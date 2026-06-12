import type { LifecycleStatus, Prisma } from '@prisma/client';
import { canTransition, type LifecycleStatus as CoreLifecycle } from '@velora/core';
import { NotFoundError, ValidationError } from '@velora/shared';
import { prisma } from '../client';

/** Ürün + Yaşam Döngüsü servisi. Geçişler core durum makinesiyle doğrulanır. */
export const products = {
  list: (brandId: string) =>
    prisma.product.findMany({
      where: { brandId },
      orderBy: { createdAt: 'desc' },
      include: { design: true },
    }),

  getById: (id: string) => prisma.product.findUnique({ where: { id } }),

  create: (input: {
    brandId: string;
    title: string;
    description?: string;
    designId?: string;
    cost?: number;
    price?: number;
  }) => prisma.product.create({ data: { ...input, status: 'NEW' } }),

  /** Yaşam döngüsü geçişi + olay kaydı (geçersiz geçişte hata). */
  async transition(id: string, to: LifecycleStatus, reason: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Ürün bulunamadı');
    if (product.status === to) return product;
    if (!canTransition(product.status as unknown as CoreLifecycle, to as unknown as CoreLifecycle)) {
      throw new ValidationError(`Geçersiz yaşam döngüsü geçişi: ${product.status} → ${to}`);
    }
    const updated = await prisma.product.update({ where: { id }, data: { status: to } });
    await prisma.productLifecycleEvent.create({
      data: { productId: id, from: product.status, to, reason },
    });
    return updated;
  },

  setShopify: (id: string, shopifyId: string, description?: string) =>
    prisma.product.update({
      where: { id },
      data: { shopifyId, ...(description ? { description } : {}) },
    }),

  /** Printify ürün/mockup/maliyet bilgisini kaydeder. */
  setPrintify: (
    id: string,
    data: {
      printifyProductId: string;
      printifyShopId: string;
      mockups: string[];
      cost?: number;
      price?: number;
    },
  ) =>
    prisma.product.update({
      where: { id },
      data: {
        printifyProductId: data.printifyProductId,
        printifyShopId: data.printifyShopId,
        mockups: data.mockups as unknown as Prisma.InputJsonValue,
        ...(data.cost != null ? { cost: data.cost } : {}),
        ...(data.price != null ? { price: data.price } : {}),
      },
    }),

  /** Shopify yayını sonrası Shopify ürün kimliğini yazar. */
  setShopifyId: (id: string, shopifyId: string) =>
    prisma.product.update({ where: { id }, data: { shopifyId } }),

  /** Shopify'dan içe aktarımda ürünü shopifyId ile eşitler (varsa günceller). */
  upsertByShopify: (
    brandId: string,
    shopifyId: string,
    data: { title: string; price?: number },
  ) =>
    prisma.product.upsert({
      where: { brandId_shopifyId: { brandId, shopifyId } },
      create: { brandId, shopifyId, title: data.title, price: data.price, status: 'TEST' },
      update: { title: data.title, ...(data.price != null ? { price: data.price } : {}) },
    }),
};
