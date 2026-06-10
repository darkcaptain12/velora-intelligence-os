'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, brands, credentials, settings, spendLimits, type Provider } from '@velora/db';
import { actionContext } from '@/lib/action-context';

export async function updateBrand(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      name: z.string().min(1),
      currency: z.string().min(1).max(8),
      taxRate: z.coerce.number().min(0).max(1),
    })
    .parse({
      name: formData.get('name'),
      currency: formData.get('currency'),
      taxRate: formData.get('taxRate'),
    });

  await brands.update(brandId, data);
  await audit.log({
    brandId,
    actor,
    action: 'brand.update',
    entity: 'Brand',
    entityId: brandId,
    payload: data,
    autonomyLevel: 2,
  });
  revalidatePath('/settings');
}

const PROVIDERS: Provider[] = [
  'OPENAI',
  'FAL',
  'ANTHROPIC',
  'SHOPIFY',
  'META',
  'SMTP',
  'ETSY',
  'PINTEREST',
];

export async function saveCredential(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const provider = String(formData.get('provider'));
  const value = String(formData.get('value') ?? '').trim();
  if (!PROVIDERS.includes(provider as Provider) || !value) return;

  await credentials.set(brandId, provider as Provider, value);
  await audit.log({
    brandId,
    actor,
    action: 'credential.set',
    entity: 'ApiCredential',
    entityId: provider,
    autonomyLevel: 2,
  });
  revalidatePath('/settings');
}

export async function saveSpendLimits(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const values = z
    .object({
      DAILY: z.coerce.number().min(0),
      WEEKLY: z.coerce.number().min(0),
      MONTHLY: z.coerce.number().min(0),
    })
    .parse({
      DAILY: formData.get('DAILY'),
      WEEKLY: formData.get('WEEKLY'),
      MONTHLY: formData.get('MONTHLY'),
    });

  await Promise.all([
    spendLimits.set(brandId, 'DAILY', values.DAILY),
    spendLimits.set(brandId, 'WEEKLY', values.WEEKLY),
    spendLimits.set(brandId, 'MONTHLY', values.MONTHLY),
  ]);
  await audit.log({
    brandId,
    actor,
    action: 'spendLimits.update',
    entity: 'SpendLimit',
    payload: values,
    autonomyLevel: 2,
  });
  revalidatePath('/settings');
}

export async function saveAutonomy(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const level = z.coerce.number().int().min(1).max(3).parse(formData.get('level'));
  const autoMode = formData.get('autoMode') === 'on';

  await settings.set(brandId, 'autonomy.level', level);
  await settings.set(brandId, 'ads.autoMode', autoMode);
  await audit.log({
    brandId,
    actor,
    action: 'autonomy.update',
    entity: 'Setting',
    payload: { level, autoMode },
    autonomyLevel: 2,
  });
  revalidatePath('/settings');
}
