import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { prisma } from '@velora/db';
import { ai } from '@velora/ai';
import { assetKey, fetchToBuffer, putObject } from '@velora/storage';
import { logger } from '../logger';
import { buildVideoPrompt } from '../lib/video-format';

/**
 * Video üretim işi: prompt → Fal video → MinIO'ya kopyala → Video.url.
 * Fal anahtarı yoksa açık hata ile FAILED olur.
 */
export async function processVideo(job: Job<JobDataMap['video']>) {
  const { videoId, prompt } = job.data;
  const video = await prisma.video.findUnique({ where: { id: videoId } });
  if (!video) throw new Error(`Video bulunamadı: ${videoId}`);

  await prisma.video.update({ where: { id: videoId }, data: { status: 'GENERATING' } });
  try {
    const url = await ai.video.generate(video.brandId, {
      prompt: buildVideoPrompt(video.type, prompt),
    });
    if (!url) throw new Error('Video üretilemedi (boş yanıt)');

    const buffer = await fetchToBuffer(url);
    const key = assetKey(video.brandId, 'video', `${videoId}.mp4`);
    const storedUrl = await putObject(key, buffer, 'video/mp4');

    await prisma.video.update({ where: { id: videoId }, data: { url: storedUrl, status: 'READY' } });
    logger.info({ videoId, storedUrl }, 'video üretildi');
    return { url: storedUrl };
  } catch (err) {
    await prisma.video.update({ where: { id: videoId }, data: { status: 'FAILED' } });
    logger.error({ videoId, err: (err as Error).message }, 'video üretimi başarısız');
    throw err;
  }
}
