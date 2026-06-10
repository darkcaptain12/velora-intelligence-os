import { prisma } from '../client';

export interface SnapshotData {
  revenue: number;
  adSpend: number;
  cogs: number;
  shipping: number;
  commission: number;
  opex?: number;
  grossProfit: number;
  netProfit: number;
  taxEstimate: number;
  orders: number;
  aov: number;
}

/** Günlük finans anlık görüntüleri (idempotent: tarih başına tek kayıt). */
export const finance = {
  upsertSnapshot: (brandId: string, date: Date, data: SnapshotData) =>
    prisma.financeSnapshot.upsert({
      where: { brandId_date: { brandId, date } },
      create: { brandId, date, ...data },
      update: data,
    }),

  range: (brandId: string, from: Date, to: Date) =>
    prisma.financeSnapshot.findMany({
      where: { brandId, date: { gte: from, lte: to } },
      orderBy: { date: 'asc' },
    }),

  latest: (brandId: string, take = 60) =>
    prisma.financeSnapshot.findMany({ where: { brandId }, orderBy: { date: 'desc' }, take }),
};

export interface OperationScoreData {
  adScore: number;
  seoScore: number;
  profitScore: number;
  qualityScore: number;
  trendScore: number;
  overall: number;
}

export const operationScores = {
  upsert: (brandId: string, date: Date, data: OperationScoreData) =>
    prisma.operationScore.upsert({
      where: { brandId_date: { brandId, date } },
      create: { brandId, date, ...data },
      update: data,
    }),

  latest: (brandId: string) =>
    prisma.operationScore.findFirst({ where: { brandId }, orderBy: { date: 'desc' } }),
};
