import { credentials, settings, spendLimits, type Provider } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { saveAutonomy, saveCredential, saveSpendLimits, updateBrand } from './actions';

export const dynamic = 'force-dynamic';

const PROVIDER_LABELS: { key: Provider; label: string; hint: string }[] = [
  { key: 'OPENAI', label: 'OpenAI', hint: 'Metin / vision / embedding' },
  { key: 'FAL', label: 'Fal.ai', hint: 'Görsel / video üretimi' },
  { key: 'ANTHROPIC', label: 'Anthropic', hint: 'Opsiyonel akıl yürütme' },
  { key: 'SHOPIFY', label: 'Shopify', hint: 'Admin API access token' },
  { key: 'META', label: 'Meta', hint: 'Marketing API token' },
  { key: 'SMTP', label: 'SMTP', hint: 'Mail gönderim şifresi' },
  { key: 'ETSY', label: 'Etsy', hint: 'Open API v3 anahtarı (ürün araştırma)' },
  { key: 'PINTEREST', label: 'Pinterest', hint: 'API erişim token (opsiyonel)' },
];

export default async function SettingsPage() {
  const brand = await getActiveBrand();
  const [credStatus, limits, level, autoMode] = await Promise.all([
    credentials.listStatus(brand.id),
    spendLimits.list(brand.id),
    settings.get<number>(brand.id, 'autonomy.level', 1),
    settings.get<boolean>(brand.id, 'ads.autoMode', false),
  ]);

  const amount = (period: string) =>
    limits.find((l) => l.period === period)?.amount.toString() ?? '0';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-muted-foreground">Marka, API anahtarları, limitler ve otonomi.</p>
      </div>

      {/* Marka */}
      <Card>
        <CardHeader>
          <CardTitle>Marka Bilgileri</CardTitle>
          <CardDescription>Aktif marka ve finansal varsayılanlar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateBrand} className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="name">Marka Adı</Label>
              <Input id="name" name="name" defaultValue={brand.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Para Birimi</Label>
              <Input id="currency" name="currency" defaultValue={brand.currency} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Vergi Oranı (0–1)</Label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                step="0.01"
                min="0"
                max="1"
                defaultValue={brand.taxRate.toString()}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit">Markayı Kaydet</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* API Anahtarları */}
      <Card>
        <CardHeader>
          <CardTitle>API Anahtarları</CardTitle>
          <CardDescription>
            Tüm anahtarlar AES-256-GCM ile şifrelenerek saklanır; değerler hiçbir zaman görüntülenmez.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {PROVIDER_LABELS.map(({ key, label, hint }) => (
            <form
              key={key}
              action={saveCredential}
              className="flex flex-wrap items-end gap-3 border-b pb-4 last:border-0 last:pb-0"
            >
              <input type="hidden" name="provider" value={key} />
              <div className="min-w-[180px] space-y-1">
                <div className="flex items-center gap-2">
                  <Label>{label}</Label>
                  {credStatus[key] ? (
                    <Badge variant="success">ayarlı</Badge>
                  ) : (
                    <Badge variant="warning">ayarsız</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
              <Input
                name="value"
                type="password"
                placeholder={credStatus[key] ? '•••••• (güncellemek için yaz)' : 'Anahtarı yapıştır'}
                className="flex-1"
              />
              <Button type="submit" variant="outline">
                Kaydet
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>

      {/* Harcama Limitleri */}
      <Card>
        <CardHeader>
          <CardTitle>Harcama Limitleri (Acil Durum Koruması)</CardTitle>
          <CardDescription>
            Reklam harcaması bu limitleri aşarsa kampanyalar otomatik duraklatılır (Faz 6).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveSpendLimits} className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="DAILY">Günlük ({brand.currency})</Label>
              <Input id="DAILY" name="DAILY" type="number" min="0" defaultValue={amount('DAILY')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="WEEKLY">Haftalık ({brand.currency})</Label>
              <Input
                id="WEEKLY"
                name="WEEKLY"
                type="number"
                min="0"
                defaultValue={amount('WEEKLY')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="MONTHLY">Aylık ({brand.currency})</Label>
              <Input
                id="MONTHLY"
                name="MONTHLY"
                type="number"
                min="0"
                defaultValue={amount('MONTHLY')}
              />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit">Limitleri Kaydet</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Otonomi */}
      <Card>
        <CardHeader>
          <CardTitle>Otonomi Seviyesi</CardTitle>
          <CardDescription>
            L1: öner & onay bekle · L2: yap & raporla · L3: tam otomatik.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveAutonomy} className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Seviye</Label>
              <select
                id="level"
                name="level"
                defaultValue={String(level)}
                className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="1">L1 — Öner</option>
                <option value="2">L2 — Yap & Raporla</option>
                <option value="3">L3 — Tam Otomatik</option>
              </select>
            </div>
            <label className="flex items-center gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                name="autoMode"
                defaultChecked={autoMode}
                className="h-4 w-4 rounded border-input"
              />
              Reklam otomatik modu
            </label>
            <Button type="submit">Otonomiyi Kaydet</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
