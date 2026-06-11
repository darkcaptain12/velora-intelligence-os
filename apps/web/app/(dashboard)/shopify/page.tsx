import { prisma, products as productSvc, type LifecycleStatus } from '@velora/db';
import { LIFECYCLE_LABELS, nextStates } from '@velora/core';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  addManualProduct,
  importFromShopify,
  publishDesign,
  publishToActive,
  runHealthCheck,
  transitionProduct,
} from './actions';

export const dynamic = 'force-dynamic';

const LIFECYCLE_VARIANT: Record<LifecycleStatus, 'secondary' | 'warning' | 'success' | 'destructive' | 'default'> = {
  NEW: 'secondary',
  TEST: 'warning',
  WINNER: 'success',
  SCALING: 'default',
  DECLINING: 'warning',
  CLOSED: 'destructive',
};

export default async function ShopifyPage() {
  const brand = await getActiveBrand();
  const [designs, products, health] = await Promise.all([
    prisma.design.findMany({
      where: { brandId: brand.id, status: { in: ['READY', 'PUBLISHED'] } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    productSvc.list(brand.id),
    prisma.shopifyHealthCheck.findMany({
      where: { brandId: brand.id },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shopify Yönetim Merkezi</h1>
          <p className="text-muted-foreground">
            Tasarımdan otomatik ürün sayfasıyla yayınla, mağazadan içe aktar, yaşam döngüsünü yönet.
          </p>
        </div>
        <form action={importFromShopify}>
          <Button type="submit" variant="outline" size="sm">Shopify'dan İçe Aktar</Button>
        </form>
      </div>

      {/* Manuel ürün ekleme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manuel Ürün Ekle</CardTitle>
          <CardDescription>Kendi ürününü sisteme ekle (Shopify'a göndermeden).</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addManualProduct} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 space-y-1" style={{ minWidth: 200 }}>
              <Label htmlFor="m-title">Başlık</Label>
              <Input id="m-title" name="title" required />
            </div>
            <div className="w-28 space-y-1">
              <Label htmlFor="m-price">Fiyat</Label>
              <Input id="m-price" name="price" type="number" min="0" step="0.01" />
            </div>
            <div className="w-28 space-y-1">
              <Label htmlFor="m-cost">Maliyet</Label>
              <Input id="m-cost" name="cost" type="number" min="0" step="0.01" />
            </div>
            <Button type="submit" variant="outline">Ekle</Button>
          </form>
        </CardContent>
      </Card>

      {/* Yayınlanabilir tasarımlar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Yayınlanabilir Tasarımlar</CardTitle>
          <CardDescription>
            Hazır/onaylı tasarımdan ürün oluştur — AI otomatik ürün sayfası (açıklama+SEO+FAQ) üretir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {designs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Hazır tasarım yok (Tasarım Fabrikası'nda üret).</p>
          ) : (
            designs.map((d) => (
              <form
                key={d.id}
                action={publishDesign}
                className="flex flex-wrap items-end gap-3 border-b pb-4 last:border-0 last:pb-0"
              >
                <input type="hidden" name="designId" value={d.id} />
                {d.pngUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.pngUrl} alt={d.prompt} className="h-14 w-14 rounded border object-cover" />
                )}
                <div className="flex-1 space-y-1" style={{ minWidth: 200 }}>
                  <Label htmlFor={`title-${d.id}`}>Ürün Başlığı</Label>
                  <Input id={`title-${d.id}`} name="title" defaultValue={d.prompt.slice(0, 60)} required />
                </div>
                <div className="w-28 space-y-1">
                  <Label htmlFor={`price-${d.id}`}>Fiyat</Label>
                  <Input id={`price-${d.id}`} name="price" type="number" min="0" step="0.01" placeholder="299" />
                </div>
                <Button type="submit">Yayınla</Button>
              </form>
            ))
          )}
        </CardContent>
      </Card>

      {/* Ürünler + yaşam döngüsü */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ürünler & Yaşam Döngüsü</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Henüz ürün yok.</p>
          ) : (
            <div className="divide-y">
              {products.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-3 p-4">
                  <div className="flex-1" style={{ minWidth: 220 }}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{p.title}</span>
                      <Badge variant={LIFECYCLE_VARIANT[p.status]}>{LIFECYCLE_LABELS[p.status]}</Badge>
                      {p.shopifyId ? (
                        <Badge variant="success">Shopify'da</Badge>
                      ) : (
                        <Badge variant="secondary">yayınlanmadı</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.shopifyId && (
                      <form action={publishToActive}>
                        <input type="hidden" name="id" value={p.id} />
                        <Button type="submit" size="sm">Satışa Aç</Button>
                      </form>
                    )}
                    {nextStates(p.status).map((to) => (
                      <form key={to} action={transitionProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="to" value={to} />
                        <Button type="submit" size="sm" variant="outline">
                          {LIFECYCLE_LABELS[to]}
                        </Button>
                      </form>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sağlık kontrolü */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Shopify Sağlık Kontrolü</CardTitle>
            <CardDescription>SEO ve görsel eksikliklerini tarar.</CardDescription>
          </div>
          <form action={runHealthCheck}>
            <Button type="submit" variant="outline" size="sm">
              Kontrolü Çalıştır
            </Button>
          </form>
        </CardHeader>
        <CardContent className="space-y-2">
          {health.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz kontrol yok.</p>
          ) : (
            health.map((h) => (
              <div key={h.id} className="flex items-center justify-between text-sm">
                <span>
                  {h.type} · {h.createdAt.toLocaleString('tr-TR')}
                </span>
                <Badge variant={h.passed ? 'success' : 'warning'}>
                  {h.passed ? 'Geçti' : 'Eksik var'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
