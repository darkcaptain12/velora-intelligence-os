import type { Prisma } from '@prisma/client';
import { prisma } from '../client';

/** Marka bazlı tipli anahtar-değer ayarları (JSON). */
export const settings = {
  async get<T = unknown>(brandId: string, key: string, fallback: T): Promise<T> {
    const row = await prisma.setting.findUnique({ where: { brandId_key: { brandId, key } } });
    return row ? (row.value as T) : fallback;
  },

  async set(brandId: string, key: string, value: unknown): Promise<void> {
    const json = value as unknown as Prisma.InputJsonValue;
    await prisma.setting.upsert({
      where: { brandId_key: { brandId, key } },
      create: { brandId, key, value: json },
      update: { value: json },
    });
  },

  all: (brandId: string) => prisma.setting.findMany({ where: { brandId } }),
};
