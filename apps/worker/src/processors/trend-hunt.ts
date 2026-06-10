import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { prisma, trends } from '@velora/db';
import { logger } from '../logger';
import { isoWeek } from '../lib/iso-week';

/**
 * Trend Avcısı: mevcut araştırma sonuçlarından (en kârlı) bu haftanın trendlerini çıkarır.
 * Kaynak verisi yoksa boş hafta yazar. Araştırma motoru (Faz 2) ile beslenir.
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
  await trends.replaceWeek(
    brandId,
    week,
    results.map((r) => ({
      niche: r.run.query ?? 'genel',
      theme: r.title.slice(0, 120),
      score: r.profitScore,
      source: r.run.source,
    })),
  );

  logger.info({ brandId, week, count: results.length }, 'trend avı tamamlandı');
  return { week, count: results.length };
}
