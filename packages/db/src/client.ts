/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import type { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ?? '';
  const { PrismaClient: Client } = require('@prisma/client');

  // queryCompiler modunda engine binary YOK — adapter zorunlu.
  if (dbUrl.includes('neon')) {
    // Vercel / Neon: WebSocket sürücüsü
    const { neonConfig } = require('@neondatabase/serverless');
    const { PrismaNeon } = require('@prisma/adapter-neon');
    try { neonConfig.webSocketConstructor = require('ws'); } catch {}
    const adapter = new PrismaNeon({ connectionString: dbUrl });
    return new Client({ adapter }) as PrismaClient;
  }

  // Lokal Docker Postgres: standart TCP (node-postgres)
  const { PrismaPg } = require('@prisma/adapter-pg');
  const adapter = new PrismaPg({ connectionString: dbUrl });
  return new Client({ adapter }) as PrismaClient;
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
