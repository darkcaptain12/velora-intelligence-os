/**
 * Acil Durum Koruması — harcama limiti değerlendirmesi (saf/deterministik).
 * Meta'ya bağımlı değildir; yalnızca harcama + limitlerden ihlalleri çıkarır.
 */
export type LimitPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type SpendByPeriod = Record<LimitPeriod, number>;

export interface LimitDef {
  period: LimitPeriod;
  amount: number;
}

export interface SpendViolation {
  period: LimitPeriod;
  spent: number;
  limit: number;
  overBy: number;
}

/** Harcamanın aktif limitleri aşıp aşmadığını döner. */
export function evaluateSpendLimits(spend: SpendByPeriod, limits: LimitDef[]): SpendViolation[] {
  const violations: SpendViolation[] = [];
  for (const limit of limits) {
    const spent = spend[limit.period] ?? 0;
    if (spent > limit.amount) {
      violations.push({
        period: limit.period,
        spent,
        limit: limit.amount,
        overBy: Math.round((spent - limit.amount) * 100) / 100,
      });
    }
  }
  return violations;
}

// --- Otomatik Mod reklam kararı ---

export type AdAction = 'SCALE' | 'KEEP' | 'PAUSE';

export interface AdPerformance {
  spend: number;
  roas?: number | null;
  cpa?: number | null;
}

export interface AutoModeConfig {
  targetRoas: number;
  maxCpa: number;
  minSpend: number; // bu eşiğin altında karar verilmez (yetersiz veri)
}

export const DEFAULT_AUTO_CONFIG: AutoModeConfig = { targetRoas: 2, maxCpa: 50, minSpend: 5 };

/**
 * Performansa göre reklam aksiyonu önerir (ölçekle / koru / durdur).
 * Otomatik mod yalnızca L3 + ads.autoMode açıkken UYGULAR; bu fonksiyon kararı verir.
 */
export function decideAdAction(
  perf: AdPerformance,
  config: AutoModeConfig = DEFAULT_AUTO_CONFIG,
): AdAction {
  if (perf.spend < config.minSpend) return 'KEEP';
  if (perf.roas != null && perf.roas >= config.targetRoas * 1.5) return 'SCALE';
  if (perf.roas != null && perf.roas < 1) return 'PAUSE';
  if (perf.cpa != null && perf.cpa > config.maxCpa) return 'PAUSE';
  if (perf.roas != null && perf.roas >= config.targetRoas) return 'KEEP';
  return 'KEEP';
}
