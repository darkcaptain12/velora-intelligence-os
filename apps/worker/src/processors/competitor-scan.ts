import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { competitors, prisma } from '@velora/db';
import { logger } from '../logger';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/**
 * Rakip tarama (best-effort fetch): rakip URL'sinden sayfa başlığı + ilk fiyat
 * sinyalini çıkarıp CompetitorProduct anlık görüntüsü olarak kaydeder.
 * Derin/JS-render gerektiren siteler Faz 8b'de Playwright ile (anti-bot).
 */
export async function processCompetitorScan(job: Job<JobDataMap['competitorScan']>) {
  const { competitorId } = job.data;
  const comp = await prisma.competitor.findUnique({ where: { id: competitorId } });
  if (!comp) throw new Error(`Rakip bulunamadı: ${competitorId}`);

  const res = await fetch(comp.url, { headers: { 'User-Agent': UA, Accept: 'text/html' } });
  if (!res.ok) throw new Error(`Rakip sayfası alınamadı (${res.status})`);
  const html = await res.text();

  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? 'Bilinmeyen')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
  const priceMatch = html.match(/(?:₺|TL|\$|€)\s?([0-9]{1,6}(?:[.,][0-9]{1,2})?)/);
  const priceStr = priceMatch?.[1];
  const price = priceStr ? Number(priceStr.replace(/\./g, '').replace(',', '.')) : 0;

  await competitors.addProduct(competitorId, title, Number.isFinite(price) ? price : 0, 'TRY', comp.url);
  logger.info({ competitorId, title, price }, 'rakip tarandı');
  return { title, price };
}
