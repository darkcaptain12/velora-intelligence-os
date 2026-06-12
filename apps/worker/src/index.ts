import { Worker } from 'bullmq';
import { serverEnv } from '@velora/config';
import { getConnection, QUEUE_NAMES } from '@velora/queue';
import { prisma } from '@velora/db';
import { logger } from './logger';
import { processSample } from './processors/sample';
import { processResearch } from './processors/research';
import { processDesign } from './processors/design';
import { processMockup } from './processors/mockup';
import { processDesignScore } from './processors/design-score';
import { processVideo } from './processors/video';
import { processShopifyPublish } from './processors/shopify-publish';
import { processShopifyHealth } from './processors/shopify-health';
import { processAdSync } from './processors/ad-sync';
import { processSpendGuardian } from './processors/spend-guardian';
import { processFinanceSnapshot } from './processors/finance-snapshot';
import { processMailSend } from './processors/mail-send';
import { processTrendHunt } from './processors/trend-hunt';
import { processCompetitorScan } from './processors/competitor-scan';
import { processWeeklyReport } from './processors/weekly-report';
import { processBackup } from './processors/backup';
import { processAutoDesign } from './processors/auto-design';
import { processAutoPilot } from './processors/auto-pilot';
import { processPrintifyPublish } from './processors/printify-publish';
import { processProductDiscovery } from './processors/product-discovery';
import { processValidateOpportunity } from './processors/validate-opportunity';
import { processProductIntelligence } from './processors/product-intelligence';

const env = serverEnv();
const connection = getConnection();

/**
 * VELORA Worker — tüm arka plan işlerinin tüketildiği süreç.
 * Her faz yeni kuyruk işleyicisi ekler.
 */
const workers: Worker[] = [];

workers.push(
  new Worker(QUEUE_NAMES.sample, async (job) => processSample(job), {
    connection,
    concurrency: env.WORKER_CONCURRENCY,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.research, async (job) => processResearch(job), {
    connection,
    concurrency: 2,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.design, async (job) => processDesign(job), {
    connection,
    concurrency: 2,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.mockup, async (job) => processMockup(job), {
    connection,
    concurrency: 2,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.designScore, async (job) => processDesignScore(job), {
    connection,
    concurrency: 2,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.video, async (job) => processVideo(job), {
    connection,
    concurrency: 2,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.shopifyPublish, async (job) => processShopifyPublish(job), {
    connection,
    concurrency: 2,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.shopifyHealth, async (job) => processShopifyHealth(job), {
    connection,
    concurrency: 1,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.adSync, async (job) => processAdSync(job), {
    connection,
    concurrency: 1,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.spendGuardian, async (job) => processSpendGuardian(job), {
    connection,
    concurrency: 1,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.financeSnapshot, async (job) => processFinanceSnapshot(job), {
    connection,
    concurrency: 1,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.mailSend, async (job) => processMailSend(job), {
    connection,
    concurrency: 3,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.trendHunt, async (job) => processTrendHunt(job), {
    connection,
    concurrency: 1,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.competitorScan, async (job) => processCompetitorScan(job), {
    connection,
    concurrency: 2,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.weeklyReport, async (job) => processWeeklyReport(job), {
    connection,
    concurrency: 1,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.backup, async (job) => processBackup(job), {
    connection,
    concurrency: 1,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.autoDesign, async (job) => processAutoDesign(job), {
    connection,
    concurrency: 1,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.autoPilot, async (job) => processAutoPilot(job), {
    connection,
    concurrency: 1,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.printifyPublish, async (job) => processPrintifyPublish(job), {
    connection,
    concurrency: 2,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.productDiscovery, async (job) => processProductDiscovery(job), {
    connection,
    concurrency: 1,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.validateOpportunity, async (job) => processValidateOpportunity(job), {
    connection,
    concurrency: 2,
  }),
);

workers.push(
  new Worker(QUEUE_NAMES.productIntelligence, async (job) => processProductIntelligence(job), {
    connection,
    concurrency: 2,
  }),
);

for (const w of workers) {
  w.on('failed', (job, err) => {
    logger.error({ queue: w.name, jobId: job?.id, err: err.message }, 'iş başarısız');
  });
  w.on('error', (err) => {
    logger.error({ queue: w.name, err: err.message }, 'worker hatası');
  });
}

logger.info(
  { queues: workers.map((w) => w.name), concurrency: env.WORKER_CONCURRENCY },
  'VELORA worker başladı',
);

// Düzgün kapanış
async function shutdown(signal: string) {
  logger.info({ signal }, 'kapanış başlatıldı');
  await Promise.all(workers.map((w) => w.close()));
  await connection.quit();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
