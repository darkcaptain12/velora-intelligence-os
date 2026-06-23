import { getActiveBrand } from '@/lib/brand';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DesignsTab } from './_components/designs-tab';
import { VideosTab } from './_components/videos-tab';
import { IntelligenceTab } from './_components/intelligence-tab';
import { LabTab } from './_components/lab-tab';

export const dynamic = 'force-dynamic';

export default async function StudioPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const brand = await getActiveBrand();
  const tab = searchParams?.tab ?? 'tasarimlar';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">🎨 Tasarım Direktörü</h1>
        <p className="text-muted-foreground">
          Brief → tasarım → mockup → video → ürün zekası → kreatif test — yaratıcı üretim hattının tamamı.
        </p>
      </div>

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="tasarimlar">Tasarımlar</TabsTrigger>
          <TabsTrigger value="videolar">Videolar</TabsTrigger>
          <TabsTrigger value="urun-zekasi">Ürün Zekası</TabsTrigger>
          <TabsTrigger value="test-lab">Test Lab</TabsTrigger>
        </TabsList>
        <TabsContent value="tasarimlar">
          <DesignsTab brandId={brand.id} />
        </TabsContent>
        <TabsContent value="videolar">
          <VideosTab brandId={brand.id} />
        </TabsContent>
        <TabsContent value="urun-zekasi">
          <IntelligenceTab brandId={brand.id} />
        </TabsContent>
        <TabsContent value="test-lab">
          <LabTab brandId={brand.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
