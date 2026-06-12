import { products, productIntelligence } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateIntelligence } from './actions';

export const dynamic = 'force-dynamic';

interface ScoreDim {
  salesPotential?: number;
  competition?: number;
  profitability?: number;
  adDifficulty?: number;
  returnRisk?: number;
  supplyRisk?: number;
  total?: number;
}
interface PIAds {
  primaryText?: string;
  headline?: string;
  description?: string;
}
interface PIAudience {
  primary?: string;
  secondary?: string;
  ageGroup?: string;
  interests?: string[];
}
interface PIUgc {
  brief?: string;
  scenario?: string;
  hooks?: string[];
  videoFlows?: string[];
}

const STATUS_VARIANT: Record<string, 'default' | 'warning' | 'secondary' | 'destructive' | 'success'> = {
  GENERATING: 'warning',
  READY: 'success',
  FAILED: 'destructive',
};

export default async function IntelligencePage() {
  const brand = await getActiveBrand();
  const [productList, piList] = await Promise.all([
    products.list(brand.id),
    productIntelligence.list(brand.id, 100),
  ]);
  const piByProduct = new Map(piList.map((pi) => [pi.productId, pi]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">🧠 Ürün Zekası Merkezi</h1>
        <p className="text-muted-foreground">
          Shopify'a eklenen/güncellenen her ürün için otomatik SEO, içerik, reklam metni, satış açıları,
          hedef kitle ve UGC brief'i üretir + <strong>Product Intelligence Score</strong> hesaplar.
        </p>
      </div>

      {productList.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Henüz ürün yok. Shopify'a ürün eklendiğinde (webhook) veya Shopify panelinden içe
            aktarıldığında burada görünür.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {productList.map((p) => {
            const pi = piByProduct.get(p.id);
            const score = (pi?.score ?? {}) as ScoreDim;
            const ads = (pi?.ads ?? {}) as PIAds;
            const audience = (pi?.audience ?? {}) as PIAudience;
            const ugc = (pi?.ugc ?? {}) as PIUgc;
            const salesAngles = (pi?.salesAngles ?? {}) as Record<string, string>;
            const keywords = (pi?.seoKeywords ?? []) as string[];

            return (
              <Card key={p.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {p.title}
                      <Badge variant={STATUS_VARIANT[pi?.status ?? ''] ?? 'secondary'}>
                        {pi?.status ?? 'YOK'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {p.shopifyId ? `Shopify: ${p.shopifyId}` : "Shopify'da yok"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    {pi?.scoreTotal != null && (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold">{pi.scoreTotal}</span>
                        <span className="text-[10px] uppercase text-muted-foreground">PI Score</span>
                      </div>
                    )}
                    <form action={generateIntelligence}>
                      <input type="hidden" name="productId" value={p.id} />
                      <Button type="submit" size="sm" variant="outline">
                        {pi ? 'Yeniden Üret' : 'Üret'}
                      </Button>
                    </form>
                  </div>
                </CardHeader>

                {pi?.status === 'GENERATING' && (
                  <CardContent className="text-sm text-muted-foreground">Üretiliyor…</CardContent>
                )}
                {pi?.status === 'FAILED' && (
                  <CardContent className="text-sm text-destructive">
                    Üretim başarısız — "Yeniden Üret" ile deneyin.
                  </CardContent>
                )}
                {pi?.status === 'READY' && (
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>satış potansiyeli {score.salesPotential ?? '-'}</span>
                      <span>· rekabet {score.competition ?? '-'}</span>
                      <span>· kârlılık {score.profitability ?? '-'}</span>
                      <span>· reklam zorluğu {score.adDifficulty ?? '-'}</span>
                      <span>· iade riski {score.returnRisk ?? '-'}</span>
                      <span>· tedarik riski {score.supplyRisk ?? '-'}</span>
                    </div>
                    {pi.aiRationale && <p className="text-xs text-muted-foreground">{pi.aiRationale}</p>}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">SEO</h4>
                        <p className="text-xs">
                          <strong>Başlık:</strong> {pi.seoTitle}
                        </p>
                        <p className="text-xs">
                          <strong>Açıklama:</strong> {pi.seoDescription}
                        </p>
                        <p className="text-xs">
                          <strong>Handle:</strong> {pi.handle}
                        </p>
                        <p className="text-xs">
                          <strong>Anahtar kelimeler:</strong> {keywords.join(', ')}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">İçerik</h4>
                        <p className="text-xs">
                          <strong>Kısa açıklama:</strong> {pi.shortDescription}
                        </p>
                        <p className="text-xs">
                          <strong>Hikaye:</strong> {pi.story}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Reklam (Meta)</h4>
                        <p className="text-xs">
                          <strong>Metin:</strong> {ads.primaryText}
                        </p>
                        <p className="text-xs">
                          <strong>Başlık:</strong> {ads.headline}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Satış Açıları</h4>
                        <ul className="space-y-0.5 text-xs">
                          {Object.entries(salesAngles).map(([k, v]) => (
                            <li key={k}>
                              <strong>{k}:</strong> {v}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">Hedef Kitle</h4>
                        <p className="text-xs">
                          <strong>Birincil:</strong> {audience.primary}
                        </p>
                        <p className="text-xs">
                          <strong>İkincil:</strong> {audience.secondary}
                        </p>
                        <p className="text-xs">
                          <strong>Yaş grubu:</strong> {audience.ageGroup}
                        </p>
                        <p className="text-xs">
                          <strong>İlgi alanları:</strong> {(audience.interests ?? []).join(', ')}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">UGC Brief</h4>
                        <p className="text-xs">
                          <strong>Brief:</strong> {ugc.brief}
                        </p>
                        <p className="text-xs">
                          <strong>Senaryo:</strong> {ugc.scenario}
                        </p>
                        <p className="text-xs">
                          <strong>Hook'lar:</strong> {(ugc.hooks ?? []).join(' / ')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
