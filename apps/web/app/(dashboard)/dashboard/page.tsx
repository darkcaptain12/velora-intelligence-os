import Link from 'next/link';
import { audit, settings, tasks } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

const AUTONOMY_LABEL: Record<number, string> = {
  1: 'L1 — Öner',
  2: 'L2 — Yap & Raporla',
  3: 'L3 — Tam Otomatik',
};

export default async function DashboardPage() {
  const brand = await getActiveBrand();
  const [taskCounts, level, recentTasks, recentAudit] = await Promise.all([
    tasks.counts(brand.id),
    settings.get<number>(brand.id, 'autonomy.level', 1),
    tasks.list(brand.id, 'OPEN'),
    audit.recent(brand.id, 6),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Komuta Merkezi</h1>
        <p className="text-muted-foreground">Aktif marka: {brand.name}</p>
      </div>

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
  );
}
