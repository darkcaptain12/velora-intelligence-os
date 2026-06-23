import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { prisma, trends, productIntelligence } from '@velora/db';
import { logger } from '../logger';
import { isoWeek } from '../lib/iso-week';

/**
 * Ürün Talep Skoru: `trendHunt` sonrası tetiklenir. Her ürün için
 * Product.designId → Opportunity.designId (niş) üzerinden bu haftanın/önceki
 * haftanın Trend skoruna bakar. Niş eşleşmesi yoksa
 * `ProductIntelligence.score.salesPotential`'a düşer; önceki değer yoksa son
 * kaydedilen `demandScore` "önceki" olarak kullanılır (week-over-week delta).
 */
export async function processProductDemand(job: Job<JobDataMap['productDemand']>) {
  const { brandId } = job.data;

  const products = await prisma.product.findMany({
    where: { brandId, intelligence: { isNot: null } },
    include: { intelligence: true },
  });

  const week = isoWeek(new Date());
  const prevWeek = isoWeek(new Date(Date.now() - 7 * 86_400_000));
  const [currentTrends, previousTrends] = await Promise.all([
    trends.list(brandId, week),
    trends.list(brandId, prevWeek),
  ]);
  const currentByNiche = new Map(currentTrends.map((t) => [t.niche, t.score]));
  const previousByNiche = new Map(previousTrends.map((t) => [t.niche, t.score]));

  let updated = 0;
  for (const product of products) {
    const pi = product.intelligence;
    if (!pi) continue;

    let niche: string | null = null;
    if (product.designId) {
      const opportunity = await prisma.opportunity.findFirst({
        where: { brandId, designId: product.designId },
        select: { niche: true },
      });
      niche = opportunity?.niche ?? null;
    }

    const nicheCurrent = niche ? currentByNiche.get(niche) : undefined;
    const nichePrevious = niche ? previousByNiche.get(niche) : undefined;
    const salesPotential =
      pi.score && typeof (pi.score as Record<string, unknown>).salesPotential === 'number'
        ? ((pi.score as Record<string, unknown>).salesPotential as number)
        : undefined;

    const score = nicheCurrent ?? salesPotential;
    if (score == null) continue;

    const previousScore = nichePrevious ?? pi.demandScore ?? undefined;

    await productIntelligence.setDemand(product.id, {
      demandScore: Math.round(score),
      previousDemandScore: previousScore != null ? Math.round(previousScore) : null,
    });
    updated++;
  }

  logger.info({ brandId, week, products: products.length, updated }, 'ürün talep skoru güncellendi');
  return { week, products: products.length, updated };
}
