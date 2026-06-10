'use server';

import { revalidatePath } from 'next/cache';
import { audit } from '@velora/db';
import { enqueue } from '@velora/queue';
import { actionContext } from '@/lib/action-context';

/** AI CEO haftalık raporunu üretip e-postayla gönderir (worker). */
export async function generateReport() {
  const { actor, brandId } = await actionContext();
  await enqueue('weeklyReport', { brandId });
  await audit.log({ brandId, actor, action: 'report.generate', entity: 'Brand', entityId: brandId, autonomyLevel: 1 });
  revalidatePath('/ceo');
}
