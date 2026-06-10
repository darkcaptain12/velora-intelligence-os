'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, emails, suppliers, tasks } from '@velora/db';
import { enqueue } from '@velora/queue';
import { ai } from '@velora/ai';
import { IntegrationError } from '@velora/shared';
import { actionContext } from '@/lib/action-context';

export async function addSupplier(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      company: z.string().min(1).max(160),
      email: z.string().email().optional().or(z.literal('')),
      phone: z.string().max(40).optional(),
      website: z.string().max(200).optional(),
      notes: z.string().max(1000).optional(),
    })
    .parse({
      company: formData.get('company'),
      email: formData.get('email') || '',
      phone: formData.get('phone') || undefined,
      website: formData.get('website') || undefined,
      notes: formData.get('notes') || undefined,
    });
  await suppliers.create({
    brandId,
    company: data.company,
    email: data.email || undefined,
    phone: data.phone,
    website: data.website,
    notes: data.notes,
  });
  await audit.log({ brandId, actor, action: 'supplier.add', entity: 'Supplier', autonomyLevel: 2 });
  revalidatePath('/suppliers');
}

/** AI ile tedarikçiye e-posta taslağı üretir (OpenAI). */
export async function draftEmail(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({ supplierId: z.string().min(1), topic: z.string().min(3).max(300) })
    .parse({ supplierId: formData.get('supplierId'), topic: formData.get('topic') });
  const supplier = await suppliers.getById(data.supplierId);
  if (!supplier) return;

  try {
    const body = await ai.text.generate(brandId, {
      prompt: `"${supplier.company}" adlı tedarikçiye şu konuda profesyonel, kısa ve nazik bir Türkçe e-posta yaz: "${data.topic}". Yalnızca e-posta gövdesini döndür (selamlama + kapanış dahil).`,
      temperature: 0.6,
      maxTokens: 500,
    });
    await emails.create({
      brandId,
      supplierId: supplier.id,
      direction: 'OUTBOUND',
      subject: data.topic.slice(0, 70),
      body,
    });
    await audit.log({ brandId, actor, action: 'mail.draft', entity: 'EmailMessage', entityId: supplier.id, autonomyLevel: 2 });
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
  revalidatePath('/suppliers');
}

/** Taslak e-postayı SMTP ile gönderir (Mailhog/üretim SMTP). */
export async function sendSupplierEmail(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await enqueue('mailSend', { emailId: id });
  await audit.log({ brandId, actor, action: 'mail.send', entity: 'EmailMessage', entityId: id, autonomyLevel: 2 });
  revalidatePath('/suppliers');
}
