import { listRecentJobs } from '@velora/queue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SampleJobRunner } from '@/components/sample-job-runner';

export const dynamic = 'force-dynamic';

function stateBadge(state: string) {
  if (state === 'completed') return <Badge variant="success">tamamlandı</Badge>;
  if (state === 'failed') return <Badge variant="destructive">başarısız</Badge>;
  if (state === 'active') return <Badge variant="warning">çalışıyor</Badge>;
  return <Badge variant="secondary">{state}</Badge>;
}

export default async function JobsPage() {
  const jobs = await listRecentJobs(30);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">İşler</h1>
        <p className="text-muted-foreground">Arka plan iş kuyruğu (BullMQ) durumu.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sistem Sağlık Testi</CardTitle>
          <CardDescription>Web → Redis → Worker → Sonuç zincirini test eder.</CardDescription>
        </CardHeader>
        <CardContent>
          <SampleJobRunner />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Son İşler</CardTitle>
          <CardDescription>Tüm kuyruklardan en son 30 iş.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {jobs.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Henüz iş yok.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 font-medium">Kuyruk</th>
                    <th className="px-4 py-2 font-medium">ID</th>
                    <th className="px-4 py-2 font-medium">Ad</th>
                    <th className="px-4 py-2 font-medium">Durum</th>
                    <th className="px-4 py-2 font-medium">Oluşturuldu</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {jobs.map((job) => (
                    <tr key={`${job.queue}-${job.id}`}>
                      <td className="px-4 py-2 font-mono text-xs">{job.queue}</td>
                      <td className="px-4 py-2 font-mono text-xs">{job.id}</td>
                      <td className="px-4 py-2">{job.name}</td>
                      <td className="px-4 py-2">{stateBadge(job.state)}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                        {new Date(job.timestamp).toLocaleString('tr-TR')}
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
