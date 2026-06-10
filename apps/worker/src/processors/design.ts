import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { enqueue } from '@velora/queue';
import { prisma } from '@velora/db';
import { ai } from '@velora/ai';
import { assetKey, fetchToBuffer, putObject } from '@velora/storage';
import { logger } from '../logger';

/**
 * Tasarım üretim işi: prompt → Fal görsel → MinIO'ya kopyala → Design.pngUrl.
 * Başarılıysa mockup ve skorlama işlerini tetikler.
 * Fal anahtarı yoksa açık hata ile FAILED olur.
 */
export async function processDesign(job: Job<JobDataMap['design']>) {
  const { designId } = job.data;
  const design = await prisma.design.findUnique({ where: { id: designId } });
  if (!design) throw new Error(`Design bulunamadı: ${designId}`);

  await prisma.design.update({ where: { id: designId }, data: { status: 'GENERATING' } });
  try {
    const urls = await ai.image.generate(design.brandId, {
      prompt: design.prompt,
      imageSize: 'square_hd',
    });
    const first = urls[0];
    if (!first) throw new Error('Görsel üretilemedi (boş yanıt)');

    const buffer = await fetchToBuffer(first);
    const key = assetKey(design.brandId, 'design', `${designId}.png`);
    const pngUrl = await putObject(key, buffer, 'image/png');

    await prisma.design.update({ where: { id: designId }, data: { pngUrl, status: 'READY' } });
    logger.info({ designId, pngUrl }, 'tasarım üretildi');

    await enqueue('mockup', { designId });
    await enqueue('designScore', { designId });
    return { pngUrl };
  } catch (err) {
    await prisma.design.update({ where: { id: designId }, data: { status: 'FAILED' } });
    logger.error({ designId, err: (err as Error).message }, 'tasarım üretimi başarısız');
    throw err;
  }
}
