/**
 * Finans hesap motoru (saf/deterministik). CLAUDE.md Finans & İş Zekası Merkezi.
 */
export interface FinanceInputs {
  revenue: number;
  cogs: number;
  adSpend: number;
  shipping: number;
  commission: number;
  opex: number;
  orders: number;
  conversions?: number;
  taxRate: number;
}

export interface FinanceComputed {
  revenue: number;
  cogs: number;
  adSpend: number;
  shipping: number;
  commission: number;
  opex: number;
  grossProfit: number;
  netProfit: number;
  taxEstimate: number;
  aov: number;
  roas: number | null;
  cpa: number | null;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function computeFinance(i: FinanceInputs): FinanceComputed {
  const grossProfit = i.revenue - i.cogs;
  const netProfit = grossProfit - i.adSpend - i.shipping - i.commission - i.opex;
  const taxEstimate = Math.max(0, netProfit) * i.taxRate;
  const aov = i.orders > 0 ? i.revenue / i.orders : 0;
  const roas = i.adSpend > 0 ? i.revenue / i.adSpend : null;
  const conv = i.conversions ?? i.orders;
  const cpa = i.adSpend > 0 && conv > 0 ? i.adSpend / conv : null;

  return {
    revenue: r2(i.revenue),
    cogs: r2(i.cogs),
    adSpend: r2(i.adSpend),
    shipping: r2(i.shipping),
    commission: r2(i.commission),
    opex: r2(i.opex),
    grossProfit: r2(grossProfit),
    netProfit: r2(netProfit),
    taxEstimate: r2(taxEstimate),
    aov: r2(aov),
    roas: roas == null ? null : r2(roas),
    cpa: cpa == null ? null : r2(cpa),
  };
}

/** Ürün bazlı kâr (maliyet + fiyattan). */
export function productProfit(price: number | null, cost: number | null): {
  margin: number | null;
  marginPct: number | null;
} {
  if (price == null || cost == null) return { margin: null, marginPct: null };
  const margin = price - cost;
  return { margin: r2(margin), marginPct: price > 0 ? r2((margin / price) * 100) : null };
}
