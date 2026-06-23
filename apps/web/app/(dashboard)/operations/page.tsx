import { getActiveBrand } from '@/lib/brand';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductsTab } from './_components/products-tab';
import { OrdersTab } from './_components/orders-tab';
import { ProductionTab } from './_components/production-tab';
import { ShippingTab } from './_components/shipping-tab';
import { SuppliersTab } from './_components/suppliers-tab';
import { ArchiveTab } from './_components/archive-tab';

export const dynamic = 'force-dynamic';

export default async function OperationsPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const brand = await getActiveBrand();
  const tab = searchParams?.tab ?? 'urunler';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">📦 Operasyon Müdürü</h1>
        <p className="text-muted-foreground">
          Ürünler, siparişler, üretim/kargo takibi, mağaza sağlığı ve tedarikçi/mail iletişimi tek
          merkezde.
        </p>
      </div>

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="urunler">Ürünler</TabsTrigger>
          <TabsTrigger value="siparisler">Siparişler</TabsTrigger>
          <TabsTrigger value="uretim">Üretim</TabsTrigger>
          <TabsTrigger value="kargo">Kargo</TabsTrigger>
          <TabsTrigger value="tedarikci">Tedarikçi & Mail</TabsTrigger>
          <TabsTrigger value="arsiv">Arşiv</TabsTrigger>
        </TabsList>
        <TabsContent value="urunler">
          <ProductsTab brandId={brand.id} />
        </TabsContent>
        <TabsContent value="siparisler">
          <OrdersTab brandId={brand.id} />
        </TabsContent>
        <TabsContent value="uretim">
          <ProductionTab brandId={brand.id} />
        </TabsContent>
        <TabsContent value="kargo">
          <ShippingTab brandId={brand.id} />
        </TabsContent>
        <TabsContent value="tedarikci">
          <SuppliersTab brandId={brand.id} />
        </TabsContent>
        <TabsContent value="arsiv">
          <ArchiveTab brandId={brand.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
