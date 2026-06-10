import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { finance, operationScores, prisma, settings } from '@velora/db';
import {
  computeFinance,
  computeOperationScore,
  marginToScore,
  roasToScore,
} from '@velora/core';
import { logger } from '../logger';

interface DesignScores {
  sellability?: number;
}

/**
 * Günlük finans anlık görüntüsü: siparişler (ciro) + reklam harcaması + maliyet
 * tahmininden FinanceSnapshot üretir, ayrıca Operasyon Skoru hesaplar.
 * COGS/kargo/komisyon ayarlardan oran/tutar olarak alınır (Order satır kalemi yok).
 */
export async function processFinanceSnapshot(job: Job<JobDataMap['financeSnapshot']>) {
  const { brandId, date } = job.data;
  const day = date ? new Date(date) : new Date();
  day.setHours(0, 0, 0, 0);
  const nextDay = new Date(day);
  nextDay.setDate(day.getDate() + 1);

  // Ciro + sipariş
  const orders = await prisma.order.findMany({
    where: { brandId, createdAt: { gte: day, lt: nextDay } },
  });
  const revenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const orderCount = orders.length;

  // Reklam harcaması (aynı gün)
  const adAgg = await prisma.adMetric.aggregate({
    _sum: { spend: true },
    where: { brandId, date: day },
  });
  const adSpend = Number(adAgg._sum.spend ?? 0);

  // Maliyet parametreleri
  const brand = await prisma.brand.findUnique({ where: { id: brandId } });
  const taxRate = Number(brand?.taxRate ?? 0.2);
  const cogsRate = await settings.get<number>(brandId, 'finance.cogsRate', 0.3);
  const shippingPerOrder = await settings.get<number>(brandId, 'finance.shippingPerOrder', 0);
  const commissionRate = await settings.get<number>(brandId, 'finance.commissionRate', 0);

  const cogs = revenue * cogsRate;
  const shipping = orderCount * shippingPerOrder;
  const commission = revenue * commissionRate;

  const fin = computeFinance({
    revenue,
    cogs,
    adSpend,
    shipping,
    commission,
    opex: 0,
    orders: orderCount,
    taxRate,
  });

  await finance.upsertSnapshot(brandId, day, {
    revenue: fin.revenue,
    adSpend: fin.adSpend,
    cogs: fin.cogs,
    shipping: fin.shipping,
    commission: fin.commission,
    grossProfit: fin.grossProfit,
    netProfit: fin.netProfit,
    taxEstimate: fin.taxEstimate,
    orders: orderCount,
    aov: fin.aov,
  });

  // --- Operasyon Skoru sinyalleri ---
  const adScore = roasToScore(fin.roas);
  const profitScore = marginToScore(fin.netProfit, revenue);

  const seoCheck = await prisma.shopifyHealthCheck.findFirst({
    where: { brandId, type: 'SEO' },
    orderBy: { createdAt: 'desc' },
  });
  const seoScore = seoCheck ? (seoCheck.passed ? 100 : 40) : 50;

  const scoredDesigns = await prisma.design.findMany({
    where: { brandId, scores: { not: undefined } },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { scores: true },
  });
  const sellabilities = scoredDesigns
    .map((d) => (d.scores as DesignScores | null)?.sellability)
    .filter((n): n is number => typeof n === 'number');
  const qualityScore =
    sellabilities.length > 0 ? sellabilities.reduce((a, b) => a + b, 0) / sellabilities.length : 50;

  const trendAgg = await prisma.researchResult.aggregate({
    _avg: { profitScore: true },
    where: { run: { brandId } },
  });
  const trendScore = trendAgg._avg.profitScore ?? 50;

  const overall = computeOperationScore({ adScore, seoScore, profitScore, qualityScore, trendScore });
  await operationScores.upsert(brandId, day, {
    adScore,
    seoScore,
    profitScore,
    qualityScore,
    trendScore,
    overall,
  });

  logger.info({ brandId, revenue, orderCount, adSpend, netProfit: fin.netProfit, overall }, 'finans anlık görüntüsü');
  return { ...fin, orders: orderCount, operationScore: overall };
}
