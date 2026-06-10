import Link from 'next/link';
import { tasks, type TaskStatus } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { createTask, setTaskStatus } from './actions';

export const dynamic = 'force-dynamic';

const STATUS_FILTERS: { value?: TaskStatus; label: string }[] = [
  { value: undefined, label: 'Tümü' },
  { value: 'OPEN', label: 'Açık' },
  { value: 'IN_PROGRESS', label: 'Devam Ediyor' },
  { value: 'DONE', label: 'Tamamlandı' },
  { value: 'CANCELLED', label: 'İptal' },
];

const STATUS_BADGE: Record<TaskStatus, { variant: 'secondary' | 'warning' | 'success' | 'outline'; label: string }> = {
  OPEN: { variant: 'secondary', label: 'Açık' },
  IN_PROGRESS: { variant: 'warning', label: 'Devam Ediyor' },
  DONE: { variant: 'success', label: 'Tamamlandı' },
  CANCELLED: { variant: 'outline', label: 'İptal' },
};

function StatusButton({ id, status, label, variant }: { id: string; status: TaskStatus; label: string; variant?: 'default' | 'outline' | 'destructive' }) {
  return (
    <form action={setTaskStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <Button type="submit" size="sm" variant={variant ?? 'outline'}>
        {label}
      </Button>
    </form>
  );
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const brand = await getActiveBrand();
  const valid = ['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED'];
  const activeStatus = valid.includes(searchParams.status ?? '')
    ? (searchParams.status as TaskStatus)
    : undefined;
  const list = await tasks.list(brand.id, activeStatus);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Görev Merkezi</h1>
        <p className="text-muted-foreground">
          Operatör ve AI tarafından oluşturulan görevler, onay kapıları.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yeni Görev</CardTitle>
          <CardDescription>API girişi, tasarım/reklam onayı veya genel görev.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createTask} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Başlık</Label>
              <Input id="title" name="title" required placeholder="Örn: Shopify API anahtarını gir" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tür</Label>
              <select
                id="type"
                name="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="GENERIC">Genel</option>
                <option value="API_INPUT">API Girişi</option>
                <option value="APPROVE_DESIGN">Tasarım Onayı</option>
                <option value="APPROVE_AD">Reklam Onayı</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Öncelik (1=yüksek, 5=düşük)</Label>
              <Input id="priority" name="priority" type="number" min="1" max="5" defaultValue="3" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea id="description" name="description" placeholder="Opsiyonel detay" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Görev Oluştur</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = activeStatus === f.value || (!activeStatus && !f.value);
          const href = f.value ? `/tasks?status=${f.value}` : '/tasks';
          return (
            <Link key={f.label} href={href}>
              <Badge variant={active ? 'default' : 'outline'} className="cursor-pointer">
                {f.label}
              </Badge>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          {list.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Görev yok.</p>
          ) : (
            <div className="divide-y">
              {list.map((task) => {
                const isApproval = task.type === 'APPROVE_DESIGN' || task.type === 'APPROVE_AD';
                const badge = STATUS_BADGE[task.status];
                const closed = task.status === 'DONE' || task.status === 'CANCELLED';
                return (
                  <div key={task.id} className="flex flex-wrap items-center gap-3 p-4">
                    <div className="flex-1 min-w-[220px]">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{task.title}</span>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                        <span className="text-xs text-muted-foreground">P{task.priority}</span>
                      </div>
                      {task.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {!closed && isApproval && (
                        <>
                          <StatusButton id={task.id} status="DONE" label="Onayla" variant="default" />
                          <StatusButton id={task.id} status="CANCELLED" label="Reddet" variant="destructive" />
                        </>
                      )}
                      {!closed && !isApproval && (
                        <>
                          {task.status === 'OPEN' && (
                            <StatusButton id={task.id} status="IN_PROGRESS" label="Başlat" />
                          )}
                          <StatusButton id={task.id} status="DONE" label="Tamamla" variant="default" />
                          <StatusButton id={task.id} status="CANCELLED" label="İptal" variant="outline" />
                        </>
                      )}
                      {closed && (
                        <StatusButton id={task.id} status="OPEN" label="Yeniden Aç" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
