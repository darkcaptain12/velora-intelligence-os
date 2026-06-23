'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, creativeTests, prisma, productIntelligence, products, tasks, type Prisma, type VideoType } from '@velora/db';
import { enqueue } from '@velora/queue';
import { ai, prompts } from '@velora/ai';
import { IntegrationError } from '@velora/shared';
import { actionContext } from '@/lib/action-context';
import { createCampaignDraftFromIntelligence } from '@/lib/decision-handlers';

/** AI Tasarım Direktörü: niş + kitleden tasarım briefi üretir (OpenAI). */
export async function generateBrief(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({ niche: z.string().min(2).max(80), audience: z.string().min(2).max(120) })
    .parse({ niche: formData.get('niche'), audience: formData.get('audience') });

  try {
    const summary = await ai.text.generate(brandId, {
      prompt: prompts.designBrief({ niche: data.niche, audience: data.audience, trends: [data.niche] }),
      temperature: 0.8,
    });
    await prisma.designBrief.create({
      data: {
        brandId,
        summary,
        targetAudience: data.audience,
        trendRefs: [data.niche] as unknown as Prisma.InputJsonValue,
      },
    });
    await audit.log({
      brandId,
      actor,
      action: 'design.brief',
      entity: 'DesignBrief',
      payload: data,
      autonomyLevel: 2,
    });
  } catch (err) {
    if (err instanceof IntegrationError) {
      // Anahtar yoksa onay/giriş görevi oluştur (kullanıcı onayı katmanı)
      await tasks.create({
        brandId,
        title: 'OpenAI API anahtarını ayarla',
        description: 'AI Tasarım Direktörü brief üretemedi: OpenAI anahtarı eksik. Ayarlar > API Anahtarları.',
        type: 'API_INPUT',
        priority: 1,
      });
    } else {
      throw err;
    }
  }
  revalidatePath('/studio');
}

/** Tasarım üretimi talep eder: Design kaydı + design kuyruğu. */
export async function requestDesign(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({ prompt: z.string().min(3).max(500), briefId: z.string().optional() })
    .parse({ prompt: formData.get('prompt'), briefId: formData.get('briefId') || undefined });

  const design = await prisma.design.create({
    data: { brandId, prompt: data.prompt, briefId: data.briefId, status: 'DRAFT' },
  });
  await enqueue('design', { designId: design.id });
  await audit.log({
    brandId,
    actor,
    action: 'design.request',
    entity: 'Design',
    entityId: design.id,
    payload: data,
    autonomyLevel: 2,
  });
  revalidatePath('/studio');
}

/** Tasarımı onaylar (yayına hazır). */
export async function approveDesign(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await prisma.design.update({ where: { id }, data: { status: 'PUBLISHED' } });
  await audit.log({
    brandId,
    actor,
    action: 'design.approve',
    entity: 'Design',
    entityId: id,
    autonomyLevel: 2,
  });
  revalidatePath('/studio');
}

export async function requestVideo(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      prompt: z.string().min(3).max(500),
      type: z.enum(['TIKTOK', 'REEL', 'STORY', 'UGC']),
    })
    .parse({ prompt: formData.get('prompt'), type: formData.get('type') });

  const video = await prisma.video.create({
    data: { brandId, type: data.type as VideoType, status: 'GENERATING' },
  });
  await enqueue('video', { videoId: video.id, prompt: data.prompt });
  await audit.log({
    brandId,
    actor,
    action: 'video.request',
    entity: 'Video',
    entityId: video.id,
    payload: data,
    autonomyLevel: 2,
  });
  revalidatePath('/studio');
}

export async function approveVideo(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await prisma.video.update({ where: { id }, data: { status: 'PUBLISHED' } });
  await audit.log({
    brandId,
    actor,
    action: 'video.approve',
    entity: 'Video',
    entityId: id,
    autonomyLevel: 2,
  });
  revalidatePath('/studio');
}

/** Ürün Zekası UGC hook'undan video üretim isteği oluşturur (Video Fabrikası, mevcut `video` kuyruğu). */
export async function requestUgcVideo(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      productId: z.string().min(1),
      hookIndex: z.coerce.number().int().min(0),
      type: z.enum(['TIKTOK', 'REEL', 'STORY', 'UGC']),
    })
    .parse({
      productId: formData.get('productId'),
      hookIndex: formData.get('hookIndex'),
      type: formData.get('type'),
    });

  const pi = await productIntelligence.getByProductId(data.productId);
  const ugc = (pi?.ugc ?? {}) as { brief?: string; scenario?: string; hooks?: string[] };
  const hook = ugc.hooks?.[data.hookIndex];
  if (!hook) return;

  const parts = [`UGC tarzı ürün tanıtım videosu. Açılış cümlesi (hook): "${hook}".`];
  if (ugc.scenario) parts.push(`Senaryo: ${ugc.scenario}`);
  if (ugc.brief) parts.push(`Brief: ${ugc.brief}`);

  const video = await prisma.video.create({
    data: { brandId, productId: data.productId, type: data.type as VideoType, status: 'GENERATING' },
  });
  await enqueue('video', { videoId: video.id, prompt: parts.join(' ') });
  await audit.log({
    brandId,
    actor,
    action: 'video.request_ugc',
    entity: 'Video',
    entityId: video.id,
    payload: { productId: data.productId, hookIndex: data.hookIndex, type: data.type },
    autonomyLevel: 2,
  });
  revalidatePath('/studio');
}

/** `campaignPrep`'ten Meta'da PAUSED (taslak) kampanya + ad set'ler oluşturur (Meta Taslak Kampanya, D5). */
export async function createCampaignDraft(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const productId = String(formData.get('productId') ?? '');
  if (!productId) return;
  await createCampaignDraftFromIntelligence(brandId, actor, productId);
  revalidatePath('/studio');
}

/** Bir ürün için Ürün Zekası paketini (yeniden) üretir (SEO+içerik+reklam+kitle+UGC+skor). */
export async function generateIntelligence(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const productId = String(formData.get('productId') ?? '');
  if (!productId) return;
  await enqueue('productIntelligence', { productId });
  await audit.log({
    brandId,
    actor,
    action: 'intelligence.generate',
    entity: 'Product',
    entityId: productId,
    autonomyLevel: 2,
  });
  revalidatePath('/studio');
}

/** PI kaydı olmayan veya FAILED olan tüm ürünler için toplu Ürün Zekası üretim talebi oluşturur. */
export async function backfillIntelligence() {
  const { actor, brandId } = await actionContext();
  const [productList, piList] = await Promise.all([
    products.list(brandId),
    productIntelligence.list(brandId, 1000),
  ]);
  const piByProduct = new Map(piList.map((pi) => [pi.productId, pi]));
  const missing = productList.filter((p) => {
    const pi = piByProduct.get(p.id);
    return !pi || pi.status === 'FAILED';
  });
  for (const p of missing) {
    await enqueue('productIntelligence', { productId: p.id });
  }
  await audit.log({
    brandId,
    actor,
    action: 'intelligence.backfill',
    entity: 'Product',
    payload: { count: missing.length },
    autonomyLevel: 2,
  });
  revalidatePath('/studio');
}

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
  revalidatePath('/studio');
}

export async function pickWinner(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const winner = String(formData.get('winner') ?? '');
  if (!id || !winner) return;
  await creativeTests.setWinner(id, winner);
  await audit.log({ brandId, actor, action: 'creative.test.winner', entity: 'CreativeTest', entityId: id, payload: { winner }, autonomyLevel: 2 });
  revalidatePath('/studio');
}
