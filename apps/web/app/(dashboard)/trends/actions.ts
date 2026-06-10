'use server';

import { revalidatePath } from 'next/cache';
import { audit } from '@velora/db';
import { enqueue } from '@velora/queue';
import { actionContext } from '@/lib/action-context';

/** Trend Avcısı: mevcut araştırma sonuçlarından bu haftanın trendlerini çıkarır. */
export async function huntTrends() {
  const { actor, brandId } = await actionContext();
  await enqueue('trendHunt', { brandId });
  await audit.log({ brandId, actor, action: 'trend.hunt', entity: 'Brand', entityId: brandId, autonomyLevel: 2 });
  revalidatePath('/trends');
}
