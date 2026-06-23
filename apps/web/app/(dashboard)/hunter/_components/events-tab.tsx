import Link from 'next/link';
import { events } from '@velora/db';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { runDiscovery } from '../actions';

const CATEGORY_LABEL: Record<string, string> = {
  SPOR: 'Spor',
  ALISVERIS: 'Alışveriş',
  KUTLAMA: 'Kutlama',
  MEVSIM: 'Mevsim',
};
const CATEGORY_VARIANT: Record<string, 'default' | 'warning' | 'secondary' | 'success'> = {
  SPOR: 'default',
  ALISVERIS: 'success',
  KUTLAMA: 'secondary',
  MEVSIM: 'warning',
};

interface EventScoreDim {
  trendPotential?: number;
  salesPotential?: number;
  readiness?: number;
  total?: number;
}

function atMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export async function EventsTab({ brandId }: { brandId: string }) {
  const list = await events.list(brandId, 100);
  const today = atMidnight(new Date());

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Global Event Calendar — spor, alışveriş, kutlama ve mevsim etkinlikleri otomatik taranır
          ve <strong>Etkinlik Skoru</strong> ile değerlendirilir (trend + satış potansiyeli +
          hazırlık zamanlaması). Hazırlık penceresine girenler otomatik <strong>Fırsatlar</strong>{' '}
          sekmesine dönüştürülür.
        </p>
        <form action={runDiscovery}>
          <Button type="submit">Tara</Button>
        </form>
      </div>

      {list.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Henüz etkinlik yok. "Tara"ya bas — Global Event Calendar 180 gün ufukta taranır,
            skorlanır ve buraya tarihe göre sıralı düşer.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((e) => {
            const score = (e.eventScore ?? {}) as EventScoreDim;
            const eventDate = atMidnight(new Date(e.eventDate));
            const daysUntil = Math.round((eventDate.getTime() - today.getTime()) / 86_400_000);
            const passed = daysUntil < 0;
            const inWindow = !passed && daysUntil <= e.prepLeadDays;

            return (
              <Card key={e.id} className={passed ? 'opacity-60' : undefined}>
                <CardContent className="flex flex-wrap items-center gap-4 p-4">
                  <div className="flex w-16 flex-col items-center">
                    <span className="text-2xl font-bold">{score.total ?? '–'}</span>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      etkinlik skoru
                    </span>
                  </div>
                  <div className="min-w-[220px] flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{e.name}</span>
                      <Badge variant={CATEGORY_VARIANT[e.category] ?? 'secondary'}>
                        {CATEGORY_LABEL[e.category] ?? e.category}
                      </Badge>
                      {e.linkedOpportunityId ? (
                        <Badge variant="success">Fırsata dönüştü</Badge>
                      ) : inWindow ? (
                        <Badge variant="warning">Hazırlık penceresinde</Badge>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span>{eventDate.toLocaleDateString('tr-TR')}</span>
                      <span>· {passed ? 'geçti' : `${daysUntil} gün sonra`}</span>
                      <span>· hazırlık {e.prepLeadDays} gün</span>
                      <span>· trend {score.trendPotential ?? '-'}</span>
                      <span>· satış {score.salesPotential ?? '-'}</span>
                      <span>· hazırlık skoru {score.readiness ?? '-'}</span>
                    </div>
                  </div>
                  {e.linkedOpportunityId && (
                    <Link href="/hunter?tab=firsatlar" className="text-xs text-muted-foreground underline">
                      Fırsatı gör →
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
