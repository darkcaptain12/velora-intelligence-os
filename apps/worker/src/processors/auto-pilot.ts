import type { Job } from 'bullmq';
import { enqueue, type JobDataMap } from '@velora/queue';
import { audit } from '@velora/db';
import { logger } from '../logger';

/**
 * Tam otonom orkestratör — mağazayı A'dan Z'ye işleten döngüyü tetikler:
 *   trend avla → otomatik tasarım üret (→ skor → L3'te talebe göre yayınla)
 *   → reklam senkron/optimizasyon → mağaza sağlığı → finans anlık görüntü.
 * Haftalık n8n master ile veya elle ("Tam Otonom Çalıştır") çağrılır.
 */
export async function processAutoPilot(job: Job<JobDataMap['autoPilot']>) {
  const { brandId } = job.data;

  // Sıra önemli değil (BullMQ async); autoDesign trendleri okur, trendHunt onları besler.
  await enqueue('trendHunt', { brandId });
  await enqueue('autoDesign', { brandId, count: 4 });
  await enqueue('adSync', { brandId });
  await enqueue('shopifyHealth', { brandId });
  await enqueue('financeSnapshot', { brandId });

  await audit.log({
    brandId,
    actor: 'autopilot',
    action: 'autopilot.run',
    entity: 'Brand',
    entityId: brandId,
    payload: { jobs: ['trendHunt', 'autoDesign', 'adSync', 'shopifyHealth', 'financeSnapshot'] },
    autonomyLevel: 3,
  });
  logger.info({ brandId }, 'otopilot döngüsü tetiklendi');
  return { ok: true };
}
