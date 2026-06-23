import type { Prisma } from '@prisma/client';
import { prisma } from '../client';

export const dailyBriefs = {
  upsert(
    brandId: string,
    date: Date,
    data: {
      riskScore: number;
      riskLevel: string;
      riskSignals: Prisma.InputJsonValue;
      topOpportunity?: string | null;
      topRisk?: string | null;
      todayTasks?: Prisma.InputJsonValue;
      narrative?: string | null;
      confidence?: number | null;
    },
  ) {
    return prisma.dailyBrief.upsert({
      where: { brandId_date: { brandId, date } },
      create: { brandId, date, ...data },
      update: data,
    });
  },

  latest(brandId: string, count = 1) {
    return prisma.dailyBrief.findMany({
      where: { brandId },
      orderBy: { date: 'desc' },
      take: count,
    });
  },

  getByDate(brandId: string, date: Date) {
    return prisma.dailyBrief.findUnique({
      where: { brandId_date: { brandId, date } },
    });
  },
};
