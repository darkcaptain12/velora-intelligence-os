import { finance, operationScores, prisma } from '@velora/db';
import { productProfit } from '@velora/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateFinancialComment, runFinanceSnapshot } from '../actions';

type Snap = Awaited<ReturnType<typeof finance.latest>>[number];

function sumSince(snaps: Snap[], since: Date) {
  const f = snaps.filter((s) => s.date >= since);
  const num = (v: unknown) => Number(v ?? 0);
  return {
    revenue: f.reduce((a, s) => a + num(s.revenue), 0),
    orders: f.reduce((a, s) => a + s.orders, 0),
    adSpend: f.reduce((a, s) => a + num(s.adSpend), 0),
    grossProfit: f.reduce((a, s) => a + num(s.grossProfit), 0),
    netProfit: f.reduce((a, s) => a + num(s.netProfit), 0),
    taxEstimate: f.reduce((a, s) => a + num(s.taxEstimate), 0),
  };
}

export async function OverviewTab({ brandId, currency }: { brandId: string; currency: string }) {
  const [snaps, opScore, products, report] = await Promise.all([
    finance.latest(brandId, 365),
    operationScores.latest(brandId),
    prisma.product.findMany({
      where: { brandId, OR: [{ price: { not: null } }, { cost: { not: null } }] },
      orderBy: { createdAt: 'desc' },
      take: 15,
    }),
    prisma.aIReport.findFirst({ where: { brandId, type: 'FINANCE' }, orderBy: { createdAt: 'desc' } }),
  ]);

  const now = new Date();
  const startDay = new Date(now); startDay.setHours(0, 0, 0, 0);
  const startWeek = new Date(startDay); startWeek.setDate(startDay.getDate() - ((startDay.getDay() + 6) % 7));
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startYear = new Date(now.getFullYear(), 0, 1);

  const day = sumSince(snaps, startDay);
  const week = sumSince(snaps, startWeek);
  const month = sumSince(snaps, startMonth);
  const year = sumSince(snaps, startYear);

  const roas = month.adSpend > 0 ? month.revenue / month.adSpend : null;
  const cpa = month.adSpend > 0 && month.orders > 0 ? month.adSpend / month.orders : null;
  const aov = month.orders > 0 ? month.revenue / month.orders : 0;
  const c = currency;

  const Kpi = ({ label, value }: { label: string; value: string }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <form action={runFinanceSnapshot}>
          <Button type="submit" variant="outline" size="sm">Anlık Görüntü Al</Button>
        </form>
        <form action={generateFinancialComment}>
          <Button type="submit" variant="outline" size="sm">AI Yorum</Button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={`Ciro (Bugün)`} value={`${day.revenue.toFixed(0)} ${c}`} />
        <Kpi label={`Ciro (Hafta)`} value={`${week.revenue.toFixed(0)} ${c}`} />
        <Kpi label={`Ciro (Ay)`} value={`${month.revenue.toFixed(0)} ${c}`} />
        <Kpi label={`Ciro (Yıl)`} value={`${year.revenue.toFixed(0)} ${c}`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Sipariş (Ay)" value={`${month.orders}`} />
        <Kpi label="Ort. Sepet (AOV)" value={`${aov.toFixed(2)} ${c}`} />
        <Kpi label="Reklam Harc. (Ay)" value={`${month.adSpend.toFixed(0)} ${c}`} />
        <Kpi label="Net Kâr (Ay)" value={`${month.netProfit.toFixed(0)} ${c}`} />
        <Kpi label="Brüt Kâr (Ay)" value={`${month.grossProfit.toFixed(0)} ${c}`} />
        <Kpi label="Vergi Tahmini (Ay)" value={`${month.taxEstimate.toFixed(0)} ${c}`} />
        <Kpi label="ROAS (Ay)" value={roas != null ? roas.toFixed(2) : '—'} />
        <Kpi label="CPA (Ay)" value={cpa != null ? `${cpa.toFixed(2)} ${c}` : '—'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Operasyon Skoru */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Operasyon Skoru</CardTitle>
            <CardDescription>Reklam · SEO · Karlılık · Kalite · Trend ağırlıklı.</CardDescription>
          </CardHeader>
          <CardContent>
            {opScore ? (
              <>
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{opScore.overall.toFixed(0)}</span>
                  <span className="text-muted-foreground">/ 100</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
                  <span>Reklam: {opScore.adScore.toFixed(0)}</span>
                  <span>SEO: {opScore.seoScore.toFixed(0)}</span>
                  <span>Karlılık: {opScore.profitScore.toFixed(0)}</span>
                  <span>Kalite: {opScore.qualityScore.toFixed(0)}</span>
                  <span>Trend: {opScore.trendScore.toFixed(0)}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Skor yok — &quot;Anlık Görüntü Al&quot; çalıştırın.</p>
            )}
          </CardContent>
        </Card>

        {/* AI Yorum */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Finansal Yorum</CardTitle>
          </CardHeader>
          <CardContent>
            {report ? (
              <p className="whitespace-pre-wrap text-sm">{report.summary}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Henüz yorum yok — &quot;AI Yorum&quot;a basın (OpenAI gerekir).</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ürün Karlılığı */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ürün Karlılığı</CardTitle>
          <CardDescription>Fiyat − maliyet (ürün maliyeti girilen ürünler).</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Maliyet/fiyat girilen ürün yok.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 font-medium">Ürün</th>
                    <th className="px-4 py-2 font-medium">Fiyat</th>
                    <th className="px-4 py-2 font-medium">Maliyet</th>
                    <th className="px-4 py-2 font-medium">Kâr</th>
                    <th className="px-4 py-2 font-medium">Marj</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((p) => {
                    const price = p.price != null ? Number(p.price) : null;
                    const cost = p.cost != null ? Number(p.cost) : null;
                    const { margin, marginPct } = productProfit(price, cost);
                    return (
                      <tr key={p.id}>
                        <td className="px-4 py-2">{p.title}</td>
                        <td className="px-4 py-2">{price != null ? `${price} ${c}` : '—'}</td>
                        <td className="px-4 py-2">{cost != null ? `${cost} ${c}` : '—'}</td>
                        <td className="px-4 py-2">{margin != null ? `${margin} ${c}` : '—'}</td>
                        <td className="px-4 py-2">
                          {marginPct != null ? (
                            <Badge variant={marginPct >= 50 ? 'success' : marginPct >= 20 ? 'warning' : 'destructive'}>
                              %{marginPct.toFixed(0)}
                            </Badge>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
