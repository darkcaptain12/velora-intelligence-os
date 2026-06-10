import type { LifecycleStatus } from '@prisma/client';
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
};
