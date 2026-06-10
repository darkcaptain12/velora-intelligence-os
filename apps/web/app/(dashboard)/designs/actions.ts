'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, prisma, tasks, type Prisma } from '@velora/db';
import { enqueue } from '@velora/queue';
import { ai, prompts } from '@velora/ai';
import { IntegrationError } from '@velora/shared';
import { actionContext } from '@/lib/action-context';

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
  revalidatePath('/designs');
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
  revalidatePath('/designs');
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
  revalidatePath('/designs');
}
