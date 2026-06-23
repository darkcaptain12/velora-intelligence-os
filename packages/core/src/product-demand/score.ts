function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

const RISING_DELTA = 15;
const DECLINING_DELTA = -15;

export interface ProductDemandInput {
  score: number;
  previousScore?: number;
}

export interface ProductDemandResult {
  triggered: boolean;
  level: 'RISING' | 'DECLINING' | null;
  delta: number;
}

/**
 * Ürün Talep Skoru değerlendirmesi: bir ürünün bağlı olduğu nişin talep skoru
 * (Trend Avcısı'ndan) önceki haftaya göre ne yönde değişti. `evaluateTrendAlarm`
 * ile aynı saf/deterministik desen — yalnızca yön çift taraflı (RISING/DECLINING).
 */
export function evaluateProductDemand(input: ProductDemandInput): ProductDemandResult {
  const score = clamp(input.score);
  if (input.previousScore == null) {
    return { triggered: false, level: null, delta: 0 };
  }
  const delta = score - clamp(input.previousScore);
  if (delta >= RISING_DELTA) return { triggered: true, level: 'RISING', delta };
  if (delta <= DECLINING_DELTA) return { triggered: true, level: 'DECLINING', delta };
  return { triggered: false, level: null, delta };
}
