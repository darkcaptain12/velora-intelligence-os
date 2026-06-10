import { prisma, type AssetStatus } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { approveVideo, requestVideo } from './actions';

export const dynamic = 'force-dynamic';

const STATUS_BADGE: Record<AssetStatus, { variant: 'secondary' | 'warning' | 'success' | 'destructive' | 'default'; label: string }> = {
  DRAFT: { variant: 'secondary', label: 'Taslak' },
  GENERATING: { variant: 'warning', label: 'Üretiliyor' },
  READY: { variant: 'success', label: 'Hazır' },
  FAILED: { variant: 'destructive', label: 'Başarısız' },
  PUBLISHED: { variant: 'default', label: 'Onaylandı' },
};

const TYPE_LABEL: Record<string, string> = {
  TIKTOK: 'TikTok',
  REEL: 'Reel',
  STORY: 'Story',
  UGC: 'UGC',
};

export default async function VideosPage() {
  const brand = await getActiveBrand();
  const videos = await prisma.video.findMany({
    where: { brandId: brand.id },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Video Fabrikası</h1>
        <p className="text-muted-foreground">
          TikTok / Reel / Story / UGC videoları üret (Fal), MinIO'da sakla, önizle ve onayla.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Yeni Video</CardTitle>
          <CardDescription>Prompt + format → Fal video üretimi.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={requestVideo} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                name="prompt"
                placeholder="örn: kedi temalı tişört tanıtımı, dinamik geçişler, neşeli"
                required
              />
            </div>
            <div className="flex items-end gap-3">
              <div className="space-y-2">
                <Label htmlFor="type">Format</Label>
                <select
                  id="type"
                  name="type"
                  className="flex h-10 w-44 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="TIKTOK">TikTok (9:16)</option>
                  <option value="REEL">Reel (9:16)</option>
                  <option value="STORY">Story (9:16)</option>
                  <option value="UGC">UGC (9:16)</option>
                </select>
              </div>
              <Button type="submit">Üret</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Videolar</h2>
        {videos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz video yok.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => {
              const badge = STATUS_BADGE[v.status];
              return (
                <Card key={v.id} className="overflow-hidden">
                  <div className="aspect-[9/16] bg-muted">
                    {v.url ? (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <video src={v.url} controls className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        {v.status === 'FAILED' ? 'Üretim başarısız' : 'Video bekleniyor…'}
                      </div>
                    )}
                  </div>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      <span className="text-xs text-muted-foreground">{TYPE_LABEL[v.type] ?? v.type}</span>
                    </div>
                    {v.status === 'READY' && (
                      <form action={approveVideo}>
                        <input type="hidden" name="id" value={v.id} />
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
