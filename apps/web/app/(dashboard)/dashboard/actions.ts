'use server';

import { revalidatePath } from 'next/cache';
import { actionContext } from '@/lib/action-context';
import { executeJarvisCommand, type JarvisResult } from '@/lib/jarvis-executor';

export type { JarvisResult };

export async function jarvisCommand(
  _prevState: JarvisResult,
  formData: FormData,
): Promise<JarvisResult> {
  const { brandId, actor } = await actionContext();
  const text = String(formData.get('command') ?? '').trim();
  const result = await executeJarvisCommand(brandId, actor, text);
  revalidatePath('/dashboard');
  return result;
}
