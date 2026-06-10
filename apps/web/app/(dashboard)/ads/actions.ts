'use server';

import { revalidatePath } from 'next/cache';
import { adCampaigns, audit, prisma, tasks } from '@velora/db';
import { enqueue } from '@velora/queue';
import { setCampaignBudget, setCampaignStatus } from '@velora/integrations';
import { IntegrationError } from '@velora/shared';
import { actionContext } from '@/lib/action-context';

/** Meta anahtarı eksikse görev açar; başka hatayı yeniden fırlatır. */
async function handleMetaError(brandId: string, err: unknown): Promise<void> {
  if (err instanceof IntegrationError) {
    await tasks.create({
      brandId,
      title: 'Meta API anahtarını ayarla',
      description: 'Meta işlemi başarısız: access token / ad account eksik. Ayarlar > API Anahtarları (META).',
      type: 'API_INPUT',
      priority: 1,
    });
    return;
  }
  throw err;
}

export async function syncAds() {
  const { actor, brandId } = await actionContext();
  await enqueue('adSync', { brandId });
  await audit.log({ brandId, actor, action: 'ads.sync', entity: 'Brand', entityId: brandId, autonomyLevel: 2 });
  revalidatePath('/ads');
}

export async function runGuardian() {
  const { actor, brandId } = await actionContext();
  await enqueue('spendGuardian', { brandId });
  await audit.log({ brandId, actor, action: 'ads.guardian', entity: 'Brand', entityId: brandId, autonomyLevel: 2 });
  revalidatePath('/ads');
}

export async function setCampaignState(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '') as 'ACTIVE' | 'PAUSED';
  const campaign = await prisma.adCampaign.findUnique({ where: { id } });
  if (!campaign || (status !== 'ACTIVE' && status !== 'PAUSED')) return;
  try {
    await setCampaignStatus(brandId, campaign.metaId, status);
    await adCampaigns.setStatus(id, status);
    await audit.log({ brandId, actor, action: 'ads.status', entity: 'AdCampaign', entityId: id, payload: { status }, autonomyLevel: 2 });
  } catch (err) {
    await handleMetaError(brandId, err);
  }
  revalidatePath('/ads');
}

export async function setBudget(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const budget = Number(formData.get('budget'));
  const campaign = await prisma.adCampaign.findUnique({ where: { id } });
  if (!campaign || !(budget > 0)) return;
  try {
    await setCampaignBudget(brandId, campaign.metaId, budget);
    await prisma.adCampaign.update({ where: { id }, data: { dailyBudget: budget } });
    await audit.log({ brandId, actor, action: 'ads.budget', entity: 'AdCampaign', entityId: id, payload: { budget }, autonomyLevel: 2 });
  } catch (err) {
    await handleMetaError(brandId, err);
  }
  revalidatePath('/ads');
}
