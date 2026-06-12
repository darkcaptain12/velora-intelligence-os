'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, prisma, products, settings, type LifecycleStatus } from '@velora/db';
import { enqueue } from '@velora/queue';
import { fetchProducts, publishPrintifyProduct, shopifyGraphQL } from '@velora/integrations';
import { IntegrationError } from '@velora/shared';
import { actionContext } from '@/lib/action-context';

/** Tasarımdan ürün oluştur + Shopify'a yayınla (otomatik ürün sayfası işi). */
export async function publishDesign(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      designId: z.string().min(1),
      title: z.string().min(2).max(200),
      price: z.coerce.number().min(0).optional(),
    })
    .parse({
      designId: formData.get('designId'),
      title: formData.get('title'),
      price: formData.get('price') || undefined,
    });

  const product = await products.create({
    brandId,
    title: data.title,
    designId: data.designId,
    price: data.price,
  });
  // Printify pasif (default) → direct Shopify (kendi mockup'larımız); aktifse Printify ürünü.
  const passive = await settings.get<boolean>(brandId, 'printify.passive', true);
  await enqueue(passive ? 'shopifyPublish' : 'printifyPublish', { productId: product.id });
  await audit.log({
    brandId,
    actor,
    action: passive ? 'shopify.publish' : 'printify.prepare',
    entity: 'Product',
    entityId: product.id,
    payload: data,
    autonomyLevel: 2,
  });
  revalidatePath('/shopify');
}

/** Printify ürününü bağlı Shopify mağazasına yayınlar (Printify→Shopify). */
export async function publishProductToShopify(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product?.printifyProductId || !product.printifyShopId) return;
  try {
    await publishPrintifyProduct(brandId, Number(product.printifyShopId), product.printifyProductId);
    await products.transition(id, 'WINNER', "Shopify'a yayınlandı (Printify)").catch(() => undefined);
    await audit.log({
      brandId,
      actor,
      action: 'printify.publish_shopify',
      entity: 'Product',
      entityId: id,
      autonomyLevel: 2,
    });
  } catch (err) {
    if (!(err instanceof IntegrationError)) throw err;
    await audit.log({ brandId, actor, action: 'printify.publish_shopify.failed', entity: 'Product', entityId: id, payload: { error: err.message }, autonomyLevel: 2 });
  }
  revalidatePath('/shopify');
}

/** Ürün yaşam döngüsü geçişi. */
export async function transitionProduct(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const to = String(formData.get('to') ?? '') as LifecycleStatus;
  if (!id || !to) return;
  await products.transition(id, to, `Manuel geçiş → ${to}`);
  await audit.log({
    brandId,
    actor,
    action: 'product.lifecycle',
    entity: 'Product',
    entityId: id,
    payload: { to },
    autonomyLevel: 2,
  });
  revalidatePath('/shopify');
}

/** Mağazadaki ürünleri sisteme içe aktarır (Shopify → sistem senkron). */
export async function importFromShopify() {
  const { actor, brandId } = await actionContext();
  try {
    const nodes = await fetchProducts(brandId, 100);
    let count = 0;
    for (const n of nodes) {
      const price = n.variants?.nodes?.[0]?.price ? Number(n.variants.nodes[0].price) : undefined;
      await products.upsertByShopify(brandId, n.id, { title: n.title, price });
      count += 1;
    }
    await audit.log({
      brandId,
      actor,
      action: 'shopify.import',
      entity: 'Product',
      payload: { count },
      autonomyLevel: 2,
    });
  } catch (err) {
    if (!(err instanceof IntegrationError)) throw err;
    await audit.log({ brandId, actor, action: 'shopify.import.failed', entity: 'Brand', payload: { error: err.message }, autonomyLevel: 2 });
  }
  revalidatePath('/shopify');
}

/** Manuel ürün ekleme (sisteme; Shopify'a göndermez). */
export async function addManualProduct(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      title: z.string().min(2).max(200),
      price: z.coerce.number().min(0).optional(),
      cost: z.coerce.number().min(0).optional(),
    })
    .parse({
      title: formData.get('title'),
      price: formData.get('price') || undefined,
      cost: formData.get('cost') || undefined,
    });
  const product = await products.create({ brandId, title: data.title, price: data.price, cost: data.cost });
  await audit.log({ brandId, actor, action: 'product.manual', entity: 'Product', entityId: product.id, payload: data, autonomyLevel: 2 });
  revalidatePath('/shopify');
}

/** Shopify'da ürünü ACTIVE yapar (satışa aç). */
export async function publishToActive(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product?.shopifyId) return;
  try {
    await shopifyGraphQL(
      brandId,
      'mutation($input: ProductInput!){ productUpdate(input:$input){ product{ id status } userErrors{ message } } }',
      { input: { id: product.shopifyId, status: 'ACTIVE' } },
    );
    await products.transition(id, 'WINNER', 'Satışa açıldı (ACTIVE)').catch(() => undefined);
    await audit.log({ brandId, actor, action: 'shopify.activate', entity: 'Product', entityId: id, autonomyLevel: 2 });
  } catch (err) {
    if (!(err instanceof IntegrationError)) throw err;
  }
  revalidatePath('/shopify');
}

/** Shopify sağlık kontrolünü kuyruğa atar. */
export async function runHealthCheck() {
  const { actor, brandId } = await actionContext();
  await enqueue('shopifyHealth', { brandId });
  await audit.log({
    brandId,
    actor,
    action: 'shopify.health',
    entity: 'Brand',
    entityId: brandId,
    autonomyLevel: 2,
  });
  revalidatePath('/shopify');
}
