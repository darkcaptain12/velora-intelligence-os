/** Rakip Fiyat Alarm Motoru — deterministik, AI gerektirmez. Sprint 6 Faz C. */

export type CompetitorAlarmLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CompetitorAlarmResult {
  triggered: boolean;
  level: CompetitorAlarmLevel | null;
  ratio: number;
  direction: 'UP' | 'DOWN' | null;
}

/**
 * İki fiyat arasındaki değişimi değerlendirir ve alarm seviyesini döner.
 *
 * Eşikler:
 *   < 15%  → alarm yok
 *   15–30% → LOW
 *   30–50% → MEDIUM
 *   50–75% → HIGH
 *   ≥ 75%  → CRITICAL
 */
export function evaluateCompetitorAlarm(oldPrice: number, newPrice: number): CompetitorAlarmResult {
  if (oldPrice <= 0 || newPrice <= 0 || oldPrice === newPrice) {
    return { triggered: false, level: null, ratio: 0, direction: null };
  }
  const ratio = Math.abs(newPrice - oldPrice) / oldPrice;
  const direction = newPrice > oldPrice ? 'UP' : 'DOWN';

  if (ratio < 0.15) return { triggered: false, level: null, ratio, direction };

  let level: CompetitorAlarmLevel;
  if (ratio >= 0.75) level = 'CRITICAL';
  else if (ratio >= 0.50) level = 'HIGH';
  else if (ratio >= 0.30) level = 'MEDIUM';
  else level = 'LOW';

  return { triggered: true, level, ratio, direction };
}
