import Link from 'next/link';
import { audit, dailyBriefs, events, finance, operationScores, opportunities, prisma, settings, tasks } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JarvisTab } from './_components/jarvis-tab';

export const dynamic = 'force-dynamic';

const AUTONOMY_LABEL: Record<number, string> = {
  1: 'L1 — Öner',
  2: 'L2 — Yap & Raporla',
  3: 'L3 — Tam Otomatik',
};

const CATEGORY_LABEL: Record<string, string> = {
  SPOR: 'Spor',
  ALISVERIS: 'Alışveriş',
  KUTLAMA: 'Kutlama',
  MEVSIM: 'Mevsim',
};

interface EventScoreDim {
  total?: number;
}

export default async function DashboardPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const brand = await getActiveBrand();
  const [
    taskCounts,
    level,
    recentTasks,
    recentAudit,
    topOpps,
    upcomingEvents,
    latestSnaps,
    opScore,
    readyDesigns,
    readyVideos,
    validatedOpps,
    approvalTasks,
    briefResults,
  ] = await Promise.all([
    tasks.counts(brand.id),                                                                     // 0
    settings.get<number>(brand.id, 'autonomy.level', 1),                                        // 1
    tasks.list(brand.id, 'OPEN'),                                                               // 2
    audit.recent(brand.id, 6),                                                                  // 3
    opportunities.top(brand.id, 5),                                                             // 4
    events.upcoming(brand.id, 5),                                                               // 5
    finance.latest(brand.id, 1),                                                                // 6
    operationScores.latest(brand.id),                                                           // 7
    prisma.design.count({ where: { brandId: brand.id, status: 'READY' } }),                     // 8
    prisma.video.count({ where: { brandId: brand.id, status: 'READY' } }),                      // 9
    opportunities.list(brand.id, { status: 'VALIDATED' }),                                      // 10
    prisma.task.findMany({                                                                      // 11
      where: { brandId: brand.id, status: 'OPEN', type: { in: ['APPROVE_DESIGN', 'APPROVE_AD'] } },
    }),
    dailyBriefs.latest(brand.id, 1),                                                           // 12
  ]);

  const latestSnap = latestSnaps[0];
  const latestBrief = (briefResults as Awaited<ReturnType<typeof dailyBriefs.latest>>)[0];
  const num = (v: unknown) => Number(v ?? 0);
  const c = brand.currency;

  const approvalItems: { label: string; href: string }[] = [];
  if (readyDesigns > 0) {
    approvalItems.push({ label: `${readyDesigns} tasarım onay bekliyor`, href: '/studio?tab=tasarimlar' });
  }
  if (readyVideos > 0) {
    approvalItems.push({ label: `${readyVideos} video onay bekliyor`, href: '/studio?tab=videolar' });
  }
  if (validatedOpps.length > 0) {
    approvalItems.push({
      label: `${validatedOpps.length} fırsat tasarıma dönüştürülmeye hazır`,
      href: '/hunter?tab=firsatlar',
    });
  }
  for (const t of approvalTasks) {
    approvalItems.push({ label: t.title, href: '/tasks' });
  }

  const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );

  const tab = (typeof searchParams === 'object' && searchParams !== null && 'tab' in searchParams
    ? String((searchParams as Record<string, string>).tab)
    : null) ?? 'ozet';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Komuta Merkezi</h1>
        <p className="text-muted-foreground">Aktif marka: {brand.name}</p>
      </div>

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="ozet">📊 Özet</TabsTrigger>
          <TabsTrigger value="jarvis">⚡ Jarvis</TabsTrigger>
        </TabsList>

        <TabsContent value="jarvis" className="mt-4">
          <JarvisTab />
        </TabsContent>

        <TabsContent value="ozet" className="mt-4">
      <div className="space-y-8">

      <Card>
        <CardHeader>
          <CardTitle className="text-base">📊 Günün Özeti</CardTitle>
          <CardDescription>
            {latestSnap
              ? `Son anlık görüntü: ${latestSnap.date.toLocaleDateString('tr-TR')}`
              : 'Henüz finans verisi yok.'}
            {' · '}
            <Link href="/finance" className="underline">
              Finans Müdürü&apos;ne git
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Ciro" value={latestSnap ? `${num(latestSnap.revenue).toFixed(0)} ${c}` : '—'} />
            <Stat label="Net Kâr" value={latestSnap ? `${num(latestSnap.netProfit).toFixed(0)} ${c}` : '—'} />
            <Stat label="Sipariş" value={latestSnap ? `${latestSnap.orders}` : '—'} />
            <Stat label="Operasyon Skoru" value={opScore ? `${opScore.overall.toFixed(0)} / 100` : '—'} />
          </div>
        </CardContent>
      </Card>

      {/* ── Risk & Daily Brief ─────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🛡️ Risk Durumu</CardTitle>
          <CardDescription>
            {latestBrief
              ? `Son brifing: ${latestBrief.date.toLocaleDateString('tr-TR')}`
              : 'Henüz günlük brifing yok — "Jarvis günlük brifing" komutu ile oluştur.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {latestBrief ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">
                  {latestBrief.riskScore}
                </span>
                <span className="text-sm text-muted-foreground">/ 100</span>
                <Badge variant={
                  latestBrief.riskLevel === 'CRITICAL' ? 'destructive' :
                  latestBrief.riskLevel === 'HIGH' ? 'destructive' :
                  latestBrief.riskLevel === 'MEDIUM' ? 'secondary' : 'outline'
                }>
                  {latestBrief.riskLevel}
                </Badge>
              </div>
              {latestBrief.topRisk && (
                <p className="text-sm text-muted-foreground">⚠️ {latestBrief.topRisk}</p>
              )}
              {latestBrief.topOpportunity && (
                <p className="text-sm text-muted-foreground">🎯 {latestBrief.topOpportunity}</p>
              )}
              {Array.isArray(latestBrief.todayTasks) && (latestBrief.todayTasks as string[]).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Bugünün Görevleri:</p>
                  <ul className="text-sm space-y-1">
                    {(latestBrief.todayTasks as string[]).map((t, i) => (
                      <li key={i}>• {t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Risk verisi yok.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">✅ Bekleyen Onaylar</CardTitle>
          <CardDescription>Aksiyon bekleyen her şey tek listede.</CardDescription>
        </CardHeader>
        <CardContent>
          {approvalItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bekleyen onay yok ✓</p>
          ) : (
            <ul className="space-y-2">
              {approvalItems.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-2 text-sm">
                  <span>{item.label}</span>
                  <Link href={item.href} className="text-xs underline">
                    İncele →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Açık Görevler</CardDescription>
            <CardTitle className="text-3xl">{taskCounts.open}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Devam Eden</CardDescription>
            <CardTitle className="text-3xl">{taskCounts.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam Görev</CardDescription>
            <CardTitle className="text-3xl">{taskCounts.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Otonomi</CardDescription>
            <CardTitle className="text-lg">{AUTONOMY_LABEL[level] ?? `L${level}`}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">🎯 Bu Haftanın En İyi Fırsatları</CardTitle>
          <CardDescription>
            Priority Score'a göre sıralı ·{' '}
            <Link href="/hunter?tab=firsatlar" className="underline">
              Ürün Avcısı'na git
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topOpps.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Henüz fırsat yok. Ürün Keşif Merkezi'nde "Keşfet"e basın.
            </p>
          ) : (
            <ul className="space-y-2">
              {topOpps.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <Badge variant="secondary">{o.kind}</Badge>
                    {o.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    P{o.priorityScore ?? '–'} · doğrulama {o.validationScore ?? '—'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">📅 Yaklaşan Etkinlikler</CardTitle>
          <CardDescription>
            Global Event Calendar ·{' '}
            <Link href="/hunter?tab=etkinlikler" className="underline">
              Ürün Avcısı'na git
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Henüz etkinlik yok. Ürün Keşif Merkezi'nde "Keşfet"e basın.
            </p>
          ) : (
            <ul className="space-y-2">
              {upcomingEvents.map((e) => {
                const score = (e.eventScore ?? {}) as EventScoreDim;
                const eventDate = new Date(e.eventDate);
                const daysUntil = Math.round(
                  (new Date(eventDate.toDateString()).getTime() - new Date(new Date().toDateString()).getTime()) /
                    86_400_000,
                );
                return (
                  <li key={e.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2">
                      <Badge variant="secondary">{CATEGORY_LABEL[e.category] ?? e.category}</Badge>
                      {e.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {daysUntil} gün · skor {score.total ?? '–'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Açık Görevler</CardTitle>
            <CardDescription>
              <Link href="/tasks" className="underline">
                Görev Merkezi'ne git
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Açık görev yok.</p>
            ) : (
              <ul className="space-y-2">
                {recentTasks.slice(0, 6).map((t) => (
                  <li key={t.id} className="flex items-center justify-between text-sm">
                    <span>{t.title}</span>
                    <span className="text-xs text-muted-foreground">P{t.priority}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Son Denetim Olayları</CardTitle>
            <CardDescription>
              <Link href="/audit" className="underline">
                Denetim kaydına git
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentAudit.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz olay yok.</p>
            ) : (
              <ul className="space-y-2">
                {recentAudit.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-mono text-xs">{a.action}</span>
                    <Badge variant="secondary">L{a.autonomyLevel}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
