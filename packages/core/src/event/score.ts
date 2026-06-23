/**
 * Global Event Calendar skorlama motoru (deterministik).
 * Event Score = 0.35·trend potansiyeli + 0.35·satış potansiyeli + 0.30·hazırlık zamanlaması.
 * `readiness`, computeSeasonality ile aynı mantık ama sabit gün eşikleri yerine
 * etkinliğe özgü `prepLeadDays`'e göre parametrik (oran-bazlı).
 */

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}
function round(n: number): number {
  return Math.round(n);
}

export interface EventSignals {
  /** Etkinliğin genel trend/viral potansiyeli (0-100). */
  trendPotential?: number;
  /** Etkinlik temalı ürünlerin satış potansiyeli (0-100). */
  salesPotential?: number;
  /** Etkinliğe kalan gün sayısı (negatifse geçmiş). */
  daysUntil: number;
  /** Hazırlık için gereken gün sayısı (tasarım + üretim + yayın). */
  prepLeadDays: number;
}

export interface EventScore {
  trendPotential: number;
  salesPotential: number;
  readiness: number;
  total: number;
}

/** Hazırlık zamanlaması (0-100): prepLeadDays'e göre parametrik computeSeasonality. */
function computeReadiness(daysUntil: number, prepLeadDays: number): number {
  const lead = prepLeadDays > 0 ? prepLeadDays : 21;
  if (daysUntil < 0) return 5; // etkinlik geçti
  const ratio = daysUntil / lead;
  if (ratio <= 1) return 100; // hazırlık penceresi içinde — tam zamanı
  if (ratio <= 2.14) return 80;
  if (ratio <= 3.57) return 50;
  if (ratio <= 5.7) return 25;
  return 10; // çok uzak
}

/** 3-boyut etkinlik skoru. total = 0.35·trend + 0.35·satış + 0.30·hazırlık. */
export function scoreEvent(s: EventSignals): EventScore {
  const trendPotential = clamp(s.trendPotential ?? 50);
  const salesPotential = clamp(s.salesPotential ?? 50);
  const readiness = computeReadiness(s.daysUntil, s.prepLeadDays);
  const total = round(clamp(0.35 * trendPotential + 0.35 * salesPotential + 0.3 * readiness));
  return { trendPotential, salesPotential, readiness, total };
}
