import { settings } from '@velora/db';
import { listPrintifyOrders, type PrintifyOrderSummary } from '@velora/integrations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const STATUS_VARIANT: Record<string, 'secondary' | 'warning' | 'success' | 'destructive' | 'default'> = {
  pending: 'secondary',
  'on-hold': 'warning',
  'in-production': 'warning',
  fulfilled: 'success',
  'partially-fulfilled': 'warning',
  canceled: 'destructive',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Beklemede',
  'on-hold': 'Beklemede (tutuldu)',
  'in-production': 'Üretimde',
  fulfilled: 'Kargolandı',
  'partially-fulfilled': 'Kısmi kargolandı',
  canceled: 'İptal',
};

export async function ShippingTab({ brandId }: { brandId: string }) {
  const shopId = await settings.get<number>(brandId, 'printify.shopId', 0);

  if (!shopId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kargo & Üretim Takibi</CardTitle>
          <CardDescription>Printify henüz yapılandırılmamış.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ayarlar&apos;dan Printify token&apos;ını kaydedip &quot;Bağlantıyı Getir&quot;e
            bastığında, ürünlerinin üretim ve kargo durumu burada görünecek.
          </p>
        </CardContent>
      </Card>
    );
  }

  let list: PrintifyOrderSummary[] = [];
  let error: string | null = null;
  try {
    list = await listPrintifyOrders(brandId, shopId);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Printify siparişleri alınamadı.';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Kargo & Üretim Takibi</CardTitle>
        <CardDescription>Printify&apos;daki sipariş üretim/kargo durumları.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {error ? (
          <p className="p-6 text-sm text-muted-foreground">{error}</p>
        ) : list.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Henüz Printify siparişi yok.</p>
        ) : (
          <div className="divide-y">
            {list.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="flex-1" style={{ minWidth: 200 }}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">
                      {o.lineItems.map((li) => `${li.title} ×${li.quantity}`).join(', ') || 'Sipariş'}
                    </span>
                    <Badge variant={STATUS_VARIANT[o.status] ?? 'secondary'}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString('tr-TR')} · {o.totalPrice.toFixed(2)}
                  </p>
                </div>
                {o.trackingNumber && (
                  <div className="text-right text-xs">
                    <p className="font-mono">{o.trackingNumber}</p>
                    {o.trackingUrl && (
                      <a href={o.trackingUrl} target="_blank" rel="noreferrer" className="underline">
                        Takip et →
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
