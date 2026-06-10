import { NextResponse, type NextRequest } from 'next/server';
import { serverEnv } from '@velora/config';
import { verifyShopifyWebhook } from '@velora/integrations';
import { audit, brands, prisma } from '@velora/db';

export const runtime = 'nodejs';

/**
 * Shopify sipariş webhook'u (orders/create, orders/paid).
 * Ham gövde HMAC ile doğrulanır → Order upsert + denetim.
 */
export async function POST(req: NextRequest) {
  const env = serverEnv();
  const raw = await req.text();
  const hmac = req.headers.get('x-shopify-hmac-sha256');
  if (!env.SHOPIFY_WEBHOOK_SECRET || !verifyShopifyWebhook(raw, hmac, env.SHOPIFY_WEBHOOK_SECRET)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let order: Record<string, unknown>;
  try {
    order = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const brand = await brands.getActive();
  if (!brand) return NextResponse.json({ ok: false, error: 'no brand' }, { status: 404 });

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
