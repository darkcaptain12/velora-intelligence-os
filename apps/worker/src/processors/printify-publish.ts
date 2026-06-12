import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import sharp from 'sharp';
import { prisma, products, settings } from '@velora/db';
import {
  createPrintifyProduct,
  getPrintifyProduct,
  resolveDefaults,
  resolveShopId,
  updateVariantPrices,
  uploadImage,
} from '@velora/integrations';
import { getObject, keyFromUrl } from '@velora/storage';
import { logger } from '../logger';

/**
 * Tasarımı Printify'a yükler + POD ürünü oluşturur. Mockup'lar Printify'dan gelir.
 * Shopify'a yayın AYRI adımdır (kullanıcı "Shopify'a Yayınla" der) — burada yapılmaz.
 *
 * 1) şeffaf baskı dosyasını ~2400px'e upscale → Printify'a yükle (image id)
 * 2) Settings varsayılanları (shop/blueprint/provider/variant/markup) ile ürün oluştur
 * 3) maliyet × markup ile perakende fiyatları güncelle
 * 4) mockup'ları + printify kimliklerini + maliyeti Product'a yaz; NEW→TEST
 */
export async function processPrintifyPublish(job: Job<JobDataMap['printifyPublish']>) {
  const { productId } = job.data;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { design: true },
  });
  if (!product) throw new Error(`Ürün bulunamadı: ${productId}`);
  const brandId = product.brandId;

  // Baskı görseli: şeffaf baskı dosyası (yoksa pngUrl)
  const printUrl = product.design?.transparentUrl ?? product.design?.pngUrl;
  if (!printUrl) throw new Error('Tasarımın baskı dosyası yok');
  const key = keyFromUrl(printUrl);
  const rawBuffer = key ? (await getObject(key)).buffer : null;
  if (!rawBuffer) throw new Error('Baskı dosyası MinIO\'dan okunamadı');

  // Baskı kalitesi için upscale (~2400px). Düz vektör grafik temiz büyür.
  const upscaled = await sharp(rawBuffer)
    .resize(2400, 2400, { fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer();
  const base64 = upscaled.toString('base64');

  // Printify hedef shop + ürün varsayılanları (Ayarlar'dan; yoksa katalog varsayılanı)
  const shopId =
    (await settings.get<number>(brandId, 'printify.shopId', 0)) ||
    (await resolveShopId(brandId));
  if (!shopId) throw new Error('Printify shop bulunamadı (Ayarlar → Bağlantıyı Getir)');

  let blueprintId = await settings.get<number>(brandId, 'printify.blueprintId', 0);
  let printProviderId = await settings.get<number>(brandId, 'printify.printProviderId', 0);
  let variantIds = await settings.get<number[]>(brandId, 'printify.variantIds', []);
  if (!blueprintId || !printProviderId || variantIds.length === 0) {
    const d = await resolveDefaults(brandId);
    blueprintId = d.blueprintId;
    printProviderId = d.printProviderId;
    variantIds = d.variantIds;
  }
  const markup = await settings.get<number>(brandId, 'printify.markup', 2.2);

  // 1+2) yükle + ürün oluştur
  const img = await uploadImage(brandId, { base64 }, `${productId}.png`);
  const created = await createPrintifyProduct(brandId, {
    shopId,
    title: product.title,
    descriptionHtml: product.description ?? product.title,
    blueprintId,
    printProviderId,
    variantIds,
    imageId: img.id,
  });

  // 3) maliyet × markup → perakende fiyat (cent)
  const prices = created.variants
    .filter((v) => v.is_enabled)
    .map((v) => ({ id: v.id, price: Math.max(100, Math.round(v.cost * markup)) }));
  if (prices.length > 0) {
    await updateVariantPrices(brandId, shopId, created.id, prices).catch((e) =>
      logger.warn({ productId, err: (e as Error).message }, 'fiyat güncellenemedi'),
    );
  }

  // 4) mockup'lar (gerekirse tekrar çek) — front/default sahneler, makul sayıda
  const pickMockups = (imgs: { src: string; position: string; is_default: boolean }[]) => {
    const front = imgs.filter((m) => m.is_default || /front/i.test(m.position));
    return (front.length > 0 ? front : imgs).slice(0, 8).map((m) => m.src);
  };
  let mockups = pickMockups(created.images ?? []);
  if (mockups.length === 0) {
    const fetched = await getPrintifyProduct(brandId, shopId, created.id).catch(() => null);
    mockups = pickMockups(fetched?.images ?? []);
  }
  const baseCost = created.variants[0]?.cost ? created.variants[0].cost / 100 : undefined;
  const retail = prices[0]?.price ? prices[0].price / 100 : undefined;

  await products.setPrintify(productId, {
    printifyProductId: created.id,
    printifyShopId: String(shopId),
    mockups,
    ...(baseCost != null ? { cost: baseCost } : {}),
    ...(retail != null ? { price: retail } : {}),
  });
  await products.transition(productId, 'TEST', 'Printify ürünü hazırlandı').catch(() => undefined);

  logger.info({ productId, printifyId: created.id, mockups: mockups.length }, 'Printify ürünü oluşturuldu');
  return { printifyProductId: created.id, mockups: mockups.length };
}
