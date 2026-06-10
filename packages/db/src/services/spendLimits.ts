import type { LimitPeriod } from '@prisma/client';
import { prisma } from '../client';

/** Acil Durum Koruması temeli — günlük/haftalık/aylık harcama limitleri. */
export const spendLimits = {
  list: (brandId: string) =>
    prisma.spendLimit.findMany({ where: { brandId }, orderBy: { period: 'asc' } }),

  set: (brandId: string, period: LimitPeriod, amount: number, active = true) =>
    prisma.spendLimit.upsert({
      where: { brandId_period: { brandId, period } },
      create: { brandId, period, amount, active },
      update: { amount, active },
    }),
};
