/** Tedarikçi Skoru (0-100) — deterministik, AI gerektirmez. Sprint 6 Faz B. */

export interface SupplierScoreInput {
  verified: boolean;
  unitCost?: number | null;
  costCurrency?: string | null;
  moq?: number | null;
  deliveryDays?: number | null;
  email?: string | null;
  phone?: string | null;
  brandCurrency?: string | null;
}

export interface SupplierScoreResult {
  score: number;
  verifiedPoints: number;
  costPoints: number;
  deliveryPoints: number;
  moqPoints: number;
  contactPoints: number;
}

/**
 * Tedarikçiyi 0-100 arası bir skor ile değerlendirir.
 *
 * Ağırlıklar:
 *   verified(30) + unitCost & para birimi eşleşmesi(25) + deliveryDays(20) + moq(15) + iletişim(10)
 */
export function computeSupplierScore(input: SupplierScoreInput): SupplierScoreResult {
  const verifiedPoints = input.verified ? 30 : 0;

  let costPoints = 0;
  if (input.unitCost != null && Number(input.unitCost) > 0) {
    const currencyMatch =
      !input.brandCurrency ||
      !input.costCurrency ||
      input.costCurrency.toUpperCase() === input.brandCurrency.toUpperCase();
    costPoints = currencyMatch ? 25 : 10;
  }

  let deliveryPoints = 0;
  if (input.deliveryDays != null) {
    const d = input.deliveryDays;
    deliveryPoints = d <= 7 ? 20 : d <= 14 ? 15 : d <= 21 ? 10 : 5;
  }

  let moqPoints = 0;
  if (input.moq != null) {
    const m = input.moq;
    moqPoints = m <= 10 ? 15 : m <= 50 ? 10 : m <= 100 ? 5 : 0;
  }

  let contactPoints = 0;
  if (input.email && input.phone) contactPoints = 10;
  else if (input.email || input.phone) contactPoints = 5;

  const score = Math.min(100, verifiedPoints + costPoints + deliveryPoints + moqPoints + contactPoints);
  return { score, verifiedPoints, costPoints, deliveryPoints, moqPoints, contactPoints };
}
