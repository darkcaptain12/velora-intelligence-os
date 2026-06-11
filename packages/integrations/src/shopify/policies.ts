import { IntegrationError } from '@velora/shared';
import { shopifyGraphQL } from './client';

export type ShopPolicyType =
  | 'REFUND_POLICY'
  | 'PRIVACY_POLICY'
  | 'TERMS_OF_SERVICE'
  | 'SHIPPING_POLICY'
  | 'LEGAL_NOTICE';

export interface ShopPolicyInput {
  type: ShopPolicyType;
  body: string; // HTML
}

/** Mağaza yasal politikalarını (iade, gizlilik, kullanım, kargo) günceller. */
export async function updateShopPolicies(
  brandId: string,
  policies: ShopPolicyInput[],
): Promise<{ updated: number; errors: string[] }> {
  const mutation = `
    mutation shopPolicyUpdate($shopPolicy: ShopPolicyInput!) {
      shopPolicyUpdate(shopPolicy: $shopPolicy) {
        shopPolicy { type }
        userErrors { field message }
      }
    }`;
  let updated = 0;
  const errors: string[] = [];
  for (const p of policies) {
    const d = await shopifyGraphQL<{
      shopPolicyUpdate: { userErrors: { message: string }[] };
    }>(brandId, mutation, { shopPolicy: { type: p.type, body: p.body } });
    const errs = d.shopPolicyUpdate?.userErrors ?? [];
    if (errs.length > 0) errors.push(`${p.type}: ${errs.map((e) => e.message).join(', ')}`);
    else updated += 1;
  }
  return { updated, errors };
}

/** Özel sayfa oluşturur (Hakkımızda / İletişim / Mesafeli Satış vb.). */
export async function createLegalPage(
  brandId: string,
  title: string,
  bodyHtml: string,
): Promise<{ id?: string; error?: string }> {
  const mutation = `
    mutation pageCreate($page: PageCreateInput!) {
      pageCreate(page: $page) {
        page { id title }
        userErrors { field message }
      }
    }`;
  try {
    const d = await shopifyGraphQL<{
      pageCreate: { page: { id: string } | null; userErrors: { message: string }[] };
    }>(brandId, mutation, { page: { title, body: bodyHtml, isPublished: true } });
    const errs = d.pageCreate?.userErrors ?? [];
    if (errs.length > 0) return { error: errs.map((e) => e.message).join(', ') };
    return { id: d.pageCreate?.page?.id ?? undefined };
  } catch (e) {
    if (e instanceof IntegrationError) return { error: e.message };
    throw e;
  }
}
