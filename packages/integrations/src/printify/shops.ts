import { printifyFetch } from './client';

export interface PrintifyShop {
  id: number;
  title: string;
  sales_channel: string; // örn. "shopify"
}

/** Printify hesabına bağlı satış kanallarını (mağazaları) döner. */
export async function listShops(brandId: string): Promise<PrintifyShop[]> {
  return printifyFetch<PrintifyShop[]>(brandId, 'GET', '/shops.json');
}

/** Shopify'a bağlı ilk shop'u döner (yoksa ilk shop). */
export async function resolveShopId(brandId: string): Promise<number | null> {
  const shops = await listShops(brandId);
  const shopify = shops.find((s) => /shopify/i.test(s.sales_channel));
  return (shopify ?? shops[0])?.id ?? null;
}
