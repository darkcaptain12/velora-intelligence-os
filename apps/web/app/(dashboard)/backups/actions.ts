'use server';

import { revalidatePath } from 'next/cache';
import { audit } from '@velora/db';
import { enqueue } from '@velora/queue';
import { actionContext } from '@/lib/action-context';

/** Yedeklemeyi kuyruğa atar (DB → MinIO). */
export async function runBackup() {
  const { actor, brandId } = await actionContext();
  await enqueue('backup', { brandId });
  await audit.log({ brandId, actor, action: 'backup.run', entity: 'Brand', entityId: brandId, autonomyLevel: 2 });
  revalidatePath('/backups');
}
