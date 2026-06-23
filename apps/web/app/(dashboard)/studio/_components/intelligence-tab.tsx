import { adCampaigns, productConversions, products, productIntelligence } from '@velora/db';
import { evaluateProductDemand } from '@velora/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { backfillIntelligence, createCampaignDraft, generateIntelligence, requestUgcVideo } from '../actions';

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
interface PICampaignAdSet {
  name?: string;
  audience?: string;
  interests?: string[];
  dailyBudgetUSD?: number;
}
interface PICampaignPrep {
  campaignName?: string;
  adSets?: PICampaignAdSet[];
  hook?: string;
  primaryText?: string;
  headline?: string;
  description?: string;
}

const STATUS_VARIANT: Record<string, 'default' | 'warning' | 'secondary' | 'destructive' | 'success'> = {
  GENERATING: 'warning',
  READY: 'success',
  FAILED: 'destructive',
};

export async function IntelligenceTab({ brandId }: { brandId: string }) {
  const [productList, piList, draftCampaigns, conversionRows] = await Promise.all([
    products.list(brandId),
    productIntelligence.list(brandId, 100),
    adCampaigns.listDrafts(brandId),
    productConversions.listByBrand(brandId, 8),
  ]);
  const piByProduct = new Map(piList.map((pi) => [pi.productId, pi]));
  const draftByProduct = new Map<string, (typeof draftCampaigns)[number]>();
  for (const c of draftCampaigns) {
    if (c.productId && !draftByProduct.has(c.productId)) draftByProduct.set(c.productId, c);
  }
  // Ürün başına haftalık geçmiş (en yeniden eskiye, cap 6)
  const conversionByProduct = new Map<string, typeof conversionRows>();
  for (const row of conversionRows) {
    const existing = conversionByProduct.get(row.productId) ?? [];
    if (existing.length < 6) {
      existing.push(row);
      conversionByProduct.set(row.productId, existing);
    }
  }
  const missingCount = productList.filter((p) => {
    const pi = piByProduct.get(p.id);
    return !pi || pi.status === 'FAILED';
  }).length;

  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Shopify'a eklenen/güncellenen her ürün için otomatik SEO, içerik, reklam metni, satış
        açıları, hedef kitle ve UGC brief'i üretir + <strong>Product Intelligence Score</strong>{' '}
        hesaplar.
      </p>

      {missingCount > 0 && (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="text-sm text-muted-foreground">
              <strong>{missingCount}</strong> üründe Ürün Zekası eksik (SEO, içerik, reklam,
              hedef kitle, UGC, skor).
            </p>
            <form action={backfillIntelligence}>
              <Button type="submit" size="sm">
                🧠 Eksiklerin Tümü İçin Üret ({missingCount})
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {productList.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Henüz ürün yok. Shopify'a ürün eklendiğinde (webhook) veya Operasyon Müdürü'nden içe
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
            const campaignPrep = (pi?.campaignPrep ?? {}) as PICampaignPrep;
            const draft = draftByProduct.get(p.id);
            const salesAngles = (pi?.salesAngles ?? {}) as Record<string, string>;
            const keywords = (pi?.seoKeywords ?? []) as string[];
            const demand =
              pi?.demandScore != null
                ? evaluateProductDemand({
                    score: pi.demandScore,
                    previousScore: pi.previousDemandScore ?? undefined,
                  })
                : null;

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
                    {pi?.demandScore != null && (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold">
                          {pi.demandScore}
                          {demand?.level === 'RISING' && ' 📈'}
                          {demand?.level === 'DECLINING' && ' 📉'}
                        </span>
                        <span className="text-[10px] uppercase text-muted-foreground">Talep Skoru</span>
                      </div>
                    )}
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
                        {(ugc.hooks ?? []).length > 0 && (
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium">Hook'lar:</p>
                            <ul className="space-y-1.5">
                              {(ugc.hooks ?? []).map((hook, i) => (
                                <li key={i} className="space-y-1 rounded-md border p-1.5">
                                  <p className="text-xs">{hook}</p>
                                  <form action={requestUgcVideo} className="flex items-center gap-1.5">
                                    <input type="hidden" name="productId" value={p.id} />
                                    <input type="hidden" name="hookIndex" value={i} />
                                    <select
                                      name="type"
                                      defaultValue="UGC"
                                      className="h-7 rounded-md border border-input bg-background px-1.5 text-xs"
                                    >
                                      <option value="UGC">UGC</option>
                                      <option value="TIKTOK">TikTok</option>
                                      <option value="REEL">Reel</option>
                                      <option value="STORY">Story</option>
                                    </select>
                                    <Button type="submit" size="sm" variant="outline" className="h-7 px-2 text-xs">
                                      🎬 Video Üret
                                    </Button>
                                  </form>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {campaignPrep.campaignName && (
                      <div className="space-y-2 border-t pt-3">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                          📣 Kampanya Hazırlık Paketi (Meta)
                        </h4>
                        <p className="text-xs">
                          <strong>Kampanya Adı:</strong> {campaignPrep.campaignName}
                        </p>
                        <p className="text-xs">
                          <strong>Hook:</strong> {campaignPrep.hook}
                        </p>
                        <p className="text-xs">
                          <strong>Primary Text:</strong> {campaignPrep.primaryText}
                        </p>
                        <p className="text-xs">
                          <strong>Headline:</strong> {campaignPrep.headline}
                        </p>
                        <p className="text-xs">
                          <strong>Description:</strong> {campaignPrep.description}
                        </p>
                        {(campaignPrep.adSets ?? []).length > 0 && (
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {(campaignPrep.adSets ?? []).map((set, i) => (
                              <div key={i} className="space-y-1 rounded-md border p-2 text-xs">
                                <p className="font-medium">{set.name}</p>
                                <p>
                                  <strong>Hedef Kitle:</strong> {set.audience}
                                </p>
                                <p>
                                  <strong>İlgi Alanları:</strong> {(set.interests ?? []).join(', ')}
                                </p>
                                <p>
                                  <strong>Bütçe:</strong> ${set.dailyBudgetUSD}/gün
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {draft ? (
                            <>
                              <Badge variant="secondary">
                                Taslak oluşturuldu: {draft.name} ({draft.status})
                              </Badge>
                              {draft.adsets.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {draft.adsets.length} ad set · Meta Ads Manager&apos;da PAUSED
                                </span>
                              )}
                            </>
                          ) : (
                            <form action={createCampaignDraft}>
                              <input type="hidden" name="productId" value={p.id} />
                              <Button type="submit" size="sm" variant="outline">
                                📤 Meta&apos;da Taslak Oluştur
                              </Button>
                            </form>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Haftalık Talep Geçmişi (Faz E Sprint 6) */}
                    {(() => {
                      const hist = conversionByProduct.get(p.id);
                      if (!hist || hist.length === 0) return null;
                      return (
                        <div className="space-y-1 border-t pt-3">
                          <span className="text-xs font-medium text-muted-foreground">
                            📈 Haftalık Talep Geçmişi
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {hist.map((h) => (
                              <div
                                key={h.id}
                                className="rounded border px-2 py-1 text-xs"
                                title={`Görüntülenme: ${h.pageViews} · Sepet: ${h.cartAdds} · İstek: ${h.wishlistAdds}`}
                              >
                                <span className="font-mono text-muted-foreground">{h.week}</span>
                                {h.behaviorScore != null && (
                                  <span className="ml-2 font-semibold">
                                    {h.behaviorScore}
                                    <span className="text-muted-foreground">/100</span>
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
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
