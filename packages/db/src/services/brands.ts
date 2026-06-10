import { prisma } from '../client';

/** Marka yönetimi (çok marka altyapısı). */
export const brands = {
  list: () => prisma.brand.findMany({ orderBy: { createdAt: 'asc' } }),

  getById: (id: string) => prisma.brand.findUnique({ where: { id } }),

  /** Aktif markayı döner; yoksa ilk markaya düşer. */
  getActive: async () => {
    const active = await prisma.brand.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
    });
    return active ?? (await prisma.brand.findFirst({ orderBy: { createdAt: 'asc' } }));
  },

  update: (id: string, data: { name?: string; currency?: string; taxRate?: number }) =>
    prisma.brand.update({ where: { id }, data }),
};
