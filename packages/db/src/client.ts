/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import type { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ?? '';

  if (dbUrl.includes('neon')) {
    // Vercel/Neon: WebSocket driver adapter — native binary engine YOK
    const { PrismaClient: NeonPrisma } = require('@prisma/client');
    const { neonConfig } = require('@neondatabase/serverless');
    const { PrismaNeon } = require('@prisma/adapter-neon');
    try { neonConfig.webSocketConstructor = require('ws'); } catch {}
    // v6.19 API: PrismaNeon takes a PoolConfig ({ connectionString }), NOT a Pool
    const adapter = new PrismaNeon({ connectionString: dbUrl });
    return new NeonPrisma({ adapter }) as PrismaClient;
  }

  const { PrismaClient: NodePrisma } = require('@prisma/client');
  return new NodePrisma({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  }) as PrismaClient;
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
