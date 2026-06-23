import { prisma } from '../client';

/** Haftalık talep sinyali zaman serisi — demandSync job'u tarafından yazılır. */
export const productConversions = {
  /** Belirtilen ürün + hafta için upsert (idempotent: demandSync her hafta bir kez çalışır). */
  upsert: (input: {
    brandId: string;
    productId: string;
    week: string;
    pageViews: number;
    cartAdds: number;
    wishlistAdds: number;
    behaviorScore?: number;
  }) =>
    prisma.productConversion.upsert({
      where: { productId_week: { productId: input.productId, week: input.week } },
      create: {
        brandId: input.brandId,
        productId: input.productId,
        week: input.week,
        pageViews: input.pageViews,
        cartAdds: input.cartAdds,
        wishlistAdds: input.wishlistAdds,
        behaviorScore: input.behaviorScore ?? null,
      },
      update: {
        pageViews: input.pageViews,
        cartAdds: input.cartAdds,
        wishlistAdds: input.wishlistAdds,
        behaviorScore: input.behaviorScore ?? null,
      },
    }),

  /** Son N hafta için marka genelinde zaman serisi (ürün başına). */
  listByBrand: (brandId: string, weeks = 8) =>
    prisma.productConversion.findMany({
      where: { brandId },
      orderBy: { week: 'desc' },
      take: weeks * 50, // max 50 ürün × weeks hafta
      include: { product: { select: { title: true, status: true } } },
    }),

  /** Tek ürün için tarihsel seri (en yeniden eskiye). */
  listByProduct: (productId: string, weeks = 8) =>
    prisma.productConversion.findMany({
      where: { productId },
      orderBy: { week: 'desc' },
      take: weeks,
    }),

  /** Bu haftanın en yüksek skorlu ürünlerini döner (haftalık rapor için). */
  topThisWeek: (brandId: string, week: string, limit = 5) =>
    prisma.productConversion.findMany({
      where: { brandId, week },
      orderBy: { behaviorScore: 'desc' },
      take: limit,
      include: { product: { select: { title: true } } },
    }),
};
