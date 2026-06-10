import { prisma } from '../client';

/** Meta reklam kampanyaları (yerel ayna). */
export const adCampaigns = {
  list: (brandId: string) =>
    prisma.adCampaign.findMany({ where: { brandId }, orderBy: { createdAt: 'desc' } }),

  upsert: (
    brandId: string,
    metaId: string,
    data: { name: string; status: string; objective: string; dailyBudget?: number },
  ) =>
    prisma.adCampaign.upsert({
      where: { brandId_metaId: { brandId, metaId } },
      create: { brandId, metaId, ...data },
      update: data,
    }),

  setStatus: (id: string, status: string) =>
    prisma.adCampaign.update({ where: { id }, data: { status } }),

  findByMeta: (brandId: string, metaId: string) =>
    prisma.adCampaign.findUnique({ where: { brandId_metaId: { brandId, metaId } } }),
};

export interface AdMetricInput {
  brandId: string;
  level: string; // CAMPAIGN | ADSET | AD
  refId: string;
  date: Date;
  spend: number;
  roas?: number | null;
  cpa?: number | null;
  cpc?: number | null;
  ctr?: number | null;
  impressions?: number;
  clicks?: number;
  conversions?: number;
}

/** Reklam metrikleri (ROAS/CPA/CPC/CTR) + dönem bazlı harcama. */
export const adMetrics = {
  upsert: (input: AdMetricInput) =>
    prisma.adMetric.upsert({
      where: {
        brandId_level_refId_date: {
          brandId: input.brandId,
          level: input.level,
          refId: input.refId,
          date: input.date,
        },
      },
      create: input,
      update: input,
    }),

  latest: (brandId: string, take = 20) =>
    prisma.adMetric.findMany({ where: { brandId }, orderBy: { date: 'desc' }, take }),

  /** Günlük/haftalık/aylık toplam harcama (Acil Durum Koruması için). */
  async spendByPeriod(brandId: string): Promise<Record<'DAILY' | 'WEEKLY' | 'MONTHLY', number>> {
    const now = new Date();
    const startDay = new Date(now);
    startDay.setHours(0, 0, 0, 0);
    const startWeek = new Date(startDay);
    startWeek.setDate(startDay.getDate() - ((startDay.getDay() + 6) % 7)); // Pazartesi
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const sumFrom = async (from: Date) => {
      const r = await prisma.adMetric.aggregate({
        _sum: { spend: true },
        where: { brandId, date: { gte: from } },
      });
      return Number(r._sum.spend ?? 0);
    };

    return {
      DAILY: await sumFrom(startDay),
      WEEKLY: await sumFrom(startWeek),
      MONTHLY: await sumFrom(startMonth),
    };
  },
};
