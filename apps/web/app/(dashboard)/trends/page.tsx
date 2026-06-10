import { trends } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { huntTrends } from './actions';

export const dynamic = 'force-dynamic';

export default async function TrendsPage() {
  const brand = await getActiveBrand();
  const list = await trends.list(brand.id);

  // Haftaya göre grupla
  const byWeek = new Map<string, typeof list>();
  for (const t of list) {
    const arr = byWeek.get(t.week) ?? [];
    arr.push(t);
    byWeek.set(t.week, arr);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trend Avcısı</h1>
          <p className="text-muted-foreground">
            Araştırma sonuçlarından haftalık niş / viral tema çıkarımı.
          </p>
        </div>
        <form action={huntTrends}>
          <Button type="submit" variant="outline" size="sm">Trend Avla</Button>
        </form>
      </div>

      {byWeek.size === 0 ? (
        <p className="text-sm text-muted-foreground">
          Henüz trend yok. Önce Ürün Araştırma yapın, sonra "Trend Avla"ya basın.
        </p>
      ) : (
        [...byWeek.entries()].map(([week, items]) => (
          <Card key={week}>
            <CardHeader>
              <CardTitle className="text-base">{week}</CardTitle>
              <CardDescription>{items.length} trend sinyali</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-2 border-b pb-2 text-sm last:border-0 last:pb-0">
                  <div>
                    <span className="font-medium">{t.theme}</span>
                    <span className="ml-2 text-xs text-muted-foreground">niş: {t.niche} · {t.source}</span>
                  </div>
                  <Badge variant={t.score >= 60 ? 'success' : 'secondary'}>{t.score.toFixed(0)}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
