import type { Job } from 'bullmq';
import { enqueue, type JobDataMap } from '@velora/queue';
import { prisma, trends, tasks } from '@velora/db';
import { evaluateTrendAlarm } from '@velora/core';
import { logger } from '../logger';
import { isoWeek } from '../lib/iso-week';

/**
 * Trend Avcısı: mevcut araştırma sonuçlarından (en kârlı) bu haftanın trendlerini çıkarır.
 * Kaynak verisi yoksa boş hafta yazar. Araştırma motoru (Faz 2) ile beslenir.
 *
 * Trend Alarm Sistemi: her niş için bu haftanın skoru önceki haftayla karşılaştırılır
 * (`evaluateTrendAlarm`). Tetiklenirse Görev Merkezi'ne 🔔 GENERIC görevi açılır
 * (aynı başlıkla açık görev varsa tekrar oluşturulmaz — idempotent).
 *
 * Ürün Talep Skoru: trendler yazıldıktan sonra `productDemand` kuyruğuna iş atılır
 * (her ürün için niş bazlı talep skorunu günceller — bkz. `processProductDemand`).
 */
export async function processTrendHunt(job: Job<JobDataMap['trendHunt']>) {
  const { brandId } = job.data;
  const results = await prisma.researchResult.findMany({
    where: { run: { brandId } },
    orderBy: { profitScore: 'desc' },
    take: 10,
    include: { run: true },
  });

  const week = isoWeek(new Date());
  const prevWeek = isoWeek(new Date(Date.now() - 7 * 86_400_000));
  const items = results.map((r) => ({
    niche: r.run.query ?? 'genel',
    theme: r.title.slice(0, 120),
    score: r.profitScore,
    source: r.run.source,
  }));

  const previous = await trends.list(brandId, prevWeek);
  const previousByNiche = new Map(previous.map((t) => [t.niche, t.score]));

  await trends.replaceWeek(brandId, week, items);
  await enqueue('productDemand', { brandId });

  let alarmCount = 0;
  for (const item of items) {
    const previousScore = previousByNiche.get(item.niche);
    const alarm = evaluateTrendAlarm({ score: item.score, previousScore });
    if (!alarm.triggered) continue;

    const title = `🔔 Trend Alarmı: "${item.theme}" (${item.niche}) — skor ${item.score.toFixed(0)}`;
    const existing = await prisma.task.findFirst({
      where: { brandId, title, status: 'OPEN' },
      select: { id: true },
    });
    if (existing) continue;

    const levelLabel = alarm.level === 'HIGH' ? 'Yüksek skor' : 'Yükselişte';
    const deltaLabel = `${alarm.delta >= 0 ? '+' : ''}${alarm.delta.toFixed(0)}`;
    await tasks.create({
      brandId,
      type: 'GENERIC',
      priority: 1,
      title,
      description:
        `${levelLabel} · değişim ${deltaLabel}` +
        (previousScore != null ? ` (önceki hafta: ${previousScore.toFixed(0)})` : ''),
    });
    alarmCount++;
  }

  logger.info({ brandId, week, count: results.length, alarmCount }, 'trend avı tamamlandı');
  return { week, count: results.length, alarmCount };
}
