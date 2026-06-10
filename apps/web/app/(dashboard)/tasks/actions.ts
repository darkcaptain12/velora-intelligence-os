'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, tasks, type TaskStatus } from '@velora/db';
import { actionContext } from '@/lib/action-context';

const TASK_STATUSES: TaskStatus[] = ['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED'];

export async function createTask(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      title: z.string().min(1).max(200),
      description: z.string().max(2000).optional(),
      type: z.enum(['GENERIC', 'API_INPUT', 'APPROVE_DESIGN', 'APPROVE_AD']).default('GENERIC'),
      priority: z.coerce.number().int().min(1).max(5).default(3),
    })
    .parse({
      title: formData.get('title'),
      description: formData.get('description') || undefined,
      type: formData.get('type') || 'GENERIC',
      priority: formData.get('priority') || 3,
    });

  const task = await tasks.create({ brandId, ...data });
  await audit.log({
    brandId,
    actor,
    action: 'task.create',
    entity: 'Task',
    entityId: task.id,
    payload: data,
    autonomyLevel: 1,
  });
  revalidatePath('/tasks');
}

export async function setTaskStatus(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  if (!id || !TASK_STATUSES.includes(status as TaskStatus)) return;

  await tasks.setStatus(id, status as TaskStatus);
  await audit.log({
    brandId,
    actor,
    action: 'task.status',
    entity: 'Task',
    entityId: id,
    payload: { status },
    autonomyLevel: 1,
  });
  revalidatePath('/tasks');
}
