/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import type { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ?? '';

  if (dbUrl.includes('neon')) {
    const { PrismaClient: EdgeClient } = require('@prisma/client/edge');
    const { Pool, neonConfig } = require('@neondatabase/serverless');
    const { PrismaNeon } = require('@prisma/adapter-neon');
    try { neonConfig.webSocketConstructor = require('ws'); } catch {}
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaNeon(pool);
    return new EdgeClient({ adapter }) as PrismaClient;
  }

  const { PrismaClient: NodeClient } = require('@prisma/client');
  return new NodeClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  }) as PrismaClient;
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
