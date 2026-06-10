import { adCampaigns, adMetrics, settings, spendLimits } from '@velora/db';
import { evaluateSpendLimits } from '@velora/core';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { runGuardian, setBudget, setCampaignState, syncAds } from './actions';

export const dynamic = 'force-dynamic';

const PERIOD_LABEL: Record<string, string> = { DAILY: 'Günlük', WEEKLY: 'Haftalık', MONTHLY: 'Aylık' };

export default async function AdsPage() {
  const brand = await getActiveBrand();
  const [campaigns, metrics, limits, spend, autoMode, level] = await Promise.all([
    adCampaigns.list(brand.id),
    adMetrics.latest(brand.id, 20),
    spendLimits.list(brand.id),
    adMetrics.spendByPeriod(brand.id),
    settings.get<boolean>(brand.id, 'ads.autoMode', false),
    settings.get<number>(brand.id, 'autonomy.level', 1),
  ]);

  const violations = evaluateSpendLimits(
    spend,
    limits.map((l) => ({ period: l.period, amount: Number(l.amount) })),
  );
  const violatedPeriods = new Set(violations.map((v) => v.period));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meta Reklam Merkezi</h1>
          <p className="text-muted-foreground">
            Kampanya yönetimi, performans (ROAS/CPA/CPC/CTR) ve acil durum koruması.
            {autoMode && level >= 3 ? ' · Otomatik mod AKTİF' : ' · Manuel mod'}
          </p>
        </div>
        <div className="flex gap-2">
          <form action={syncAds}>
            <Button type="submit" variant="outline" size="sm">Senkronize Et</Button>
          </form>
          <form action={runGuardian}>
            <Button type="submit" variant="outline" size="sm">Koruma Kontrolü</Button>
          </form>
        </div>
      </div>

      {/* Acil Durum Koruması */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acil Durum Koruması</CardTitle>
          <CardDescription>
            Harcama limitleri (Ayarlar'dan düzenlenir). Aşımda kampanyalar otomatik duraklatılır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {limits.map((l) => {
              const spent = spend[l.period as keyof typeof spend] ?? 0;
              const over = violatedPeriods.has(l.period);
              return (
                <div key={l.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{PERIOD_LABEL[l.period]}</span>
                    <Badge variant={over ? 'destructive' : 'success'}>
                      {over ? 'AŞILDI' : 'Güvenli'}
                    </Badge>
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {spent.toFixed(2)} / {Number(l.amount).toFixed(2)} {brand.currency}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Kampanyalar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kampanyalar</CardTitle>
          <CardDescription>Manuel mod: aç / durdur / bütçe. "Senkronize Et" ile Meta'dan çekilir.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {campaigns.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              Kampanya yok. Meta anahtarını ayarlayıp "Senkronize Et"e basın.
            </p>
          ) : (
            <div className="divide-y">
              {campaigns.map((c) => (
                <div key={c.id} className="flex flex-wrap items-center gap-3 p-4">
                  <div className="flex-1" style={{ minWidth: 200 }}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.name}</span>
                      <Badge variant={c.status === 'ACTIVE' ? 'success' : 'secondary'}>{c.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.objective}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {c.status === 'ACTIVE' ? (
                      <form action={setCampaignState}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="status" value="PAUSED" />
                        <Button type="submit" size="sm" variant="outline">Durdur</Button>
                      </form>
                    ) : (
                      <form action={setCampaignState}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="status" value="ACTIVE" />
                        <Button type="submit" size="sm" variant="outline">Aç</Button>
                      </form>
                    )}
                    <form action={setBudget} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={c.id} />
                      <Input
                        name="budget"
                        type="number"
                        min="1"
                        step="1"
                        defaultValue={c.dailyBudget ? Number(c.dailyBudget).toString() : ''}
                        placeholder="Bütçe"
                        className="h-9 w-24"
                      />
                      <Button type="submit" size="sm" variant="outline">Kaydet</Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performans (Son Metrikler)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {metrics.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Henüz metrik yok.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 font-medium">Tarih</th>
                    <th className="px-4 py-2 font-medium">Harcama</th>
                    <th className="px-4 py-2 font-medium">ROAS</th>
                    <th className="px-4 py-2 font-medium">CPA</th>
                    <th className="px-4 py-2 font-medium">CPC</th>
                    <th className="px-4 py-2 font-medium">CTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {metrics.map((m) => (
                    <tr key={m.id}>
                      <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                        {m.date.toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-2">{Number(m.spend).toFixed(2)}</td>
                      <td className="px-4 py-2">{m.roas?.toFixed(2) ?? '-'}</td>
                      <td className="px-4 py-2">{m.cpa?.toFixed(2) ?? '-'}</td>
                      <td className="px-4 py-2">{m.cpc?.toFixed(2) ?? '-'}</td>
                      <td className="px-4 py-2">{m.ctr?.toFixed(2) ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
