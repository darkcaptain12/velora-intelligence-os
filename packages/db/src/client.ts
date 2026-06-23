import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ?? '';

  if (dbUrl.includes('neon.tech')) {
    // Neon serverless adapter — native binary gerektirmez (Vercel uyumlu)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool, neonConfig } = require('@neondatabase/serverless');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaNeon } = require('@prisma/adapter-neon');
    try { neonConfig.webSocketConstructor = require('ws'); } catch { /* browser */ }
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter } as never);
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
