import type { MailDir, Prisma, Source } from '@prisma/client';
import { prisma } from '../client';

/** Rakip Analiz Merkezi. */
export const competitors = {
  list: (brandId: string) =>
    prisma.competitor.findMany({
      where: { brandId },
      orderBy: { createdAt: 'desc' },
      include: {
        products: { orderBy: { seenAt: 'desc' }, take: 10 },
        ads: { orderBy: { seenAt: 'desc' }, take: 5 },
      },
    }),
  getById: (id: string) => prisma.competitor.findUnique({ where: { id } }),
  create: (brandId: string, name: string, url: string) =>
    prisma.competitor.create({ data: { brandId, name, url } }),
  addProduct: (competitorId: string, title: string, price: number, currency = 'TRY', url?: string) =>
    prisma.competitorProduct.create({ data: { competitorId, title, price, currency, url } }),
};

/** Tedarikçi Merkezi. */
export const suppliers = {
  list: (brandId: string) =>
    prisma.supplier.findMany({
      where: { brandId },
      orderBy: { createdAt: 'desc' },
      include: { emails: { orderBy: { createdAt: 'desc' }, take: 5 } },
    }),
  getById: (id: string) => prisma.supplier.findUnique({ where: { id } }),
  create: (input: {
    brandId: string;
    company: string;
    email?: string;
    phone?: string;
    website?: string;
    notes?: string;
  }) => prisma.supplier.create({ data: input }),
};

/** Mail Merkezi. */
export const emails = {
  list: (brandId: string) =>
    prisma.emailMessage.findMany({
      where: { brandId },
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: { supplier: true },
    }),
  getById: (id: string) =>
    prisma.emailMessage.findUnique({ where: { id }, include: { supplier: true } }),
  create: (input: {
    brandId: string;
    supplierId?: string;
    direction: MailDir;
    subject: string;
    body: string;
  }) => prisma.emailMessage.create({ data: input }),
  markSent: (id: string) =>
    prisma.emailMessage.update({ where: { id }, data: { status: 'SENT', sentAt: new Date() } }),
  markFailed: (id: string) =>
    prisma.emailMessage.update({ where: { id }, data: { status: 'FAILED' } }),
};

/** Kreatif Test Laboratuvarı (A/B). */
export const creativeTests = {
  list: (brandId: string) =>
    prisma.creativeTest.findMany({ where: { brandId }, orderBy: { createdAt: 'desc' }, take: 30 }),
  create: (brandId: string, hypothesis: string, variants: string[]) =>
    prisma.creativeTest.create({
      data: { brandId, hypothesis, variants: variants as unknown as Prisma.InputJsonValue },
    }),
  setWinner: (id: string, winner: string) =>
    prisma.creativeTest.update({ where: { id }, data: { winner, status: 'SUCCESS' } }),
};

/** Trend Avcısı. */
export const trends = {
  list: (brandId: string, week?: string) =>
    prisma.trend.findMany({
      where: { brandId, ...(week ? { week } : {}) },
      orderBy: [{ week: 'desc' }, { score: 'desc' }],
      take: 50,
    }),
  replaceWeek: async (
    brandId: string,
    week: string,
    items: { niche: string; theme: string; score: number; source: Source }[],
  ) => {
    await prisma.trend.deleteMany({ where: { brandId, week } });
    if (items.length > 0) {
      await prisma.trend.createMany({ data: items.map((i) => ({ brandId, week, ...i })) });
    }
  },
};
