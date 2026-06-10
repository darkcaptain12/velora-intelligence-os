import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { prisma, type Prisma } from '@velora/db';
import { fetchProductsForHealth } from '@velora/integrations';
import { logger } from '../logger';

/**
 * Shopify Sağlık Kontrolü (API tabanlı): SEO açıklaması ve öne çıkan görsel eksiklerini
 * tarar, ShopifyHealthCheck kayıtları üretir. Shopify mağaza/token gerekir.
 */
export async function processShopifyHealth(job: Job<JobDataMap['shopifyHealth']>) {
  const { brandId } = job.data;
  const nodes = await fetchProductsForHealth(brandId, 50);

  let missingSeo = 0;
  let missingImage = 0;
  for (const p of nodes) {
    if (!p.seo?.description) missingSeo += 1;
    if (!p.featuredImage) missingImage += 1;
  }

  await prisma.shopifyHealthCheck.create({
    data: {
      brandId,
      type: 'SEO',
      passed: missingSeo === 0,
      detail: { total: nodes.length, missingSeo } as Prisma.InputJsonValue,
    },
  });
  await prisma.shopifyHealthCheck.create({
    data: {
      brandId,
      type: 'IMAGES',
      passed: missingImage === 0,
      detail: { total: nodes.length, missingImage } as Prisma.InputJsonValue,
    },
  });

  logger.info({ brandId, total: nodes.length, missingSeo, missingImage }, 'Shopify sağlık kontrolü');
  return { products: nodes.length, missingSeo, missingImage };
}
