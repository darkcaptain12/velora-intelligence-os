import { opportunities } from '@velora/db';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { convertToDesign, runDiscovery, validateOpportunityAction } from '../actions';

const KIND_LABEL: Record<string, string> = { TREND: 'Trend', PROBLEM: 'Problem', EVENT: 'Özel Gün' };
const KIND_VARIANT: Record<string, 'default' | 'warning' | 'secondary'> = {
  TREND: 'default',
  PROBLEM: 'warning',
  EVENT: 'secondary',
};

interface Dim {
  talep?: number;
  rekabet?: number;
  karlilik?: number;
  uretilebilirlik?: number;
  trend?: number;
  pazarBuyuklugu?: number;
  total?: number;
}

interface ValSignals {
  talep?: number;
  rekabetTersi?: number;
  karlilik?: number;
  pazarBuyuklugu?: number;
  trend?: number;
  trendingNow?: boolean;
}

export async function OpportunitiesTab({ brandId }: { brandId: string }) {
  const list = await opportunities.list(brandId, { take: 60 });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Satacak ürün bulma + satış doğrulama motoru. Fırsatlar <strong>Priority Score</strong>'a
          göre sıralı (Opportunity + Validation + Seasonality). Sert kapı:{' '}
          <strong>Validation Score ≥ 60</strong> olmadan tasarım YOK.
        </p>
        <form action={runDiscovery}>
          <Button type="submit">Keşfet</Button>
        </form>
      </div>

      {list.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Henüz fırsat yok. "Keşfet"e bas — Google Trends, yaklaşan özel günler ve Şikayetvar'dan
            fırsatlar üretilir, skorlanır ve buraya sıralı düşer.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((o) => {
            const s = (o.opportunityScore ?? {}) as Dim;
            const v = (o.validationSignals ?? {}) as ValSignals;
            const val = o.validationScore;
            const canDesign = (val ?? 0) >= 60;
            return (
              <Card key={o.id}>
                <CardContent className="flex flex-wrap items-center gap-4 p-4">
                  <div className="flex w-16 flex-col items-center">
                    <span className="text-2xl font-bold">{o.priorityScore ?? '–'}</span>
                    <span className="text-[10px] uppercase text-muted-foreground">priority</span>
                  </div>
                  <div className="min-w-[220px] flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{o.title}</span>
                      <Badge variant={KIND_VARIANT[o.kind] ?? 'secondary'}>{KIND_LABEL[o.kind] ?? o.kind}</Badge>
                      <Badge variant={o.status === 'VALIDATED' ? 'success' : o.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                        {o.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span>fırsat {s.total ?? '-'}</span>
                      <span>· talep {s.talep ?? '-'}</span>
                      <span>· rekabet {s.rekabet ?? '-'}</span>
                      <span>· kâr {s.karlilik ?? '-'}</span>
                      <span>· pazar {s.pazarBuyuklugu ?? '-'}</span>
                      <span>· trend {s.trend ?? '-'}</span>
                      <span>· sezon {o.seasonalityScore ?? '-'}</span>
                    </div>
                    {val != null && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                        <span className={`font-semibold ${canDesign ? 'text-green-600' : 'text-red-600'}`}>
                          doğrulama {val}
                        </span>
                        <span className="text-muted-foreground">talep {v.talep ?? '-'}</span>
                        <span className="text-muted-foreground">· rekabet-tersi {v.rekabetTersi ?? '-'}</span>
                        <span className="text-muted-foreground">· kâr {v.karlilik ?? '-'}</span>
                        <span className="text-muted-foreground">· pazar {v.pazarBuyuklugu ?? '-'}</span>
                        <span className="text-muted-foreground">· trend {v.trend ?? '-'}</span>
                        <span className="text-muted-foreground">
                          · {v.trendingNow ? 'şu an trend ✓' : 'şu an trend değil'}
                        </span>
                      </div>
                    )}
                    {o.aiRationale && <p className="text-xs text-muted-foreground">{o.aiRationale}</p>}
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
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!canDesign}
                        className="w-full"
                        title={canDesign ? '' : 'Validation ≥ 60 gerekli'}
                      >
                        Tasarıma Dönüştür
                      </Button>
                    </form>
                    {!canDesign && (
                      <span className="text-center text-[10px] text-muted-foreground">
                        {val == null ? 'önce doğrula' : 'skor < 60'}
                      </span>
                    )}
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
