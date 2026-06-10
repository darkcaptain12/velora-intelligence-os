import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { prisma } from '@velora/db';
import { assetKey, fetchToBuffer, putObject } from '@velora/storage';
import { logger } from '../logger';
import { MOCKUP_TYPES, renderMockup } from '../lib/mockup';

/**
 * Mockup üretim işi: tasarım PNG'sini 4 giysi türüne kompoze eder, MinIO'ya yükler,
 * Mockup kayıtları oluşturur. AI gerektirmez (yerel sharp kompozisyon).
 */
export async function processMockup(job: Job<JobDataMap['mockup']>) {
  const { designId } = job.data;
  const design = await prisma.design.findUnique({ where: { id: designId } });
  if (!design?.pngUrl) throw new Error(`Tasarım PNG yok: ${designId}`);

  const designBuffer = await fetchToBuffer(design.pngUrl);

  for (const type of MOCKUP_TYPES) {
    const buffer = await renderMockup(designBuffer, type);
    const key = assetKey(design.brandId, 'mockup', `${designId}-${type}.png`);
    const url = await putObject(key, buffer, 'image/png');
    await prisma.mockup.create({ data: { brandId: design.brandId, designId, type, url } });
  }

  logger.info({ designId, count: MOCKUP_TYPES.length }, 'mockuplar üretildi');
  return { count: MOCKUP_TYPES.length };
}
