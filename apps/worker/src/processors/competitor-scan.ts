import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { competitors, prisma, tasks } from '@velora/db';
import { fetchPageAds } from '@velora/integrations';
import { evaluateCompetitorAlarm } from '@velora/core';
import { IntegrationError } from '@velora/shared';
import { logger } from '../logger';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/**
 * Rakip tarama (best-effort fetch): rakip URL'sinden sayfa başlığı + ilk fiyat
 * sinyalini çıkarıp CompetitorProduct anlık görüntüsü olarak kaydeder.
 * Derin/JS-render gerektiren siteler Faz 8b'de Playwright ile (anti-bot).
 *
 * Fiyat değişimi tespiti: aynı rakip+başlık için ÖNCEKİ anlık görüntüyle
 * kıyaslanır; %15+ değişimde Görev Merkezi'ne görev açılır (idempotent —
 * aynı eski→yeni fiyat için tekrar açılmaz).
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
  const currency = 'TRY';

  const previous = await prisma.competitorProduct.findFirst({
    where: { competitorId, title },
    orderBy: { seenAt: 'desc' },
  });

  const created = await competitors.addProduct(competitorId, title, Number.isFinite(price) ? price : 0, currency, comp.url);
  logger.info({ competitorId, title, price }, 'rakip tarandı');

  if (previous) {
    const oldPrice = Number(previous.price);
    const newPrice = Number(created.price);
    const alarm = evaluateCompetitorAlarm(oldPrice, newPrice);
    if (alarm.triggered && alarm.level) {
      const direction = alarm.direction === 'UP' ? '📈' : '📉';
      const levelEmoji = { CRITICAL: '🚨', HIGH: '🔴', MEDIUM: '🟡', LOW: '🟢' }[alarm.level];
      const alarmTitle = `${direction} Rakip fiyat değişti: "${title}" ${oldPrice.toFixed(2)}→${newPrice.toFixed(2)} ${currency}`;
      const existing = await prisma.task.findFirst({
        where: { brandId: comp.brandId, title: alarmTitle, status: 'OPEN' },
        select: { id: true },
      });
      if (!existing) {
        const priority = alarm.level === 'CRITICAL' || alarm.level === 'HIGH' ? 1 : alarm.level === 'MEDIUM' ? 2 : 3;
        await tasks.create({
          brandId: comp.brandId,
          type: 'GENERIC',
          priority,
          title: alarmTitle,
          description: `${levelEmoji} ${alarm.level} · Rakip: ${comp.name} · değişim ${alarm.direction === 'UP' ? '+' : '-'}${(alarm.ratio * 100).toFixed(0)}%`,
        });
        logger.info({ competitorId, level: alarm.level, ratio: alarm.ratio.toFixed(2) }, 'rakip fiyat alarmı oluşturuldu');
      }
    }
  }

  if (comp.metaPageId) {
    try {
      const ads = await fetchPageAds(comp.brandId, comp.metaPageId, 10);
      let newAds = 0;
      for (const ad of ads) {
        if (!ad.body && !ad.snapshotUrl) continue;
        const existing = await prisma.competitorAd.findFirst({
          where: { competitorId, platform: 'META', copy: ad.body ?? null, creativeUrl: ad.snapshotUrl ?? null },
          select: { id: true },
        });
        if (existing) continue;
        await competitors.addAd(competitorId, { platform: 'META', creativeUrl: ad.snapshotUrl, copy: ad.body });
        newAds++;
      }
      if (newAds > 0) logger.info({ competitorId, newAds }, 'rakip reklam kütüphanesi: yeni reklam bulundu');
    } catch (e) {
      if (e instanceof IntegrationError) {
        logger.warn({ competitorId, error: e.message }, 'rakip reklam kütüphanesi taranamadı (Meta yapılandırılmamış/hata)');
      } else {
        throw e;
      }
    }
  }

  return { title, price };
}
