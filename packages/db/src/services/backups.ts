import type { BackupType } from '@prisma/client';
import { prisma } from '../client';

/** Yedekleme Merkezi kayıtları. */
export const backups = {
  list: (take = 20) => prisma.backup.findMany({ orderBy: { createdAt: 'desc' }, take }),
  create: (input: { brandId?: string; type: BackupType; location: string; sizeBytes: number }) =>
    prisma.backup.create({
      data: {
        brandId: input.brandId,
        type: input.type,
        location: input.location,
        sizeBytes: BigInt(input.sizeBytes),
      },
    }),
};
