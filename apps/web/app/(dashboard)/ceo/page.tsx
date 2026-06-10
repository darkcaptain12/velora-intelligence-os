import { prisma } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateReport } from './actions';

export const dynamic = 'force-dynamic';

export default async function CeoPage() {
  const brand = await getActiveBrand();
  const reports = await prisma.aIReport.findMany({
    where: { brandId: brand.id, type: { in: ['CEO', 'WEEKLY'] } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI CEO</h1>
          <p className="text-muted-foreground">Haftalık sentez raporu: finans + operasyon + trend + öneriler. E-postayla gönderilir.</p>
        </div>
        <form action={generateReport}>
          <Button type="submit" variant="outline" size="sm">Rapor Üret & Gönder</Button>
        </form>
      </div>

      {reports.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz rapor yok — "Rapor Üret & Gönder"e basın.</p>
      ) : (
        reports.map((r) => {
          const insights = Array.isArray(r.insights) ? (r.insights as string[]) : [];
          const recs = Array.isArray(r.recommendations) ? (r.recommendations as string[]) : [];
          return (
            <Card key={r.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Haftalık Rapor · {r.period}</CardTitle>
                  <Badge variant="secondary">{r.type}</Badge>
                </div>
                <CardDescription>{r.createdAt.toLocaleString('tr-TR')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="whitespace-pre-wrap">{r.summary}</p>
                {insights.length > 0 && (
                  <div>
                    <p className="font-medium">Özet Metrikler</p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {insights.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recs.length > 0 && (
                  <div>
                    <p className="font-medium">Öneriler</p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {recs.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
