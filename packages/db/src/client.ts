import { PrismaClient } from '@prisma/client';

/**
 * Geliştirmede hot-reload sırasında birden fazla bağlantı havuzu açılmasını önlemek için
 * global singleton kullanılır.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
