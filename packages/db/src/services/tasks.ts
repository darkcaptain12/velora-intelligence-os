import type { TaskStatus, TaskType } from '@prisma/client';
import { prisma } from '../client';

/** Görev Merkezi — Claude'un/operatörün oluşturduğu görevler ve onay kapıları. */
export const tasks = {
  list: (brandId: string, status?: TaskStatus) =>
    prisma.task.findMany({
      where: { brandId, ...(status ? { status } : {}) },
      orderBy: [{ status: 'asc' }, { priority: 'asc' }, { createdAt: 'desc' }],
    }),

  getById: (id: string) => prisma.task.findUnique({ where: { id } }),

  create: (input: {
    brandId: string;
    title: string;
    description?: string;
    type?: TaskType;
    priority?: number;
    dueAt?: Date;
  }) => prisma.task.create({ data: input }),

  setStatus: (id: string, status: TaskStatus) =>
    prisma.task.update({ where: { id }, data: { status } }),

  async counts(brandId: string) {
    const [open, inProgress, total] = await Promise.all([
      prisma.task.count({ where: { brandId, status: 'OPEN' } }),
      prisma.task.count({ where: { brandId, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { brandId } }),
    ]);
    return { open, inProgress, total };
  },
};
