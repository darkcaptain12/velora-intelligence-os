'use server';

import { revalidatePath } from 'next/cache';
import { audit } from '@velora/db';
import { enqueue } from '@velora/queue';
import { actionContext } from '@/lib/action-context';

/** Bir ürün için Ürün Zekası paketini (yeniden) üretir (SEO+içerik+reklam+kitle+UGC+skor). */
export async function generateIntelligence(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const productId = String(formData.get('productId') ?? '');
  if (!productId) return;
  await enqueue('productIntelligence', { productId });
  await audit.log({
    brandId,
    actor,
    action: 'intelligence.generate',
    entity: 'Product',
    entityId: productId,
    autonomyLevel: 2,
  });
  revalidatePath('/intelligence');
}
