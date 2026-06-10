/**
 * Operasyon Skoru — reklam/SEO/karlılık/ürün kalitesi/trend uyumundan ağırlıklı genel skor.
 */
export interface OperationScoreInputs {
  adScore: number;
  seoScore: number;
  profitScore: number;
  qualityScore: number;
  trendScore: number;
}

export interface OperationWeights {
  ad: number;
  seo: number;
  profit: number;
  quality: number;
  trend: number;
}

export const DEFAULT_OPERATION_WEIGHTS: OperationWeights = {
  ad: 0.25,
  seo: 0.15,
  profit: 0.3,
  quality: 0.15,
  trend: 0.15,
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function computeOperationScore(
  inputs: OperationScoreInputs,
  weights: OperationWeights = DEFAULT_OPERATION_WEIGHTS,
): number {
  const overall =
    inputs.adScore * weights.ad +
    inputs.seoScore * weights.seo +
    inputs.profitScore * weights.profit +
    inputs.qualityScore * weights.quality +
    inputs.trendScore * weights.trend;
  return Math.round(clamp(overall) * 10) / 10;
}

/** ROAS → 0–100 reklam skoru (hedef ROAS=3 → ~100). */
export function roasToScore(roas: number | null): number {
  if (roas == null) return 50;
  return Math.round(clamp((roas / 3) * 100) * 10) / 10;
}

/** Net kâr marjı (-1..1) → 0–100 karlılık skoru. */
export function marginToScore(netProfit: number, revenue: number): number {
  if (revenue <= 0) return 50;
  const margin = netProfit / revenue;
  return Math.round(clamp(50 + margin * 100) * 10) / 10;
}
