import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { enqueue } from '@velora/queue';
import { competitors } from '@velora/db';
import { logger } from '../logger';

/**
 * Rakip İzleme: markaya kayıtlı tüm rakipleri tek seferde tarar (fan-out).
 * Her rakip için `competitorScan` kuyruğa eklenir; fiyat değişimi tespiti
 * `processCompetitorScan` içinde yapılır.
 */
export async function processCompetitorWatch(job: Job<JobDataMap['competitorWatch']>) {
  const { brandId } = job.data;
  const list = await competitors.list(brandId);

  for (const c of list) {
    await enqueue('competitorScan', { competitorId: c.id });
  }

  logger.info({ brandId, count: list.length }, 'rakip izleme: tüm rakipler kuyruğa eklendi');
  return { count: list.length };
}
