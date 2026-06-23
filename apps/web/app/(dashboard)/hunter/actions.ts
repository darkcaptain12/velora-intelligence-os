'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, competitors, opportunities, prisma, type Source } from '@velora/db';
import { enqueue } from '@velora/queue';
import { actionContext } from '@/lib/action-context';
import { convertOpportunityToDesign } from '@/lib/decision-handlers';

/** Ürün keşfini tetikle (kaynaklardan fırsat üret + skorla, etkinlik takvimini güncelle). */
export async function runDiscovery() {
  const { actor, brandId } = await actionContext();
  await enqueue('productDiscovery', { brandId });
  await audit.log({ brandId, actor, action: 'discovery.run', entity: 'Brand', entityId: brandId, autonomyLevel: 2 });
  revalidatePath('/hunter');
  revalidatePath('/dashboard');
}

/** Bir fırsatı doğrula (validationScore üret → Opportunity-First kapısı). */
export async function validateOpportunityAction(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const opp = await opportunities.getById(id);
  if (!opp || opp.brandId !== brandId) return;
  await enqueue('validateOpportunity', { opportunityId: id });
  await audit.log({ brandId, actor, action: 'opportunity.validate', entity: 'Opportunity', entityId: id, autonomyLevel: 2 });
  revalidatePath('/hunter');
}

/**
 * "Tasarıma Dönüştür" — OPPORTUNITY-FIRST SERT KAPI: validationScore ≥ 60 değilse tasarım YOK.
 * Geçerse fırsattan tasarım üretilir, fırsat PURSUED olur.
 */
export async function convertToDesign(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  await convertOpportunityToDesign(brandId, actor, id);
  revalidatePath('/hunter');
}

/** Trend Avcısı: mevcut araştırma sonuçlarından bu haftanın trendlerini çıkarır. */
export async function huntTrends() {
  const { actor, brandId } = await actionContext();
  await enqueue('trendHunt', { brandId });
  await audit.log({ brandId, actor, action: 'trend.hunt', entity: 'Brand', entityId: brandId, autonomyLevel: 2 });
  revalidatePath('/hunter');
}

export async function addCompetitor(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      name: z.string().min(1).max(120),
      url: z.string().url(),
      metaPageId: z.string().max(60).optional(),
    })
    .parse({
      name: formData.get('name'),
      url: formData.get('url'),
      metaPageId: formData.get('metaPageId') || undefined,
    });
  const c = await competitors.create(brandId, data.name, data.url, data.metaPageId);
  await audit.log({ brandId, actor, action: 'competitor.add', entity: 'Competitor', entityId: c.id, autonomyLevel: 2 });
  revalidatePath('/hunter');
}

/** Tüm rakipleri tek seferde tara (fan-out → competitorScan, fiyat değişimi tespiti). */
export async function watchAllCompetitors() {
  const { actor, brandId } = await actionContext();
  await enqueue('competitorWatch', { brandId });
  await audit.log({ brandId, actor, action: 'competitor.watch_all', entity: 'Brand', entityId: brandId, autonomyLevel: 2 });
  revalidatePath('/hunter');
}

export async function scanCompetitor(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await enqueue('competitorScan', { competitorId: id });
  await audit.log({ brandId, actor, action: 'competitor.scan', entity: 'Competitor', entityId: id, autonomyLevel: 2 });
  revalidatePath('/hunter');
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
  revalidatePath('/hunter');
}

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
  revalidatePath('/hunter');
}
