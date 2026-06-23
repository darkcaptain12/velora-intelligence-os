import { getActiveBrand } from '@/lib/brand';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OpportunitiesTab } from './_components/opportunities-tab';
import { EventsTab } from './_components/events-tab';
import { TrendsTab } from './_components/trends-tab';
import { CompetitorsTab } from './_components/competitors-tab';
import { ResearchTab } from './_components/research-tab';

export const dynamic = 'force-dynamic';

export default async function HunterPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const brand = await getActiveBrand();
  const tab = searchParams?.tab ?? 'firsatlar';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">🎯 Ürün Avcısı</h1>
        <p className="text-muted-foreground">
          Fırsat bul, doğrula, etkinlik/trend/rakip takip et — satılacak ürünü burada keşfet.
        </p>
      </div>

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="firsatlar">Fırsatlar</TabsTrigger>
          <TabsTrigger value="etkinlikler">Etkinlikler</TabsTrigger>
          <TabsTrigger value="trendler">Trendler</TabsTrigger>
          <TabsTrigger value="rakipler">Rakipler</TabsTrigger>
          <TabsTrigger value="arastirma">Araştırma</TabsTrigger>
        </TabsList>
        <TabsContent value="firsatlar">
          <OpportunitiesTab brandId={brand.id} />
        </TabsContent>
        <TabsContent value="etkinlikler">
          <EventsTab brandId={brand.id} />
        </TabsContent>
        <TabsContent value="trendler">
          <TrendsTab brandId={brand.id} />
        </TabsContent>
        <TabsContent value="rakipler">
          <CompetitorsTab brandId={brand.id} />
        </TabsContent>
        <TabsContent value="arastirma">
          <ResearchTab brandId={brand.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
