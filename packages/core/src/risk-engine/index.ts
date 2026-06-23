/**
 * Risk Engine — birleşik risk skoru (0-100, deterministik, AI gerektirmez).
 *
 * 5 sinyal kaynağı:
 *   1. Harcama limiti ihlali    (spendGuardian)     → ağırlık %30
 *   2. Rakip fiyat değişimi     (competitorAlarm)    → ağırlık %15
 *   3. Talep düşüşü             (productDemand)      → ağırlık %20
 *   4. Düşük ROAS / yüksek CPA (adPerformance)      → ağırlık %25
 *   5. Trend alarm              (trendAlarm)         → ağırlık %10
 *
 * Skor 0 = risk yok, 100 = kritik.
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskSignal {
  source: string;
  score: number; // 0-100
  detail: string;
}

export interface RiskReport {
  totalScore: number;
  level: RiskLevel;
  signals: RiskSignal[];
  topRisk: RiskSignal | null;
}

export interface RiskEngineInput {
  spendViolationCount: number;
  competitorAlarms: { level: string | null; count: number };
  decliningProducts: number;
  totalProducts: number;
  roas?: number | null;
  targetRoas?: number;
  cpa?: number | null;
  maxCpa?: number;
  trendAlarmsHigh: number;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

export function computeRiskScore(input: RiskEngineInput): RiskReport {
  const signals: RiskSignal[] = [];

  // 1. Harcama limiti ihlali (%30)
  const spendScore = input.spendViolationCount > 0
    ? clamp(input.spendViolationCount * 50) // 1 ihlal=50, 2+=100
    : 0;
  if (spendScore > 0) {
    signals.push({
      source: 'SPEND_LIMIT',
      score: spendScore,
      detail: `${input.spendViolationCount} harcama limiti aşıldı`,
    });
  }

  // 2. Rakip fiyat değişimi (%15)
  let competitorScore = 0;
  if (input.competitorAlarms.count > 0) {
    const levelScore: Record<string, number> = {
      CRITICAL: 100, HIGH: 75, MEDIUM: 50, LOW: 25,
    };
    competitorScore = clamp(
      (levelScore[input.competitorAlarms.level ?? ''] ?? 25) +
      (input.competitorAlarms.count - 1) * 10
    );
    signals.push({
      source: 'COMPETITOR_PRICE',
      score: competitorScore,
      detail: `${input.competitorAlarms.count} rakip fiyat alarmı (${input.competitorAlarms.level ?? 'N/A'})`,
    });
  }

  // 3. Talep düşüşü (%20)
  let demandScore = 0;
  if (input.totalProducts > 0 && input.decliningProducts > 0) {
    const ratio = input.decliningProducts / input.totalProducts;
    demandScore = clamp(Math.round(ratio * 200)); // %50 declining = 100
    signals.push({
      source: 'DEMAND_DECLINE',
      score: demandScore,
      detail: `${input.decliningProducts}/${input.totalProducts} üründe talep düşüşü`,
    });
  }

  // 4. Düşük ROAS / yüksek CPA (%25)
  let adScore = 0;
  const targetRoas = input.targetRoas ?? 2;
  const maxCpa = input.maxCpa ?? 50;

  if (input.roas != null && input.roas > 0) {
    if (input.roas < 1) adScore = 100;
    else if (input.roas < targetRoas * 0.5) adScore = 80;
    else if (input.roas < targetRoas) adScore = 50;
  }
  if (input.cpa != null && input.cpa > maxCpa) {
    adScore = Math.max(adScore, clamp(Math.round((input.cpa / maxCpa) * 60)));
  }
  if (adScore > 0) {
    const parts: string[] = [];
    if (input.roas != null) parts.push(`ROAS ${input.roas.toFixed(1)}`);
    if (input.cpa != null) parts.push(`CPA ${input.cpa.toFixed(0)}`);
    signals.push({
      source: 'AD_PERFORMANCE',
      score: adScore,
      detail: parts.join(' · ') || 'Reklam performansı düşük',
    });
  }

  // 5. Trend alarm (%10)
  let trendScore = 0;
  if (input.trendAlarmsHigh > 0) {
    trendScore = clamp(input.trendAlarmsHigh * 30);
    signals.push({
      source: 'TREND_SHIFT',
      score: trendScore,
      detail: `${input.trendAlarmsHigh} yüksek trend alarmı`,
    });
  }

  // Ağırlıklı toplam
  const totalScore = clamp(Math.round(
    spendScore * 0.30 +
    competitorScore * 0.15 +
    demandScore * 0.20 +
    adScore * 0.25 +
    trendScore * 0.10
  ));

  // Seviye
  let level: RiskLevel;
  if (totalScore >= 75) level = 'CRITICAL';
  else if (totalScore >= 50) level = 'HIGH';
  else if (totalScore >= 25) level = 'MEDIUM';
  else level = 'LOW';

  // En yüksek risk
  signals.sort((a, b) => b.score - a.score);

  return {
    totalScore,
    level,
    signals,
    topRisk: signals[0] ?? null,
  };
}
