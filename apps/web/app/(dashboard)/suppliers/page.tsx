import { suppliers } from '@velora/db';
import { getActiveBrand } from '@/lib/brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { addSupplier, draftEmail, sendSupplierEmail } from './actions';

export const dynamic = 'force-dynamic';

const MAIL_BADGE = {
  DRAFT: { variant: 'secondary' as const, label: 'Taslak' },
  SENT: { variant: 'success' as const, label: 'Gönderildi' },
  FAILED: { variant: 'destructive' as const, label: 'Başarısız' },
};

export default async function SuppliersPage() {
  const brand = await getActiveBrand();
  const list = await suppliers.list(brand.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tedarikçi & Mail Merkezi</h1>
        <p className="text-muted-foreground">Tedarikçi kaydı + AI e-posta taslağı + SMTP gönderim.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tedarikçi Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addSupplier} className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="company">Firma</Label>
              <Input id="company" name="company" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" name="email" type="email" placeholder="iletisim@firma.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="website">Web Sitesi</Label>
              <Input id="website" name="website" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="notes">Notlar</Label>
              <Input id="notes" name="notes" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Ekle</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz tedarikçi yok.</p>
      ) : (
        list.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle className="text-base">{s.company}</CardTitle>
              <CardDescription>
                {[s.email, s.phone, s.website].filter(Boolean).join(' · ') || 'İletişim bilgisi yok'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={draftEmail} className="flex flex-wrap items-end gap-2">
                <input type="hidden" name="supplierId" value={s.id} />
                <div className="flex-1 space-y-1" style={{ minWidth: 220 }}>
                  <Label htmlFor={`topic-${s.id}`}>AI Mail Konusu</Label>
                  <Input id={`topic-${s.id}`} name="topic" placeholder="örn: toptan fiyat teklifi iste" required />
                </div>
                <Button type="submit" variant="outline">Taslak Üret</Button>
              </form>

              {s.emails.length > 0 && (
                <div className="space-y-2">
                  {s.emails.map((m) => {
                    const badge = MAIL_BADGE[m.status];
                    return (
                      <div key={m.id} className="rounded-md border p-3 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{m.subject}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                            {m.status === 'DRAFT' && s.email && (
                              <form action={sendSupplierEmail}>
                                <input type="hidden" name="id" value={m.id} />
                                <Button type="submit" size="sm">Gönder</Button>
                              </form>
                            )}
                          </div>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{m.body}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
