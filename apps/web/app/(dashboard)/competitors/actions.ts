'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, competitors } from '@velora/db';
import { enqueue } from '@velora/queue';
import { actionContext } from '@/lib/action-context';

export async function addCompetitor(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({ name: z.string().min(1).max(120), url: z.string().url() })
    .parse({ name: formData.get('name'), url: formData.get('url') });
  const c = await competitors.create(brandId, data.name, data.url);
  await audit.log({ brandId, actor, action: 'competitor.add', entity: 'Competitor', entityId: c.id, autonomyLevel: 2 });
  revalidatePath('/competitors');
}

export async function scanCompetitor(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await enqueue('competitorScan', { competitorId: id });
  await audit.log({ brandId, actor, action: 'competitor.scan', entity: 'Competitor', entityId: id, autonomyLevel: 2 });
  revalidatePath('/competitors');
}

export async function addCompetitorProduct(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({ competitorId: z.string().min(1), title: z.string().min(1).max(200), price: z.coerce.number().min(0) })
    .parse({
      competitorId: formData.get('competitorId'),
      title: formData.get('title'),
      price: formData.get('price'),
    });
  await competitors.addProduct(data.competitorId, data.title, data.price);
  await audit.log({ brandId, actor, action: 'competitor.product', entity: 'CompetitorProduct', autonomyLevel: 2 });
  revalidatePath('/competitors');
}
