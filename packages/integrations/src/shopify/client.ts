import { serverEnv } from '@velora/config';
import { credentials } from '@velora/db';
import { IntegrationError } from '@velora/shared';

interface ShopifyCreds {
  domain: string;
  token: string;
  version: string;
}

/**
 * Shopify kimlik bilgisi çözümü: markaya özel credential (token + meta.domain),
 * yoksa env. CLAUDE.md ilkesi: API öncelikli.
 */
async function resolveShopify(brandId: string): Promise<ShopifyCreds> {
  const env = serverEnv();
  const token =
    (await credentials.get(brandId, 'SHOPIFY').catch(() => null)) ||
    env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const meta = await credentials.getMeta(brandId, 'SHOPIFY').catch(() => null);
  const domain = (meta?.domain as string | undefined) || env.SHOPIFY_STORE_DOMAIN;
  if (!token || !domain) {
    throw new IntegrationError('SHOPIFY', 'Shopify mağaza alan adı / access token yapılandırılmamış');
  }
  return { domain, token, version: env.SHOPIFY_API_VERSION };
}

/** Shopify Admin GraphQL çağrısı. */
export async function shopifyGraphQL<T>(
  brandId: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const { domain, token, version } = await resolveShopify(brandId);
  const url = `https://${domain}/admin/api/${version}/graphql.json`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new IntegrationError('SHOPIFY', `Shopify GraphQL HTTP ${res.status}`, await res.text().catch(() => ''));
  }
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) {
    throw new IntegrationError('SHOPIFY', 'Shopify GraphQL hatası', json.errors);
  }
  return json.data as T;
}
