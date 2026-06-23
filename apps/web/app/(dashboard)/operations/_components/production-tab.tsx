import { brands, products as productSvc, suppliers, type LifecycleStatus } from '@velora/db';
import { LIFECYCLE_LABELS, computeBehaviorScore, evaluateProductDemand } from '@velora/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { applySupplierCost, updateBehaviorSignals } from '../actions';

const SECTION_ORDER: { status: LifecycleStatus; emoji: string }[] = [
  { status: 'WINNER', emoji: '🏆' },
  { status: 'SCALING', emoji: '📈' },
  { status: 'TEST', emoji: '🧪' },
  { status: 'DECLINING', emoji: '📉' },
  { status: 'NEW', emoji: '🆕' },
  // CLOSED ürünler Arşiv sekmesinde gösterilir.
];

export async function ProductionTab({ brandId }: { brandId: string }) {
  const [list, supplierList, brand] = await Promise.all([
    productSvc.list(brandId),
    suppliers.list(brandId),
    brands.getById(brandId),
  ]);
  const currency = brand?.currency ?? 'TRY';
  const costSuppliers = supplierList
    .filter((s) => s.unitCost != null && (!s.costCurrency || s.costCurrency === currency))
    .sort((a, b) => Number(a.unitCost) - Number(b.unitCost));

  const grouped = new Map<LifecycleStatus, typeof list>();
  for (const p of list) {
    const bucket = grouped.get(p.status) ?? [];
    bucket.push(p);
    grouped.set(p.status, bucket);
  }

  const sections = SECTION_ORDER.filter((s) => (grouped.get(s.status)?.length ?? 0) > 0);

  if (list.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Henüz ürün yok.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map(({ status, emoji }) => {
        const items = grouped.get(status) ?? [];
        return (
          <Card key={status}>
            <CardHeader>
              <CardTitle className="text-base">
                {emoji} {LIFECYCLE_LABELS[status]} ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {items.map((p) => {
                  const mockups = Array.isArray(p.mockups) ? (p.mockups as string[]) : [];
                  const cost = p.cost != null ? Number(p.cost) : null;
                  const price = p.price != null ? Number(p.price) : null;
                  const margin = cost != null && price != null ? price - cost : null;
                  const marginPct = margin != null && price ? (margin / price) * 100 : null;
                  const demandScore = p.intelligence?.demandScore ?? null;
                  const demand =
                    demandScore != null
                      ? evaluateProductDemand({
                          score: demandScore,
                          previousScore: p.intelligence?.previousDemandScore ?? undefined,
                        })
                      : null;
                  const behavior = computeBehaviorScore({
                    pageViews: p.pageViews,
                    cartAdds: p.cartAdds,
                    wishlistAdds: p.wishlistAdds,
                  });
                  const cheaperSupplier = costSuppliers.find((s) => cost == null || Number(s.unitCost) < cost);
                  return (
                    <div key={p.id} className="flex flex-wrap items-center gap-3 p-4">
                      {mockups[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mockups[0]}
                          alt={p.title}
                          className="h-14 w-14 rounded border object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded border bg-muted" />
                      )}
                      <div className="flex-1" style={{ minWidth: 200 }}>
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.createdAt.toLocaleDateString('tr-TR')}
                          {p.printifyProductId && ' · Printify'}
                          {p.shopifyId && ' · Shopify\'da'}
                        </p>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Maliyet</p>
                          <p>{cost != null ? cost.toFixed(2) : '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Fiyat</p>
                          <p>{price != null ? price.toFixed(2) : '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Marj</p>
                          {margin != null ? (
                            <Badge variant={margin >= 0 ? 'success' : 'destructive'}>
                              {margin.toFixed(2)}
                              {marginPct != null && ` (${marginPct.toFixed(0)}%)`}
                            </Badge>
                          ) : (
                            <p>—</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Talep</p>
                          {demandScore != null ? (
                            <p>
                              {demandScore}
                              {demand?.level === 'RISING' && ' 📈'}
                              {demand?.level === 'DECLINING' && ' 📉'}
                            </p>
                          ) : (
                            <p>—</p>
                          )}
                        </div>
                      </div>
                      {cheaperSupplier && (
                        <div className="flex w-full flex-wrap items-center gap-2 rounded-md border border-dashed p-2 text-xs">
                          <span className="text-muted-foreground">
                            💡 {cheaperSupplier.company}: {Number(cheaperSupplier.unitCost).toFixed(2)}{' '}
                            {cheaperSupplier.costCurrency ?? currency}
                            {cheaperSupplier.moq != null && ` · MOQ ${cheaperSupplier.moq}`}
                            {cost != null ? ' — mevcut maliyetten daha ucuz' : ' — maliyet önerisi'}
                          </span>
                          <form action={applySupplierCost}>
                            <input type="hidden" name="productId" value={p.id} />
                            <input type="hidden" name="supplierId" value={cheaperSupplier.id} />
                            <Button type="submit" size="sm" variant="outline" className="h-6 px-2 text-xs">
                              Bu Maliyeti Uygula
                            </Button>
                          </form>
                        </div>
                      )}
                      {/* Davranış Sinyalleri (Demand V2) */}
                      <div className="w-full rounded-md border p-2 text-xs">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium text-muted-foreground">📊 Davranış Sinyalleri</span>
                          {behavior.hasSignals && (
                            <Badge variant={behavior.score >= 50 ? 'success' : behavior.score >= 25 ? 'warning' : 'destructive'} className="text-xs">
                              Skor: {behavior.score}/100
                            </Badge>
                          )}
                        </div>
                        <form action={updateBehaviorSignals} className="flex flex-wrap gap-2">
                          <input type="hidden" name="id" value={p.id} />
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">👁️ Görüntülenme:</span>
                            <Input name="pageViews" type="number" min="0" defaultValue={p.pageViews ?? 0} className="h-6 w-20 px-1 text-xs" />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">🛒 Sepet:</span>
                            <Input name="cartAdds" type="number" min="0" defaultValue={p.cartAdds ?? 0} className="h-6 w-16 px-1 text-xs" />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">❤️ İstek:</span>
                            <Input name="wishlistAdds" type="number" min="0" defaultValue={p.wishlistAdds ?? 0} className="h-6 w-16 px-1 text-xs" />
                          </div>
                          <Button type="submit" size="sm" variant="outline" className="h-6 px-2 text-xs">Güncelle</Button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
