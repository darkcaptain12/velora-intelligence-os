import { competitors } from '@velora/db';
import { evaluateCompetitorAlarm } from '@velora/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addCompetitor, addCompetitorProduct, scanCompetitor, watchAllCompetitors } from '../actions';

const ALARM_BADGE: Record<string, { emoji: string; class: string }> = {
  CRITICAL: { emoji: '🚨', class: 'text-red-600 font-bold' },
  HIGH: { emoji: '🔴', class: 'text-orange-500 font-semibold' },
  MEDIUM: { emoji: '🟡', class: 'text-yellow-600' },
  LOW: { emoji: '🟢', class: 'text-green-600' },
};

export async function CompetitorsTab({ brandId }: { brandId: string }) {
  const list = await competitors.list(brandId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Rakip ürün/fiyat takibi. "Tara" sayfa başlığı + fiyat sinyali çeker. Fiyat değişimi:
          🟢 LOW (%15–30) · 🟡 MEDIUM (%30–50) · 🔴 HIGH (%50–75) · 🚨 CRITICAL (%75+).
        </p>
        {list.length > 0 && (
          <form action={watchAllCompetitors}>
            <Button type="submit" variant="outline" size="sm">
              Tümünü Tara
            </Button>
          </form>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rakip Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addCompetitor} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 space-y-1" style={{ minWidth: 180 }}>
              <Label htmlFor="name">Ad</Label>
              <Input id="name" name="name" placeholder="Rakip marka" required />
            </div>
            <div className="flex-1 space-y-1" style={{ minWidth: 220 }}>
              <Label htmlFor="url">URL</Label>
              <Input id="url" name="url" type="url" placeholder="https://..." required />
            </div>
            <div className="flex-1 space-y-1" style={{ minWidth: 160 }}>
              <Label htmlFor="metaPageId">Meta Sayfa ID (opsiyonel)</Label>
              <Input id="metaPageId" name="metaPageId" placeholder="örn: 123456789012345" />
            </div>
            <Button type="submit">Ekle</Button>
          </form>
        </CardContent>
      </Card>

      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz rakip yok.</p>
      ) : (
        list.map((c) => (
          <Card key={c.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">{c.name}</CardTitle>
                <CardDescription>
                  <a href={c.url} target="_blank" rel="noreferrer" className="hover:underline">{c.url}</a>
                  {c.metaPageId && <span className="ml-2 text-xs">· Meta Sayfa: {c.metaPageId}</span>}
                </CardDescription>
              </div>
              <form action={scanCompetitor}>
                <input type="hidden" name="id" value={c.id} />
                <Button type="submit" variant="outline" size="sm">Tara</Button>
              </form>
            </CardHeader>
            <CardContent className="space-y-3">
              {c.products.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b text-left text-muted-foreground">
                      <tr>
                        <th className="py-1 pr-4 font-medium">Ürün/Gözlem</th>
                        <th className="py-1 pr-4 font-medium">Fiyat</th>
                        <th className="py-1 font-medium">Tarih</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {c.products.map((p, idx) => {
                        const prev = c.products.slice(idx + 1).find((pp) => pp.title === p.title);
                        const alarm = prev
                          ? evaluateCompetitorAlarm(Number(prev.price), Number(p.price))
                          : null;
                        const badge = alarm?.triggered && alarm.level ? ALARM_BADGE[alarm.level] : null;
                        return (
                          <tr key={p.id}>
                            <td className="py-1 pr-4">{p.title}</td>
                            <td className="py-1 pr-4">
                              {Number(p.price).toFixed(2)} {p.currency}
                              {badge && (
                                <span className={`ml-2 text-xs ${badge.class}`}>
                                  {badge.emoji} {alarm!.level}
                                </span>
                              )}
                            </td>
                            <td className="py-1 text-muted-foreground">{p.seenAt.toLocaleDateString('tr-TR')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {c.ads.length > 0 && (
                <div className="space-y-2 rounded-md border p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    📢 Reklamlar (Meta Ad Library)
                  </p>
                  <div className="space-y-2">
                    {c.ads.map((ad) => (
                      <div key={ad.id} className="rounded-md border p-2 text-sm">
                        {ad.copy && <p className="whitespace-pre-wrap">{ad.copy}</p>}
                        {ad.creativeUrl && (
                          <a
                            href={ad.creativeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-muted-foreground hover:underline"
                          >
                            Reklamı görüntüle →
                          </a>
                        )}
                        <p className="text-xs text-muted-foreground">{ad.seenAt.toLocaleDateString('tr-TR')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <form action={addCompetitorProduct} className="flex flex-wrap items-end gap-2">
                <input type="hidden" name="competitorId" value={c.id} />
                <Input name="title" placeholder="Ürün/gözlem" className="flex-1" style={{ minWidth: 180 }} required />
                <Input name="price" type="number" min="0" step="0.01" placeholder="Fiyat" className="w-28" required />
                <Button type="submit" variant="outline" size="sm">Manuel Ekle</Button>
              </form>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
