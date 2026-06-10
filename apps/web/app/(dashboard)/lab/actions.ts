'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, creativeTests } from '@velora/db';
import { actionContext } from '@/lib/action-context';

export async function createTest(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const hypothesis = z.string().min(3).max(300).parse(formData.get('hypothesis'));
  const variants = String(formData.get('variants') ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  if (variants.length < 2) return;
  const test = await creativeTests.create(brandId, hypothesis, variants);
  await audit.log({ brandId, actor, action: 'creative.test.create', entity: 'CreativeTest', entityId: test.id, autonomyLevel: 2 });
  revalidatePath('/lab');
}

export async function pickWinner(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const winner = String(formData.get('winner') ?? '');
  if (!id || !winner) return;
  await creativeTests.setWinner(id, winner);
  await audit.log({ brandId, actor, action: 'creative.test.winner', entity: 'CreativeTest', entityId: id, payload: { winner }, autonomyLevel: 2 });
  revalidatePath('/lab');
}
