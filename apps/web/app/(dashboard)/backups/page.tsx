import { backups } from '@velora/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { runBackup } from './actions';

export const dynamic = 'force-dynamic';

function formatBytes(n: bigint): string {
  const num = Number(n);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / 1024 / 1024).toFixed(2)} MB`;
}

export default async function BackupsPage() {
  const list = await backups.list(20);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Yedekleme Merkezi</h1>
          <p className="text-muted-foreground">
            Veritabanı mantıksal yedeği (JSON → MinIO). Sırlar (API anahtarları) yedeğe dahil edilmez.
          </p>
        </div>
        <form action={runBackup}>
          <Button type="submit" variant="outline" size="sm">Yedek Al</Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Yedekler</CardTitle>
          <CardDescription>Son 20 yedek kaydı.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {list.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Henüz yedek yok — "Yedek Al"a basın.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 font-medium">Tarih</th>
                    <th className="px-4 py-2 font-medium">Tür</th>
                    <th className="px-4 py-2 font-medium">Boyut</th>
                    <th className="px-4 py-2 font-medium">Konum</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {list.map((b) => (
                    <tr key={b.id}>
                      <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                        {b.createdAt.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant="secondary">{b.type}</Badge>
                      </td>
                      <td className="px-4 py-2">{formatBytes(b.sizeBytes)}</td>
                      <td className="max-w-md truncate px-4 py-2">
                        <a href={b.location} target="_blank" rel="noreferrer" className="hover:underline">
                          {b.location}
                        </a>
                      </td>
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
