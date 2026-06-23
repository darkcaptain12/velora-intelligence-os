import { dailyBriefs, decisions, prisma } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { applyDecision, dismissDecision, generateReport } from './actions';

export const dynamic = 'force-dynamic';

/** Stratejik sinyal satırları (🎯 fırsat, 📅 etkinlik, 🧠 ürün zekası) bu önekle başlar. */
const HIGHLIGHT_PREFIXES = ['🎯', '📅', '🧠'];

/** AIDecision.action → kısa Türkçe rozet etiketi. */
const DECISION_LABELS: Record<string, string> = {
  CONVERT_OPPORTUNITY: 'Fırsatı Tasarıma Dönüştür',
  GENERATE_INTELLIGENCE: 'Ürün Zekası Üret',
  PREP_EVENT_DESIGN: 'Etkinlik Hazırlığı',
  ADJUST_AD_BUDGET: 'Reklam Bütçesi',
  PAUSE_CAMPAIGN: 'Kampanyayı Durdur',
  CONTACT_SUPPLIER: 'Tedarikçi İletişimi',
  EXIT_NICHE: 'Nişten Çık',
  APPLY_SUPPLIER_COST: 'Tedarikçi Maliyetini Uygula',
  CREATE_AD_DRAFT: 'Meta Taslak Kampanya Oluştur',
  GENERIC: 'Genel Görev',
};

export default async function CeoPage() {
  const brand = await getActiveBrand();
  const reports = await prisma.aIReport.findMany({
    where: { brandId: brand.id, type: { in: ['CEO', 'WEEKLY'] } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  const pendingDecisions = await decisions.list(brand.id, 'PENDING');
  const latestBriefs = await dailyBriefs.latest(brand.id, 1);
  const brief = latestBriefs[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI CEO</h1>
          <p className="text-muted-foreground">Günlük brifing + haftalık sentez raporu. Risk analizi ve stratejik kararlar.</p>
        </div>
        <form action={generateReport}>
          <Button type="submit" variant="outline" size="sm">Rapor Üret & Gönder</Button>
        </form>
      </div>

      {/* ── Günlük Brifing (AI CEO 2.0) ─────────────────────────── */}
      {brief && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">🛡️ Günlük Brifing</CardTitle>
            <CardDescription>
              {brief.date.toLocaleDateString('tr-TR')} · Risk: {brief.riskScore}/100 ({brief.riskLevel})
              {brief.confidence != null && ` · Güven: ${brief.confidence}%`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {brief.narrative && (
              <div className="rounded-lg bg-violet-50 p-4 dark:bg-violet-950">
                <p className="text-sm whitespace-pre-line">{brief.narrative}</p>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {brief.topOpportunity && (
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">🎯 En İyi Fırsat</p>
                  <p className="text-sm font-medium">{brief.topOpportunity}</p>
                </div>
              )}
              {brief.topRisk && (
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">⚠️ En Büyük Risk</p>
                  <p className="text-sm font-medium">{brief.topRisk}</p>
                </div>
              )}
            </div>
            {Array.isArray(brief.todayTasks) && (brief.todayTasks as string[]).length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Bugün Yapılacaklar:</p>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  {(brief.todayTasks as string[]).map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">🧭 Kararlar</CardTitle>
          <CardDescription>
            AI CEO'nun haftalık sentezden ürettiği aksiyon önerileri — "Uygula" mevcut akışı tetikler, "Reddet" kararı kapatır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingDecisions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bekleyen karar yok.</p>
          ) : (
            <div className="space-y-3">
              {pendingDecisions.map((d) => (
                <div key={d.id} className="space-y-2 rounded-md border p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{d.title}</p>
                      <p className="text-sm text-muted-foreground">{d.rationale}</p>
                      {(d.confidence != null || d.expectedImpact || d.riskLevel) && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {d.confidence != null && (
                            <Badge variant="outline" className="text-xs">
                              🎯 Güven: {d.confidence}%
                            </Badge>
                          )}
                          {d.expectedImpact && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                d.expectedImpact === 'HIGH'
                                  ? 'text-green-600'
                                  : d.expectedImpact === 'MEDIUM'
                                    ? 'text-yellow-600'
                                    : 'text-muted-foreground'
                              }`}
                            >
                              📈 Etki: {d.expectedImpact}
                            </Badge>
                          )}
                          {d.riskLevel && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                d.riskLevel === 'HIGH'
                                  ? 'text-red-600'
                                  : d.riskLevel === 'MEDIUM'
                                    ? 'text-yellow-600'
                                    : 'text-green-600'
                              }`}
                            >
                              ⚠️ Risk: {d.riskLevel}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <Badge variant="secondary">{DECISION_LABELS[d.action] ?? d.action}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <form action={applyDecision}>
                      <input type="hidden" name="id" value={d.id} />
                      <Button type="submit" size="sm">Uygula</Button>
                    </form>
                    <form action={dismissDecision}>
                      <input type="hidden" name="id" value={d.id} />
                      <Button type="submit" size="sm" variant="outline">Reddet</Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {reports.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz rapor yok — "Rapor Üret & Gönder"e basın.</p>
      ) : (
        reports.map((r) => {
          const insights = Array.isArray(r.insights) ? (r.insights as string[]) : [];
          const highlights = insights.filter((i) => HIGHLIGHT_PREFIXES.some((p) => i.startsWith(p)));
          const metrics = insights.filter((i) => !HIGHLIGHT_PREFIXES.some((p) => i.startsWith(p)));
          const recs = Array.isArray(r.recommendations) ? (r.recommendations as string[]) : [];
          return (
            <Card key={r.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Haftalık Rapor · {r.period}</CardTitle>
                  <Badge variant="secondary">{r.type}</Badge>
                </div>
                <CardDescription>{r.createdAt.toLocaleString('tr-TR')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="whitespace-pre-wrap">{r.summary}</p>
                {highlights.length > 0 && (
                  <div className="space-y-1 rounded-md bg-violet-50 p-3 dark:bg-violet-950/30">
                    <p className="font-medium">🚀 Stratejik Sinyaller</p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {highlights.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {metrics.length > 0 && (
                  <div>
                    <p className="font-medium">Özet Metrikler</p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {metrics.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recs.length > 0 && (
                  <div>
                    <p className="font-medium">Öneriler</p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {recs.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
