import { creativeTests } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { createTest, pickWinner } from './actions';

export const dynamic = 'force-dynamic';

export default async function LabPage() {
  const brand = await getActiveBrand();
  const tests = await creativeTests.list(brand.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kreatif Test Laboratuvarı</h1>
        <p className="text-muted-foreground">Reklam metni/görsel/video varyantları için A/B testleri.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Yeni A/B Testi</CardTitle>
          <CardDescription>Hipotez + varyantlar (her satır bir varyant).</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createTest} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="hypothesis">Hipotez</Label>
              <Input id="hypothesis" name="hypothesis" placeholder="örn: Duygusal başlık CTR'ı artırır" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="variants">Varyantlar (satır başına bir tane)</Label>
              <Textarea id="variants" name="variants" placeholder={'Varyant A: ...\nVaryant B: ...'} required />
            </div>
            <Button type="submit">Test Oluştur</Button>
          </form>
        </CardContent>
      </Card>

      {tests.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz test yok.</p>
      ) : (
        tests.map((t) => {
          const variants = Array.isArray(t.variants) ? (t.variants as string[]) : [];
          return (
            <Card key={t.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{t.hypothesis}</CardTitle>
                  <Badge variant={t.winner ? 'success' : 'secondary'}>
                    {t.winner ? `Kazanan seçildi` : t.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 border-b pb-2 text-sm last:border-0 last:pb-0">
                    <span className={t.winner === v ? 'font-semibold' : ''}>{v}</span>
                    {t.winner === v ? (
                      <Badge variant="success">Kazanan</Badge>
                    ) : !t.winner ? (
                      <form action={pickWinner}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="winner" value={v} />
                        <Button type="submit" size="sm" variant="outline">Kazanan Seç</Button>
                      </form>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
