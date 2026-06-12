import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { opportunities } from '@velora/db';
import { getAdapter } from '@velora/scraping';
import { computePriority } from '@velora/core';
import { logger } from '../logger';

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const round = (n: number) => Math.round(n);

interface DimScore {
  talep?: number;
  rekabet?: number;
  karlilik?: number;
  pazarBuyuklugu?: number;
  trend?: number;
  total?: number;
}

/**
 * Satış Doğrulama Merkezi: "bu gerçekten satar mı?" → validationScore (0–100).
 * Sinyaller: talep · düşük rekabet · karlılık · pazar büyüklüğü · trend + canlı Google Trends teyidi.
 * Sonra priority güncellenir. SERT KAPI: <60 → REJECTED (tasarım/yayın engellenir), ≥60 → VALIDATED.
 */
export async function processValidateOpportunity(job: Job<JobDataMap['validateOpportunity']>) {
  const { opportunityId } = job.data;
  const opp = await opportunities.getById(opportunityId);
  if (!opp) throw new Error(`Opportunity bulunamadı: ${opportunityId}`);

  const s = (opp.opportunityScore ?? {}) as DimScore;
  const talep = s.talep ?? 50;
  const rekabet = s.rekabet ?? 50;
  const karlilik = s.karlilik ?? 55;
  const pazar = s.pazarBuyuklugu ?? 50;
  const trend = s.trend ?? 50;

  // Canlı Google Trends teyidi (best-effort): niş şu an TR'de yükseliyor mu?
  let trendingNow = false;
  try {
    const trends = await getAdapter('GOOGLE_TRENDS').scrape('', { limit: 20 });
    const niche = opp.niche.toLowerCase();
    trendingNow = trends.some(
      (t) => t.title.toLowerCase().includes(niche) || niche.includes(t.title.toLowerCase()),
    );
  } catch {
    /* best-effort */
  }

  const base = 0.35 * talep + 0.2 * (100 - rekabet) + 0.15 * karlilik + 0.2 * pazar + 0.1 * trend;
  const validationScore = round(clamp(base + (trendingNow ? 10 : 0)));

  const priority = computePriority(s.total ?? validationScore, validationScore, opp.seasonalityScore ?? 55);
  const status = validationScore >= 60 ? 'VALIDATED' : 'REJECTED';

  await opportunities.setValidation(opportunityId, {
    validationScore,
    validationSignals: {
      talep,
      rekabetTersi: 100 - rekabet,
      karlilik,
      pazarBuyuklugu: pazar,
      trend,
      trendingNow,
    },
    priorityScore: priority,
    status,
  });

  logger.info({ opportunityId, validationScore, status }, 'fırsat doğrulandı');
  return { validationScore, status };
}
