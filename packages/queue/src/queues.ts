import { Queue, type JobsOptions } from 'bullmq';
import { getConnection } from './connection';

/**
 * Kuyruk kayıt defteri.
 * Yeni fazlar burada yeni kuyruk adı + iş veri tipini ekler.
 */
export const QUEUE_NAMES = {
  sample: 'sample',
  research: 'research',
  design: 'design',
  mockup: 'mockup',
  designScore: 'designScore',
  video: 'video',
  shopifyPublish: 'shopifyPublish',
  shopifyHealth: 'shopifyHealth',
  adSync: 'adSync',
  spendGuardian: 'spendGuardian',
  financeSnapshot: 'financeSnapshot',
  mailSend: 'mailSend',
  trendHunt: 'trendHunt',
  competitorScan: 'competitorScan',
  weeklyReport: 'weeklyReport',
  backup: 'backup',
  autoDesign: 'autoDesign',
  autoPilot: 'autoPilot',
  printifyPublish: 'printifyPublish',
  productDiscovery: 'productDiscovery',
  validateOpportunity: 'validateOpportunity',
} as const;

export type QueueName = keyof typeof QUEUE_NAMES;

/** Her kuyruğun iş verisi tipi. */
export interface JobDataMap {
  sample: { message: string };
  research: { runId: string };
  design: { designId: string };
  mockup: { designId: string };
  designScore: { designId: string };
  video: { videoId: string; prompt: string };
  shopifyPublish: { productId: string };
  shopifyHealth: { brandId: string };
  adSync: { brandId: string };
  spendGuardian: { brandId: string };
  financeSnapshot: { brandId: string; date?: string };
  mailSend: { emailId: string };
  trendHunt: { brandId: string };
  competitorScan: { competitorId: string };
  weeklyReport: { brandId: string };
  backup: { brandId?: string };
  /** Trend + özel gün temalarından otomatik tasarım üretimi (haftalık). */
  autoDesign: { brandId: string; count?: number };
  /** Tam otonom orkestratör: araştır→trend→tasarım→(talebe göre)yayın→reklam→rapor. */
  autoPilot: { brandId: string };
  /** Tasarımı Printify'a yükle + ürün+mockup oluştur (Shopify yayını ayrı/kapı arkasında). */
  printifyPublish: { productId: string };
  /** Ürün Keşif: kaynaklardan fırsat üret + 6-boyut skor + seasonality + priority. */
  productDiscovery: { brandId: string };
  /** Satış doğrulama: fırsat için validationScore üret + priority güncelle (Opportunity-First kapısı). */
  validateOpportunity: { opportunityId: string };
}

const _queues = new Map<string, Queue>();

/** İlgili kuyruğu (singleton) döner — tip güvenli iş verisiyle. */
export function getQueue<N extends QueueName>(name: N): Queue<JobDataMap[N]> {
  const queueName = QUEUE_NAMES[name];
  let queue = _queues.get(queueName);
  if (!queue) {
    queue = new Queue(queueName, {
      connection: getConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    });
    _queues.set(queueName, queue);
  }
  return queue as Queue<JobDataMap[N]>;
}

/** Kuyruğa iş ekler. */
export async function enqueue<N extends QueueName>(
  name: N,
  data: JobDataMap[N],
  opts?: JobsOptions,
) {
  // Jenerik veri tipini koruyup BullMQ'nun koşullu `NameType`'ı ile sürtüşmeyi önlemek için
  // varsayılan jenerikli Queue olarak ele alınır (iş adı = kuyruk adı).
  const queue = getQueue(name) as Queue;
  return queue.add(name, data, opts);
}

export interface JobSummary {
  queue: string;
  id: string | undefined;
  name: string;
  state: string;
  timestamp: number;
  finishedOn: number | null;
  failedReason: string | null;
}

/** Tüm kayıtlı kuyruklardan son işleri toplar (iş izleme paneli için). */
export async function listRecentJobs(limit = 25): Promise<JobSummary[]> {
  const summaries: JobSummary[] = [];
  for (const name of Object.keys(QUEUE_NAMES) as QueueName[]) {
    const queue = getQueue(name);
    const jobs = await queue.getJobs(
      ['active', 'waiting', 'delayed', 'prioritized', 'completed', 'failed'],
      0,
      limit,
    );
    for (const job of jobs) {
      summaries.push({
        queue: queue.name,
        id: job.id,
        name: job.name,
        state: await job.getState(),
        timestamp: job.timestamp,
        finishedOn: job.finishedOn ?? null,
        failedReason: job.failedReason ?? null,
      });
    }
  }
  summaries.sort((a, b) => b.timestamp - a.timestamp);
  return summaries.slice(0, limit);
}
