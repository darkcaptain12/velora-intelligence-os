import { suppliers } from '@velora/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { addSupplier, draftEmail, findSuppliers, sendSupplierEmail, updateSupplierCost, updateSupplierDelivery, verifySupplier } from '../actions';
import { MailTemplates } from './mail-templates';

const MAIL_BADGE = {
  DRAFT: { variant: 'secondary' as const, label: 'Taslak' },
  SENT: { variant: 'success' as const, label: 'Gönderildi' },
  FAILED: { variant: 'destructive' as const, label: 'Başarısız' },
};

export async function SuppliersTab({ brandId }: { brandId: string }) {
  const list = await suppliers.list(brandId);

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Tedarikçi kaydı + AI e-posta taslağı + SMTP gönderim.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">🔎 Tedarikçi Bul</CardTitle>
          <CardDescription>
            AI, girdiğin niş/ürün için gerçek web araması yapar ve firma adaylarını önerir
            (kaydedilenler &quot;Doğrulanmadı&quot; olarak işaretlenir, onayladığında kalıcı olur).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={findSuppliers} className="flex flex-wrap items-end gap-2">
            <div className="flex-1 space-y-1" style={{ minWidth: 220 }}>
              <Label htmlFor="niche">Niş / Ürün</Label>
              <Input id="niche" name="niche" placeholder="örn: özel baskılı kedi tişörtü üreticisi" required />
            </div>
            <Button type="submit">Ara</Button>
          </form>
        </CardContent>
      </Card>

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
            <div className="grid gap-3 sm:col-span-2 sm:grid-cols-4">
              <div className="space-y-1">
                <Label htmlFor="moq">MOQ (min. sipariş)</Label>
                <Input id="moq" name="moq" type="number" min="1" step="1" placeholder="örn: 50" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="unitCost">Birim Maliyet</Label>
                <Input id="unitCost" name="unitCost" type="number" min="0" step="0.01" placeholder="örn: 4.50" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="costCurrency">Para Birimi</Label>
                <Input id="costCurrency" name="costCurrency" placeholder="örn: TRY" maxLength={10} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="deliveryDays">Teslimat (gün)</Label>
                <Input id="deliveryDays" name="deliveryDays" type="number" min="1" step="1" placeholder="örn: 7" />
              </div>
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{s.company}</CardTitle>
                  {s.supplierScore != null && (
                    <Badge variant="outline">⭐ {s.supplierScore}/100</Badge>
                  )}
                </div>
                {!s.verified && (
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">Doğrulanmadı</Badge>
                    <form action={verifySupplier}>
                      <input type="hidden" name="id" value={s.id} />
                      <Button type="submit" size="sm" variant="outline">Doğrula</Button>
                    </form>
                  </div>
                )}
              </div>
              <CardDescription>
                {[s.email, s.phone, s.website].filter(Boolean).join(' · ') || 'İletişim bilgisi yok'}
              </CardDescription>
              {s.notes && !s.verified && (
                <CardDescription className="text-xs italic">{s.notes}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 rounded-md border p-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  💰 MOQ &amp; Birim Maliyet
                  {s.unitCost != null && (
                    <span className="ml-2 font-normal text-foreground">
                      {Number(s.unitCost).toFixed(2)} {s.costCurrency ?? ''}
                      {s.moq != null && ` · MOQ ${s.moq}`}
                    </span>
                  )}
                </p>
                <form action={updateSupplierCost} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="id" value={s.id} />
                  <div className="space-y-1" style={{ width: 110 }}>
                    <Label htmlFor={`moq-${s.id}`}>MOQ</Label>
                    <Input
                      id={`moq-${s.id}`}
                      name="moq"
                      type="number"
                      min="1"
                      step="1"
                      defaultValue={s.moq ?? ''}
                    />
                  </div>
                  <div className="space-y-1" style={{ width: 130 }}>
                    <Label htmlFor={`unitCost-${s.id}`}>Birim Maliyet</Label>
                    <Input
                      id={`unitCost-${s.id}`}
                      name="unitCost"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={s.unitCost != null ? Number(s.unitCost) : ''}
                    />
                  </div>
                  <div className="space-y-1" style={{ width: 100 }}>
                    <Label htmlFor={`costCurrency-${s.id}`}>Para Birimi</Label>
                    <Input
                      id={`costCurrency-${s.id}`}
                      name="costCurrency"
                      maxLength={10}
                      defaultValue={s.costCurrency ?? ''}
                    />
                  </div>
                  <Button type="submit" size="sm" variant="outline">Kaydet</Button>
                </form>
              </div>

              <div className="space-y-2 rounded-md border p-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  ⏱️ Teslimat
                  {s.deliveryDays != null && (
                    <span className="ml-2 font-normal text-foreground">{s.deliveryDays} gün</span>
                  )}
                </p>
                <form action={updateSupplierDelivery} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="id" value={s.id} />
                  <div className="space-y-1" style={{ width: 160 }}>
                    <Label htmlFor={`deliveryDays-${s.id}`}>Ortalama Teslimat (gün)</Label>
                    <Input
                      id={`deliveryDays-${s.id}`}
                      name="deliveryDays"
                      type="number"
                      min="1"
                      step="1"
                      defaultValue={s.deliveryDays ?? ''}
                    />
                  </div>
                  <Button type="submit" size="sm" variant="outline">Kaydet</Button>
                </form>
              </div>

              <div className="space-y-2">
                <MailTemplates targetId={`topic-${s.id}`} />
                <form action={draftEmail} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="supplierId" value={s.id} />
                  <div className="flex-1 space-y-1" style={{ minWidth: 220 }}>
                    <Label htmlFor={`topic-${s.id}`}>AI Mail Konusu</Label>
                    <Input id={`topic-${s.id}`} name="topic" placeholder="örn: toptan fiyat teklifi iste" required />
                  </div>
                  <Button type="submit" variant="outline">Taslak Üret</Button>
                </form>
              </div>

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
