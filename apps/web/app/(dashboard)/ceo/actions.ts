'use server';

import { revalidatePath } from 'next/cache';
import { audit, decisions, emails, suppliers, tasks } from '@velora/db';
import { enqueue } from '@velora/queue';
import { ai, prompts } from '@velora/ai';
import { IntegrationError } from '@velora/shared';
import { actionContext } from '@/lib/action-context';
import {
  adjustCampaignBudget,
  applySupplierCostToProduct,
  convertOpportunityToDesign,
  createCampaignDraftFromIntelligence,
  exitNiche,
  pauseCampaign,
} from '@/lib/decision-handlers';

/** AI CEO haftalık raporunu üretip e-postayla gönderir (worker). */
export async function generateReport() {
  const { actor, brandId } = await actionContext();
  await enqueue('weeklyReport', { brandId });
  await audit.log({ brandId, actor, action: 'report.generate', entity: 'Brand', entityId: brandId, autonomyLevel: 1 });
  revalidatePath('/ceo');
}

/**
 * AI CEO Karar Motoru — "Uygula": kararın `action`'ına göre ilgili akışı tetikler
 * (mevcut handler'lar/kuyruklar, hiçbir yeni mantık YOK), sonra APPLIED işaretler.
 * Her karar PENDING başlar — bu, tek-tık manuel onaydır (otomatik uygulama değil).
 */
export async function applyDecision(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const decision = await decisions.getById(id);
  if (!decision || decision.brandId !== brandId || decision.status !== 'PENDING') return;
  const params = (decision.params ?? {}) as unknown as Record<string, unknown>;

  switch (decision.action) {
    case 'CONVERT_OPPORTUNITY':
      if (typeof params.opportunityId === 'string') {
        await convertOpportunityToDesign(brandId, actor, params.opportunityId);
      }
      break;

    case 'GENERATE_INTELLIGENCE':
      if (typeof params.productId === 'string') {
        await enqueue('productIntelligence', { productId: params.productId });
      }
      break;

    case 'PREP_EVENT_DESIGN':
      await enqueue('autoDesign', { brandId, count: 1 });
      break;

    case 'ADJUST_AD_BUDGET':
      if (typeof params.campaignId === 'string' && typeof params.dailyBudget === 'number') {
        await adjustCampaignBudget(brandId, actor, params.campaignId, params.dailyBudget);
      }
      break;

    case 'PAUSE_CAMPAIGN':
      if (typeof params.campaignId === 'string') {
        await pauseCampaign(brandId, actor, params.campaignId);
      }
      break;

    case 'CONTACT_SUPPLIER': {
      if (typeof params.supplierId === 'string') {
        const supplier = await suppliers.getById(params.supplierId);
        const topic = typeof params.topic === 'string' && params.topic ? params.topic : 'İlk iletişim ve iş birliği teklifi';
        if (supplier) {
          try {
            const body = await ai.text.generate(brandId, {
              prompt: prompts.draftSupplierEmail({ company: supplier.company, topic }),
              temperature: 0.6,
              maxTokens: 500,
            });
            await emails.create({ brandId, supplierId: supplier.id, direction: 'OUTBOUND', subject: topic.slice(0, 70), body });
          } catch (err) {
            if (err instanceof IntegrationError) {
              await tasks.create({
                brandId,
                title: 'OpenAI API anahtarını ayarla',
                description: 'Mail taslağı üretilemedi: OpenAI anahtarı eksik. Ayarlar > API Anahtarları.',
                type: 'API_INPUT',
                priority: 1,
              });
            } else {
              throw err;
            }
          }
        }
      }
      break;
    }

    case 'EXIT_NICHE':
      if (typeof params.productId === 'string') {
        await exitNiche(brandId, actor, params.productId);
      }
      break;

    case 'APPLY_SUPPLIER_COST':
      if (typeof params.productId === 'string' && typeof params.supplierId === 'string') {
        await applySupplierCostToProduct(brandId, actor, params.productId, params.supplierId);
      }
      break;

    case 'CREATE_AD_DRAFT':
      if (typeof params.productId === 'string') {
        await createCampaignDraftFromIntelligence(brandId, actor, params.productId);
      }
      break;

    case 'GENERIC':
    default:
      await tasks.create({
        brandId,
        title: decision.title,
        description: decision.rationale,
        type: 'GENERIC',
        priority: 2,
      });
      break;
  }

  await decisions.setStatus(id, 'APPLIED');
  await audit.log({
    brandId,
    actor,
    action: 'decision.apply',
    entity: 'AIDecision',
    entityId: id,
    payload: { decisionAction: decision.action },
    autonomyLevel: 1,
  });
  revalidatePath('/ceo');
}

/** AI CEO Karar Motoru — "Reddet": karar uygulanmaz, listeden kalkar. */
export async function dismissDecision(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const decision = await decisions.getById(id);
  if (!decision || decision.brandId !== brandId || decision.status !== 'PENDING') return;
  await decisions.setStatus(id, 'DISMISSED');
  await audit.log({ brandId, actor, action: 'decision.dismiss', entity: 'AIDecision', entityId: id, autonomyLevel: 1 });
  revalidatePath('/ceo');
}
