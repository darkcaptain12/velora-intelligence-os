'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, products, type LifecycleStatus } from '@velora/db';
import { enqueue } from '@velora/queue';
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
  await enqueue('shopifyPublish', { productId: product.id });
  await audit.log({
    brandId,
    actor,
    action: 'shopify.publish',
    entity: 'Product',
    entityId: product.id,
    payload: data,
    autonomyLevel: 2,
  });
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
