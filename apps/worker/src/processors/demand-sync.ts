import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { prisma, productConversions } from '@velora/db';
import { computeBehaviorScore } from '@velora/core';
import { logger } from '../logger';
import { isoWeek } from '../lib/iso-week';

/**
 * Gerçek Talep Takibi (Faz E Sprint 6):
 * Her haftanın pageViews/cartAdds/wishlistAdds davranış sinyallerini
 * ProductConversion tablosuna anlık görüntü olarak yazar — zaman serisi oluşur.
 *
 * Tetiklenme: Jarvis "talep güncelle" komutu veya haftalık rapor öncesi.
 * Yeni queue/worker oluşturulmadı — mevcut worker'a eklendi (CLAUDE.md kısıtı).
 */
export async function processDemandSync(job: Job<JobDataMap['demandSync']>) {
  const { brandId } = job.data;
  const week = isoWeek(new Date());

  const products = await prisma.product.findMany({
    where: {
      brandId,
      status: { not: 'CLOSED' },
      OR: [
        { pageViews: { gt: 0 } },
        { cartAdds: { gt: 0 } },
        { wishlistAdds: { gt: 0 } },
      ],
    },
    select: {
      id: true,
      brandId: true,
      pageViews: true,
      cartAdds: true,
      wishlistAdds: true,
    },
  });

  let synced = 0;
  for (const product of products) {
    const pageViews = product.pageViews ?? 0;
    const cartAdds = product.cartAdds ?? 0;
    const wishlistAdds = product.wishlistAdds ?? 0;

    const { score: behaviorScore } = computeBehaviorScore({ pageViews, cartAdds, wishlistAdds });

    await productConversions.upsert({
      brandId: product.brandId,
      productId: product.id,
      week,
      pageViews,
      cartAdds,
      wishlistAdds,
      behaviorScore: Math.round(behaviorScore),
    });
    synced++;
  }

  logger.info({ brandId, week, synced }, 'talep sinyalleri haftalık anlık görüntü kaydedildi');
  return { week, synced };
}
