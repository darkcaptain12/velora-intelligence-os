import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { logger } from '../logger';

/**
 * Faz 0 örnek işleyici — kuyruk/worker zincirinin uçtan uca çalıştığını doğrular.
 * Sonraki fazlarda gerçek işleyiciler (research/design/shopify/...) bu deseni izler.
 */
export async function processSample(job: Job<JobDataMap['sample']>) {
  logger.info({ jobId: job.id, data: job.data }, 'örnek iş alındı');

  // İş simülasyonu
  await new Promise((resolve) => setTimeout(resolve, 500));

  const result = {
    echo: job.data.message,
    processedAt: new Date().toISOString(),
  };

  logger.info({ jobId: job.id, result }, 'örnek iş tamamlandı');
  return result;
}
