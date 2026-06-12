'use server';

import { revalidatePath } from 'next/cache';
import { audit, opportunities, prisma } from '@velora/db';
import { enqueue } from '@velora/queue';
import { actionContext } from '@/lib/action-context';

/** Ürün keşfini tetikle (kaynaklardan fırsat üret + skorla). */
export async function runDiscovery() {
  const { actor, brandId } = await actionContext();
  await enqueue('productDiscovery', { brandId });
  await audit.log({ brandId, actor, action: 'discovery.run', entity: 'Brand', entityId: brandId, autonomyLevel: 2 });
  revalidatePath('/discovery');
}

/** Bir fırsatı doğrula (validationScore üret → Opportunity-First kapısı). */
export async function validateOpportunityAction(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const opp = await opportunities.getById(id);
  if (!opp || opp.brandId !== brandId) return;
  await enqueue('validateOpportunity', { opportunityId: id });
  await audit.log({ brandId, actor, action: 'opportunity.validate', entity: 'Opportunity', entityId: id, autonomyLevel: 2 });
  revalidatePath('/discovery');
  revalidatePath('/validation');
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
export async function convertToDesign(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const opp = await opportunities.getById(id);
  if (!opp || opp.brandId !== brandId) return;
  // SERT KAPI
  if ((opp.validationScore ?? 0) < 60) {
    await audit.log({
      brandId,
      actor,
      action: 'opportunity.convert.blocked',
      entity: 'Opportunity',
      entityId: id,
      payload: { validationScore: opp.validationScore ?? 0 },
      autonomyLevel: 2,
    });
    revalidatePath('/discovery');
    return;
  }
  const design = await prisma.design.create({
    data: { brandId, prompt: promptFromOpportunity(opp), status: 'GENERATING' },
  });
  await enqueue('design', { designId: design.id });
  await opportunities.setDesign(id, design.id);
  await audit.log({
    brandId,
    actor,
    action: 'opportunity.convert',
    entity: 'Opportunity',
    entityId: id,
    payload: { designId: design.id },
    autonomyLevel: 2,
  });
  revalidatePath('/discovery');
}
