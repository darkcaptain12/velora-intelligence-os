import { audit } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

function levelBadge(level: number) {
  if (level >= 3) return <Badge variant="destructive">L3</Badge>;
  if (level === 2) return <Badge variant="warning">L2</Badge>;
  return <Badge variant="secondary">L1</Badge>;
}

export default async function AuditPage() {
  const brand = await getActiveBrand();
  const logs = await audit.recent(brand.id, 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Denetim Kaydı</h1>
        <p className="text-muted-foreground">
          Tüm L2/L3 eylemleri otonomi seviyesiyle birlikte değişmez şekilde kaydedilir.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Son Olaylar</CardTitle>
          <CardDescription>En son 100 kayıt.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Kayıt yok.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 font-medium">Zaman</th>
                    <th className="px-4 py-2 font-medium">Actor</th>
                    <th className="px-4 py-2 font-medium">Eylem</th>
                    <th className="px-4 py-2 font-medium">Varlık</th>
                    <th className="px-4 py-2 font-medium">Seviye</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logs.map((entry) => (
                    <tr key={entry.id}>
                      <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                        {entry.createdAt.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-4 py-2">{entry.actor}</td>
                      <td className="px-4 py-2 font-mono text-xs">{entry.action}</td>
                      <td className="px-4 py-2">
                        {entry.entity}
                        {entry.entityId ? (
                          <span className="text-muted-foreground"> · {entry.entityId}</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-2">{levelBadge(entry.autonomyLevel)}</td>
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
