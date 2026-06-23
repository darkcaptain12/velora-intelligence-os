import type { DecisionAction, DecisionStatus, Prisma } from '@prisma/client';
import { prisma } from '../client';

/** AI CEO Karar Motoru — öner + tek-tık uygula (her zaman PENDING başlar). */
export const decisions = {
  list: (brandId: string, status?: DecisionStatus) =>
    prisma.aIDecision.findMany({
      where: { brandId, ...(status ? { status } : {}) },
      orderBy: { createdAt: 'desc' },
    }),

  getById: (id: string) => prisma.aIDecision.findUnique({ where: { id } }),

  create: (input: {
    brandId: string;
    reportId?: string;
    title: string;
    rationale: string;
    action: DecisionAction;
    params?: unknown;
    confidence?: number;
    expectedImpact?: string;
    riskLevel?: string;
  }) =>
    prisma.aIDecision.create({
      data: {
        brandId: input.brandId,
        reportId: input.reportId,
        title: input.title.slice(0, 200),
        rationale: input.rationale,
        action: input.action,
        params: (input.params ?? undefined) as Prisma.InputJsonValue | undefined,
        confidence: input.confidence ?? null,
        expectedImpact: input.expectedImpact ?? null,
        riskLevel: input.riskLevel ?? null,
      },
    }),

  setStatus: (id: string, status: DecisionStatus) =>
    prisma.aIDecision.update({ where: { id }, data: { status } }),
};
