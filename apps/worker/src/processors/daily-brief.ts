import type { Job } from 'bullmq';
import { prisma } from '@velora/db';
import { dailyBriefs } from '@velora/db';
import {
  computeRiskScore,
  evaluateProductDemand,
  type RiskEngineInput,
} from '@velora/core';
import { ai, prompts } from '@velora/ai';
import { logger } from '../logger';

export async function processDailyBrief(job: Job<{ brandId: string }>) {
  const { brandId } = job.data;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  logger.info({ brandId }, 'daily brief başlatılıyor');

  // ── 1. Sinyal toplama ──────────────────────────────────────────

  // Harcama ihlalleri
  const spendLimits = await prisma.spendLimit.findMany({ where: { brandId } });
  const adMetrics = await prisma.adMetric.findMany({
    where: { brandId },
    orderBy: { date: 'desc' },
    take: 30,
  });
  const todaySpend = adMetrics
    .filter((m) => {
      const d = new Date(m.date);
      return d.toDateString() === today.toDateString();
    })
    .reduce((s, m) => s + Number(m.spend), 0);
  const weekSpend = adMetrics
    .filter((m) => {
      const d = new Date(m.date);
      const diff = (today.getTime() - d.getTime()) / 86400000;
      return diff < 7;
    })
    .reduce((s, m) => s + Number(m.spend), 0);
  let spendViolationCount = 0;
  for (const limit of spendLimits) {
    const spend =
      limit.period === 'DAILY' ? todaySpend :
      limit.period === 'WEEKLY' ? weekSpend : 0;
    if (spend > Number(limit.amount)) spendViolationCount++;
  }

  // Rakip alarmları
  const recentTasks = await prisma.task.findMany({
    where: { brandId, status: 'OPEN', title: { startsWith: '📈' } },
    take: 20,
  });
  const competitorAlarmCount = recentTasks.length;
  const worstLevel = recentTasks.length > 0 ? 'HIGH' : null;

  // Talep düşüşü
  const allPI = await prisma.productIntelligence.findMany({
    where: { product: { brandId, status: { not: 'CLOSED' } } },
    select: { demandScore: true, previousDemandScore: true },
  });
  let decliningProducts = 0;
  for (const pi of allPI) {
    if (pi.demandScore != null && pi.previousDemandScore != null) {
      const result = evaluateProductDemand({
        score: pi.demandScore,
        previousScore: pi.previousDemandScore,
      });
      if (result.level === 'DECLINING') decliningProducts++;
    }
  }

  // Reklam performansı (son 7 gün)
  const totalAdSpend = weekSpend;
  const weekRevenue = await prisma.order
    .findMany({
      where: {
        brandId,
        createdAt: { gte: new Date(today.getTime() - 7 * 86400000) },
      },
      select: { total: true },
    })
    .then((orders) => orders.reduce((s, o) => s + Number(o.total), 0));
  const roas = totalAdSpend > 0 ? weekRevenue / totalAdSpend : null;

  // Trend alarmları
  const trendAlarmTasks = await prisma.task.findMany({
    where: { brandId, status: 'OPEN', title: { startsWith: '🔔' } },
  });

  // ── 2. Risk Engine ─────────────────────────────────────────────

  const riskInput: RiskEngineInput = {
    spendViolationCount,
    competitorAlarms: { level: worstLevel, count: competitorAlarmCount },
    decliningProducts,
    totalProducts: allPI.length,
    roas,
    trendAlarmsHigh: trendAlarmTasks.length,
  };

  const risk = computeRiskScore(riskInput);

  // ── 3. En iyi fırsat ──────────────────────────────────────────

  const topOpp = await prisma.opportunity.findFirst({
    where: { brandId, status: { in: ['NEW', 'SCORED', 'VALIDATED'] } },
    orderBy: { priorityScore: 'desc' },
    select: { title: true, priorityScore: true },
  });

  // ── 4. Bugünün görevleri (açık Task'lardan ilk 3) ─────────────

  const openTasks = await prisma.task.findMany({
    where: { brandId, status: 'OPEN' },
    orderBy: { priority: 'asc' },
    take: 3,
    select: { title: true, priority: true },
  });

  // ── 5. Claude CEO analizi (token tasarrufu: sadece risk>0 veya fırsat varsa) ─

  let narrative: string | null = null;
  let confidence: number | null = null;
  const brand = await prisma.brand.findUnique({ where: { id: brandId }, select: { currency: true } });
  const currency = brand?.currency ?? 'TRY';

  const shouldAnalyze = risk.totalScore > 10 || topOpp != null || openTasks.length > 0;
  if (shouldAnalyze) {
    try {
      const prompt = prompts.dailyCeoAnalysis({
        date: today.toISOString().slice(0, 10),
        currency,
        riskScore: risk.totalScore,
        riskLevel: risk.level,
        riskSignals: risk.signals,
        topOpportunity: topOpp ? `${topOpp.title} (P${topOpp.priorityScore})` : null,
        topRisk: risk.topRisk ? `${risk.topRisk.source}: ${risk.topRisk.detail}` : null,
        todayTasks: openTasks.map((t) => t.title),
      });
      const raw = await ai.text.claude(brandId, { prompt, maxTokens: 800, temperature: 0.5 });
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        narrative = parsed.narrative ?? null;
        confidence = typeof parsed.confidence === 'number' ? Math.min(100, Math.max(0, parsed.confidence)) : null;
      }
    } catch (err) {
      logger.warn({ err: (err as Error).message }, 'Claude CEO analizi atlandı (anahtar eksik veya hata)');
    }
  }

  // ── 6. DB'ye kaydet ───────────────────────────────────────────

  const brief = await dailyBriefs.upsert(brandId, today, {
    riskScore: risk.totalScore,
    riskLevel: risk.level,
    riskSignals: JSON.parse(JSON.stringify(risk.signals)),
    topOpportunity: topOpp ? `${topOpp.title} (P${topOpp.priorityScore})` : null,
    topRisk: risk.topRisk ? `${risk.topRisk.source}: ${risk.topRisk.detail}` : null,
    todayTasks: openTasks.map((t) => t.title),
    narrative,
    confidence,
  });

  logger.info(
    { brandId, riskScore: risk.totalScore, riskLevel: risk.level, signals: risk.signals.length },
    'daily brief oluşturuldu',
  );

  return {
    riskScore: risk.totalScore,
    riskLevel: risk.level,
    signals: risk.signals.length,
    topOpportunity: brief.topOpportunity,
    topRisk: brief.topRisk,
    tasks: openTasks.length,
  };
}
