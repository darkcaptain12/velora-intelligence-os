'use server';

import { revalidatePath } from 'next/cache';
import { adCampaigns, audit, finance, prisma, tasks, type Prisma } from '@velora/db';
import { enqueue } from '@velora/queue';
import { ai } from '@velora/ai';
import { setCampaignStatus } from '@velora/integrations';
import { IntegrationError } from '@velora/shared';
import { actionContext } from '@/lib/action-context';
import { adjustCampaignBudget, handleMetaError, pauseCampaign } from '@/lib/decision-handlers';

/** Bugünün finans anlık görüntüsünü kuyruğa atar. */
export async function runFinanceSnapshot() {
  const { actor, brandId } = await actionContext();
  await enqueue('financeSnapshot', { brandId });
  await audit.log({ brandId, actor, action: 'finance.snapshot', entity: 'Brand', entityId: brandId, autonomyLevel: 2 });
  revalidatePath('/finance');
}

/** Son finans verilerinden AI finansal yorum üretir (AIReport FINANCE). */
export async function generateFinancialComment() {
  const { actor, brandId } = await actionContext();
  const snaps = await finance.latest(brandId, 14);
  if (snaps.length === 0) {
    await tasks.create({
      brandId,
      title: 'Finans verisi yok',
      description: 'Yorum için önce "Anlık Görüntü Al" çalıştırın (sipariş/harcama verisi gerekir).',
      type: 'GENERIC',
      priority: 3,
    });
    revalidatePath('/finance');
    return;
  }

  const summary = snaps
    .map((s) => `${s.date.toISOString().slice(0, 10)}: ciro ${s.revenue}, net kâr ${s.netProfit}, sipariş ${s.orders}`)
    .join('\n');

  try {
    const text = await ai.text.generate(brandId, {
      prompt: `Aşağıdaki günlük finans verilerine bakarak KISA Türkçe finansal yorum ve 2 somut öneri ver:\n${summary}`,
      temperature: 0.5,
      maxTokens: 600,
    });
    await prisma.aIReport.create({
      data: {
        brandId,
        type: 'FINANCE',
        period: new Date().toISOString().slice(0, 10),
        summary: text,
        insights: [] as unknown as Prisma.InputJsonValue,
        recommendations: [] as unknown as Prisma.InputJsonValue,
      },
    });
    await audit.log({ brandId, actor, action: 'finance.comment', entity: 'AIReport', autonomyLevel: 2 });
  } catch (err) {
    if (err instanceof IntegrationError) {
      await tasks.create({
        brandId,
        title: 'OpenAI API anahtarını ayarla',
        description: 'Finansal yorum üretilemedi: OpenAI anahtarı eksik. Ayarlar > API Anahtarları.',
        type: 'API_INPUT',
        priority: 1,
      });
    } else {
      throw err;
    }
  }
  revalidatePath('/finance');
}

export async function syncAds() {
  const { actor, brandId } = await actionContext();
  await enqueue('adSync', { brandId });
  await audit.log({ brandId, actor, action: 'ads.sync', entity: 'Brand', entityId: brandId, autonomyLevel: 2 });
  revalidatePath('/finance');
}

export async function runGuardian() {
  const { actor, brandId } = await actionContext();
  await enqueue('spendGuardian', { brandId });
  await audit.log({ brandId, actor, action: 'ads.guardian', entity: 'Brand', entityId: brandId, autonomyLevel: 2 });
  revalidatePath('/finance');
}

export async function setCampaignState(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '') as 'ACTIVE' | 'PAUSED';
  const campaign = await prisma.adCampaign.findUnique({ where: { id } });
  if (!campaign || (status !== 'ACTIVE' && status !== 'PAUSED')) return;
  if (status === 'PAUSED') {
    await pauseCampaign(brandId, actor, id);
    revalidatePath('/finance');
    return;
  }
  try {
    await setCampaignStatus(brandId, campaign.metaId, status);
    await adCampaigns.setStatus(id, status);
    await audit.log({ brandId, actor, action: 'ads.status', entity: 'AdCampaign', entityId: id, payload: { status }, autonomyLevel: 2 });
  } catch (err) {
    await handleMetaError(brandId, err);
  }
  revalidatePath('/finance');
}

export async function setBudget(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const budget = Number(formData.get('budget'));
  await adjustCampaignBudget(brandId, actor, id, budget);
  revalidatePath('/finance');
}
