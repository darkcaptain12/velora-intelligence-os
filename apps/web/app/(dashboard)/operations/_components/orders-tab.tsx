import { orders } from '@velora/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const STATUS_VARIANT: Record<string, 'secondary' | 'warning' | 'success' | 'destructive' | 'default'> = {
  paid: 'success',
  pending: 'warning',
  refunded: 'destructive',
  partially_refunded: 'warning',
  voided: 'destructive',
  authorized: 'secondary',
};

const STATUS_LABEL: Record<string, string> = {
  paid: 'Ödendi',
  pending: 'Beklemede',
  refunded: 'İade edildi',
  partially_refunded: 'Kısmi iade',
  voided: 'İptal',
  authorized: 'Onaylandı',
};

export async function OrdersTab({ brandId }: { brandId: string }) {
  const list = await orders.list(brandId);
  const totalRevenue = list.reduce((sum, o) => sum + Number(o.total), 0);
  const currency = list[0]?.currency ?? 'TRY';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Siparişler</CardTitle>
          <CardDescription>
            Shopify webhook ile senkronlanan son {list.length} sipariş
            {list.length > 0 && ` · toplam ${totalRevenue.toFixed(2)} ${currency}`}
          </CardDescription>
        </CardHeader>
      </Card>

      {list.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Henüz sipariş yok. Shopify webhook&apos;u kurulduktan sonra siparişler burada görünecek.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((o) => (
            <Card key={o.id}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg font-semibold">
                    {Number(o.total).toFixed(2)} {o.currency}
                  </span>
                  <Badge variant={o.financialStatus ? STATUS_VARIANT[o.financialStatus] ?? 'secondary' : 'secondary'}>
                    {o.financialStatus ? STATUS_LABEL[o.financialStatus] ?? o.financialStatus : 'bilinmiyor'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{o.createdAt.toLocaleString('tr-TR')}</p>
                <p className="truncate text-xs font-mono text-muted-foreground">{o.shopifyId}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
