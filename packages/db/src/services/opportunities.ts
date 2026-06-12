import type { OpportunityKind, OpportunityStatus, Prisma } from '@prisma/client';
import { prisma } from '../client';

/** Ürün Avcısı fırsatları (Opportunity-First). priorityScore'a göre sıralanır. */
export const opportunities = {
  create: (input: {
    brandId: string;
    title: string;
    niche: string;
    kind: OpportunityKind;
    week: string;
    sourceSignals?: unknown;
    eventDate?: Date;
  }) =>
    prisma.opportunity.create({
      data: {
        brandId: input.brandId,
        title: input.title.slice(0, 200),
        niche: input.niche.slice(0, 120),
        kind: input.kind,
        week: input.week,
        sourceSignals: (input.sourceSignals ?? undefined) as Prisma.InputJsonValue | undefined,
        ...(input.eventDate ? { eventDate: input.eventDate } : {}),
      },
    }),

  getById: (id: string) => prisma.opportunity.findUnique({ where: { id } }),

  list: (brandId: string, opts?: { status?: OpportunityStatus; take?: number }) =>
    prisma.opportunity.findMany({
      where: { brandId, ...(opts?.status ? { status: opts.status } : {}) },
      orderBy: [{ priorityScore: 'desc' }, { createdAt: 'desc' }],
      take: opts?.take ?? 100,
    }),

  /** En iyi fırsatlar (Komuta Merkezi widget). */
  top: (brandId: string, take = 5) =>
    prisma.opportunity.findMany({
      where: { brandId, status: { in: ['SCORED', 'VALIDATED', 'PURSUED'] } },
      orderBy: [{ priorityScore: 'desc' }, { createdAt: 'desc' }],
      take,
    }),

  /** Keşif skorlaması: 6-boyut + seasonality + priority + AI gerekçe. */
  setScores: (
    id: string,
    data: {
      opportunityScore: unknown;
      seasonalityScore?: number;
      priorityScore?: number;
      aiRationale?: string;
      status?: OpportunityStatus;
    },
  ) =>
    prisma.opportunity.update({
      where: { id },
      data: {
        opportunityScore: data.opportunityScore as Prisma.InputJsonValue,
        ...(data.seasonalityScore != null ? { seasonalityScore: data.seasonalityScore } : {}),
        ...(data.priorityScore != null ? { priorityScore: data.priorityScore } : {}),
        ...(data.aiRationale ? { aiRationale: data.aiRationale } : {}),
        ...(data.status ? { status: data.status } : {}),
      },
    }),

  /** Doğrulama: validationScore + sinyaller + güncel priority + durum. */
  setValidation: (
    id: string,
    data: {
      validationScore: number;
      validationSignals?: unknown;
      priorityScore?: number;
      status?: OpportunityStatus;
    },
  ) =>
    prisma.opportunity.update({
      where: { id },
      data: {
        validationScore: data.validationScore,
        ...(data.validationSignals !== undefined
          ? { validationSignals: data.validationSignals as Prisma.InputJsonValue }
          : {}),
        ...(data.priorityScore != null ? { priorityScore: data.priorityScore } : {}),
        ...(data.status ? { status: data.status } : {}),
      },
    }),

  setStatus: (id: string, status: OpportunityStatus) =>
    prisma.opportunity.update({ where: { id }, data: { status } }),

  /** "Tasarıma Dönüştür" sonrası bağlanan tasarımı işaretler + PURSUED. */
  setDesign: (id: string, designId: string) =>
    prisma.opportunity.update({ where: { id }, data: { designId, status: 'PURSUED' } }),
};
