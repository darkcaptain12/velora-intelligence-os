import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ?? '';

  // Neon (Vercel) — WebSocket adapter, native binary gereksiz
  if (dbUrl.includes('neon.tech') || dbUrl.includes('neon.')) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      neonConfig.webSocketConstructor = require('ws');
    } catch {
      // Edge runtime — ws yok, built-in WebSocket kullanılır
    }
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaNeon(pool);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new PrismaClient({ adapter } as any);
  }

  // Lokal Docker Postgres — native binary engine
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
