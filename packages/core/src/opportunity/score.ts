/**
 * Opportunity skorlama motoru (Opportunity-First mimarisi, deterministik).
 * - 6-boyut fırsat skoru (talep/rekabet/karlılık/üretilebilirlik/trend/pazarBüyüklüğü)
 * - Timing/Seasonality skoru ("şu anda satar mı?")
 * - Priority skoru (Opportunity + Validation + Seasonality bileşimi) — ana sıralama.
 * AI sentezi worker katmanındadır; buradaki sayısal mantık saf/test edilebilir.
 */

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}
function round(n: number): number {
  return Math.round(n);
}

export interface OpportunitySignals {
  /** Talep (etkileşim/arama hacmi normalize, 0–100). */
  demand?: number;
  /** Rekabet seviyesi (0–100; YÜKSEK = daha kalabalık → fırsat için kötü). */
  competition?: number;
  /** Karlılık (0–100). */
  profit?: number;
  /** Üretilebilirlik (baskılı tekstil için genelde yüksek, 0–100). */
  producibility?: number;
  /** Trend ivmesi (0–100). */
  trend?: number;
  /** Pazar büyüklüğü — toplam potansiyel kitle (0–100). */
  marketSize?: number;
}

export interface OpportunityScore {
  talep: number;
  rekabet: number;
  karlilik: number;
  uretilebilirlik: number;
  trend: number;
  pazarBuyuklugu: number;
  total: number;
}

/** 6-boyut fırsat skoru. `total`'da rekabet TERS etki eder (yüksek rekabet → düşük total). */
export function scoreOpportunity(s: OpportunitySignals): OpportunityScore {
  const talep = clamp(s.demand ?? 50);
  const rekabet = clamp(s.competition ?? 50);
  const karlilik = clamp(s.profit ?? 55);
  const uretilebilirlik = clamp(s.producibility ?? 80);
  const trend = clamp(s.trend ?? 50);
  const pazarBuyuklugu = clamp(s.marketSize ?? 50);

  const total = round(
    clamp(
      0.24 * talep +
        0.16 * (100 - rekabet) +
        0.2 * karlilik +
        0.08 * uretilebilirlik +
        0.16 * trend +
        0.16 * pazarBuyuklugu,
    ),
  );
  return { talep, rekabet, karlilik, uretilebilirlik, trend, pazarBuyuklugu, total };
}

/** Seasonality 0–100: "şimdi doğru zaman mı?". */
export function computeSeasonality(opts: {
  daysUntilEvent?: number | null;
  evergreen?: boolean;
}): number {
  if (opts.evergreen) return 85; // yıl boyu stabil (gym vb.)
  const d = opts.daysUntilEvent;
  if (d == null) return 55; // sezon-bağımsız (TREND/PROBLEM) — nötr
  if (d < 0) return 5; // geçti
  if (d <= 21) return 100; // çok yakın — tam zamanı
  if (d <= 45) return 80;
  if (d <= 75) return 50;
  if (d <= 120) return 25;
  return 10; // çok uzak
}

/**
 * Priority skoru (ana sıralama). Sezon güçlü çarpan:
 * priority = (opportunity·0.5 + validation·0.5) × (seasonality/100)
 * Validation yoksa base = opportunity (keşif sonrası ilk sıralama).
 */
export function computePriority(
  opportunityTotal: number,
  validationScore: number | null | undefined,
  seasonalityScore: number,
): number {
  const base =
    validationScore != null ? 0.5 * opportunityTotal + 0.5 * validationScore : opportunityTotal;
  return round(clamp(base * (clamp(seasonalityScore) / 100)));
}
