import { adCampaigns, adSets, audit, opportunities, prisma, productIntelligence, products, suppliers, tasks } from '@velora/db';
import { enqueue } from '@velora/queue';
import { createAdSet, createCampaign, searchInterests, setCampaignBudget, setCampaignStatus } from '@velora/integrations';
import { IntegrationError } from '@velora/shared';

/**
 * Paylaşılan karar/aksiyon handler'ları — hem hub-özel server action'lar
 * (`hunter/actions.ts`, `finance/actions.ts`) hem AI CEO Karar Motoru'nun
 * `applyDecision`'ı (`ceo/actions.ts`) tarafından çağrılır. Davranış öncekiyle
 * birebir aynı; sadece tek yerden çağrılabilir hale getirildi.
 */

/** Meta anahtarı eksikse görev açar; başka hatayı yeniden fırlatır. */
export async function handleMetaError(brandId: string, err: unknown): Promise<void> {
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

/** Fırsattan başlığı/temayı tasarım promptuna çevirir. */
function promptFromOpportunity(opp: { niche: string; kind: string; sourceSignals: unknown }): string {
  if (opp.kind === 'EVENT') {
    const sig = opp.sourceSignals as { themes?: string[] } | null;
    if (sig?.themes?.[0]) return sig.themes[0];
  }
  return opp.niche;
}

/**
 * "Tasarıma Dönüştür" — OPPORTUNITY-FIRST SERT KAPI: validationScore ≥ 60 değilse tasarım YOK.
 * Geçerse fırsattan tasarım üretilir, fırsat PURSUED olur.
 */
export async function convertOpportunityToDesign(brandId: string, actor: string, opportunityId: string): Promise<void> {
  const opp = await opportunities.getById(opportunityId);
  if (!opp || opp.brandId !== brandId) return;
  // SERT KAPI
  if ((opp.validationScore ?? 0) < 60) {
    await audit.log({
      brandId,
      actor,
      action: 'opportunity.convert.blocked',
      entity: 'Opportunity',
      entityId: opportunityId,
      payload: { validationScore: opp.validationScore ?? 0 },
      autonomyLevel: 2,
    });
    return;
  }
  const design = await prisma.design.create({
    data: { brandId, prompt: promptFromOpportunity(opp), status: 'GENERATING' },
  });
  await enqueue('design', { designId: design.id });
  await opportunities.setDesign(opportunityId, design.id);
  await audit.log({
    brandId,
    actor,
    action: 'opportunity.convert',
    entity: 'Opportunity',
    entityId: opportunityId,
    payload: { designId: design.id },
    autonomyLevel: 2,
  });
}

/** Mevcut bir Meta kampanyasının günlük bütçesini değiştirir (yeni kampanya OLUŞTURMAZ). */
export async function adjustCampaignBudget(brandId: string, actor: string, campaignId: string, dailyBudget: number): Promise<void> {
  const campaign = await prisma.adCampaign.findUnique({ where: { id: campaignId } });
  if (!campaign || campaign.brandId !== brandId || !(dailyBudget > 0)) return;
  try {
    await setCampaignBudget(brandId, campaign.metaId, dailyBudget);
    await prisma.adCampaign.update({ where: { id: campaignId }, data: { dailyBudget } });
    await audit.log({ brandId, actor, action: 'ads.budget', entity: 'AdCampaign', entityId: campaignId, payload: { budget: dailyBudget }, autonomyLevel: 2 });
  } catch (err) {
    await handleMetaError(brandId, err);
  }
}

/** Mevcut bir Meta kampanyasını durdurur. */
export async function pauseCampaign(brandId: string, actor: string, campaignId: string): Promise<void> {
  const campaign = await prisma.adCampaign.findUnique({ where: { id: campaignId } });
  if (!campaign || campaign.brandId !== brandId) return;
  try {
    await setCampaignStatus(brandId, campaign.metaId, 'PAUSED');
    await adCampaigns.setStatus(campaignId, 'PAUSED');
    await audit.log({ brandId, actor, action: 'ads.status', entity: 'AdCampaign', entityId: campaignId, payload: { status: 'PAUSED' }, autonomyLevel: 2 });
  } catch (err) {
    await handleMetaError(brandId, err);
  }
}

interface CampaignPrepAdSet {
  name?: string;
  audience?: string;
  interests?: string[];
  dailyBudgetUSD?: number;
}

interface CampaignPrep {
  campaignName?: string;
  adSets?: CampaignPrepAdSet[];
  hook?: string;
  primaryText?: string;
  headline?: string;
  description?: string;
}

/**
 * `ProductIntelligence.campaignPrep`'ten Meta'da PAUSED (taslak) kampanya + ad set'ler
 * oluşturur (Meta Taslak Kampanya, D5). Otomatik YAYIN yok — sonuç Meta Ads Manager'da
 * taslak olarak görünür, kullanıcı onayıyla elle aktif edilir.
 */
export async function createCampaignDraftFromIntelligence(brandId: string, actor: string, productId: string): Promise<void> {
  const product = await products.getById(productId);
  if (!product || product.brandId !== brandId) return;

  const pi = await productIntelligence.getByProductId(productId);
  const campaignPrep = (pi?.campaignPrep ?? null) as CampaignPrep | null;
  if (!campaignPrep?.campaignName) return;

  try {
    const campaign = await createCampaign(brandId, { name: campaignPrep.campaignName, objective: 'OUTCOME_ENGAGEMENT' });
    const localCampaign = await adCampaigns.upsert(brandId, campaign.id, {
      name: campaign.name,
      status: campaign.status,
      objective: campaign.objective,
      productId,
    });

    for (const set of (campaignPrep.adSets ?? []).slice(0, 3)) {
      const interestIds: string[] = [];
      for (const interest of (set.interests ?? []).slice(0, 5)) {
        const found = await searchInterests(brandId, interest).catch(() => []);
        if (found[0]) interestIds.push(found[0].id);
      }
      const dailyBudget = set.dailyBudgetUSD && set.dailyBudgetUSD > 0 ? set.dailyBudgetUSD : 10;
      const adSet = await createAdSet(brandId, {
        campaignId: campaign.id,
        name: set.name || campaignPrep.campaignName,
        dailyBudget,
        interestIds,
      });
      await adSets.create(localCampaign.id, adSet.id, adSet.name, adSet.status, dailyBudget);
    }

    await audit.log({
      brandId,
      actor,
      action: 'ads.draft_campaign',
      entity: 'AdCampaign',
      entityId: localCampaign.id,
      payload: { productId, metaId: campaign.id, adSets: (campaignPrep.adSets ?? []).length },
      autonomyLevel: 1,
    });
  } catch (err) {
    await handleMetaError(brandId, err);
  }
}

/**
 * "Nişten Çık" — ürünü yaşam döngüsünde KAPATILDI'ya geçirir + ürüne bağlı aktif Meta
 * kampanyalarını durdurur (varsa). AI CEO Karar Motoru v2: sürekli düşüşte olan zayıf
 * ürünler için önerilir.
 */
export async function exitNiche(brandId: string, actor: string, productId: string): Promise<void> {
  const product = await products.getById(productId);
  if (!product || product.brandId !== brandId) return;

  await products.transition(productId, 'CLOSED', 'AI CEO Karar Motoru: nişten çık');

  const activeCampaigns = await prisma.adCampaign.findMany({
    where: { brandId, productId, status: 'ACTIVE' },
    select: { id: true },
  });
  for (const c of activeCampaigns) {
    await pauseCampaign(brandId, actor, c.id);
  }

  await audit.log({
    brandId,
    actor,
    action: 'product.exit_niche',
    entity: 'Product',
    entityId: productId,
    payload: { pausedCampaigns: activeCampaigns.length },
    autonomyLevel: 1,
  });
}

/** Tedarikçinin birim maliyetini ürüne uygular (Faz B/E — karşılaştırmalı tedarikçi maliyeti). */
export async function applySupplierCostToProduct(
  brandId: string,
  actor: string,
  productId: string,
  supplierId: string,
): Promise<void> {
  const [product, supplier] = await Promise.all([products.getById(productId), suppliers.getById(supplierId)]);
  if (!product || product.brandId !== brandId) return;
  if (!supplier || supplier.brandId !== brandId || supplier.unitCost == null) return;

  const cost = Number(supplier.unitCost);
  await products.setCost(productId, cost);
  await audit.log({
    brandId,
    actor,
    action: 'product.cost.apply_supplier',
    entity: 'Product',
    entityId: productId,
    payload: { supplierId, supplier: supplier.company, cost, currency: supplier.costCurrency },
    autonomyLevel: 2,
  });
}
