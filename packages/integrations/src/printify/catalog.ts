import { printifyFetch } from './client';

export interface Blueprint {
  id: number;
  title: string;
  brand: string;
  model: string;
}

export interface PrintProvider {
  id: number;
  title: string;
}

export interface CatalogVariant {
  id: number;
  title: string;
  placeholders?: { position: string; height: number; width: number }[];
}

/** Tüm ürün şablonları (blueprint) — ör. tişört türleri. */
export function listBlueprints(brandId: string): Promise<Blueprint[]> {
  return printifyFetch<Blueprint[]>(brandId, 'GET', '/catalog/blueprints.json');
}

/** Bir blueprint için baskı sağlayıcıları. */
export function listPrintProviders(brandId: string, blueprintId: number): Promise<PrintProvider[]> {
  return printifyFetch<PrintProvider[]>(
    brandId,
    'GET',
    `/catalog/blueprints/${blueprintId}/print_providers.json`,
  );
}

/** Blueprint + sağlayıcı için varyantlar (beden/renk) ve baskı alanı boyutları. */
export function listVariants(
  brandId: string,
  blueprintId: number,
  printProviderId: number,
): Promise<{ id: number; title: string; variants: CatalogVariant[] }> {
  return printifyFetch(
    brandId,
    'GET',
    `/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json`,
  );
}

export interface PrintifyDefaults {
  blueprintId: number;
  printProviderId: number;
  variantIds: number[];
  /** Ön baskı alanı boyutu (px) — yerleştirme ölçeği için. */
  frontPlaceholder?: { width: number; height: number };
}

/**
 * Makul varsayılan: Unisex Heavy Cotton Tee (blueprint 6) + ilk sağlayıcı + ilk ~10 varyant.
 * Ayarlar'dan değiştirilebilir.
 */
export async function resolveDefaults(brandId: string, blueprintId = 6): Promise<PrintifyDefaults> {
  const providers = await listPrintProviders(brandId, blueprintId);
  const printProviderId = providers[0]?.id;
  if (!printProviderId) throw new Error('Printify: blueprint için sağlayıcı bulunamadı');
  const { variants } = await listVariants(brandId, blueprintId, printProviderId);
  const variantIds = variants.slice(0, 10).map((v) => v.id);
  const front = variants[0]?.placeholders?.find((p) => p.position === 'front');
  return {
    blueprintId,
    printProviderId,
    variantIds,
    ...(front ? { frontPlaceholder: { width: front.width, height: front.height } } : {}),
  };
}
