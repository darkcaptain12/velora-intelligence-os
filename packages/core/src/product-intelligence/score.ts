/**
 * Product Intelligence skorlama motoru (deterministik).
 * AI, ürünü 6 boyutta 0-100 puanlar (rakip/iade/reklam zorluğu YÜKSEK = kötü);
 * burada saf/test edilebilir ağırlıklı toplam hesaplanır.
 */

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}
function round(n: number): number {
  return Math.round(n);
}

export interface ProductIntelligenceSignals {
  /** Satış potansiyeli (0-100). */
  salesPotential?: number;
  /** Rekabet seviyesi (0-100; YÜKSEK = daha kalabalık → kötü). */
  competition?: number;
  /** Karlılık (0-100). */
  profitability?: number;
  /** Reklam zorluğu (0-100; YÜKSEK = reklamda zorlanır → kötü). */
  adDifficulty?: number;
  /** İade riski (0-100; YÜKSEK = daha riskli → kötü). */
  returnRisk?: number;
  /** Tedarik riski (0-100; YÜKSEK = daha riskli → kötü). */
  supplyRisk?: number;
}

export interface ProductIntelligenceScore {
  salesPotential: number;
  competition: number;
  profitability: number;
  adDifficulty: number;
  returnRisk: number;
  supplyRisk: number;
  total: number;
}

/** Product Intelligence Score: rekabet/reklam zorluğu/iade riski/tedarik riski TERS etki eder. */
export function scoreProductIntelligence(s: ProductIntelligenceSignals): ProductIntelligenceScore {
  const salesPotential = clamp(s.salesPotential ?? 50);
  const competition = clamp(s.competition ?? 50);
  const profitability = clamp(s.profitability ?? 50);
  const adDifficulty = clamp(s.adDifficulty ?? 50);
  const returnRisk = clamp(s.returnRisk ?? 30);
  const supplyRisk = clamp(s.supplyRisk ?? 30);

  const total = round(
    clamp(
      0.3 * salesPotential +
        0.15 * (100 - competition) +
        0.25 * profitability +
        0.1 * (100 - adDifficulty) +
        0.1 * (100 - returnRisk) +
        0.1 * (100 - supplyRisk),
    ),
  );

  return { salesPotential, competition, profitability, adDifficulty, returnRisk, supplyRisk, total };
}
