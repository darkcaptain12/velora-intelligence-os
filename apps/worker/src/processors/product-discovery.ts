import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { opportunities, tasks, type OpportunityKind } from '@velora/db';
import { getAdapter } from '@velora/scraping';
import { scoreOpportunity, computeSeasonality, computePriority } from '@velora/core';
import { ScrapeBlockedError } from '@velora/shared';
import { isoWeek } from '../lib/iso-week';
import { upcomingSpecialDays } from '../lib/special-days';
import { logger } from '../logger';

/** Geniş kitleli niş anahtarları (pazar büyüklüğü sezgisi + problem aramaları). */
const BROAD = [
  'cat', 'kedi', 'dog', 'köpek', 'coffee', 'kahve', 'gym', 'fitness', 'anime', 'love', 'aşk',
  'mom', 'anne', 'dad', 'baba', 'funny', 'komik', 'music', 'müzik', 'football', 'futbol',
  'oyun', 'gaming', 'doğa', 'travel', 'seyahat',
];
/** Şikayet aranacak ürün kategorileri (PROBLEM motoru — best-effort). */
const PROBLEM_SEEDS = ['baskılı tişört', 'oversize tişört'];

function trafficToDemand(t: number): number {
  if (t >= 200_000) return 92;
  if (t >= 50_000) return 78;
  if (t >= 20_000) return 64;
  if (t >= 5_000) return 50;
  if (t > 0) return 38;
  return 30;
}
function estimateMarketSize(s: string): number {
  const l = s.toLowerCase();
  return BROAD.some((w) => l.includes(w)) ? 78 : 50;
}

/**
 * Ürün Keşif Merkezi (sistemin kalbi). 3 tip fırsat üretir:
 *  TREND (Google Trends TR) · EVENT (yaklaşan özel günler) · PROBLEM (Şikayetvar, best-effort).
 * Her fırsat: 6-boyut opportunityScore + seasonalityScore + priorityScore (validation yok → base=opp).
 * Engellenen best-effort kaynaklar → manuel doğrulama görevi (yeniden denenmez).
 */
export async function processProductDiscovery(job: Job<JobDataMap['productDiscovery']>) {
  const { brandId } = job.data;
  const week = isoWeek(new Date());
  const seen = new Set<string>();
  let created = 0;

  const save = async (o: {
    title: string;
    niche: string;
    kind: OpportunityKind;
    signals: unknown;
    demand: number;
    competition: number;
    trend: number;
    marketSize: number;
    seasonality: number;
    eventDate?: Date;
    rationale: string;
  }) => {
    const key = o.title.toLowerCase().slice(0, 80);
    if (seen.has(key)) return;
    seen.add(key);
    const score = scoreOpportunity({
      demand: o.demand,
      competition: o.competition,
      trend: o.trend,
      marketSize: o.marketSize,
      profit: 58,
      producibility: 82,
    });
    const priority = computePriority(score.total, null, o.seasonality);
    const opp = await opportunities.create({
      brandId,
      title: o.title,
      niche: o.niche,
      kind: o.kind,
      week,
      sourceSignals: o.signals,
      ...(o.eventDate ? { eventDate: o.eventDate } : {}),
    });
    await opportunities.setScores(opp.id, {
      opportunityScore: score,
      seasonalityScore: o.seasonality,
      priorityScore: priority,
      aiRationale: o.rationale,
      status: 'SCORED',
    });
    created += 1;
  };

  // 1) TREND — Google Trends TR (güvenilir)
  try {
    const trends = await getAdapter('GOOGLE_TRENDS').scrape('', { limit: 12 });
    for (const t of trends) {
      const demand = trafficToDemand(t.score ?? 0);
      await save({
        title: t.title,
        niche: t.title,
        kind: 'TREND',
        signals: { source: 'GOOGLE_TRENDS', traffic: t.raw },
        demand,
        competition: 55,
        trend: 82,
        marketSize: estimateMarketSize(t.title),
        seasonality: 72, // şu an yükseliyor
        rationale: `Google Trends TR'de yükselen arama. Talep sinyali güçlü; baskılı tişörte hızlı uyarlanabilir.`,
      });
    }
  } catch (err) {
    logger.warn({ err: (err as Error).message }, 'Google Trends keşfi atlandı');
  }

  // 2) EVENT — yaklaşan özel günler (45 gün)
  for (const sd of upcomingSpecialDays(45)) {
    await save({
      title: `${sd.name} koleksiyonu`,
      niche: sd.name,
      kind: 'EVENT',
      signals: { event: sd.name, daysUntil: sd.daysUntil, themes: sd.themes },
      demand: 66,
      competition: 50,
      trend: 60,
      marketSize: 72,
      seasonality: computeSeasonality({ daysUntilEvent: sd.daysUntil }),
      eventDate: sd.date,
      rationale: `${sd.daysUntil} gün sonra ${sd.name}. Sezon penceresi açık — şimdi üretip yetiştirilebilir.`,
    });
  }

  // 3) PROBLEM — Şikayetvar (best-effort; engellenirse manuel görev)
  for (const niche of PROBLEM_SEEDS) {
    try {
      const complaints = await getAdapter('SIKAYETVAR').scrape(niche, { limit: 8 });
      if (complaints.length >= 3) {
        await save({
          title: `${niche}: kalite/beklenti problemi fırsatı`,
          niche,
          kind: 'PROBLEM',
          signals: { complaints: complaints.slice(0, 6).map((c) => c.title) },
          demand: Math.min(85, 45 + complaints.length * 4),
          competition: 42, // problem = yetersiz hizmet edilen alan
          trend: 50,
          marketSize: estimateMarketSize(niche),
          seasonality: 60,
          rationale: `${complaints.length} şikayet sinyali: müşteriler bu üründe sorun yaşıyor. Kaliteli/çözüm odaklı versiyon fırsatı.`,
        });
      }
    } catch (err) {
      if (err instanceof ScrapeBlockedError) {
        await tasks.create({
          brandId,
          title: 'Şikayetvar manuel doğrulama gerekli',
          description: `"${niche}" için Şikayetvar bot korumasına takıldı. Tarayıcıda doğrulayın veya proxy ayarlayın. (${err.message})`,
          type: 'API_INPUT',
          priority: 2,
        });
      } else {
        logger.warn({ niche, err: (err as Error).message }, 'Şikayetvar keşfi atlandı');
      }
    }
  }

  logger.info({ brandId, created }, 'ürün keşfi tamamlandı');
  return { created };
}
