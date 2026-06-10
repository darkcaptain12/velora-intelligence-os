'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, prisma, type VideoType } from '@velora/db';
import { enqueue } from '@velora/queue';
import { actionContext } from '@/lib/action-context';

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
  revalidatePath('/videos');
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
  revalidatePath('/videos');
}
