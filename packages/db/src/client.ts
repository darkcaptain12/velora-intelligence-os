/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ?? '';

  if (dbUrl.includes('neon.tech') || dbUrl.includes('neon.')) {
    const { Pool, neonConfig } = require('@neondatabase/serverless') as any;
    const { PrismaNeon } = require('@prisma/adapter-neon') as any;
    try { neonConfig.webSocketConstructor = require('ws'); } catch {}
    const pool = new (Pool as any)({ connectionString: dbUrl });
    const adapter = new (PrismaNeon as any)(pool);
    return new PrismaClient({ adapter } as any);
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
