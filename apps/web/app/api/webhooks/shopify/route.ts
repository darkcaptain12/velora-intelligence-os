import { NextResponse, type NextRequest } from 'next/server';
import { serverEnv } from '@velora/config';
import { verifyShopifyWebhook } from '@velora/integrations';
import { audit, brands, prisma, products } from '@velora/db';
import { enqueue } from '@velora/queue';

export const runtime = 'nodejs';

interface ShopifyProductVariant {
  price?: string;
}

interface ShopifyProductPayload {
  id: number | string;
  title?: string;
  variants?: ShopifyProductVariant[];
}

/** Ürün Zekası Motoru: ürün create/update webhook'unda tetiklenir (SEO+içerik+reklam+kitle+UGC+skor). */
async function handleProductWebhook(brandId: string, raw: string) {
  const payload = JSON.parse(raw) as ShopifyProductPayload;
  const numericId = String(payload.id ?? '');
  if (!numericId) return NextResponse.json({ ok: false, error: 'no product id' }, { status: 400 });

  // Product.shopifyId konvansiyonu GraphQL gid formatıdır (bkz. fetchProducts/createProduct).
  const shopifyId = `gid://shopify/Product/${numericId}`;
  const title = payload.title ?? 'Shopify Ürünü';
  const price = payload.variants?.[0]?.price != null ? Number(payload.variants[0].price) : undefined;

  const product = await products.upsertByShopify(brandId, shopifyId, { title, price });
  await enqueue('productIntelligence', { productId: product.id });

  await audit.log({
    brandId,
    actor: 'shopify',
    action: 'webhook.product',
    entity: 'Product',
    entityId: product.id,
    autonomyLevel: 2,
  });

  return NextResponse.json({ ok: true, productId: product.id });
}

/** Shopify sipariş webhook'u (orders/create, orders/paid): Order upsert + denetim. */
async function handleOrderWebhook(brand: { id: string; currency: string }, raw: string) {
  const order = JSON.parse(raw) as Record<string, unknown>;
  const shopifyId = String(order.id ?? '');
  if (!shopifyId) return NextResponse.json({ ok: false, error: 'no order id' }, { status: 400 });

  const total = String(order.total_price ?? '0');
  const currency = String(order.currency ?? brand.currency);
  const financialStatus = (order.financial_status as string | undefined) ?? null;
  const createdAt = order.created_at ? new Date(String(order.created_at)) : new Date();

  await prisma.order.upsert({
    where: { brandId_shopifyId: { brandId: brand.id, shopifyId } },
    create: { brandId: brand.id, shopifyId, total, currency, financialStatus, createdAt },
    update: { total, financialStatus },
  });

  await audit.log({
    brandId: brand.id,
    actor: 'shopify',
    action: 'webhook.order',
    entity: 'Order',
    entityId: shopifyId,
    autonomyLevel: 2,
  });

  return NextResponse.json({ ok: true });
}

/**
 * Shopify webhook ucu (orders/create|paid, products/create|update).
 * Ham gövde HMAC ile doğrulanır; konu (`x-shopify-topic`) başlığına göre yönlendirilir.
 */
export async function POST(req: NextRequest) {
  const env = serverEnv();
  const raw = await req.text();
  const hmac = req.headers.get('x-shopify-hmac-sha256');
  if (!env.SHOPIFY_WEBHOOK_SECRET || !verifyShopifyWebhook(raw, hmac, env.SHOPIFY_WEBHOOK_SECRET)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }
  if (!parsed || typeof parsed !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const brand = await brands.getActive();
  if (!brand) return NextResponse.json({ ok: false, error: 'no brand' }, { status: 404 });

  const topic = req.headers.get('x-shopify-topic') ?? '';
  if (topic.startsWith('products/')) {
    return handleProductWebhook(brand.id, raw);
  }
  return handleOrderWebhook(brand, raw);
}
