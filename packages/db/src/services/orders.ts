import { prisma } from '../client';

/** Shopify siparişleri (Operasyon Müdürü "Siparişler" sekmesi). */
export const orders = {
  /** Son siparişler, tarihe göre azalan. */
  list: (brandId: string, take = 50) =>
    prisma.order.findMany({
      where: { brandId },
      orderBy: { createdAt: 'desc' },
      take,
    }),
};
