import { prisma, type JobStatus } from '@velora/db';
import { availableSources } from '@velora/scraping';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { startResearch } from './actions';

export const dynamic = 'force-dynamic';

const STATUS_BADGE: Record<JobStatus, { variant: 'secondary' | 'warning' | 'success' | 'destructive'; label: string }> = {
  QUEUED: { variant: 'secondary', label: 'Kuyrukta' },
  RUNNING: { variant: 'warning', label: 'Çalışıyor' },
  SUCCESS: { variant: 'success', label: 'Tamamlandı' },
  FAILED: { variant: 'destructive', label: 'Başarısız' },
};

const SOURCE_LABEL: Record<string, string> = {
  HACKERNEWS: 'Hacker News',
  REDDIT: 'Reddit',
  TIKTOK: 'TikTok',
  PINTEREST: 'Pinterest',
  ETSY: 'Etsy',
  AMAZON: 'Amazon',
};

export default async function ResearchPage() {
  const brand = await getActiveBrand();
  const sources = availableSources();
  const runs = await prisma.researchRun.findMany({
    where: { brandId: brand.id },
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: { results: { orderBy: { profitScore: 'desc' }, take: 8 } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ürün Araştırma Motoru</h1>
        <p className="text-muted-foreground">
          Kaynaktan veri çek, talep/rekabet/satış/kâr skorla. Heuristik skorlama (AI gerektirmez).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Araştırma</CardTitle>
          <CardDescription>
            Kullanılabilir kaynaklar: {sources.map((s) => SOURCE_LABEL[s] ?? s).join(', ')}.
            Reddit/HN/Etsy resmi/açık API ile; Pinterest/TikTok/Amazon tarayıcı ile çekilir
            (bot koruması olursa Görev Merkezi'ne manuel doğrulama görevi açılır). Etsy/Pinterest
            için Ayarlar'dan API anahtarı girin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={startResearch} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 space-y-2" style={{ minWidth: 240 }}>
              <Label htmlFor="query">Sorgu / Niş</Label>
              <Input id="query" name="query" placeholder="örn: cat lover gift" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Kaynak</Label>
              <select
                id="source"
                name="source"
                className="flex h-10 w-44 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {sources.map((s) => (
                  <option key={s} value={s}>
                    {SOURCE_LABEL[s] ?? s}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Araştır</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz araştırma yok.</p>
        ) : (
          runs.map((run) => {
            const badge = STATUS_BADGE[run.status];
            return (
              <Card key={run.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base">
                      {SOURCE_LABEL[run.source] ?? run.source} · “{run.query}”
                    </CardTitle>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {run.createdAt.toLocaleString('tr-TR')} · {run.results.length} sonuç
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {run.results.length === 0 ? (
                    <p className="px-6 pb-4 text-sm text-muted-foreground">
                      {run.status === 'FAILED' ? 'Araştırma başarısız oldu.' : 'Sonuç bekleniyor…'}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b text-left text-muted-foreground">
                          <tr>
                            <th className="px-6 py-2 font-medium">Başlık</th>
                            <th className="px-3 py-2 font-medium">Talep</th>
                            <th className="px-3 py-2 font-medium">Rekabet</th>
                            <th className="px-3 py-2 font-medium">Satış</th>
                            <th className="px-3 py-2 font-medium">Kâr</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {run.results.map((r) => (
                            <tr key={r.id}>
                              <td className="max-w-md px-6 py-2">
                                {r.url ? (
                                  <a
                                    href={r.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="line-clamp-1 hover:underline"
                                  >
                                    {r.title}
                                  </a>
                                ) : (
                                  <span className="line-clamp-1">{r.title}</span>
                                )}
                              </td>
                              <td className="px-3 py-2">{r.demandScore}</td>
                              <td className="px-3 py-2">{r.competitionScore}</td>
                              <td className="px-3 py-2">{r.salesPotential}</td>
                              <td className="px-3 py-2 font-semibold">{r.profitScore}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
