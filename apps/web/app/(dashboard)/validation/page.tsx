import { opportunities } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { convertToDesign, validateOpportunityAction } from '../discovery/actions';

export const dynamic = 'force-dynamic';

interface ValSignals {
  talep?: number;
  rekabetTersi?: number;
  karlilik?: number;
  pazarBuyuklugu?: number;
  trend?: number;
  trendingNow?: boolean;
}

export default async function ValidationPage() {
  const brand = await getActiveBrand();
  const list = await opportunities.list(brand.id, { take: 60 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">✅ Satış Doğrulama Merkezi</h1>
        <p className="text-muted-foreground">
          "Bu gerçekten satar mı?" Sert kapı: <strong>Validation Score ≥ 60</strong> olmadan tasarım/mockup/ürün YOK.
        </p>
      </div>

      {list.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Doğrulanacak fırsat yok. Önce Ürün Keşif Merkezi'nde "Keşfet" yapın.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((o) => {
            const v = (o.validationSignals ?? {}) as ValSignals;
            const val = o.validationScore;
            const canDesign = (val ?? 0) >= 60;
            return (
              <Card key={o.id}>
                <CardContent className="flex flex-wrap items-center gap-4 p-4">
                  <div className="flex w-16 flex-col items-center">
                    <span className={`text-2xl font-bold ${canDesign ? 'text-green-600' : val != null ? 'text-red-600' : ''}`}>
                      {val ?? '—'}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground">validation</span>
                  </div>
                  <div className="min-w-[220px] flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{o.title}</span>
                      <Badge variant={o.status === 'VALIDATED' ? 'success' : o.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                        {o.status}
                      </Badge>
                    </div>
                    {val != null ? (
                      <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                        <span>talep {v.talep ?? '-'}</span>
                        <span>· rekabet-tersi {v.rekabetTersi ?? '-'}</span>
                        <span>· kâr {v.karlilik ?? '-'}</span>
                        <span>· pazar {v.pazarBuyuklugu ?? '-'}</span>
                        <span>· trend {v.trend ?? '-'}</span>
                        <span>· {v.trendingNow ? 'şu an trend ✓' : 'şu an trend değil'}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Henüz doğrulanmadı.</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <form action={validateOpportunityAction}>
                      <input type="hidden" name="id" value={o.id} />
                      <Button type="submit" size="sm" variant="outline" className="w-full">
                        {val == null ? 'Doğrula' : 'Yeniden Doğrula'}
                      </Button>
                    </form>
                    <form action={convertToDesign}>
                      <input type="hidden" name="id" value={o.id} />
                      <Button type="submit" size="sm" disabled={!canDesign} className="w-full">
                        Onayla → Tasarım
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
