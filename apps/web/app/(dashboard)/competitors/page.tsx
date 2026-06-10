import { competitors } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addCompetitor, addCompetitorProduct, scanCompetitor } from './actions';

export const dynamic = 'force-dynamic';

export default async function CompetitorsPage() {
  const brand = await getActiveBrand();
  const list = await competitors.list(brand.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rakip Analiz Merkezi</h1>
        <p className="text-muted-foreground">Rakip ürün/fiyat takibi. "Tara" sayfa başlığı + fiyat sinyali çeker.</p>
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
                      {c.products.map((p) => (
                        <tr key={p.id}>
                          <td className="py-1 pr-4">{p.title}</td>
                          <td className="py-1 pr-4">{Number(p.price).toFixed(2)} {p.currency}</td>
                          <td className="py-1 text-muted-foreground">{p.seenAt.toLocaleDateString('tr-TR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
