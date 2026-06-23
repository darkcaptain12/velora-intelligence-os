import { trends } from '@velora/db';
import { evaluateTrendAlarm } from '@velora/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { huntTrends } from '../actions';

export async function TrendsTab({ brandId }: { brandId: string }) {
  const list = await trends.list(brandId);

  // Haftaya göre grupla (trends.list zaten week desc sıralı döner)
  const byWeek = new Map<string, typeof list>();
  for (const t of list) {
    const arr = byWeek.get(t.week) ?? [];
    arr.push(t);
    byWeek.set(t.week, arr);
  }
  const weekEntries = [...byWeek.entries()];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Araştırma sonuçlarından haftalık niş / viral tema çıkarımı.
        </p>
        <form action={huntTrends}>
          <Button type="submit" variant="outline" size="sm">
            Trend Avla
          </Button>
        </form>
      </div>

      {weekEntries.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Henüz trend yok. Önce "Araştırma" sekmesinden tarama yapın, sonra "Trend Avla"ya basın.
          </CardContent>
        </Card>
      ) : (
        weekEntries.map(([week, items], idx) => {
          const prevItems = weekEntries[idx + 1]?.[1] ?? [];
          const prevByNiche = new Map(prevItems.map((t) => [t.niche, t.score]));
          return (
            <Card key={week}>
              <CardHeader>
                <CardTitle className="text-base">{week}</CardTitle>
                <CardDescription>{items.length} trend sinyali</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.map((t) => {
                  const alarm = evaluateTrendAlarm({ score: t.score, previousScore: prevByNiche.get(t.niche) });
                  return (
                    <div key={t.id} className="flex items-center justify-between gap-2 border-b pb-2 text-sm last:border-0 last:pb-0">
                      <div>
                        <span className="font-medium">{t.theme}</span>
                        <span className="ml-2 text-xs text-muted-foreground">niş: {t.niche} · {t.source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {alarm.triggered && (
                          <Badge variant="destructive">
                            🔥 {alarm.level === 'HIGH' ? 'Alarm' : 'Yükselişte'}
                          </Badge>
                        )}
                        <Badge variant={t.score >= 60 ? 'success' : 'secondary'}>{t.score.toFixed(0)}</Badge>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
