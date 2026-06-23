'use client';

import { Button } from '@/components/ui/button';

const TEMPLATES = [
  { label: 'Fiyat Teklifi İste', topic: 'Toptan fiyat teklifi ve minimum sipariş adedi hakkında bilgi istiyorum' },
  { label: 'Numune Talep Et', topic: 'Ürün numunesi gönderilmesini talep ediyorum' },
  { label: 'Kargo Süresini Sor', topic: 'Üretim ve kargo süreleri hakkında bilgi istiyorum' },
  { label: 'Sipariş Takibi', topic: 'Mevcut siparişimin durumu hakkında bilgi istiyorum' },
];

/** Sık kullanılan mail konusu şablonlarını tek tıkla ilgili input'a doldurur. */
export function MailTemplates({ targetId }: { targetId: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {TEMPLATES.map((t) => (
        <Button
          key={t.label}
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => {
            const input = document.getElementById(targetId);
            if (input instanceof HTMLInputElement) {
              input.value = t.topic;
              input.focus();
            }
          }}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}
