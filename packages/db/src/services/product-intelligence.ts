import type { Prisma } from '@prisma/client';
import { prisma } from '../client';

export interface ProductIntelligenceResult {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  handle: string;
  description: string;
  shortDescription: string;
  story: string;
  faq: unknown;
  ads: unknown;
  salesAngles: unknown;
  audience: unknown;
  ugc: unknown;
  campaignPrep: unknown;
  score: unknown;
  scoreTotal: number;
  aiRationale: string;
}

/** Ürün Zekası Motoru: Shopify ürün webhook'unda üretilen SEO/içerik/reklam/kitle/UGC/skor paketi. */
export const productIntelligence = {
  getByProductId: (productId: string) =>
    prisma.productIntelligence.findUnique({ where: { productId }, include: { product: true } }),

  list: (brandId: string, take = 50) =>
    prisma.productIntelligence.findMany({
      where: { brandId, product: { status: { not: 'CLOSED' } } },
      include: { product: true },
      orderBy: [{ scoreTotal: 'desc' }, { updatedAt: 'desc' }],
      take,
    }),

  /** Üretim başlarken GENERATING durumuna alır (kayıt yoksa oluşturur). */
  start: (brandId: string, productId: string) =>
    prisma.productIntelligence.upsert({
      where: { productId },
      create: { brandId, productId, status: 'GENERATING' },
      update: { status: 'GENERATING' },
    }),

  setResult: (productId: string, data: ProductIntelligenceResult) =>
    prisma.productIntelligence.update({
      where: { productId },
      data: {
        status: 'READY',
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords as Prisma.InputJsonValue,
        handle: data.handle,
        description: data.description,
        shortDescription: data.shortDescription,
        story: data.story,
        faq: data.faq as Prisma.InputJsonValue,
        ads: data.ads as Prisma.InputJsonValue,
        salesAngles: data.salesAngles as Prisma.InputJsonValue,
        audience: data.audience as Prisma.InputJsonValue,
        ugc: data.ugc as Prisma.InputJsonValue,
        campaignPrep: data.campaignPrep as Prisma.InputJsonValue,
        score: data.score as Prisma.InputJsonValue,
        scoreTotal: data.scoreTotal,
        aiRationale: data.aiRationale,
      },
    }),

  setFailed: (productId: string) =>
    prisma.productIntelligence.update({ where: { productId }, data: { status: 'FAILED' } }),

  /** Ürün Talep Skoru (Trend Avcısı niş eşleştirmesi) — bkz. `evaluateProductDemand`. */
  setDemand: (productId: string, data: { demandScore: number; previousDemandScore?: number | null }) =>
    prisma.productIntelligence.update({
      where: { productId },
      data: { demandScore: data.demandScore, previousDemandScore: data.previousDemandScore ?? null },
    }),
};
