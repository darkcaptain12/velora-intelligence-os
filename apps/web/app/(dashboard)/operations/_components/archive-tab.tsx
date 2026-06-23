import { prisma } from '@velora/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { transitionProduct } from '../actions';

export async function ArchiveTab({ brandId }: { brandId: string }) {
  const archived = await prisma.product.findMany({
    where: { brandId, status: 'CLOSED' },
    orderBy: { updatedAt: 'desc' },
    include: { intelligence: { select: { scoreTotal: true } } },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📦 Arşiv</CardTitle>
          <CardDescription>
            {archived.length > 0 ? `${archived.length} ürün arşivlendi. ` : ''}
            Kapatılan ürünler varsayılan listelerde ve AI CEO analizinde görünmez.
            Test durumuna alarak yeniden aktif edebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {archived.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Arşivde ürün yok.</p>
          ) : (
            <div className="divide-y">
              {archived.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-3 p-4">
                  <div className="flex-1" style={{ minWidth: 200 }}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-muted-foreground">{p.title}</span>
                      <Badge variant="secondary">Kapatıldı</Badge>
                      {p.intelligence?.scoreTotal != null && (
                        <Badge variant="outline">PI: {p.intelligence.scoreTotal}</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p.updatedAt.toLocaleDateString('tr-TR')}
                      {p.shopifyId && " · Shopify'da"}
                      {p.price != null && ` · Fiyat: ${Number(p.price).toFixed(2)}`}
                      {p.cost != null && ` · Maliyet: ${Number(p.cost).toFixed(2)}`}
                      {p.price != null && p.cost != null && Number(p.price) > 0 && (
                        ` · Marj: %${Math.round(((Number(p.price) - Number(p.cost)) / Number(p.price)) * 100)}`
                      )}
                    </p>
                  </div>
                  <form action={transitionProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="to" value="TEST" />
                    <Button type="submit" size="sm" variant="outline">
                      Geri Al (Test)
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
