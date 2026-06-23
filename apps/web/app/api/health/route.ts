import { NextResponse } from 'next/server';
import { serverEnv } from '@velora/config';
import { prisma } from '@velora/db';
import { getConnection } from '@velora/queue';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Sağlık ucu: DB + Redis + MinIO bağlanırlığı. İzleme/uptime için (auth yok). */
export async function GET() {
  const checks: Record<string, boolean> = { db: false, redis: false, storage: false };

  let dbError = '';
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.db = true;
  } catch (e) {
    dbError = (e as Error).message?.slice(0, 200) ?? 'unknown';
  }

  try {
    const pong = await getConnection().ping();
    checks.redis = pong === 'PONG';
  } catch {
    /* redis down */
  }

  try {
    const res = await fetch(`${serverEnv().S3_ENDPOINT.replace(/\/$/, '')}/minio/health/live`);
    checks.storage = res.ok;
  } catch {
    /* storage down */
  }

  const ok = Object.values(checks).every(Boolean);
  return NextResponse.json({ ok, checks, dbError: dbError || undefined, ts: new Date().toISOString() }, { status: ok ? 200 : 503 });
}
