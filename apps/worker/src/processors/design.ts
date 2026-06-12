import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { enqueue } from '@velora/queue';
import { prisma } from '@velora/db';
import { ai } from '@velora/ai';
import { assetKey, fetchToBuffer, putObject } from '@velora/storage';
import { buildDesignPrompt, extractOverlayText } from '../lib/design-prompt';
import { makePrintReady } from '../lib/print-file';
import { renderTextOverlay } from '../lib/text-overlay';
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
    // Tırnak içindeki slogan varsa: illüstrasyonu yazısız üret, yazıyı sonra net bas.
    const { subject, text } = extractOverlayText(design.prompt);
    const urls = await ai.image.generate(design.brandId, {
      prompt: buildDesignPrompt(subject),
      imageSize: 'square_hd',
    });
    const first = urls[0];
    if (!first) throw new Error('Görsel üretilemedi (boş yanıt)');

    let buffer = await fetchToBuffer(first);
    if (text) buffer = await renderTextOverlay(buffer, text);
    const key = assetKey(design.brandId, 'design', `${designId}.png`);
    const pngUrl = await putObject(key, buffer, 'image/png');

    // Baskıya hazır şeffaf PNG (mockup değil — basılan grafik)
    let transparentUrl: string | undefined;
    try {
      const printBuf = await makePrintReady(buffer);
      const printKey = assetKey(design.brandId, 'design', `${designId}-print.png`);
      transparentUrl = await putObject(printKey, printBuf, 'image/png');
    } catch (e) {
      logger.warn({ designId, err: (e as Error).message }, 'şeffaf baskı dosyası üretilemedi');
    }

    await prisma.design.update({
      where: { id: designId },
      data: { pngUrl, ...(transparentUrl ? { transparentUrl } : {}), status: 'READY' },
    });
    logger.info({ designId, pngUrl, transparentUrl }, 'tasarım üretildi');

    // Kendi gerçekçi mockup'larımız (Printify pasif default). Printify aktifse de zararsız.
    await enqueue('mockup', { designId });
    await enqueue('designScore', { designId });
    return { pngUrl };
  } catch (err) {
    await prisma.design.update({ where: { id: designId }, data: { status: 'FAILED' } });
    logger.error({ designId, err: (err as Error).message }, 'tasarım üretimi başarısız');
    throw err;
  }
}
