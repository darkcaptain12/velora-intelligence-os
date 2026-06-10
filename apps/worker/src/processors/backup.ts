import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { backups, prisma } from '@velora/db';
import { putObject } from '@velora/storage';
import { logger } from '../logger';

/**
 * Yedekleme: çekirdek tabloların mantıksal (JSON) dışa aktarımı → MinIO + Backup kaydı.
 * Sürümden bağımsız ve taşınabilir. ApiCredential (şifreli sırlar) DAHİL EDİLMEZ.
 * Üretimde ek olarak `pg_dump` (sürüm eşleşen) cron sidecar ile alınabilir.
 */
function jsonReplacer(_key: string, value: unknown): unknown {
  return typeof value === 'bigint' ? value.toString() : value;
}

export async function processBackup(job: Job<JobDataMap['backup']>) {
  const { brandId } = job.data;

  const data = {
    exportedAt: new Date().toISOString(),
    schema: 'velora-logical-v1',
    brands: await prisma.brand.findMany(),
    settings: await prisma.setting.findMany(),
    products: await prisma.product.findMany(),
    designs: await prisma.design.findMany(),
    mockups: await prisma.mockup.findMany(),
    videos: await prisma.video.findMany(),
    orders: await prisma.order.findMany(),
    financeSnapshots: await prisma.financeSnapshot.findMany(),
    operationScores: await prisma.operationScore.findMany(),
    adCampaigns: await prisma.adCampaign.findMany(),
    tasks: await prisma.task.findMany(),
    suppliers: await prisma.supplier.findMany(),
    competitors: await prisma.competitor.findMany(),
    trends: await prisma.trend.findMany(),
    aiReports: await prisma.aIReport.findMany(),
  };

  const buffer = Buffer.from(JSON.stringify(data, jsonReplacer, 2), 'utf8');
  const key = `backups/db-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const location = await putObject(key, buffer, 'application/json');

  await backups.create({ brandId, type: 'DATABASE', location, sizeBytes: buffer.length });

  logger.info({ brandId, location, size: buffer.length }, 'yedekleme tamamlandı');
  return { location, size: buffer.length };
}
