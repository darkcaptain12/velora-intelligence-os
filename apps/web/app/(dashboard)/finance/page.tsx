import { getActiveBrand } from '@/lib/brand';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './_components/overview-tab';
import { AdsTab } from './_components/ads-tab';

export const dynamic = 'force-dynamic';

export default async function FinancePage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const brand = await getActiveBrand();
  const tab = searchParams?.tab ?? 'genel-bakis';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">💰 Finans Müdürü</h1>
        <p className="text-muted-foreground">
          Ciro, kâr, operasyon skoru ve reklam performansı + acil durum koruması tek merkezde.
        </p>
      </div>

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="genel-bakis">Genel Bakış</TabsTrigger>
          <TabsTrigger value="reklam">Reklam Performansı</TabsTrigger>
        </TabsList>
        <TabsContent value="genel-bakis">
          <OverviewTab brandId={brand.id} currency={brand.currency} />
        </TabsContent>
        <TabsContent value="reklam">
          <AdsTab brandId={brand.id} currency={brand.currency} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
