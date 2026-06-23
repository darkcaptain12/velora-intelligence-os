import { prisma, type AssetStatus } from '@velora/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { approveDesign, generateBrief, requestDesign } from '../actions';

const STATUS_BADGE: Record<AssetStatus, { variant: 'secondary' | 'warning' | 'success' | 'destructive' | 'default'; label: string }> = {
  DRAFT: { variant: 'secondary', label: 'Taslak' },
  GENERATING: { variant: 'warning', label: 'Üretiliyor' },
  READY: { variant: 'success', label: 'Hazır' },
  FAILED: { variant: 'destructive', label: 'Başarısız' },
  PUBLISHED: { variant: 'default', label: 'Onaylandı' },
};

interface DesignScores {
  sellability?: number;
  trend?: number;
  ad?: number;
  audience?: number;
}

export async function DesignsTab({ brandId }: { brandId: string }) {
  const [briefs, designs] = await Promise.all([
    prisma.designBrief.findMany({ where: { brandId }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.design.findMany({
      where: { brandId },
      orderBy: { createdAt: 'desc' },
      take: 12,
      include: { mockups: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Tasarım Direktörü</CardTitle>
            <CardDescription>Niş + kitleden brief üret (OpenAI).</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={generateBrief} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="niche">Niş</Label>
                <Input id="niche" name="niche" placeholder="örn: kedi sahipleri" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Hedef Kitle</Label>
                <Input id="audience" name="audience" placeholder="örn: 25-40 yaş kedi severler" required />
              </div>
              <Button type="submit">Brief Üret</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasarım Üret</CardTitle>
            <CardDescription>Prompt → Fal görsel + 4 mockup + skorlama.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={requestDesign} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="prompt">Görsel Prompt</Label>
                <Textarea id="prompt" name="prompt" placeholder="örn: minimal line-art kedi, tişört baskısı" required />
              </div>
              {briefs.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="briefId">İlişkili Brief (opsiyonel)</Label>
                  <select
                    id="briefId"
                    name="briefId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">— Yok —</option>
                    {briefs.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.targetAudience} · {b.summary.slice(0, 40)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <Button type="submit">Üret</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {briefs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Son Briefler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {briefs.map((b) => (
              <div key={b.id} className="border-b pb-3 text-sm last:border-0 last:pb-0">
                <p className="font-medium">{b.targetAudience}</p>
                <p className="whitespace-pre-wrap text-muted-foreground">{b.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold">Tasarımlar</h2>
        {designs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz tasarım yok.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {designs.map((d) => {
              const badge = STATUS_BADGE[d.status];
              const scores = (d.scores as DesignScores | null) ?? null;
              return (
                <Card key={d.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted">
                    {d.pngUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={d.pngUrl} alt={d.prompt} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        {d.status === 'FAILED' ? 'Üretim başarısız' : 'Görsel bekleniyor…'}
                      </div>
                    )}
                  </div>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      {d.mockups.length > 0 && (
                        <span className="text-xs text-muted-foreground">{d.mockups.length} mockup</span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm">{d.prompt}</p>
                    {scores && (
                      <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                        <span>satış {scores.sellability ?? '-'}</span>
                        <span>· trend {scores.trend ?? '-'}</span>
                        <span>· reklam {scores.ad ?? '-'}</span>
                        <span>· kitle {scores.audience ?? '-'}</span>
                      </div>
                    )}
                    {d.mockups.length > 0 && (
                      <div className="flex gap-1">
                        {d.mockups.slice(0, 4).map((m) => (
                          <a key={m.id} href={m.url} download target="_blank" rel="noreferrer" title={`${m.type} indir`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={m.url}
                              alt={m.type}
                              className="h-12 w-12 rounded border object-cover transition-opacity hover:opacity-80"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                    {(d.transparentUrl || d.pngUrl) && (
                      <a
                        href={d.transparentUrl ?? d.pngUrl ?? '#'}
                        download={`${d.id}-baski.png`}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-center text-xs font-medium text-primary underline"
                      >
                        ⬇ Baskı dosyasını indir (şeffaf PNG)
                      </a>
                    )}
                    {d.status === 'READY' && (
                      <form action={approveDesign}>
                        <input type="hidden" name="id" value={d.id} />
                        <Button type="submit" size="sm" className="w-full">
                          Onayla
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
