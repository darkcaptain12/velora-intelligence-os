/**
 * Trend Alarm Sistemi (deterministik).
 * HIGH: skor mutlak eşiği aşıyor (önceki haftadan bağımsız — yeni/güçlü bir tema).
 * RISING: önceki hafta skoru biliniyor ve sıçrama (delta) eşiği aşılıyor.
 */

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

const HIGH_THRESHOLD = 75;
const RISING_DELTA = 20;

export interface TrendAlarmInput {
  score: number;
  previousScore?: number;
}

export interface TrendAlarmResult {
  triggered: boolean;
  level: 'HIGH' | 'RISING' | null;
  delta: number;
}

export function evaluateTrendAlarm(input: TrendAlarmInput): TrendAlarmResult {
  const score = clamp(input.score);
  const delta = input.previousScore != null ? score - clamp(input.previousScore) : 0;

  if (score >= HIGH_THRESHOLD) return { triggered: true, level: 'HIGH', delta };
  if (input.previousScore != null && delta >= RISING_DELTA) return { triggered: true, level: 'RISING', delta };
  return { triggered: false, level: null, delta };
}
