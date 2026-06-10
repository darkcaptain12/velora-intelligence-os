import type { Prisma } from '@prisma/client';
import { prisma } from '../client';

export interface AuditInput {
  brandId: string;
  actor: string; // "system" | "ai" | userId/email
  action: string;
  entity: string;
  entityId?: string;
  payload?: unknown;
  autonomyLevel?: number;
}

/** Tüm L2/L3 eylemlerinin değişmez kaydı. */
export const audit = {
  log: (input: AuditInput) =>
    prisma.auditLog.create({
      data: {
        brandId: input.brandId,
        actor: input.actor,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        payload:
          input.payload === undefined
            ? undefined
            : (input.payload as unknown as Prisma.InputJsonValue),
        autonomyLevel: input.autonomyLevel ?? 2,
      },
    }),

  recent: (brandId: string, take = 100) =>
    prisma.auditLog.findMany({ where: { brandId }, orderBy: { createdAt: 'desc' }, take }),
};
