'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, prisma, type Source } from '@velora/db';
import { enqueue } from '@velora/queue';
import { actionContext } from '@/lib/action-context';

export async function startResearch(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      query: z.string().min(2).max(100),
      source: z.enum(['HACKERNEWS', 'REDDIT', 'TIKTOK', 'PINTEREST', 'ETSY', 'AMAZON']),
    })
    .parse({ query: formData.get('query'), source: formData.get('source') });

  const run = await prisma.researchRun.create({
    data: { brandId, source: data.source as Source, query: data.query, status: 'QUEUED' },
  });
  await enqueue('research', { runId: run.id });
  await audit.log({
    brandId,
    actor,
    action: 'research.start',
    entity: 'ResearchRun',
    entityId: run.id,
    payload: data,
    autonomyLevel: 2,
  });
  revalidatePath('/research');
}
