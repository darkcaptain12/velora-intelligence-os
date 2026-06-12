import { printifyFetch } from './client';

export interface PrintifyMockup {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
}

export interface PrintifyVariant {
  id: number;
  title: string;
  cost: number; // sağlayıcı maliyeti (cent)
  price: number; // perakende (cent)
  is_enabled: boolean;
}

export interface PrintifyProduct {
  id: string;
  title: string;
  images: PrintifyMockup[];
  variants: PrintifyVariant[];
  external?: { id: string; handle: string } | null; // Shopify'a yayınlanınca dolar
}

export interface CreatePrintifyInput {
  shopId: number;
  title: string;
  descriptionHtml: string;
  blueprintId: number;
  printProviderId: number;
  variantIds: number[];
  imageId: string;
  /** Başlangıç fiyatı (cent). Oluşturma sonrası maliyete göre markup ile güncellenir. */
  defaultPriceCents?: number;
  /** Ön baskı yerleşimi (0–1 oran). */
  placement?: { x: number; y: number; scale: number; angle: number };
}

/** Printify'da ürün oluşturur (ön baskı = yüklenen tasarım); mockup'lar yanıtta döner. */
export async function createPrintifyProduct(
  brandId: string,
  input: CreatePrintifyInput,
): Promise<PrintifyProduct> {
  const price = input.defaultPriceCents ?? 1999;
  const place = input.placement ?? { x: 0.5, y: 0.5, scale: 0.92, angle: 0 };
  const body = {
    title: input.title,
    description: input.descriptionHtml,
    blueprint_id: input.blueprintId,
    print_provider_id: input.printProviderId,
    variants: input.variantIds.map((id) => ({ id, price, is_enabled: true })),
    print_areas: [
      {
        variant_ids: input.variantIds,
        placeholders: [
          {
            position: 'front',
            images: [{ id: input.imageId, x: place.x, y: place.y, scale: place.scale, angle: place.angle }],
          },
        ],
      },
    ],
  };
  return printifyFetch<PrintifyProduct>(brandId, 'POST', `/shops/${input.shopId}/products.json`, body);
}

/** Varyant perakende fiyatlarını günceller (maliyet × markup sonrası). */
export async function updateVariantPrices(
  brandId: string,
  shopId: number,
  productId: string,
  prices: { id: number; price: number }[],
): Promise<void> {
  await printifyFetch(brandId, 'PUT', `/shops/${shopId}/products/${productId}.json`, {
    variants: prices.map((p) => ({ id: p.id, price: p.price, is_enabled: true })),
  });
}

/** Ürünü bağlı satış kanalına (Shopify) yayınlar. */
export async function publishPrintifyProduct(
  brandId: string,
  shopId: number,
  productId: string,
): Promise<void> {
  await printifyFetch(brandId, 'POST', `/shops/${shopId}/products/${productId}/publish.json`, {
    title: true,
    description: true,
    images: true,
    variants: true,
    tags: true,
    keyFeatures: true,
    shipping_template: true,
  });
}

/** Tek ürünü getirir (mockup/durum/dış kimlik). */
export function getPrintifyProduct(
  brandId: string,
  shopId: number,
  productId: string,
): Promise<PrintifyProduct> {
  return printifyFetch<PrintifyProduct>(brandId, 'GET', `/shops/${shopId}/products/${productId}.json`);
}
