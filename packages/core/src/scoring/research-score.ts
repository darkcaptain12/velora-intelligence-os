import type { ResearchItem, ResearchScores, ScoredResearchItem } from '@velora/shared';

/**
 * Ürün araştırma skorlama motoru (heuristik v1, deterministik).
 * Etkileşim + ticari niyet + tazelik sinyallerinden 0–100 arası 4 puan üretir.
 * Harici AI/servis GEREKTİRMEZ; AI zenginleştirme ayrı katmandadır.
 */

const COMMERCIAL_KEYWORDS = [
  // EN
  'buy', 'best', 'review', 'vs', 'worth', 'gift', 'custom', 'personalized', 'cheap',
  'deal', 'sale', 'price', 'shop', 'order', 'amazon', 'etsy', 'trending', 'viral',
  'aesthetic', 'design', 'shirt', 'tshirt', 'hoodie', 'mug', 'poster', 'sticker',
  // TR
  'satın', 'fiyat', 'indirim', 'hediye', 'özel', 'tasarım', 'tişört', 'kupa', 'trend',
];

const ENGAGEMENT_CEIL = 50_000; // log normalizasyon tavanı
const DAY_MS = 86_400_000;

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Etkileşimi log ölçeğinde 0–100'e indirger. */
function normalizeEngagement(engagement: number): number {
  if (engagement <= 0) return 0;
  return clamp((100 * Math.log10(1 + engagement)) / Math.log10(1 + ENGAGEMENT_CEIL));
}

/** Başlıktaki ticari niyet yoğunluğu (0–1). */
function commercialIntent(title: string): number {
  const lower = title.toLowerCase();
  let hits = 0;
  for (const kw of COMMERCIAL_KEYWORDS) {
    if (lower.includes(kw)) hits += 1;
  }
  return clamp(hits / 3, 0, 1) as number;
}

/** Tazelik katkısı (0–1): son 30 günde daha yüksek. */
function recencyFactor(createdAt?: string): number {
  if (!createdAt) return 0.5;
  const ts = Date.parse(createdAt);
  if (Number.isNaN(ts)) return 0.5;
  const ageDays = (Date.now() - ts) / DAY_MS;
  if (ageDays <= 7) return 1;
  if (ageDays >= 90) return 0;
  return clamp(1 - (ageDays - 7) / 83, 0, 1);
}

/** Tek bir öğeyi skorlar. */
export function scoreItem(item: ResearchItem): ResearchScores {
  const engagement = (item.score ?? 0) + 2 * (item.comments ?? 0);
  const demand = normalizeEngagement(engagement);
  const intent = commercialIntent(item.title);
  const recency = recencyFactor(item.createdAt);

  const demandScore = round(clamp(demand * (0.8 + 0.2 * recency)));
  const competitionScore = round(clamp(30 + 55 * intent));
  const salesPotential = round(clamp(0.55 * demandScore + 45 * intent));
  const profitScore = round(clamp(0.6 * salesPotential - 0.4 * competitionScore + 45));

  return { demandScore, competitionScore, salesPotential, profitScore };
}

/** Bir liste öğeyi skorlayıp profitScore'a göre azalan sıralar. */
export function scoreItems(items: ResearchItem[]): ScoredResearchItem[] {
  return items
    .map((item) => ({ ...item, scores: scoreItem(item) }))
    .sort((a, b) => b.scores.profitScore - a.scores.profitScore);
}

/** Bir koşunun özet ortalamaları (UI için). */
export function summarizeScores(items: ScoredResearchItem[]): ResearchScores {
  if (items.length === 0) {
    return { demandScore: 0, competitionScore: 0, salesPotential: 0, profitScore: 0 };
  }
  const acc = items.reduce(
    (a, it) => ({
      demandScore: a.demandScore + it.scores.demandScore,
      competitionScore: a.competitionScore + it.scores.competitionScore,
      salesPotential: a.salesPotential + it.scores.salesPotential,
      profitScore: a.profitScore + it.scores.profitScore,
    }),
    { demandScore: 0, competitionScore: 0, salesPotential: 0, profitScore: 0 },
  );
  const n = items.length;
  return {
    demandScore: round(acc.demandScore / n),
    competitionScore: round(acc.competitionScore / n),
    salesPotential: round(acc.salesPotential / n),
    profitScore: round(acc.profitScore / n),
  };
}
