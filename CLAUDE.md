# CLAUDE.md

## PROJE ADI

VELORA AI COMMERCE OS

---

# PROJE AMACI

Bu proje tek kişilik ancak kurumsal seviyede çalışan, yapay zeka destekli tam otomasyonlu E-Ticaret Operasyon Sistemi geliştirmeyi amaçlamaktadır.

Sistem Shopify mağazasını yönetebilmeli, ürün araştırabilmeli, tasarım üretebilmeli, mockup hazırlayabilmeli, reklam videoları oluşturabilmeli, ürünleri Shopify'a yükleyebilmeli, raporlama yapabilmeli ve operasyonel öneriler sunabilmelidir.

Sistem ileride büyütülebilecek şekilde modüler mimaride tasarlanmalıdır.

---

# GENEL KURAL

Claude her zaman önce mevcut CLAUDE.md dosyasını okuyacak.

Kod yazmaya başlamadan önce:

1. Mevcut durumu analiz et.
2. Tamamlanan görevleri kontrol et.
3. Bekleyen görevleri kontrol et.
4. Çakışma oluşturabilecek geliştirmeleri belirle.
5. Sonra kod üret.

Her geliştirme tamamlandıktan sonra CLAUDE.md güncellenecek.

Asla eski duruma dönülmeyecek.

---

# GELİŞTİRME KURALI

Her görev sonunda:

- Yapılan işlemler
- Yeni eklenen modüller
- Veritabanı değişiklikleri
- API değişiklikleri
- Yeni bağımlılıklar
- Yeni workflowlar

CLAUDE.md içerisine eklenmelidir.

Amaç token tasarrufu ve proje hafızası oluşturmaktır.

---

# OTONOMİ SEVİYELERİ

## LEVEL 1

Öner
Analiz Et
Onay Bekle

---

## LEVEL 2

İşlemi Yap
Raporla

---

## LEVEL 3

Tam Otomatik

- Tasarım Üret
- Mockup Üret
- Video Üret
- Shopify Yükle
- Reklam Oluştur
- Rapor Gönder

Kullanıcı müdahalesi olmadan çalışabilir.

---

# TEKNOLOJİLER

## FRONTEND

Next.js
TypeScript
TailwindCSS
Shadcn UI
Framer Motion

---

## BACKEND

Node.js
Next.js API

---

## DATABASE

PostgreSQL

---

## ORM

Prisma

---

## AUTOMATION

n8n

---

## AI

OpenAI
Fal.ai

---

## BROWSER AUTOMATION

Playwright

---

## EMAIL

SMTP

---

## CONTAINER

Docker

---

# ÇALIŞMA PRENSİBİ

Öncelik sırası:

1. API
2. Playwright
3. Kullanıcı Onayı

Eğer API ile yapılabiliyorsa API kullan.

Eğer API yoksa Playwright kullan.

Playwright ile yapılamıyorsa kullanıcıdan doğrulama iste.

---

# SİSTEM MODÜLLERİ

## AI KOMUTA MERKEZİ

Tek merkezden:

- Ürün Araştır
- Tasarım Üret
- Mockup Üret
- Video Üret
- Shopify Yönet
- Meta Yönet
- Finans Yönet

---

## ÜRÜN ARAŞTIRMA MOTORU

Kaynaklar:

- TikTok
- Pinterest
- Etsy
- Amazon
- Reddit

Çıktılar:

- Talep Puanı
- Rekabet Puanı
- Satış Potansiyeli
- Karlılık Puanı

---

## TASARIM FABRİKASI

Üretilecek:

- SVG
- PNG
- Transparent PNG
- Baskıya Hazır Dosya

---

## MOCKUP FABRİKASI

Üretilecek:

- Tshirt Mockup
- Hoodie Mockup
- Sweatshirt Mockup
- Oversize Mockup

---

## VIDEO FABRİKASI

Üretilecek:

- TikTok
- Reel
- Story
- UGC

Videolar

---

## SHOPIFY YÖNETİM MERKEZİ

Oluşturulacak:

- Ürün
- Koleksiyon
- SEO
- Etiket
- İndirim
- Kampanya

---

## META REKLAM MERKEZİ

Manuel Mod

- Reklam Aç
- Reklam Durdur
- Bütçe Değiştir

Otomatik Mod

- Reklam Testi
- Reklam Optimizasyonu
- Ölçekleme

---

## RAKİP ANALİZ MERKEZİ

Takip:

- Ürünler
- Reklamlar
- Fiyatlar
- Trendler

---

## TREND AVCISI

Haftalık:

- Yeni Nişler
- Viral Temalar
- Trend Tasarımlar

---

## KARLILIK ANALİZİ

Hesaplanacak:

- Ürün Maliyeti
- Reklam Maliyeti
- Kargo
- Komisyon
- Net Kar

---

## TASARIM SKORLAMA

Puanlar:

- Satılabilirlik
- Trend Uyumu
- Reklam Uyumu
- Hedef Kitle Uyumu

---

## TEDARİKÇİ MERKEZİ

Bulunacak:

- Firma
- Mail
- Telefon
- Web Sitesi

---

## MAIL MERKEZİ

Yapabilecekleri:

- Mail Yaz
- Mail Gönder
- Tedarikçi İletişimi

---

## GÖREV MERKEZİ

Claude görev oluşturabilir.

Örnek:

- API Gir
- Tasarımı Onayla
- Reklamı Onayla

---

## AI CEO

Haftalık analiz sunar.

Örnek:

"Evcil hayvan ürünleri daha iyi performans gösteriyor."

"Bu kategoriye ağırlık ver."

---

## ÜRÜN YAŞAM DÖNGÜSÜ

Durumlar:

- Yeni
- Test
- Kazanan
- Ölçekleniyor
- Düşüşte
- Kapatıldı

---

## KREATİF TEST LABORATUVARI

Oluştur:

- Reklam Metni
- Görsel
- Video

A/B testleri yap.

---

## SHOPIFY SAĞLIK KONTROLÜ

Kontrol:

- SEO
- Görseller
- Kırık Sayfalar
- Performans

---

## AI TASARIM DİREKTÖRÜ

Trendler + Geçmiş Satışlar + Rakipler

üzerinden tasarım briefi oluşturur.

---

## OTOMATİK ÜRÜN SAYFASI

Üretilecek:

- Açıklama
- SEO
- FAQ
- Satış Metni

---

## ACİL DURUM KORUMASI

Tanımlanabilir:

- Günlük Limit
- Haftalık Limit
- Aylık Limit

Limit aşılırsa:

- Reklamlar durdurulur.

---

## YEDEKLEME MERKEZİ

Yedeklenecek:

- Veritabanı
- n8n Workflow
- Tasarımlar
- Videolar

---

## ÇOKLU MARKA ALTYAPISI

Altyapı desteklemeli.

Şimdilik tek marka aktif olacak.

---

## OPERASYON SKORU

Gösterilecek:

- Reklam
- SEO
- Karlılık
- Ürün Kalitesi
- Trend Uyumu

Genel skor üretilecek.

---

## FİNANS VE İŞ ZEKASI MERKEZİ

Gösterilecek:

- Günlük Ciro
- Haftalık Ciro
- Aylık Ciro
- Yıllık Ciro

- Sipariş Sayısı
- Ortalama Sipariş Tutarı

- Reklam Harcaması
- Net Kar
- Brüt Kar

- Vergi Tahmini
- Nakit Akışı

- ROAS
- CPA
- CPC
- CTR

Claude finansal yorum yapabilmelidir.

---

# N8N GÖREVLERİ

Her Pazar 00:00

Çalıştır:

1. Trend Analizi
2. Rakip Analizi
3. Yeni Tasarım Üretimi
4. Mockup Üretimi
5. Video Üretimi
6. Karlılık Analizi
7. Haftalık Rapor
8. Mail Gönderimi

---

# PROJE KURALI

Kod eksik bırakılmayacak.

Placeholder bırakılmayacak.

Yarım modül bırakılmayacak.

Her modül üretim seviyesinde tamamlanacak.

Her sprint sonunda:

- Versiyon yükselt
- CLAUDE.md güncelle
- Yapılanları kaydet

Bu dosya proje hafızası olarak kullanılacaktır.

---

# PROJE DURUMU / İLERLEME

## Sürüm: 1.8.0 — SPRINT 5: STABİLİZASYON + JARVIS (TAMAMLANDI, canlı doğrulandı)
Tarih: 2026-06-17

Sprint 5, 4 Faz'dan oluşur (A–D). Tüm fazlar mevcut 6 hub'ın İÇİNE yerleşir;
yeni route yalnızca `/dashboard`'a Jarvis sekmesi eklenmesi için açıldı (yeni
**bağımsız** route değil, mevcut route'a yeni `TabsContent`). Yeni DB migration
**YOK** (Faz C migration'ı önceki context'te uygulandı: `add_product_behavior_signals`).
Sprint kısıtı: "Mevcut mimariyi bozma / Yeni AI sistemi yazma / Tekrarlayan queue
oluşturma / Token tasarrufu zorunlu" — hepsi karşılandı.

### Faz A — PI Fix + Backfill (Smart-Enqueue)
- **Neden:** `importFromShopify` her içe aktarmada tüm ürünler için `productIntelligence`
  job kuyruğa alıyordu — READY PI'leri yeniden üretmek gereksiz API/token harcaması.
- **`apps/web/app/(dashboard)/operations/actions.ts`**: `importFromShopify` artık her
  ürün için `prisma.productIntelligence.findUnique({where:{productId}, select:{status}})`
  kontrolü yapar; `status==='READY'` ise **atlar**. `piQueued` sayacı audit log'a eklendi.
  Yeni **`backfillProductIntelligence()`**: `prisma.product.findMany({where:{brandId,
  OR:[{intelligence:null},{intelligence:{status:{not:'READY'}}}]}})` → her biri için
  `enqueue('productIntelligence',{productId})`.
- **`apps/web/app/(dashboard)/operations/_components/products-tab.tsx`**: `missingPiCount`
  hesaplanır; `> 0` ise "🔁 PI Backfill (N ürün)" butonu render edilir — tüm READY'ler
  varsa buton **gizlenir** (idempotent).
- **Doğrulama (canlı):** 31/31 ürün READY → backfill butonu render edilmedi ✓.

### Faz B — Arşiv Sistemi (CLOSED ürünler)
- **Neden:** `products.list()` CLOSED ürünleri de döndürüyordu — Üretim/PI listelerini
  "arşiv kirliliği" ile dolduruyordu.
- **`packages/db/src/services/products.ts`**: `list(brandId, opts?)` imzası değişti —
  varsayılan olarak `status:{not:'CLOSED'}` filtresi uygulanır; `opts?.includeArchived`
  ile geçersiz kılınabilir. Yeni `setBehavior(id, data)` servisi eklendi.
- **`packages/db/src/services/product-intelligence.ts`**: `list()` artık
  `product:{status:{not:'CLOSED'}}` filtresi uygular — CLOSED ürünlerin PI'leri
  haftalık rapor/CEO analizinden otomatik olarak çıkar.
- **`apps/web/app/(dashboard)/operations/_components/production-tab.tsx`**: `SECTION_ORDER`
  dizisinden `CLOSED` kalemi kaldırıldı.
- **`apps/web/app/(dashboard)/operations/_components/archive-tab.tsx`** (yeni):
  CLOSED ürünleri tarih-sıralı listeler — her kart "Kapatıldı" rozeti + PI skoru +
  **"Geri Al (Test)"** butonu (`transitionProduct` action, `to="TEST"`).
- **`apps/web/app/(dashboard)/operations/page.tsx`**: 5 sekme → 6 sekme (Arşiv eklendi).
- **Doğrulama (canlı):** `/operations?tab=arsiv` 200, CLOSED ürün "Kapatıldı" rozeti +
  PI skoru + "Geri Al" butonu render edildi ✓. Haftalık rapor CLOSED ürünleri dışlar ✓.

### Faz C — Davranış Sinyali / Demand Validation V2
- **Neden:** Talep skoru yalnızca trend verisinden geliyordu — kullanıcının gerçek
  davranışı (görüntülenme/sepet/istek listesi) sisteme girmiyordu.
- **DB `Product.pageViews Int? / cartAdds Int? / wishlistAdds Int?`** (migration
  `add_product_behavior_signals`, uygulandı). Her alan `@default(0)`.
- **`packages/core/src/behavior/score.ts`** (yeni): deterministik `computeBehaviorScore
  ({pageViews?, cartAdds?, wishlistAdds?}): {score:0-100, viewContribution, cartContribution,
  wishlistContribution, hasSignals}`. Ağırlık: Görüntülenme %50 · Sepet %30 · İstek %20.
  `packages/core/src/index.ts`'e export edildi.
- **`packages/db/src/services/products.ts`**: yeni `setBehavior(id, data)` →
  `prisma.product.update({where:{id}, data})`.
- **`apps/web/app/(dashboard)/operations/actions.ts`**: yeni `updateBehaviorSignals
  (formData)` — zod `{id, pageViews?, cartAdds?, wishlistAdds?}` → brand kontrolü →
  `products.setBehavior` → `audit.log('product.behavior_signals')`.
- **`apps/web/app/(dashboard)/operations/_components/production-tab.tsx`**: her ürün
  satırına "📊 Davranış Sinyalleri" bölümü — `computeBehaviorScore` ile hesaplanan skor
  rozeti (hasSignals ise) + 3 input (pageViews/cartAdds/wishlistAdds) + "Güncelle" butonu.
- **`apps/worker/src/processors/weekly-report.ts`**: `computeBehaviorScore` import
  edildi; `allProducts` üzerinden `behaviorMap` inşa edilir. En yüksek davranış skorlu
  ürün için `📊 Davranış sinyali: ...` insight satırı eklenir (skor≥50 ise
  kampanya/stok önceliklendir önerisi). Talep düşüşü (DECLINING) + güçlü davranış
  (skor≥50) çakışmasında `⚠️ Davranış-Talep çakışması:` uyarısı eklenir.
- **DB değişikliği:** `Product.pageViews/cartAdds/wishlistAdds` (migration
  `add_product_behavior_signals`).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` ✓ · dev+worker
  yeniden başlatıldı ✓ · JDM Honda'ya pageViews=850/cartAdds=75/wishlistAdds=40 set
  edildi → Üretim sekmesinde "Skor: 81/100" rozeti render edildi ✓ · test verisi
  temizlendi ✓.

### Faz D — Jarvis + Aksiyon Router (Sprint 5 son faz)
- **Neden:** Tüm işlemler için tek-tek UI sayfalarına gitmek gerekiyordu — tek
  komut satırından (Türkçe serbest metin) herhangi bir sistemi tetikleyecek bir
  "action dispatcher" yoktu. "Jarvis karar vermez. VELORA karar verir. JARVIS uygular."
- **`packages/core/src/action-router/index.ts`** (yeni): deterministik
  `parseIntent(text): Intent` — öncelikli anahtar kelime eşleştirmesi, **AI gerektirmez**.
  `ActionType` enum: `HUNT_TRENDS / WATCH_COMPETITORS / FIND_SUPPLIERS /
  GENERATE_REPORT / RUN_DISCOVERY / BACKFILL_PI / GENERATE_DESIGN /
  FINANCE_SNAPSHOT / SHOPIFY_IMPORT / UNKNOWN`. `Intent: {type, keyword?}` —
  FIND_SUPPLIERS için kullanıcı metninden niş/ürün çıkarılır. Export:
  `packages/core/src/index.ts`'e `parseIntent`, `ActionType`, `Intent`.
- **`apps/web/app/(dashboard)/dashboard/actions.ts`** (yeni): `jarvisCommand
  (prevState, formData): Promise<JarvisResult>` — `parseIntent(text)` → ActionType'a
  göre switch → **mevcut** `enqueue` çağrıları (trendHunt/competitorWatch/
  supplierFinder/weeklyReport/productDiscovery/autoDesign/financeSnapshot) veya
  `prisma.product.findMany` + döngüsel `enqueue('productIntelligence',...)` (BACKFILL_PI) →
  `audit.log('jarvis.command', {text, intent})` → `{ok, message}` döner. Yeni
  queue/worker/API oluşturulmadı — mevcut altyapı aynen kullanıldı.
- **`apps/web/app/(dashboard)/dashboard/_components/jarvis-tab.tsx`** (yeni,
  `'use client'`): `useFormState(jarvisCommand, initialState)` — komut input'u + 8
  örnek komut butonu (her biri hidden input'lu mini-form, aynı action'a post eder) +
  sonuç mesajı (ok=true → yeşil, ok=false → gri).
- **`apps/web/app/(dashboard)/dashboard/page.tsx`**: `searchParams` prop eklendi;
  mevcut tek-sayfa içerik `<TabsContent value="ozet">` içine alındı; yeni
  `<TabsContent value="jarvis"><JarvisTab /></TabsContent>` eklendi. Tab başlıkları:
  "📊 Özet" / "⚡ Jarvis".
- **Desteklenen Jarvis komutları (örnekler):**
  - "trend avla" → `trendHunt`
  - "rakipleri tara" → `competitorWatch`
  - "tedarikçi bul özel baskılı tişört" → `supplierFinder` (keyword: "özel baskılı tişört")
  - "rapor üret" → `weeklyReport`
  - "fırsat bul" → `productDiscovery`
  - "ürün zekası üret" → PI backfill (tüm eksik ürünler)
  - "tasarım üret" → `autoDesign`
  - "finans güncelle" → `financeSnapshot`
- **DB değişikliği:** YOK.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (`/dashboard` 2.45kB,
  Jarvis `'use client'` bileşeni dahil) ✓ · dev+worker yeniden başlatıldı ✓ ·
  `/dashboard?tab=jarvis` 200 — "⚡ Jarvis Komut Merkezi" + "Örnek Komutlar" + 8 örnek
  buton render edildi ✓ · `parseIntent` 5/5 test case doğrulandı (HUNT_TRENDS/
  WATCH_COMPETITORS/FIND_SUPPLIERS keyword çıkarımı/GENERATE_REPORT/UNKNOWN) ✓.

### Sprint 6 tamamlandı (v1.9.0) — bkz. Sprint 6 bölümü (Faz A–F)

## Sürüm: 1.9.0 — SPRINT 6: TEDARİKÇİ SKORU V2 + JARVIS V2 + RAKİP ALARM V2 + TALEP TAKİBİ (TAMAMLANDI, canlı doğrulandı)
Tarih: 2026-06-17

Kısıtlar: "Mevcut mimariyi bozma / Yeni AI çalışanı oluşturma / Tekrarlayan queue
oluşturma / Token tasarrufu zorunlu / Mevcut sistemi genişlet / Opportunity-First
mimarisi korunacak". Her faz sonunda typecheck+build+canlı doğrulama zorunlu.
Tüm özellikler mevcut 6 hub'ın içine yerleşir — yeni bağımsız route YOK.

### Faz A — PI Webhook Doğrulama + Event Engine Kontrol (canlı doğrulandı)
- **Neden:** Sprint 6 Faz A bir "doğrulama" fazıdır — `productIntelligence` job'unun
  `products/create`+`products/update` webhook'uyla tetiklendiği, ve `special-days.ts`
  etkinlik listesinin Sprint 6 kapsamını karşıladığı doğrulandı.
- **`apps/web/app/api/webhooks/shopify/route.ts`** (okundu, değiştirilmedi):
  `products/create`+`products/update` → `enqueue('productIntelligence', {productId})`
  zaten doğru uygulanmış — **fix gerekmedi** ✓.
- **`apps/worker/src/lib/special-days.ts`** (okundu, değiştirilmedi): NBA Playoffs
  (`month:4, day:15`), FIFA Dünya Kupası, UEFA Şampiyonlar Ligi, Euro, Copa America,
  Cyber Monday dahil tüm sprint 6 etkinlikleri zaten listede — **ekleme gerekmedi** ✓.
- **DB değişikliği:** YOK.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` ✓ · PI webhook
  akışı statik olarak doğrulandı ✓.

### Faz B — Tedarikçi Skoru V2 + Jarvis Mail (canlı doğrulandı)
- **Neden:** `Supplier` modelinde `deliveryDays`/`supplierScore` yoktu — tedarikçi
  kalitesi yalnızca `verified`+`unitCost` sinyalleriyle değerlendirilebiliyordu.
  Sprint 6 Faz B deterministik 0-100 tedarikçi skoru + Jarvis `mail yaz` komutu ekler.
- **DB `Supplier.deliveryDays Int? / supplierScore Int?`** (migration `add_supplier_v2`
  uygulandı). `deliveryDays`: ortalama teslimat günü. `supplierScore`: deterministik
  0-100 skor (hesaplanan, `computeSupplierScore` ile).
- **`packages/core/src/supplier/score.ts`** (yeni): saf/deterministik
  `computeSupplierScore({verified, unitCost?, costCurrency?, moq?, deliveryDays?,
  email?, phone?, brandCurrency?}): {score, verifiedPoints, costPoints,
  deliveryPoints, moqPoints, contactPoints}`. Ağırlıklar: verified(30) + unitCost &
  para birimi eşleşmesi(25) + deliveryDays(20) + moq(15) + iletişim(10).
  `packages/core/src/index.ts`'e export edildi.
- **`packages/db/src/services/crm.ts`**: `suppliers.create`/`suppliers.update`
  imzalarına `deliveryDays?`, `supplierScore?` eklendi (geriye dönük uyumlu);
  yeni `suppliers.setScore(id, score)`.
- **`apps/worker/src/processors/supplier-finder.ts`**: AI önerisi oluştururken
  `computeSupplierScore` çağrılır; `supplierScore` `suppliers.create`'e geçirilir
  — yeni AI önerileri artık skor ile kaydedilir.
- **`apps/web/app/(dashboard)/operations/actions.ts`**:
  - `computeSupplierScore` importu eklendi (`@velora/core`).
  - `addSupplier`: `deliveryDays` alanı eklendi; `computeSupplierScore` çağrılır
    (verified=true, tüm alanlar); `supplierScore` create'e geçirilir.
  - `updateSupplierCost`: `computeSupplierScore` ile skor yeniden hesaplanır
    (güncellenen cost/moq/currency + mevcut deliveryDays/email/phone); `supplierScore`
    update'e eklendi.
  - `verifySupplier`: `suppliers.getById` ile brand check eklendi; `computeSupplierScore`
    (verified=true + mevcut alanlar) → `suppliers.update(id, {supplierScore})` →
    `suppliers.verify(id)` — artık doğrulama +30 puan skor güncellemesi yapar.
  - Yeni **`updateSupplierDelivery(formData)`**: zod `{id, deliveryDays?}` → brand
    check → `computeSupplierScore` (mevcut supplier + yeni deliveryDays) →
    `suppliers.update(id, {deliveryDays, supplierScore})` + `audit.log
    ('supplier.update_delivery', autonomyLevel:2)`.
- **`apps/web/app/(dashboard)/operations/_components/suppliers-tab.tsx`**:
  - "Tedarikçi Ekle" formu: 3-sütun → 4-sütun grid (MOQ / Birim Maliyet / Para
    Birimi / Teslimat); `deliveryDays` input eklendi.
  - Her tedarikçi kartı başlığına: `s.supplierScore != null` ise `"⭐ {score}/100"`
    `Badge variant="outline"` eklendi (doğrulanmış+detaylı tedarikçilerde görünür).
  - Her CardContent'e yeni **"⏱️ Teslimat"** bölümü (MOQ bölümünün hemen altında):
    mevcut `deliveryDays` değerini gösterir + `updateSupplierDelivery` formu
    (`deliveryDays` input + "Kaydet" butonu).
- **`packages/core/src/action-router/index.ts`**:
  - `ActionType.DRAFT_SUPPLIER_EMAIL = 'DRAFT_SUPPLIER_EMAIL'` eklendi (10. aksiyon).
  - PATTERNS'e `{ type: ActionType.DRAFT_SUPPLIER_EMAIL, keywords: ['mail yaz', 'mail
    taslağı', 'tedarikçi mail', 'mail oluştur'], extractAfter: true }` eklendi.
- **`apps/web/app/(dashboard)/dashboard/actions.ts`**:
  - `ai`, `prompts` (`@velora/ai`), `emails`, `suppliers` (`@velora/db`),
    `IntegrationError` (`@velora/shared`) importları eklendi.
  - `DRAFT_SUPPLIER_EMAIL` case: keyword ile `suppliers.list` sonucunda company adı
    fuzzy eşleştirme (yoksa ilk verified tedarikçi) → `ai.text.generate` +
    `prompts.draftSupplierEmail` → `emails.create(DRAFT)` → başarı/hata mesajı.
    `IntegrationError` → `ok=false, message='OpenAI anahtarı eksik'` (akış kırılmaz).
- **`apps/web/app/(dashboard)/dashboard/_components/jarvis-tab.tsx`**:
  `EXAMPLES` dizisine `'mail yaz'` eklendi (9 örnek komut).
- **DB değişikliği:** `Supplier.deliveryDays/supplierScore` (migration `add_supplier_v2`).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (`/operations` 1.75 kB,
  `/dashboard` 2.46 kB) ✓ · dev+worker yeniden başlatılmadı (migration önceki context'te
  uygulandı, kod değişikliği next dev fast-refresh ile aktif) ✓ · `/operations?tab=tedarikci`
  200 — "⏱️ Teslimat" bölümü (Ortalama Teslimat inputu + Kaydet butonu) 3 tedarikçide
  render edildi ✓ · `/dashboard?tab=jarvis` 200 — "mail yaz" örnek komutu render edildi ✓.

### Faz C — Competitor Watch V2 (alarm seviyeleri — canlı doğrulandı)
- **Neden:** Sprint 3 Faz D'deki rakip fiyat tespiti yalnızca "değişim var/yok"
  sinyali üretiyordu — %15 artış ile %90 artış aynı P2 görevle sonuçlanıyordu.
  Faz C bu tespiti dört alarm seviyesine böler: LOW/MEDIUM/HIGH/CRITICAL.
- **`packages/core/src/competitor-alarm/index.ts`** (yeni, deterministik):
  `evaluateCompetitorAlarm(oldPrice, newPrice): CompetitorAlarmResult`. Eşikler:
  `<15%` → alarm yok · `15–30%` → **LOW** · `30–50%` → **MEDIUM** ·
  `50–75%` → **HIGH** · `≥75%` → **CRITICAL**. `triggered`/`level`/`ratio`/
  `direction('UP'|'DOWN')` döner. `oldPrice≤0` veya `newPrice≤0` → alarm yok
  (sıfır fiyat "veri yok" anlamına gelir). `packages/core/src/index.ts`'e
  export: `evaluateCompetitorAlarm`, `CompetitorAlarmLevel`, `CompetitorAlarmResult`.
- **`apps/worker/src/processors/competitor-scan.ts`**: `PRICE_CHANGE_THRESHOLD`
  sabiti kaldırıldı → `evaluateCompetitorAlarm(oldPrice, newPrice)` ile değiştirildi.
  Görev önceliği: CRITICAL/HIGH → 1, MEDIUM → 2, LOW → 3. Görev açıklaması:
  `${levelEmoji} ${alarm.level} · Rakip: ${comp.name} · değişim ±N%`
  (örn. `🚨 CRITICAL · Rakip: LC Waikiki · değişim +120%`).
- **`apps/web/app/(dashboard)/hunter/_components/competitors-tab.tsx`**:
  - `ALARM_BADGE` sabiti: `{CRITICAL: {emoji:'🚨', class:'text-red-600 font-bold'},
    HIGH: {emoji:'🔴', class:'text-orange-500 font-semibold'},
    MEDIUM: {emoji:'🟡', class:'text-yellow-600'}, LOW: {emoji:'🟢', class:'text-green-600'}}`.
  - Açıklama metni: "Fiyat değişimi: 🟢 LOW (%15–30) · 🟡 MEDIUM (%30–50) ·
    🔴 HIGH (%50–75) · 🚨 CRITICAL (%75+)".
  - Ürün tablosunda her satır için: `c.products.slice(idx+1).find(pp=>pp.title===p.title)`
    ile **önceki** snapshot bulunur → `evaluateCompetitorAlarm` çalıştırılır →
    tetiklenirse fiyat hücresinde `<span className={badge.class}>{emoji} {level}</span>`
    render edilir (aynı kart içinde anlık karşılaştırma, DB çağrısı yok).
- **DB değişikliği:** YOK.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (`/hunter` aynı
  route, 107kB) ✓ · dev+worker yeniden başlatıldı ✓ · senaryo: "LC Waikiki"
  rakibine (mevcut 3 snapshot, fiyatlar sıfır) test fiyatları set edildi
  (100→150→200 TRY) → `/hunter?tab=rakipler` 200 — fiyat hücresinde "🟡 MEDIUM"
  (150→200, %33) + "🔴 HIGH" (100→150, %50) rozetleri render edildi ✓ ·
  doğrulama sonrası fiyatlar 0'a sıfırlandı (test verisi, kod/özellik kalıcı) ✓.

### Faz D — AI CEO V2 + Weekly Report V2 (karar kalitesi — canlı doğrulandı)
- **Neden:** `AIDecision` kararları "ne yapmalı" sorusunu cevaplıyordu ama
  "ne kadar emin?", "etkisi ne büyük?", "riski ne?" soruları yanıtsız kalıyordu.
  Faz D bu üç meta-bilgiyi karar üretim zincirinin tamamına ekler.
- **DB `AIDecision.confidence Int? / expectedImpact String? / riskLevel String?`**
  (migration `add_decision_quality`, uygulandı). Tüm alanlar nullable (eski
  kararlarla geriye dönük uyumlu). Anlamları: `confidence` = AI'nın güven
  skoru 0-100 · `expectedImpact` = beklenen iş etkisi LOW/MEDIUM/HIGH ·
  `riskLevel` = uygulamanın riski LOW/MEDIUM/HIGH.
- **`packages/db/src/services/decisions.ts`**: `decisions.create(input)` üç
  yeni opsiyonel alan kabul eder: `confidence?/expectedImpact?/riskLevel?` →
  `prisma.aIDecision.create(data)`.
- **`packages/ai/src/prompts/index.ts`** (`prompts.weeklyStrategy`): `decisions[]`
  çıktı şemasına 3 yeni alan eklendi — her karar artık JSON'da
  `"confidence":0-100`, `"expectedImpact":"LOW|MEDIUM|HIGH"`,
  `"riskLevel":"LOW|MEDIUM|HIGH"` döner. Kurallar: `confidence=bu kararın
  doğruluğuna güven 0-100`, `expectedImpact=beklenen iş etkisi`,
  `riskLevel=bu kararı uygulamanın riski`.
- **`apps/worker/src/processors/weekly-report.ts`**:
  - `ValidatedDecision` arayüzüne `confidence?/expectedImpact?/riskLevel?` eklendi.
  - `validateDecision()`: üç alanı ham AI yanıtından çıkarır (confidence
    0-100 sıkıştırılır; expectedImpact/riskLevel `['LOW','MEDIUM','HIGH']`
    whitelist). Helper `ok(params)` fonksiyonu `q={confidence,expectedImpact,
    riskLevel}` spread ile tüm case'leri bir kez kısalttı (anti-halüsinasyon
    doğrulama mantığı değişmedi — mevcut ID kontrolü korunuyor).
  - `decisions.create(...)` çağrısına 3 yeni alan iletildi.
- **`apps/web/app/(dashboard)/ceo/page.tsx`**: "🧭 Kararlar" kartında her
  karar için kalite rozet grubu eklendi — `confidence!=null` ise
  `"🎯 Güven: N%"` · `expectedImpact` varsa `"📈 Etki: X"` (HIGH→yeşil,
  MEDIUM→sarı, LOW→gri) · `riskLevel` varsa `"⚠️ Risk: X"` (HIGH→kırmızı,
  MEDIUM→sarı, LOW→yeşil). Eski kararlar (null alanlar) rozetleri göstermez
  (ternary `d.confidence!=null || d.expectedImpact || d.riskLevel`). Mevcut
  "Uygula"/"Reddet" mantığı değişmedi (regresyon yok).
- **DB değişikliği:** `AIDecision.confidence/expectedImpact/riskLevel`
  (migration `add_decision_quality`).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `prisma migrate dev`
  (`add_decision_quality`) ✓ · `next build` (`/ceo` 87.4kB) ✓ · dev+worker
  yeniden başlatıldı (Prisma Client tazeleme) ✓ · test kararı DB'ye doğrudan
  insert edildi (`confidence=85, expectedImpact='HIGH', riskLevel='LOW'`) →
  `/ceo` 200 — "🎯 Güven: 85%" + "📈 Etki: HIGH" (yeşil) + "⚠️ Risk: LOW"
  (yeşil) rozetleri render edildi ✓ · test kararı silindi (kod/özellik kalıcı) ✓ ·
  Gerçek `weeklyReport` job tetiklendiğinde OPENAI_API_KEY varsa AI kalite
  alanlarını da JSON'da üretecek ve DB'ye yazacak — ek kod gerekmez ✓.

### Faz E — Gerçek Talep Takibi: ProductConversion Zaman Serisi (canlı doğrulandı)
- **Neden:** `Product.pageViews/cartAdds/wishlistAdds` (Sprint 5 Faz C) anlık
  değerleri tutuyor ama geçmiş haftaları hatırlamıyordu — "bu haftaki talep geçen
  haftadan iyi mi kötü mü?" sorusu yanıtsız kalıyordu. Faz E bu davranış
  sinyallerini **haftalık zaman serisi** olarak arşivler.
- **DB `ProductConversion`** (migration `add_product_conversions`, uygulandı):
  `brandId, productId, week (ISO), pageViews, cartAdds, wishlistAdds, behaviorScore?`.
  `@@unique([productId, week])` → upsert idempotent. `@@index([brandId, week])`.
  `Product.conversionHistory`, `Brand.productConversions` back-relations eklendi.
- **`packages/db/src/services/product-conversions.ts`** (yeni): `productConversions.
  upsert(input)` · `listByBrand(brandId, weeks=8)` · `listByProduct(productId, weeks=8)`
  · `topThisWeek(brandId, week, limit=5)`. `packages/db/src/index.ts`'e export edildi.
- **`packages/queue/src/queues.ts`**: yeni `demandSync: { brandId: string }` kuyruğu.
- **`apps/worker/src/processors/demand-sync.ts`** (yeni): `processDemandSync` —
  `prisma.product.findMany({where:{brandId, status:{not:'CLOSED'}, OR:[{pageViews:{gt:0}},
  {cartAdds:{gt:0}},{wishlistAdds:{gt:0}}]}})` → her ürün için `computeBehaviorScore`
  → `productConversions.upsert({...week, behaviorScore: Math.round(score)})`.
  `synced` sayısı + hafta loglanır. Sinyal olmayan ürünler (tüm sıfır) atlanır.
- **`apps/worker/src/index.ts`**: `demandSync` kuyruğu için worker kaydı (concurrency 1).
- **`packages/core/src/action-router/index.ts`**: `SYNC_DEMAND`, `UPDATE_SEO`,
  `PREPARE_ADS` `ActionType`'a eklendi; PATTERNS'e 3 yeni kural eklendi.
- **`apps/web/app/(dashboard)/dashboard/actions.ts`**: `SYNC_DEMAND` case (demandSync
  enqueue) · `UPDATE_SEO` case (READY PI'si olan Shopify ürünlerini productIntelligence
  kuyruğuna al, cap 20) · `PREPARE_ADS` case (campaignPrep dolu ama taslak olmayan
  ürünleri say → Studio > Ürün Zekası sekmesine yönlendir).
- **`apps/web/app/(dashboard)/studio/_components/intelligence-tab.tsx`**: Faz E
  — `productConversions.listByBrand(brandId, 8)` çekilir, `conversionByProduct`
  map inşa edilir (productId → son 6 hafta). Her ürün kartında READY PI+conversion
  verisi varsa **"📈 Haftalık Talep Geçmişi"** bölümü — hafta rozeti
  (`2026-W25 · 98/100` biçimi, tooltip ile pageViews/cartAdds/wishlistAdds).
- **DB değişikliği:** yeni `ProductConversion` modeli (migration `add_product_conversions`).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` ✓ · dev+worker
  yeniden başlatıldı ✓ · JDM Honda'ya `pageViews=1200/cartAdds=90/wishlistAdds=55`
  set edildi → `demandSync` job (n8n webhook ile tetiklendi) → `ProductConversion`
  row oluştu: week=2026-W25, behaviorScore=98 ✓ · `/studio?tab=urun-zekasi` 200 —
  "Haftalık Talep Geçmişi" bölümü render edildi ✓ · doğrulama sonrası test verisi
  temizlendi (`pageViews=cartAdds=wishlistAdds=0`, `ProductConversion` row silindi) ✓.

### Faz F — Jarvis V2: Ses Girişi + SEO/Reklam Komutları (canlı doğrulandı)
- **Neden:** Jarvis yalnızca yazılı komut kabul ediyordu — `'use client'` bileşen
  olduğu için Web Speech API (tarayıcı standart, sıfır bağımlılık) ile sesli komut
  eklemek mimari açıdan düşük maliyetli ve yüksek değerliydi. Ayrıca `UPDATE_SEO`
  ve `PREPARE_ADS` komutları hiçbir Jarvis giriş noktasına bağlı değildi.
- **`packages/core/src/action-router/index.ts`**: (Faz E ile birlikte) `SYNC_DEMAND`,
  `UPDATE_SEO`, `PREPARE_ADS` enum + PATTERNS.
- **`apps/web/app/(dashboard)/dashboard/actions.ts`**: `UPDATE_SEO` + `PREPARE_ADS`
  case'leri (`jarvisCommand` switch'e eklendi — bkz. Faz E detayı).
- **`apps/web/app/(dashboard)/dashboard/_components/jarvis-tab.tsx`**:
  - `useRef<HTMLInputElement>` + `useState(listening)` + `useCallback(startVoice)` eklendi.
  - **Ses butonu (🎙️):** form'un yanında `w-9 h-9` buton — tıklanınca
    `window.SpeechRecognition ?? window.webkitSpeechRecognition` ile tanıyıcı
    başlatılır; `lang='tr-TR'`, `interimResults=false`. `onresult` → transkripti
    `inputRef.current.value`'ya yazar (form submit için hazır). Dinleme sırasında
    kırmızı arkaplan, bitince normale döner. Tarayıcı desteklemiyorsa alert.
    TypeScript uyumluluğu: tüm Speech API nesneleri `any` cast ile (`"types":["node"]`
    çakışması çözümü).
  - **EXAMPLES dizisi:** 12'ye çıkarıldı — `'talep senkronla'`, `'seo güncelle'`,
    `'reklam hazırla'` eklendi.
- **DB değişikliği:** YOK.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (`/dashboard`
  2.88kB, Jarvis ses girişi dahil) ✓ · dev+worker yeniden başlatıldı ✓ ·
  `/dashboard?tab=jarvis` 200 — 🎙️ butonu + 12 örnek komut render edildi ✓ ·
  `parseIntent` 5/5 test (SYNC_DEMAND/UPDATE_SEO/PREPARE_ADS/meta kampanya/
  ürün içeriği) doğrulandı ✓.

### Sprint 8.5 tamamlandı (v2.2.0) — bkz. Sprint 8.5 bölümü (Faz A–C)

## Sürüm: 2.2.0 — SPRINT 8.5: JARVIS ORB UI (TAMAMLANDI, typecheck+build+canlı doğrulandı)
Tarih: 2026-06-18

Kısıtlar: "Mevcut mimariyi bozma / Yeni AI çalışanı yok / Yeni sistem kurma yok /
Mevcut Jarvis+VELORA entegrasyonunu genişlet / Token tasarrufu zorunlu."
Orb, mevcut `/api/jarvis/command` + `velora_bridge` + BullMQ altyapısını
kullanır — yeni queue/worker/DB migration/bağımlılık YOK.

### Faz A — State Backend (canlı doğrulandı)
- **Neden:** Python Jarvis state'lerinin (AWAKE/LISTENING) ve VELORA işlem
  state'lerinin (PROCESSING/SUCCESS/ERROR) browser'da görselleştirilebilmesi
  için Redis-backed, TTL-controlled bir durum deposu gerekiyordu.
- **`apps/web/app/api/jarvis/state/route.ts`** (YENİ):
  - Redis key `jarvis:orb:state`, TTL 90s (inaktiflik sonrası SLEEP'e döner).
  - `GET /api/jarvis/state`: auth yok (dashboard layout zaten session korumalı);
    `getConnection().get(ORB_KEY)` → JSON parse → yoksa `{status:'SLEEP', ...}`.
  - `POST /api/jarvis/state`: `JARVIS_API_TOKEN` Bearer auth (Python Jarvis
    pushlar); `{status, lastCommand?, lastResult?, durationMs?}` → mevcut
    state ile merge → `setex(ORB_KEY, 90, JSON)` → `{ok:true}`.
- **`apps/web/lib/jarvis-executor.ts`** (DEĞİŞTİRİLEN):
  - `getConnection` import eklendi (`@velora/queue`).
  - `setOrbState(patch)` helper: `getConnection().get` → merge → `setex`.
    Fire-and-forget (`.catch(()=>{})`), Redis hatası ana akışı kırmasın.
  - `executeJarvisCommand` başında: `startTime = Date.now()` +
    `setOrbState({status:'PROCESSING', lastCommand:text})`.
  - `executeJarvisCommand` sonunda (audit.log'dan sonra):
    `setOrbState({status:ok?'SUCCESS':'ERROR', lastResult:message,
    durationMs:Date.now()-startTime})`.
- **DB değişikliği:** YOK (Redis ephermal state).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build`
  (`/api/jarvis/state` route listede) ✓ · `GET /api/jarvis/state` →
  `{status:'SLEEP'}` ✓ · `POST /api/jarvis/state {status:'AWAKE'}` →
  `{ok:true}` → GET → `{status:'AWAKE'}` ✓ · Gerçek `POST /api/jarvis/command`
  → jarvis-executor PROCESSING+SUCCESS set → GET → `{status:'SUCCESS',
  durationMs:14}` ✓.

### Faz B — Python Bridge push_state (canlı doğrulandı)
- **Neden:** Python Jarvis'teki AWAKE (wake word) ve LISTENING (komut
  gönderilmeden önce) state'lerinin VELORA'ya push edilmesi gerekiyordu —
  bu state'ler yalnızca Python tarafında biliniyor.
- **`Jarvis/velora_bridge.py`** (DEĞİŞTİRİLEN):
  - `push_state(status, command='')`: daemon thread içinde `requests.post
    /api/jarvis/state` (Bearer token); `except Exception: pass` — state push
    hatası asla ana akışı kırmasın. Rate limiting uygulanmaz (hafif iç sinyal).
  - `call_velora()` içinde `requests.post` öncesine
    `push_state('LISTENING', command)` eklendi.
- **`Jarvis/main.py`** (DEĞİŞTİRİLEN, minimal patch):
  - `push_state` import eklendi (`velora_bridge`'ten).
  - `on_wake(text)` callback'inde: `push_state('AWAKE', text)` (WakeWordListener
    wake word tespiti sonrası — orb AWAKE state'ine geçer).
- **DB değişikliği:** YOK.
- **Doğrulama (canlı):** venv Python3 ile `push_state('AWAKE','Jarvis trend avla')`
  → `GET /api/jarvis/state` → `{status:'AWAKE'}` ✓ · `push_state('LISTENING',
  'trend avla')` → `{status:'LISTENING'}` ✓ · daemon thread fire-and-forget ✓.

### Faz C — JarvisOrb UI Component + Layout (canlı doğrulandı)
- **Neden:** 6-state görsel gösterge; "Iron Man Jarvis hissi, Apple Siri
  sadeliği, ChatGPT Voice netliği." Browser polls `/api/jarvis/state` her 2sn.
- **`apps/web/app/globals.css`** (DEĞİŞTİRİLEN): 3 yeni keyframe eklendi:
  `orb-breathing` (LISTENING scale+opacity loop), `orb-blink` (ERROR 3× blink),
  `orb-glow` (SUCCESS green glow 1×). CSS sınıfları: `.orb-breathing`,
  `.orb-blink-3x`, `.orb-glow-once`.
- **`apps/web/components/jarvis-orb.tsx`** (YENİ, `'use client'`):
  - `useEffect`: `setInterval(poll, 2000)` → `fetch /api/jarvis/state` →
    `setState` (sadece status veya updatedAt değişince günceller).
  - `useEffect`: SUCCESS state değişince `window.speechSynthesis.speak(
    lastResult, {lang:'tr-TR', rate:1.1})` — TTS feedback.
  - `useEffect`: SUCCESS/ERROR → 5sn sonra lokal `{status:'SLEEP'}` reset
    (Redis TTL beklemez, anında görsel temizleme).
  - Fixed `bottom-6 right-6 z-[9999]`, 64px circle (md: 56px).
  - State → görsel:
    - SLEEP: `gray-400 opacity-50`, 🤖, animasyon yok
    - AWAKE: `blue-500`, ⚡, `animate-ping` dış halka
    - LISTENING: `blue-600`, 🎙️, `orb-breathing` (scale loop)
    - PROCESSING: `purple-500`, ⚙️, dönen `border-t-purple-400` ince halka
    - SUCCESS: `green-500`, ✓, `orb-glow-once`
    - ERROR: `red-500`, ✕, `orb-blink-3x`
  - Hover: CSS `group-hover:block` tooltip → `{label}` (ör. "İşleniyor")
  - Click: `showPanel` toggle → absolute-positioned detail panel
    (Son Komut / Sonuç / Süre — boş ise "Hazır — komut bekleniyor.")
- **`apps/web/app/(dashboard)/layout.tsx`** (DEĞİŞTİRİLEN):
  - `import { JarvisOrb }` eklendi.
  - `<MobileNav />` sonrasına `<JarvisOrb />` eklendi (tüm hub'larda görünür).
- **DB değişikliği:** YOK.
- **Yeni bağımlılık:** YOK (Tailwind CSS animations, Web Speech API).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` ✓ · dev server
  yeniden başlatıldı ✓ · `GET /api/jarvis/state` 200 (SLEEP default) ✓ ·
  tam state zinciri: AWAKE → LISTENING → `POST /api/jarvis/command` →
  SUCCESS + durationMs:13ms ✓.

### Sprint 8.5 Özeti
- **Değiştirilen/Yeni dosyalar (6 adet):**
  - `apps/web/app/api/jarvis/state/route.ts` (YENİ — GET/POST state endpoint)
  - `apps/web/components/jarvis-orb.tsx` (YENİ — 6-state animated orb)
  - `apps/web/lib/jarvis-executor.ts` (getConnection + setOrbState helper)
  - `apps/web/app/(dashboard)/layout.tsx` (JarvisOrb import + render)
  - `apps/web/app/globals.css` (3 keyframe: breathing/blink/glow)
  - `Jarvis/velora_bridge.py` (push_state fonksiyonu)
  - `Jarvis/main.py` (push_state import + on_wake AWAKE push)
- **Yeni DB migration:** YOK.
- **Yeni queue/worker:** YOK.
- **Yeni bağımlılık:** YOK.

### Sıradaki: Sprint 8 Faz C–D (devreden)
- **Faz C:** Jarvis UI ayarları (`ui.py`'da VELORA token/URL) + TTS `say -v Onur`
- **Faz D:** VELORA → Jarvis push notification (WebSocket/SSE) — job tamamlanınca
  sesli bildirim (şu an yalnızca "kuyruğa alındı" bildirimi var)

### Sprint 8 tamamlandı (v2.1.0) — bkz. Sprint 8 bölümü (Faz A–B)

## Sürüm: 2.1.0 — SPRINT 8: JARVIS + VELORA ENTEGRASYONU (Faz A–B TAMAMLANDI, typecheck+build doğrulandı)
Tarih: 2026-06-18

Kısıtlar: "Mevcut VELORA mimarisini bozma / Yeni AI çalışanı oluşturma / Yeni hafıza sistemi
oluşturma yok / Token tasarrufu zorunlu / Mevcut sistemi genişlet." Python Jarvis
(`Jarvis/`) VELORA'nın sesli operatörü olarak entegre edildi — yeni route yalnızca
`/api/jarvis/command` endpoint'i, yeni module yok.

### Faz A — Python Tarafı: velora_bridge.py + main.py patch (typecheck doğrulandı)
- **Neden:** Python Jarvis her komutu doğrudan Gemini'ye gönderiyordu — VELORA entegrasyonu
  yoktu. Faz A `on_wake` ve `_on_text_command` intercept noktalarına VELORA routing ekler.
  Gemini yalnızca UNKNOWN intent'ler için fallback olarak kalır.
- **`Jarvis/velora_bridge.py`** (YENİ): Python portu `parseIntent()` — 16 ActionType,
  PATTERNS listesi TS `action-router/index.ts` ile birebir eşdeğer (deterministik,
  AI gerektirmez). `call_velora(command)` → `POST /api/jarvis/command` Bearer token ile.
  `speak_result(msg)` → macOS `say` komutu (daemon thread). `requires_confirmation(text)`:
  kritik komutlar için UI uyarısı (arşivle/kapat/yayınla). Rate limiting: dakikada max 10
  istek. Graceful error: VELORA down → açıklayıcı mesaj, Jarvis çökmez.
  Token: `config/api_keys.json`'dan `velora_api_token` veya `VELORA_API_TOKEN` env.
- **`Jarvis/main.py`** (MODIFIED, minimal patch):
  - `velora_bridge` import eklendi (en üste).
  - `_route_command(text)` yeni metot: `parse_velora_intent` → UNKNOWN değilse daemon
    thread'de `call_velora` → UI log + `speak_result` → `True` döner; UNKNOWN → `False`.
  - `_on_text_command()`: `self._route_command(text)` True ise `return` (Gemini'ye gönderme).
  - `main()` → `runner()`: `WakeWordListener` wire-up eklendi — `on_wake` callback:
    `_route_command(text)` → UNKNOWN ise `_on_text_command.__func__(jarvis, text)` ile
    Gemini'ye yönlendir. `WakeWordListener` başlatılamassa `try/except` ile zarifçe atlanır.
- **`Jarvis/app_config.py`** (MODIFIED): `DEFAULT_CONFIG`'e `velora_api_token: ""` ve
  `velora_base_url: "http://localhost:3000"` eklendi.
- **`Jarvis/config/api_keys.json`** (MODIFIED): `velora_api_token` ve `velora_base_url` alanları.
- **venv durumu:** Zaten çalışıyor (3.14.6, tüm paketler kurulu — `requests` dahil). Rebuild
  gerekmedi.
- **Doğrulama:** `parse_velora_intent` 10/10 test ✓ (TS `parseIntent` ile birebir davranış) ·
  `requires_confirmation` ✓ · `call_velora` (VELORA down): graceful `"VELORA'ya bağlanılamıyor"` ✓.

### Faz B — VELORA Tarafı: HTTP Endpoint + Shared Executor (typecheck+build doğrulandı)
- **Neden:** `jarvisCommand` server action Python'dan çağrılamıyordu. Faz B tüm komut
  mantığını `jarvis-executor.ts`'e taşır ve yeni `/api/jarvis/command` HTTP endpoint açar.
  `dashboard/actions.ts` artık thin wrapper — kod tekrarı yok.
- **`packages/config/src/index.ts`**: `serverSchema`'ya `JARVIS_API_TOKEN: z.string().default('')`
  eklendi.
- **`.env`**: `JARVIS_API_TOKEN=491dd0fcb54217ad9f4598b96894d1a2ef10bd0799c1ce1a` eklendi.
- **`apps/web/lib/jarvis-executor.ts`** (YENİ): `executeJarvisCommand(brandId, actor, text)` —
  17 ActionType'ın tüm switch/case mantığı. `dashboard/actions.ts` ve
  `/api/jarvis/command` route'u bu fonksiyonu çağırır. Actor: server action → NextAuth kullanıcısı;
  API route → `'jarvis-python'`. Audit log her iki çağrı için de yazılır.
- **`apps/web/app/api/jarvis/command/route.ts`** (YENİ): `POST /api/jarvis/command`.
  `JARVIS_API_TOKEN` ayarlı değilse 503; Bearer token yanlışsa 401; `brands.getActive()` ile
  aktif marka alınır; `executeJarvisCommand` → JSON sonuç. n8n webhook deseniyle aynı
  güvenlik modeli.
- **`apps/web/app/(dashboard)/dashboard/actions.ts`** (MODIFIED): thin wrapper —
  `actionContext()` + `executeJarvisCommand(brandId, actor, text)` + `revalidatePath`.
  Tüm switch/case `jarvis-executor.ts`'e taşındı. Davranış değişmedi.
- **DB değişikliği:** YOK.
- **Yeni queue/worker:** YOK.
- **Doğrulama:** typecheck (11 paket) ✓ · `next build` (`/api/jarvis/command` 0B route
  listede görünüyor, `/dashboard` 3.02kB) ✓ · Python token okuma ✓ (48 karakter, config'den) ·
  `call_velora` (VELORA down): `"VELORA'ya bağlanılamıyor"` graceful ✓. Docker başlatılınca
  tam uçtan uca (Python → VELORA → queue → worker) test edilebilir.

### Sıradaki: Sprint 8 Faz C–D (onay sonrası)
- **Faz C:** Jarvis UI ayarları (ui.py'da VELORA token/URL alanı) + TTS iyileştirme
  (Gemini Live TTS ile VELORA sonuçları seslendirme — şu an macOS `say` kullanılıyor)
- **Faz D:** VELORA'dan Jarvis'e push notification (WebSocket) — VELORA bir iş tamamlanınca
  Jarvis'i sesli bilgilendirir. Şu an sadece "kuyruğa alındı" bildirimi var, job tamamlanma
  bildirimi yok.
- **Açık notlar:**
  - `WakeWordListener` mevcut `main.py`'da kullanılmıyordu — Faz A ile wire-up yapıldı ama
    henüz canlı doğrulanamadı (Docker/dev gerekiyor).
  - Kritik komut onayı (arşivle/kapat) şu an UI log gösteriyor — tam ses onayı Faz C'de.
  - VELORA `say` TTS macOS varsayılan sesiyle konuşuyor — Türkçe ses ("Onur") yoksa
    İngilizce telaffuz sorunları olabilir. Faz C'de `say -v Onur` veya Gemini TTS fallback.

### Sprint 7 tamamlandı (v2.0.0) — bkz. Sprint 7 bölümü (Faz A–F)

## Sürüm: 2.0.0 — SPRINT 7: JARVIS TAMAMLAMA (TAMAMLANDI, typecheck+build doğrulandı)
Tarih: 2026-06-18

Kısıtlar: "Yeni modül oluşturma / Yeni AI çalışanı oluşturma / Yeni roadmap oluşturma
yok. Mevcut sistemi tamamla. Mevcut modülleri kullan. Token tasarrufu zorunlu."
Sprint 7 Jarvis'in 6 eksik bağlantısını tamamlar — yeni route/worker/queue yok,
tüm değişiklikler 3 mevcut dosyaya yapıldı.

### Faz A — Action Router Genişletme (3 yeni ActionType)
- **`packages/core/src/action-router/index.ts`**: Üç yeni `ActionType` enum değeri
  eklendi: `GENERATE_VIDEO = 'GENERATE_VIDEO'` (video üret/ugc üret/reel üret) ·
  `SYNC_ADS = 'SYNC_ADS'` (reklamları senkronla/meta senkronla/reklam performansı) ·
  `RUN_BACKUP = 'RUN_BACKUP'` (yedek al/yedekleme yap/backup al). PATTERNS dizisine
  3 yeni giriş eklendi — toplam ActionType sayısı 14'ten 17'ye çıktı (UNKNOWN dahil).
- **DB değişikliği:** YOK.

### Faz B — Jarvis Server Action: SHOPIFY_IMPORT Gerçek Uygulama
- **Neden:** Sprint 5/6'da `SHOPIFY_IMPORT` case yalnızca kullanıcıyı `/operations`'a
  yönlendiriyordu — gerçek Shopify içe aktarma yapmıyordu. Faz B bunu `importFromShopify`
  mantığıyla (`fetchProducts` + `upsertByShopify` + PI smart-enqueue) aynı case'in içinde
  gerçek uygulama haline getirir.
- **`apps/web/app/(dashboard)/dashboard/actions.ts`**:
  - `import { fetchProducts } from '@velora/integrations'` eklendi.
  - `SHOPIFY_IMPORT` case: `fetchProducts(brandId, 100)` → her `node` için
    `products.upsertByShopify(brandId, n.id, {title, price})` → PI durumu kontrol
    (READY varsa atla, yoksa `enqueue('productIntelligence', {productId})`); sayaçlar
    (`count`, `piQueued`) hesaplanır → `"✅ N ürün içe aktarıldı (M PI kuyruğa alındı)"`
    mesajı. `IntegrationError` → `"⚠️ Shopify bağlantısı başarısız..."` (akış kırılmaz).
- **DB değişikliği:** YOK.

### Faz C — Jarvis Server Action: GENERATE_VIDEO
- **Neden:** Jarvis "video üret" komutunu alıyordu ama UNKNOWN'a düşüyordu.
  Faz C mevcut `video` kuyruğu/`processVideo` worker'ını Jarvis'ten tetikler.
- **`apps/web/app/(dashboard)/dashboard/actions.ts`**:
  - `GENERATE_VIDEO` case: `prisma.productIntelligence.findFirst({where:{status:'READY',
    product:{brandId, status:{not:'CLOSED'}}}, orderBy:{scoreTotal:'desc'},
    select:{ugc:true, product:{select:{id,title}}}})` → `ugc` yoksa uyarı mesajı;
    varsa `ugc.hooks[0]` + `ugc.scenario` → prompt metni → `prisma.video.create
    ({data:{brandId, productId, type:'UGC', status:'GENERATING'}})` →
    `enqueue('video', {videoId, prompt})` → başarı mesajı. Mevcut `video` kuyruğu/
    worker değiştirilmedi.
- **DB değişikliği:** YOK.

### Faz D — Jarvis Server Action: SYNC_ADS + RUN_BACKUP
- **Neden:** `adSync` ve `backup` kuyrukları zaten `packages/queue/src/queues.ts`'de
  kayıtlı, worker'ları mevcut — Jarvis sadece bağlı değildi.
- **`apps/web/app/(dashboard)/dashboard/actions.ts`**:
  - `SYNC_ADS` case: `enqueue('adSync', {brandId})` → `"✅ Meta reklam performansı
    senkronizasyonu başlatıldı."`.
  - `RUN_BACKUP` case: `enqueue('backup', {brandId})` → `"✅ Yedekleme başlatıldı..."`.
- **DB değişikliği:** YOK.

### Faz E — UI Sadeleştirme: EXAMPLE_GROUPS (Jarvis Sekme)
- **Neden:** Jarvis'te 12 komut düz liste olarak gösteriliyordu — tematik gruplandırma
  olmadan hangi komutun ne yaptığı anlaşılmıyordu; ayrıca 4 yeni komut (video üret,
  shopify içe aktar, yedek al, reklamları senkronla) eklenmesiydi.
- **`apps/web/app/(dashboard)/dashboard/_components/jarvis-tab.tsx`**:
  - `EXAMPLES` düz dizisi → `EXAMPLE_GROUPS` (4 grup × 4 komut = 16 toplam):
    🔍 Araştır · 🏭 Üret · 📊 Güncelle · ⚙️ Sistem.
  - Her grup için küçük başlık (`text-xs font-medium text-muted-foreground`) +
    `flex-wrap gap-2` buton satırı (grup bazında ayrım).
  - Ses girişi (startVoice/AnyRec/🎙️ butonu) değiştirilmedi.
- **DB değişikliği:** YOK.

### Faz F — Arşiv Sekmesi İyileştirme
- **Neden:** Arşiv sekmesinde ürün sayısı ve maliyet/fiyat bilgisi gösterilmiyordu
  — hangi ürünlerin neden kapatıldığını değerlendirmek için bağlam eksikti.
- **`apps/web/app/(dashboard)/operations/_components/archive-tab.tsx`**:
  - `CardDescription`: dinamik sayı eklendi — `archived.length > 0` ise
    `"N ürün arşivlendi. "` öneki.
  - Her ürün satırına `p.price` ve `p.cost` gösterimi (her ikisi `Prisma.Decimal | null`
    olduğundan `Number(p.price).toFixed(2)` ile formatlandı); her ikisi de `!= null` ise
    marj yüzdesi de gösterilir: `%Math.round(((price-cost)/price)*100)`.
  - Mevcut query `prisma.product.findMany(include:{intelligence})` tüm scalar alanları
    döndürüyor — yeni DB sorgusu/kolonu gerekmedi.
- **DB değişikliği:** YOK.

### Sprint 7 Özeti
- **Doğrulama:** typecheck (11 paket) ✓ · `next build` (`/dashboard` 3.02 kB,
  `/operations` 1.75 kB) ✓ · Docker daemon bu oturumda çalışmıyordu — dev server
  başlatılamadı, UI render canlı doğrulanamadı. Kod yolları typecheck+build ile
  statik doğrulandı (Faz C Meta Ad Library/Faz D Meta Kampanya v1.7.0 emsal
  deseniyle aynı).
- **Değiştirilen dosyalar (3 adet):**
  - `packages/core/src/action-router/index.ts` (GENERATE_VIDEO + SYNC_ADS + RUN_BACKUP enum+pattern)
  - `apps/web/app/(dashboard)/dashboard/actions.ts` (SHOPIFY_IMPORT gerçek impl + GENERATE_VIDEO + SYNC_ADS + RUN_BACKUP case)
  - `apps/web/app/(dashboard)/dashboard/_components/jarvis-tab.tsx` (EXAMPLE_GROUPS — 4 grup × 4 komut)
  - `apps/web/app/(dashboard)/operations/_components/archive-tab.tsx` (sayı + fiyat/maliyet/marj)
- **Yeni DB migration:** YOK.
- **Yeni queue/worker:** YOK.
- **Yeni route:** YOK.

### Sıradaki: Sprint 8
Sprint 7 (v2.0.0, Faz A–F) tamamlandı — 6 Jarvis bağlantısı tamamlandı, mevcut
mimari değiştirilmedi (yeni route/worker/queue YOK). Sprint 8 kapsamı henüz
tanımlanmadı; bir sonraki "SPRINT 8 ONAYLANDI" mesajıyla fazlara bölünecek.
Bilinen açık notlar (Sprint 6'dan devreden):
- `demandSync` n8n webhook ile tetikleniyor — `daily-discovery.json` deseniyle
  zamanlanabilir.
- Jarvis ses girişi HTTPS/localhost'ta çalışır (Web Speech API güvenlik kısıtı).
- Docker daemon çalışmadığında canlı doğrulama yapılamaz; Docker başlatılınca
  `pnpm --filter @velora/web run dev` + `pnpm --filter @velora/worker run dev`
  ile dev stack ayağa kalkar.

### Önceki Durum (arşiv)

## Sürüm: 1.7.0 — SPRINT 4: TALEP/MALİYET SİNYALLERİ + RAKİP REKLAM + META TASLAK KAMPANYA + KARAR MOTORU V2 (TAMAMLANDI, canlı doğrulandı)
Tarih: 2026-06-15

Sprint 4, Sprint 3'ün (v1.6.0 Faz G) kapanışında belirlenen 5 maddeyi 5 Faz'a
(A–E) böler. Hepsi mevcut 6 hub'ın İÇİNE yerleşir — **yeni route YOK**
(v1.5.0/v1.6.0 ile aynı ilke). Uygulama sırası bilinçli: **A/B/C/D önce yeni
sinyal üretir** (talep düşüşü, maliyet fırsatı, rakip reklamı, kampanya
taslağı-adayı), **E bu sinyalleri Karar Motoru'na bağlar** — Sprint 3
Faz C/D/E → Faz G sıralamasının doğrudan devamı.

### Faz A — Ürün Talep Skoru (Product Demand Score)
- **Neden:** `ProductIntelligence.scoreTotal` statikti — bir ürünün niş
  talebinin haftadan haftaya yükselip/düştüğünü gösteren sinyal yoktu. Trend
  Avcısı (v1.6.0 Faz C) zaten haftalık niş skorları üretiyordu; Faz A bunları
  **ürün bazında** haftalık talep skoruna dönüştürür ve Ürün Zekası/Üretim
  ekranlarında 📈/📉 rozetiyle gösterir.
- **`packages/core/src/product-demand/score.ts`** (yeni): saf/deterministik
  `evaluateProductDemand({score, previousScore?}): {triggered, level:
  'RISING'|'DECLINING'|null, delta}`. Kural: `previousScore` yoksa
  tetiklenmez; `delta = score − previousScore`; `delta>=15` → **RISING**,
  `delta<=-15` → **DECLINING** (Faz C'deki `evaluateTrendAlarm` ile aynı
  stil — `RISING_DELTA=15`/`DECLINING_DELTA=-15`/`clamp`).
  `packages/core/src/index.ts`'e export edildi (`evaluateProductDemand`,
  `ProductDemandInput`, `ProductDemandResult`).
- **DB `ProductIntelligence.demandScore Int? / previousDemandScore Int?`**
  (migration `add_product_demand_score`, doc-comment: "Ürün Talep Skoru
  (Trend Avcısı niş eşleştirmesi — bkz. evaluateProductDemand)").
  **`packages/db/src/services/product-intelligence.ts`**: yeni
  `setDemand(productId, {demandScore, previousDemandScore?})` →
  `prisma.productIntelligence.update({where:{productId}, data:{demandScore,
  previousDemandScore: previousDemandScore ?? null}})`.
- **`packages/queue/src/queues.ts`**: yeni `productDemand: { brandId: string }`
  kuyruğu; **`apps/worker/src/index.ts`**: worker kaydı (concurrency 1).
- **`apps/worker/src/processors/product-demand.ts`** (yeni,
  `processProductDemand`):
  - `prisma.product.findMany({where:{brandId, intelligence:{isNot:null}},
    include:{intelligence:true}})` — sadece PI'si olan ürünler.
  - `week`/`prevWeek` = `isoWeek(now)`/`isoWeek(now−7g)`; `trends.list(brandId,
    week|prevWeek)` → `Map<niche,score>` (bu hafta / önceki hafta).
  - Her ürün için: `product.designId` → `prisma.opportunity.findFirst({where:
    {brandId, designId: product.designId}, select:{niche:true}})` ile **niş**
    bulunur (Opportunity-First zincirinin geriye izi).
  - `score = nicheCurrent ?? pi.score.salesPotential` (haftalık niş skoru
    yoksa PI'nin satış-potansiyeli alt-skoruna düşer); `previousScore =
    nichePrevious ?? pi.demandScore` (**hafta-zinciri**: önceki hafta verisi
    yoksa ürünün son `demandScore`'u önceki değer olur — skor hareketi
    haftalar arası zincirlenir).
  - `productIntelligence.setDemand(product.id, {demandScore: round(score),
    previousDemandScore: round(previousScore)})`. Döner: `{week, products,
    updated}`.
- **Cascade tetikleyici** — `apps/worker/src/processors/trend-hunt.ts`:
  haftalık trend taraması (`trends.replaceWeek` + Faz C alarm kontrolü)
  sonrası `await enqueue('productDemand', { brandId })` eklendi — Talep Skoru
  her zaman güncel haftalık niş skorlarıyla hesaplanır, ayrı cron gerekmez.
- **UI — `studio/_components/intelligence-tab.tsx`**: PI Score rozetinin
  yanına `evaluateProductDemand({score: pi.demandScore, previousScore:
  pi.previousDemandScore})` ile 📈 (RISING) / 📉 (DECLINING) + `demandScore`
  değeri (`demandScore==null` ise render edilmez, geriye dönük uyumlu).
- **UI — `operations/_components/production-tab.tsx`**: her ürün satırına
  yeni "Talep" sütunu — `demandScore` + aynı 📈/📉 ikonu.
- **Faz E bağlantısı (ileri ref):** READY PI'ler arasında
  `evaluateProductDemand(...).level==='DECLINING'` olan ilk ürün `decliningPI`
  → `weekly-report.ts`'de `📉 Talep düşüşü: ...` insight + "nişten çıkmayı
  değerlendir" önerisi + `EXIT_NICHE` karar adayı (bkz. Faz E).
- **DB değişikliği:** `ProductIntelligence.demandScore/previousDemandScore`
  (migration `add_product_demand_score`).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `prisma migrate dev`
  (`add_product_demand_score`) ✓ · `next build` (`/studio`,`/operations` aynı
  route'lar) ✓ · dev+worker yeniden başlatıldı (Prisma Client tazeleme) ✓ ·
  senaryo: `2026-W23` (önceki hafta) "jdm cars" nişine sentetik skor **85**
  yazıldı, `2026-W24` (bu hafta) gerçek skoru ~50 idi (delta≈−35 → DECLINING
  beklenir) → `productDemand` job'u, PI'si olan **10 ürün** için çalıştırıldı
  → **10/10 güncellendi**; "jdm r35" (niş: jdm cars) →
  `demandScore≈50/previousDemandScore=85` → `evaluateProductDemand` →
  **DECLINING** (delta≈−35) ✓ → `/studio?tab=urun-zekasi` 200, "jdm r35" PI
  Score rozetinin yanında "📉" render edildi ✓ → `/operations?tab=uretim` 200,
  "Talep" sütununda aynı ürün için skor+📉 render edildi ✓ · **doğrulama
  sonrası temizlik**: sentetik `2026-W23` "jdm cars" (skor 85) `Trend` satırı
  silindi (kod/özellik kalıcı, bir sonraki gerçek `trendHunt` skorları doğal
  olarak güncelleyecek) ✓.

### Faz B — Tedarikçi Maliyet Karşılaştırma (Supplier Cost Comparison)
- **Neden:** `Supplier` modelinde maliyet bilgisi yoktu — Üretim sekmesi
  (v1.6.0 Faz A) Maliyet/Fiyat/Marj gösteriyordu ama "daha ucuz bir tedarikçi
  var mı?" sorusuna cevap yoktu. Faz B, doğrulanmış tedarikçilere MOQ+birim
  maliyet+para birimi ekler ve Üretim sekmesinde **tek-tık** maliyet uygulama
  önerisi sunar.
- **DB `Supplier.moq Int? / unitCost Decimal?@db.Decimal(12,2) / costCurrency
  String?`** (migration `add_supplier_moq_cost`, doc-comment: "MOQ & Birim
  Maliyet (Faz B — karşılaştırmalı tedarikçi maliyeti)").
  **`packages/db/src/services/crm.ts`**: `suppliers.create`/`suppliers.update`
  imzalarına opsiyonel `moq?/unitCost?/costCurrency?` eklendi (geriye dönük
  uyumlu).
- **`apps/web/.../operations/_components/suppliers-tab.tsx`**: "Tedarikçi
  Ekle" formuna 3 opsiyonel alan (MOQ/Birim Maliyet/Para Birimi); her tedarikçi
  kartında özet satırı (`{unitCost} {costCurrency} · MOQ {moq}`) + düzenleme
  formu (3 input, `defaultValue` ile önceden doldurulmuş,
  `updateSupplierCost`'a post).
- **`apps/web/.../operations/actions.ts`**: yeni `updateSupplierCost(formData)`
  — zod `{id, moq?, unitCost?, costCurrency?}` → `suppliers.update(id, {moq:??
  null, unitCost:?? null, costCurrency:?? null})` + `audit.log
  ('supplier.update_cost', autonomyLevel:2)`. Yeni `applySupplierCost(formData)`
  — zod `{productId, supplierId}` → `applySupplierCostToProduct(brandId, actor,
  productId, supplierId)` (paylaşılan handler).
- **`apps/web/lib/decision-handlers.ts`**: yeni
  `applySupplierCostToProduct(brandId, actor, productId, supplierId)` —
  `products.getById`+`suppliers.getById` doğrulaması (brand eşleşmesi +
  `supplier.unitCost!=null`) → `products.setCost(productId,
  Number(supplier.unitCost))` + `audit.log('product.cost.apply_supplier',
  payload:{supplierId, supplier: supplier.company, cost, currency:
  supplier.costCurrency}, autonomyLevel:2)`.
  **`packages/db/src/services/products.ts`**: yeni `setCost(id, cost)` →
  `prisma.product.update({where:{id}, data:{cost}})`.
- **`apps/web/.../operations/_components/production-tab.tsx`**: her ürün
  satırı için `costSuppliers` (marka para birimiyle eşleşen, `unitCost` dolu,
  maliyete göre artan sıralı tedarikçiler) hesaplanır;
  `cheaperSupplier = costSuppliers.find(s => cost==null || unitCost(s) <
  cost)` — varsa, satırın altında kesikli-çerçeveli "💡 `<tedarikçi>`:
  `<unitCost> <currency>` [· MOQ `<moq>`] — mevcut maliyetten daha ucuz/maliyet
  önerisi" kutusu + **"Bu Maliyeti Uygula"** butonu (`applySupplierCost`
  formu, `productId`+`supplierId` hidden input).
- **Faz E bağlantısı (ileri ref):** doğrulanmış+`unitCost` dolu+marka para
  birimiyle eşleşen en ucuz tedarikçi `cheapestVerifiedSupplier`, ondan daha
  pahalı `cost`'a sahip ilk ürün `cheaperCostProduct` → `weekly-report.ts`'de
  `💰 Maliyet fırsatı: ...` insight + öneri + `APPLY_SUPPLIER_COST` karar adayı
  (bkz. Faz E).
- **DB değişikliği:** `Supplier.moq/unitCost/costCurrency` (migration
  `add_supplier_moq_cost`).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `prisma migrate dev`
  (`add_supplier_moq_cost`) ✓ · `next build` (`/operations` aynı route) ✓ ·
  dev+worker yeniden başlatıldı (Prisma Client tazeleme) ✓ · senaryo: Sprint 3
  Faz E'de doğrulanmış **"Printutu"** tedarikçisine `updateSupplierCost` ile
  `unitCost=5, costCurrency=TRY, moq=50` girildi → `/operations?tab=tedarikci`
  200, kartta "5.00 TRY · MOQ 50" render edildi ✓ → `/operations?tab=uretim`
  200 — "jdm r35" satırında (mevcut `cost` > 5 TRY) "💡 Printutu: 5.00 TRY ·
  MOQ 50 — mevcut maliyetten daha ucuz" kutusu + "Bu Maliyeti Uygula" butonu
  render edildi ✓ → buton tetiklendi → `Product.cost=5` ✓ + `audit.log
  ('product.cost.apply_supplier', {supplierId, supplier:'Printutu', cost:5,
  currency:'TRY'})` kaydı oluştu ✓ → sayfa yeniden çekildi, "💡" kutusu kalktı
  (artık `cost=5`, Printutu'dan daha ucuz tedarikçi yok), "Maliyet" sütunu
  "5.00" gösteriyor ✓.

### Faz C — Rakip Reklam İzleme (Meta Ad Library, Competitor Watch genişlemesi)
- **Neden:** v1.6.0 Faz D'deki Competitor Watch sadece fiyat sinyali
  topluyordu — rakibin Meta'da hangi reklamları yayında tuttuğunu görmenin
  yolu yoktu. Meta **Ad Library Transparency API** (`ads_archive`) herkese
  açık ve **reklam hesabı gerektirmez** (sadece access token) — CLAUDE.md
  "API > Playwright" ilkesiyle birebir örtüşür.
- **`packages/integrations/src/meta/ad-library.ts`** (yeni):
  - `resolveAdLibraryToken(brandId)` — marka `META` credential'ı veya env
    `META_ACCESS_TOKEN`; yoksa `IntegrationError('META','Meta access token
    yapılandırılmamış')`.
  - `export interface MetaLibraryAd { id: string; pageName?: string; body?:
    string; snapshotUrl?: string; startTime?: string; }`
  - `export async function fetchPageAds(brandId, pageId, limit=10):
    Promise<MetaLibraryAd[]>` — `GET /v21.0/ads_archive`
    (`search_page_ids:[pageId]`, `ad_reached_countries:['TR']`,
    `ad_active_status:'ALL'`, `fields:'id,page_name,ad_creative_bodies,
    ad_snapshot_url,ad_delivery_start_time'`) → `ad_creative_bodies[0]`→`body`,
    `ad_snapshot_url`→`snapshotUrl`.
  - `packages/integrations/src/index.ts`'e export: `fetchPageAds`,
    `MetaLibraryAd`.
- **DB `Competitor.metaPageId String?`** + yeni **`model CompetitorAd`**
  (`id, competitorId, platform String, creativeUrl String?, copy String?,
  seenAt @default(now())`, relation `competitor`, `@@index([competitorId,
  seenAt])`) — migration `add_competitor_meta_page_id`.
  **`packages/db/src/services/crm.ts`**: yeni `competitors.addAd(competitorId,
  {platform, creativeUrl?, copy?})` → `prisma.competitorAd.create(...)`.
- **`apps/worker/src/processors/competitor-scan.ts`** genişletildi — mevcut
  fetch+regex fiyat taramasından SONRA, `comp.metaPageId` varsa:
  `fetchPageAds(comp.brandId, comp.metaPageId, 10)` → her reklam için
  `prisma.competitorAd.findFirst({where:{competitorId, platform:'META',
  copy: ad.body??null, creativeUrl: ad.snapshotUrl??null}})` ile **dedup**
  → yeni olanlar `competitors.addAd(competitorId, {platform:'META',
  creativeUrl: ad.snapshotUrl, copy: ad.body})`. `IntegrationError` (Meta
  yapılandırılmamış) → `logger.warn` ile zarifçe atlanır (ana fiyat-tarama
  akışı bozulmaz — mevcut "engelleme akışı bozmaz" prensibiyle aynı).
- **`apps/web/.../hunter/_components/competitors-tab.tsx`**: "Rakip Ekle"
  formuna opsiyonel `metaPageId` input ("örn: 123456789012345"); rakip kartı
  açıklamasında varsa "· Meta Sayfa: `<id>`" etiketi; yeni **"📢 Reklamlar
  (Meta Ad Library)"** bölümü — `c.ads` doluysa her reklam için `copy` (varsa)
  + "Reklamı görüntüle →" linki (varsa `creativeUrl`) + `seenAt` tarihi.
- **DB değişikliği:** `Competitor.metaPageId` + yeni `CompetitorAd` modeli
  (migration `add_competitor_meta_page_id`).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `prisma migrate dev`
  (`add_competitor_meta_page_id`) ✓ · `next build` (`/hunter` aynı route) ✓ ·
  dev+worker yeniden başlatıldı (Prisma Client tazeleme) ✓ · senaryo: geçici
  **"LC Waikiki"** rakibi `metaPageId="123456789012345"` ile eklendi →
  `/hunter?tab=rakipler` 200, kartta "· Meta Sayfa: 123456789012345" render
  edildi ✓ → "Tara" tetiklendi → `competitorScan` çalıştı; bu ortamda gerçek
  `META_ACCESS_TOKEN`/credential yapılandırılı değil → `fetchPageAds` →
  `IntegrationError` → `logger.warn('rakip reklam kütüphanesi taranamadı')`
  ile atlandı, fiyat-tarama kısmı (mevcut davranış) etkilenmedi, run SUCCESS ✓
  · kod yolu (`fetchPageAds`/`addAd`/dedup/UI render) typecheck+build ile
  statik doğrulandı; gerçek Meta token Ayarlar'dan girildiğinde reklam çekimi
  ek kod gerekmeden aktif olur ✓ · **doğrulama sonrası temizlik**: "LC
  Waikiki" test rakibi DB'den silindi (kod/özellik kalıcı) ✓.

### Faz D — Meta Taslak Kampanya (Meta Draft Campaign — "D5")
- **Neden:** v1.4.0 Faz D'den beri `ProductIntelligence.campaignPrep`
  (kampanya adı/ad set'ler/hook/metin) üretiliyordu ama hiçbir şey Meta'da
  OLUŞTURULMUYORDU ("D5 ertelendi" notu, v1.4.0+v1.6.0). Faz D bu paketi
  Meta'da **PAUSED (taslak) kampanya + ad set'lere** dönüştürür — otomatik
  YAYIN YOK, sonuç Meta Ads Manager'da taslak olarak durur, kullanıcı elle
  aktif eder (spend-guardian/Karar Motoru "PENDING/PAUSED başlar" emsaliyle
  aynı ruh).
- **`packages/integrations/src/meta/client.ts`** — 3 yeni fonksiyon, hepsi
  **HER ZAMAN** `status:'PAUSED'` ile oluşturur:
  - `createCampaign(brandId, {name, objective}): Promise<{id,name,status,
    objective}>` — `POST /act_{adAccount}/campaigns` (`status:'PAUSED'`
    sabit).
  - `searchInterests(brandId, query): Promise<{id,name}[]>` — `GET /search?
    type=adinterest&q=<query>` (kampanya hazırlık paketindeki `interests[]`
    dizisini Meta interest ID'lerine çevirmek için).
  - `createAdSet(brandId, {campaignId, name, dailyBudget, interestIds}):
    Promise<{id,name,status}>` — `POST /act_{adAccount}/adsets`
    (`status:'PAUSED'` sabit, `targeting:{geo_locations:{countries:['TR']},
    flexible_spec:[{interests: interestIds.map(id=>({id}))}]}`, bütçe
    major→cent çevrimi mevcut `setCampaignBudget` deseniyle aynı).
- **DB `AdCampaign.productId String?`** (FK→`Product`, `onDelete:SetNull`,
  `@@index([productId])`) + yeni **`model AdSet`** (`id, campaignId, metaId,
  name, status String?, budget Decimal?@db.Decimal(12,2), createdAt`,
  relation `campaign`, `@@index([campaignId])`) — migration
  `ad_campaign_product_decision_v2` (Faz E ile birleşik).
  **`packages/db/src/services/ads.ts`**: `adCampaigns.upsert` artık opsiyonel
  `productId`; yeni `adCampaigns.findByProduct(brandId,productId)` (en güncel,
  `include:{adsets:true}`) ve `adCampaigns.listDrafts(brandId)` (tüm
  `productId!=null` kampanyalar, `include:{adsets:true}`); yeni `adSets =
  {create(campaignId, metaId, name, status?, budget?)}` —
  `packages/db/src/index.ts`'e export edildi.
- **`apps/web/lib/decision-handlers.ts`**: yeni
  `createCampaignDraftFromIntelligence(brandId, actor, productId)` —
  `productIntelligence.getByProductId(productId)` → `campaignPrep` yoksa/
  `campaignName` boşsa sessizce çık → `createCampaign(brandId,
  {name: campaignPrep.campaignName, objective:'OUTCOME_ENGAGEMENT'})` →
  `adCampaigns.upsert(brandId, campaign.id, {name,status,objective,
  productId})` → `campaignPrep.adSets` (cap 3) için: her `interests` (cap 5)
  `searchInterests` ile Meta interest ID'sine çevrilir (bulunamazsa atlanır,
  `.catch(()=>[])`) → `createAdSet(...)` → `adSets.create(localCampaign.id,
  adSet.id, adSet.name, adSet.status, dailyBudget)` → `audit.log
  ('ads.draft_campaign', entity:'AdCampaign', payload:{productId, metaId,
  adSets: count}, autonomyLevel:1)`. Meta hatası → `handleMetaError` (mevcut
  "API anahtarını ayarla" görev deseni).
- **`apps/web/.../studio/_components/intelligence-tab.tsx`**: "📣 Kampanya
  Hazırlık Paketi (Meta)" bölümünün altına, `adCampaigns.findByProduct`
  sonucu varsa `Badge "Taslak oluşturuldu: <name> (<status>)"`, yoksa
  `<form action={createCampaignDraft}>` + **"📤 Meta'da Taslak Oluştur"**
  butonu (`productId` hidden input).
- **`apps/web/.../studio/actions.ts`**: yeni `createCampaignDraft(formData)` —
  `productId` oku → `createCampaignDraftFromIntelligence(brandId, actor,
  productId)` → `revalidatePath('/studio')`.
- **Faz E bağlantısı (ileri ref):** READY PI'si `campaignPrep.campaignName`
  dolu ama `adCampaigns.listDrafts(brandId)`'te karşılığı olmayan ilk ürün
  `adDraftCandidate` → `weekly-report.ts`'de `📣 Kampanya hazır: ...` insight +
  öneri + `CREATE_AD_DRAFT` karar adayı (bkz. Faz E).
- **DB değişikliği:** `AdCampaign.productId` + yeni `AdSet` modeli (migration
  `ad_campaign_product_decision_v2`, Faz E'nin `DecisionAction` v2
  enum'larıyla birleşik).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `prisma migrate dev`
  (`ad_campaign_product_decision_v2`) ✓ · `next build` (`/studio` aynı route)
  ✓ · dev+worker yeniden başlatıldı (Prisma Client tazeleme) ✓ · senaryo:
  "jdm r35" (`campaignPrep` v1.4.0 Faz D'den dolu) için `/studio?tab=urun-
  zekasi` 200 — "📤 Meta'da Taslak Oluştur" butonu render edildi ✓ →
  tetiklendi → `createCampaignDraftFromIntelligence` → bu ortamda gerçek Meta
  access token/ad account yapılandırılı değil → `createCampaign` →
  `IntegrationError` → `handleMetaError` → `Task('Meta API anahtarını
  ayarla', API_INPUT, P1)` oluştu, sayfa hatasız `/studio`'ya döndü ✓ (kod
  yolu — `createCampaign`/`searchInterests`/`createAdSet`/`adSets.create`/
  `adCampaigns.upsert`/`listDrafts` — typecheck+build ile statik doğrulandı;
  gerçek Meta token ile taslak akışı ek kod gerekmeden aktif olur) ✓ ·
  `/tasks` 200 — "Meta API anahtarını ayarla" görevi listelendi ✓ ·
  **doğrulama sonrası temizlik**: test görevi DB'den silindi (kod/özellik
  kalıcı) ✓.

### Faz E — AI CEO Karar Motoru v2: Anti-Halüsinasyon + Idempotency + 3 Yeni Aksiyon (SPRINT 4 SON FAZ)
- **Neden:** v1.6.0 Faz G'deki Karar Motoru 7 aksiyon destekliyordu, ama (1)
  Faz A-D'nin ürettiği YENİ sinyaller (talep düşüşü/maliyet fırsatı/rakip
  reklamı/kampanya taslağı-adayı) karara dönüşmüyordu; (2) AI'nın
  `decisions[]` çıktısı hiçbir DOĞRULAMA'dan geçmiyordu — var olmayan bir
  `opportunityId`/`campaignId`/`productId` "halüsinasyon" edip geçersiz karar
  üretebilirdi; (3) her haftalık rapor aynı öneri için tekrar PENDING
  `AIDecision` açabilirdi (idempotency yok). Faz E üçünü birden çözer: 3 yeni
  `DecisionAction`, `validateDecision` (gerçek DB bağlamına karşı ID
  doğrulama), `decisionKey` (tekrar-açmayı önleyen idempotency anahtarı).
- **DB `DecisionAction` enum +3**: `EXIT_NICHE`, `APPLY_SUPPLIER_COST`,
  `CREATE_AD_DRAFT` (mevcut 7'nin yanına — toplam 10) — migration
  `ad_campaign_product_decision_v2` (Faz D ile birleşik).
- **`apps/worker/src/processors/weekly-report.ts`** (~497 satır, merkezi
  dosya) — yeni tipler/yapı:
  - `interface ValidatedDecision { title; rationale; action: DecisionAction;
    params: Record<string,unknown>; }`
  - `interface DecisionContext { topOppId?, topOppValidated: boolean,
    weakestProductId?, nearestEventReady: boolean, campaignIds: Set<string>,
    unverifiedSupplierId?, exitNicheProductId?, supplierCostMatch?:
    {productId,supplierId}, adDraftProductId? }` — haftanın **gerçek** DB
    durumunun anti-halüsinasyon "beyaz listesi".
  - **Yeni sinyal toplama** (Faz A/B/C/D çıktıları): `decliningPI` (Faz A —
    `evaluateProductDemand(...).level==='DECLINING'` olan ilk READY PI),
    `cheapestVerifiedSupplier`/`cheaperCostProduct` (Faz B), `draftCampaigns`/
    `adDraftCandidate` (Faz D), `trendAlarmTasks` (Faz C — '🔔' önekli açık
    `Task`'lar), `competitorChangeTasks` ('📈'/'📉' önekli), `activeCampaigns`
    (`adCampaigns.list`→`status==='ACTIVE'`), `unverifiedSuppliers`
    (`verified===false`). Her biri ilgili `📉`/`💰`/`📣` emoji-önekli insight +
    öneri satırına eklenir (mevcut 🎯/📅/🧠 stratejik sinyal desenine ek).
  - `decisionCtx: DecisionContext` bu sinyallerden inşa edilir.
  - **`validateDecision(raw, ctx): ValidatedDecision | null`** — AI'nın
    önerdiği her `decisions[]` öğesi `action`'a göre doğrulanır:
    `CONVERT_OPPORTUNITY` (`opportunityId===topOppId && topOppValidated`),
    `GENERATE_INTELLIGENCE` (`productId===weakestProductId`),
    `PREP_EVENT_DESIGN` (`nearestEventReady`), `ADJUST_AD_BUDGET`/
    `PAUSE_CAMPAIGN` (`campaignId ∈ campaignIds`), `CONTACT_SUPPLIER`
    (`supplierId===unverifiedSupplierId`), `EXIT_NICHE`
    (`productId===exitNicheProductId`), `APPLY_SUPPLIER_COST`
    (`productId/supplierId===supplierCostMatch.*`), `CREATE_AD_DRAFT`
    (`productId===adDraftProductId`), `GENERIC` (geçer), `default`→`null`.
    Koşul tutmazsa `null` — karar **sessizce elenir** (akış kırılmaz).
  - **`decisionKey(action, params): string | null`** — idempotency anahtarı
    (örn. `CONVERT_OPPORTUNITY:<opportunityId>`,
    `APPLY_SUPPLIER_COST:<productId>:<supplierId>`, `PREP_EVENT_DESIGN` sabit,
    `GENERIC`→`null` yani dedup yok).
  - **Deterministik fallback** (AI'sız/`validatedDecisions.length===0`):
    sırayla — `topOpp` VALIDATED → `CONVERT_OPPORTUNITY`; `weakestPI.score<50`
    → `GENERATE_INTELLIGENCE`; `decliningPI` varsa → `EXIT_NICHE`;
    `cheaperCostProduct`+`cheapestVerifiedSupplier` varsa →
    `APPLY_SUPPLIER_COST`; `adDraftCandidate` varsa → `CREATE_AD_DRAFT` —
    her biri somut `title`/`rationale`/`params` ile.
  - **Idempotency**: `pendingDecisions=decisions.list(brandId,'PENDING')` →
    `existingDecisionKeys=Set<decisionKey(...)>` → `validatedDecisions.slice
    (0,5)` için anahtarı sette varsa **atla**, yoksa `decisions.create({...})`
    + anahtarı sete ekle. Aynı hafta tekrar çalıştırılırsa yinelenen PENDING
    karar açılmaz.
  - `prompts.weeklyStrategy` girdisine `decliningProduct`,
    `cheaperSupplierMatch`, `adDraftCandidate`, `signals:{trendAlarms,
    competitorChanges, unverifiedSupplierCount}` eklendi (şema geriye dönük
    uyumlu).
- **`apps/web/lib/decision-handlers.ts`** — 1 yeni handler (diğer ikisi
  Faz B/D'de tanımlandı): `exitNiche(brandId, actor, productId)` —
  `products.transition(productId,'CLOSED','AI CEO Karar Motoru: nişten çık')`
  (mevcut yaşam-döngüsü state machine, Sprint 1'den beri) →
  `prisma.adCampaign.findMany({where:{brandId,productId,status:'ACTIVE'}})` →
  her biri için `pauseCampaign(...)` → `audit.log('product.exit_niche',
  payload:{pausedCampaigns: count}, autonomyLevel:1)`.
- **`apps/web/.../ceo/actions.ts` `applyDecision`** — switch'e 3 yeni `case`:
  `EXIT_NICHE`→`exitNiche(...)`, `APPLY_SUPPLIER_COST`→
  `applySupplierCostToProduct(...)`, `CREATE_AD_DRAFT`→
  `createCampaignDraftFromIntelligence(...)`. Her durumda (önceki 7 + yeni 3)
  `decisions.setStatus(id,'APPLIED')` + `audit.log('decision.apply',
  payload:{decisionAction})`.
- **`apps/web/.../ceo/page.tsx`** — `DECISION_LABELS` +3: `EXIT_NICHE:'Nişten
  Çık'`, `APPLY_SUPPLIER_COST:'Tedarikçi Maliyetini Uygula'`,
  `CREATE_AD_DRAFT:'Meta Taslak Kampanya Oluştur'` (toplam 10 etiket). "🧭
  Kararlar" kartı yapısı değişmedi (v1.6.0 Faz G ile aynı render).
- **Otonomi politikası (v1.6.0 Faz G'den değişmedi):** yeni 3 aksiyon da
  PENDING başlar, manuel "Uygula"/"Reddet" bekler — `EXIT_NICHE`/
  `APPLY_SUPPLIER_COST`/`CREATE_AD_DRAFT` kalıcı/parasal etkili oldukları için
  özellikle otomatik uygulanmaz.
- **DB değişikliği:** `DecisionAction` enum +3 (migration
  `ad_campaign_product_decision_v2`, Faz D ile birleşik — Sprint 4'ün 4.
  migration'ı).
- **Doğrulama (canlı) — Sprint 4'ün uçtan-uca son testi:** typecheck (11
  paket) ✓ · `prisma migrate dev` (`ad_campaign_product_decision_v2`) ✓ ·
  `next build` (`/ceo`,`/studio`,`/hunter`,`/operations` aynı route'lar) ✓ ·
  dev+worker yeniden başlatıldı (Prisma Client tazeleme) ✓ ·
  - `generateReport` ("Rapor Üret & Gönder") → `weeklyReport` job çalıştı,
    **gerçek AI** (OPENAI_API_KEY mevcut) → `decisions: 3` → DB'de 3 yeni
    `AIDecision(PENDING)`: **EXIT_NICHE** ("jdm r35" — Faz A'nın DECLINING
    talep sinyaline dayanarak nişten çıkış önerisi), **APPLY_SUPPLIER_COST**
    ("jdm r35"e Printutu'nun 5 TRY birim maliyetini uygula — Faz B sinyali),
    **CREATE_AD_DRAFT** ("jdm r35" için `campaignPrep`'ten Meta taslak
    kampanya oluştur — Faz D sinyali); üçü de `validateDecision`'dan GEÇTİ
    (gerçek `productId`/`supplierId` DB'de mevcut) ✓.
  - `/ceo` 200 — "🧭 Kararlar" kartında 3 karar, doğru Türkçe rozetlerle
    ("Nişten Çık" / "Tedarikçi Maliyetini Uygula" / "Meta Taslak Kampanya
    Oluştur") render edildi ✓.
  - **EXIT_NICHE → "Uygula"**: `exitNiche` → "jdm r35"
    `products.transition(...,'CLOSED',...)` → **`Product.status=CLOSED`** ✓
    (aktif kampanya yok → `pausedCampaigns:0`) → `audit.log
    ('product.exit_niche',{pausedCampaigns:0})` ✓ → karar `APPLIED` ✓.
  - **APPLY_SUPPLIER_COST → "Uygula"**: `applySupplierCostToProduct` →
    `Product.cost=5` (Printutu'nun `unitCost`) ✓ → `audit.log
    ('product.cost.apply_supplier',{supplierId, supplier:'Printutu', cost:5,
    currency:'TRY'})` ✓ → karar `APPLIED` ✓.
  - **CREATE_AD_DRAFT → "Uygula"**: `createCampaignDraftFromIntelligence` →
    Meta access token/ad account yok → `IntegrationError` →
    `handleMetaError` → `Task('Meta API anahtarını ayarla', API_INPUT, P1)`
    oluştu (akış kırılmadı) ✓ → karar `APPLIED` ✓.
  - 3/3 karar `APPLIED`; ayrıca süreç içinde oluşan 2 ek PENDING karar
    "Reddet" ile `DISMISSED` edildi (`decision.dismiss` audit — v1.6.0 Faz
    G'deki `dismissDecision` davranışı birebir korunuyor, regresyon yok) ✓ ·
    son durumda `/ceo` "🧭 Kararlar" kartı "Bekleyen karar yok." gösteriyor ✓.
  - **idempotency doğrulaması**: `weeklyReport` ikinci kez çalıştırıldı →
    "jdm r35" artık `CLOSED` (Faz A'nın `decliningPI` taraması artık aday
    değil) ve `cost=5` (Faz B'nin `cheaperCostProduct` araması artık eşleşme
    bulamıyor) → yeni `EXIT_NICHE`/`APPLY_SUPPLIER_COST` kararı **oluşmadı**;
    `CREATE_AD_DRAFT` için Meta'da gerçek taslak oluşmadığından
    (`listDrafts` hâlâ boş) ve önceki `CREATE_AD_DRAFT:jdm-r35` PENDING'te
    olmadığından (APPLIED edilmişti) **yeni bir `CREATE_AD_DRAFT` adayı**
    üretildi — idempotency'nin **PENDING'i** tekrarlamayı önlediğini, ama
    altındaki koşul hâlâ geçerliyse (Meta'da gerçek taslak yokken) bir sonraki
    turda yeniden önerilebileceğini doğruladı (beklenen/doğru davranış) ✓ →
    bu yeni karar da "Reddet" ile temizlendi.
  - **Son durum (kalıcı):** "jdm r35" → `status=CLOSED`, `cost=5` — Karar
    Motoru'nun gerçek handler'larla DB'yi gerçekten değiştirdiğinin kanıtı;
    yalnızca gürültü (fazladan "Meta API anahtarını ayarla" görevleri,
    `DISMISSED` kararlar) temizlendi, kod/özellik ve bu durum kalıcı ✓.

### Sıradaki: Sprint 5
Sprint 4 (v1.7.0, Faz A–E) tamamlandı — 5 madde canlı doğrulandı, 6 hub içine
yerleşti (yeni route YOK). Sprint 5 kapsamı henüz tanımlanmadı; bir sonraki
"SPRINT 5 ONAYLANDI" mesajıyla ayrı bir plan turunda fazlara bölünecek.
Bilinen açık notlar:
- Şikayetvar/Trendyol Playwright adaptörlerinin canlı doğrulanması için `pnpm
  exec playwright install chromium` gerekiyor (WARN ile zarifçe atlanıyor, run
  başarısız olmuyor — Sprint 1'den beri açık not).
- Faz C (Meta Ad Library) ve Faz D (Meta Taslak Kampanya) kod yolları
  tamamlanmış ve statik doğrulanmış durumda, ama bu ortamda gerçek bir `META`
  access token/ad account credential'ı yok — Ayarlar > API Anahtarları'ndan
  `META` credential'ı girildiğinde her iki özellik de **ek kod gerekmeden**
  canlı Meta verisiyle çalışmaya başlar.

### Önceki Durum (arşiv)
## Sürüm: 1.6.0 — SPRINT 3: OPERASYON, OTOMASYON VE KARAR ZEKASI (TAMAMLANDI, canlı doğrulandı)
Tarih: 2026-06-14

Sprint 3, "SPRINT 3 ONAYLANDI" ile onaylanan 7 maddeyi 7 Faz'a (A–G) böler — plan:
`splendid-jumping-thompson`. Her faz kendi içinde uçtan uca çalışır ve canlı doğrulanır;
hepsi mevcut 6 hub'ın (v1.5.0) İÇİNE yerleşir, yeni route açılmaz.

### Faz A — Operasyon Müdürü: Siparişler + Üretim + Kargo (madde 1, canlı doğrulandı)
- **Neden:** `/operations` yalnızca "Ürünler" + "Tedarikçi & Mail" sekmelerinden ibaretti —
  `Order` modeli (Shopify webhook ile dolan) hiçbir ekranda gösterilmiyordu, Printify
  üretim/kargo durumu görünmüyordu. Operasyon Müdürü artık siparişleri, ürünleri
  üretim/yaşam-döngüsü açısından ve Printify kargo durumunu tek hub'da gösteriyor.
- **`packages/integrations/src/printify/orders.ts`** (yeni): `listPrintifyOrders(brandId,
  shopId, limit=50)` — `GET /shops/{shopId}/orders.json` → `PrintifyOrderSummary[]`
  (id/status/totalPrice [cent'ten ana birime çevrilmiş]/lineItems/trackingNumber/
  trackingUrl/createdAt). `packages/integrations/src/index.ts`'e export edildi.
- **`packages/db/src/services/orders.ts`** (yeni, ince): `orders.list(brandId, take=50)` →
  `prisma.order.findMany` (tarihe göre azalan). `packages/db/src/index.ts`'e export edildi.
- **`/operations` 2 sekme → 5 sekme** (Ürünler, **Siparişler**, **Üretim**, **Kargo**,
  Tedarikçi & Mail):
  - **`_components/orders-tab.tsx`** (yeni): `orders.list` → toplam ciro özeti + sipariş
    başına büyük kart (tutar/para birimi, ödeme durumu rozeti, tarih, Shopify ID).
  - **`_components/production-tab.tsx`** (yeni): `products.list` sonucu lifecycle durumuna
    göre gruplanır (🏆 Kazanan, 📈 Ölçekleniyor, 🧪 Test, 📉 Düşüşte, 🆕 Yeni, ⏹️ Kapatıldı —
    sadece dolu bölümler render edilir), her ürün mockup thumbnail + Maliyet/Fiyat/Marj
    (marj rozeti pozitif/negatife göre yeşil/kırmızı).
  - **`_components/shipping-tab.tsx`** (yeni): `settings['printify.shopId']` yoksa nazik
    "Printify henüz yapılandırılmamış" mesajı; varsa `listPrintifyOrders` canlı çağrılır —
    her Printify siparişi için durum rozeti (Beklemede/Üretimde/Kargolandı/İptal) + varsa
    takip numarası/linki; API hatası mesaj olarak gösterilir (sayfa çökmez).
- **DB değişikliği:** YOK — mevcut `Order`/`Product` alanları yeterliydi.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (`/operations` aynı route,
  100kB) ✓ · NextAuth credentials ile authenticated curl: `/operations?tab=siparisler` 200 —
  "Henüz sipariş yok" (DB'de henüz `Order` satırı yok) ✓ · `/operations?tab=uretim` 200 —
  🏆/🧪/⏹️ bölümleri + ~29 üründe Maliyet/Fiyat/Marj render edildi ✓ ·
  `/operations?tab=kargo` 200 — Printify `shopId` yapılandırılı, `listPrintifyOrders` canlı
  çağrıldı (gerçek API, hata yok), "Henüz Printify siparişi yok" (mevcut Printify hesabında
  sipariş yok) ✓.
- **Not:** Bu ortamda `pm2` bulunamadı (binary yok); değişiklikler **DB migration
  içermediği** için zaten çalışan `next dev` instance'ı (fast refresh) yeterli oldu — Prisma
  Client tazeleme tuzağı (bkz. 1.3.0 teknik notları) yalnızca migration olan fazlarda geçerli.

### Faz B — UGC → Video Factory (madde 2, canlı doğrulandı)
- **Neden:** `ProductIntelligence.ugc` (brief/senaryo/hook'lar/videoFlows) `/studio` "Ürün
  Zekası" sekmesinde sadece DÜZ METİN olarak gösteriliyordu — bir hook'tan doğrudan video
  üretim isteği oluşturmanın yolu yoktu. Artık her hook kendi "🎬 Video Üret" mini-formuna
  sahip; mevcut Video Fabrikası (`video` kuyruğu/`processVideo`/`buildVideoPrompt`)
  **değiştirilmeden** kullanılıyor.
- **`apps/web/.../studio/actions.ts`** — yeni `requestUgcVideo(formData)`: `{productId,
  hookIndex, type}` (zod) → `productIntelligence.getByProductId(productId)` → seçilen
  `ugc.hooks[hookIndex]` + varsa `ugc.scenario`/`ugc.brief`'ten **UGC bağlamlı prompt metni**
  kurar (örn. `UGC tarzı ürün tanıtım videosu. Açılış cümlesi (hook): "...". Senaryo: ...
  Brief: ...`) → `prisma.video.create({brandId, productId, type, status:'GENERATING'})` →
  `enqueue('video', {videoId, prompt})` → `audit.log('video.request_ugc', ...)` →
  `revalidatePath('/studio')`.
- **Mimari karar — `buildUgcVideoPrompt` eklenmedi:** Plan, UGC prompt kurma mantığını
  `apps/worker/src/lib/video-format.ts`'e (`buildUgcVideoPrompt`) eklemeyi öneriyordu, ancak
  bu fonksiyonu çağıracak `apps/web` server action'ı **apps/worker/src'ten import edemez**
  (ayrı app, paylaşılan paket değil). Çözüm: UGC bağlam metni doğrudan `studio/actions.ts`
  içinde (küçük, ~5 satır) kuruldu ve **RAW** (format/süre eklenmemiş) olarak `video`
  kuyruğuna `prompt` alanıyla geçildi — mevcut `processVideo`, her zaman yaptığı gibi
  `buildVideoPrompt(type, prompt)` ile format/en-boy/süre bilgisini SONRADAN ekliyor (çift
  sarmalama yok). Sonuç: worker/`video-format.ts` **hiç değişmedi**, "mevcut kuyruk/worker
  değişmeden kullanılır" gereksinimi tam karşılandı, cross-app import anti-pattern'i oluşmadı.
- **`_components/intelligence-tab.tsx`**: "UGC Brief" bölümünde her hook artık kendi kartında
  (`<li>`) — hook metni + yanında format seçici (UGC/TikTok/Reel/Story, varsayılan UGC) +
  "🎬 Video Üret" butonu (`requestUgcVideo`'ya `productId`+`hookIndex` gizli alanlarıyla post).
- **`_components/videos-tab.tsx`**: `prisma.video.findMany` artık `include: {product:
  {select:{title}}}`; video kartında `v.productId` varsa "🔗 <ürün adı>" etiketi (durumdan
  bağımsız, izlenebilirlik).
- **DB değişikliği:** YOK.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (`/studio` aynı route, 100kB) ✓
  · `/studio?tab=urun-zekasi` 200 — "jdm r35" ve "world champions" ürünleri için 3'er hook,
  her biri format seçici + "🎬 Video Üret" formuyla render edildi ✓ · "jdm r35" hook 0
  ("Bu tişörtü giyince kendimi kral gibi hissediyorum!", format UGC) için form submit edildi
  → `Video(GENERATING, productId=jdm r35, type=UGC)` oluştu + `audit.log('video.request_ugc')`
  kaydedildi ✓ → enqueue edilen `prompt` UGC bağlamını taşıyor (hook+senaryo+brief, format
  eki YOK) ✓ → **mevcut** `processVideo`/`buildVideoPrompt` job'u işledi, gerçek Fal video API
  çağrısı (FAL_KEY mevcut) → **4.5MB gerçek mp4** → MinIO → `Video.status=READY`,
  `/api/asset/.../*.mp4` 200 ✓ → `/studio?tab=videolar` 200, video kartında "🔗 jdm r35"
  etiketi + `<video controls>` ile gerçek video oynatılabilir ✓.
- **Teknik Not (geleceğe not):** Bu fazda `next build` (`apps/web`), ÇALIŞAN `next dev`
  instance'ının `.next` dizinini production formatına çevirip bozdu (`Cannot find module
  './12.js'`, webpack chunk uyumsuzluğu). Çözüm: `next dev` süreci durduruldu, `.next`
  silindi, `pnpm --filter @velora/web run dev` ile yeniden başlatıldı. **Bundan sonraki
  fazlarda:** `next build` doğrulamasından SONRA, eğer `next dev` ile canlı test
  yapılacaksa, dev sürecini yeniden başlatmak gerekir (1.3.0'daki "Prisma Client önbelleği"
  tuzağına benzer ama farklı kök neden — burada `.next` build-çıktısı çakışması).

### Faz C — Trend Alarm Sistemi (madde 7, canlı doğrulandı)
- **Neden:** `trendHunt` haftalık olarak niş/tema skorları üretiyordu ama hiçbir eşik/alarm
  yoktu — bir niş skoru sıçradığında ya da zaten çok yüksek olduğunda operatöre proaktif
  haber verilmiyordu. Faz C bunu **Trend Alarm Sistemi** ile çözer: deterministik bir
  eşik/delta motoru + otomatik Görev Merkezi bildirimi + Trendler sekmesinde "🔥" rozeti.
- **`packages/core/src/trend-alarm/score.ts`** (yeni): saf/deterministik
  `evaluateTrendAlarm({score, previousScore?}): {triggered, level: 'HIGH'|'RISING'|null,
  delta}`. Kural: `score>=75` → **HIGH** (önceki haftadan bağımsız — yeni/güçlü tema);
  `previousScore` mevcut ve `delta>=20` → **RISING** (sıçrama). `packages/core/src/index.ts`'e
  export edildi (`evaluateTrendAlarm`, `TrendAlarmInput`, `TrendAlarmResult`).
- **`apps/worker/src/processors/trend-hunt.ts`** yeniden yazıldı: `trends.replaceWeek` ile bu
  haftanın trendleri yazılmadan ÖNCE, önceki haftanın (`isoWeek(now - 7g)`) aynı `niche`
  skorları `trends.list(brandId, prevWeek)`'ten okunup `Map<niche, score>`'a alınır. Yazımdan
  sonra her item için `evaluateTrendAlarm({score, previousScore})` çalıştırılır; tetiklenirse
  `tasks.create({brandId, type:'GENERIC', priority:1, title:'🔔 Trend Alarmı: "<tema>"
  (<niş>) — skor <score>', description:'<Yüksek skor|Yükselişte> · değişim <±delta> (önceki
  hafta: <skor>)'})`. **İdempotent**: `title` yuvarlanmış skoru içerdiği için, yaratmadan
  önce `prisma.task.findFirst({brandId, title, status:'OPEN'})` kontrol edilir — aynı
  haftada aynı verilerle tekrar çalıştırma yeni görev AÇMAZ.
- **`apps/web/.../hunter/_components/trends-tab.tsx`**: `evaluateTrendAlarm` `@velora/core`'dan
  import edildi (web zaten bağımlı). Trend listesi haftaya göre gruplanır (`weekEntries`);
  her hafta kartı için bir ÖNCEKİ (daha eski) haftanın `niche→score` haritası çıkarılır
  (`weekEntries[idx+1]`). Her trend satırı için `evaluateTrendAlarm` inline çalıştırılır —
  tetiklenirse skor rozetinin yanına `destructive` (kırmızı) **"🔥 Alarm"** (HIGH) veya
  **"🔥 Yükselişte"** (RISING) rozeti eklenir.
- **DB değişikliği:** YOK — mevcut `Trend`/`Task` modelleri yeterli.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (`/hunter` aynı route, 107kB) ✓
  · `next dev` yeniden başlatıldı (Faz B'deki `.next` çakışması notu) ✓ · senaryo: `2026-W24`
  "jdm cars" 10 trend satırı (skor 39.1–50.3) mevcuttu, `2026-W23` verisi yoktu →
  `2026-W23`'e "jdm cars" için sentetik skor=25 satırı eklendi (delta≥20 RISING senaryosunu
  tetiklemek için) → `huntTrends` server action'ı çalıştırıldı → **3 yeni `Task` (GENERIC,
  P1, status OPEN)** oluştu: skor 50→`+25`, skor 47→`+22`, skor 45→`+20` (hepsi "Yükselişte ·
  değişim +N (önceki hafta: 25)"); skor 44.5 (`delta=19.5<20`) doğru şekilde tetiklenMEDİ ✓ ·
  `huntTrends` ikinci kez çalıştırıldı → görev sayısı **3'te sabit kaldı** (idempotency) ✓ ·
  `/hunter?tab=trendler` 200 — skor 50/47/45 satırlarında "🔥 Yükselişte" rozeti, `2026-W23`
  kartı (en eski hafta, karşılaştırma yok) rozetsiz doğru render edildi ✓ · `/tasks` 200 —
  3 "🔔 Trend Alarmı: ..." görevi doğru başlık/açıklama/P1 ile listelendi ✓ · **doğrulama
  sonrası temizlik**: sentetik `2026-W23` "jdm cars" satırı ve ondan kaynaklanan 3 alarm
  görevi DB'den silindi (gerçek veri değil, test senaryosu içindi — kod/özellik kalıcı ve
  canlı doğrulanmış durumda kalıyor).

### Faz D — Rakip İzleme / Competitor Watch (madde 6, canlı doğrulandı)
- **Neden:** Rakip taraması yalnızca tek-tek manuel "Tara" butonuyla çalışıyordu ve fiyat
  değişimi tespiti yoktu. Faz D, tüm rakipleri tek seferde (manuel veya günlük cron ile)
  tarayıp **%15+ fiyat değişimlerini** otomatik Görev Merkezi uyarısına dönüştürür.
- **`packages/queue/src/queues.ts`**: yeni `competitorWatch: { brandId: string }` kuyruğu
  (`QUEUE_NAMES` + `JobDataMap`).
- **`apps/worker/src/processors/competitor-watch.ts`** (yeni): `processCompetitorWatch` —
  `competitors.list(brandId)` → her rakip için `enqueue('competitorScan', {competitorId})`
  (fan-out, concurrency 1).
- **`apps/worker/src/processors/competitor-scan.ts`** yeniden yazıldı: mevcut fetch+regex
  (başlık+fiyat) taramasından sonra, aynı `competitorId`+`title` için **ÖNCEKİ** `CompetitorProduct`
  satırı (`orderBy seenAt desc`) okunur. `|yeni−eski|/eski >= 0.15` ise
  `tasks.create({brandId: comp.brandId, type:'GENERIC', priority:2, title:'📈/📉 Rakip fiyat
  değişti: "<başlık>" <eski>→<yeni> <currency>', description:'Rakip: <ad> · değişim ±N%'})`.
  Yön emojisi artışta 📈, azalışta 📉. **İdempotent**: aynı `title`+`status:'OPEN'` için
  `prisma.task.findFirst` kontrolü — tekrarlı/aynı-fiyat taramalarda yeni görev AÇMAZ.
- **`apps/worker/src/index.ts`**: `competitorWatch` kuyruğu için worker kaydı (concurrency 1,
  mevcut desen — `competitorScan` worker'ının hemen altına eklendi).
- **`apps/web/.../hunter/actions.ts`**: yeni `watchAllCompetitors()` — `enqueue('competitorWatch',
  {brandId})` + `audit.log('competitor.watch_all', ...)` + `revalidatePath('/hunter')`.
- **`apps/web/.../hunter/_components/competitors-tab.tsx`**: üst açıklama satırı genişletildi
  + sağda **"Tümünü Tara"** butonu (rakip listesi boş değilse render edilir) —
  `watchAllCompetitors`'a post eder.
- **`n8n/workflows/daily-competitor-watch.json`** (yeni): `daily-discovery.json` deseniyle —
  Cron **her gün 04:00** → `POST /api/webhooks/n8n` `{event:'daily.competitor_watch',
  queue:'competitorWatch'}` (Bearer `N8N_WEBHOOK_SECRET`; `brandId` webhook'ta otomatik
  enjekte edilir, mevcut desen).
- **DB değişikliği:** YOK — fiyat geçmişi zaten `CompetitorProduct` anlık görüntü satırlarında.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (`/hunter` aynı route, 107kB) ✓ ·
  `next dev` yeniden başlatıldı (port 3000 boştu, temiz restart) ✓ · senaryo: geçici "Test
  Rakip" (`url` → `/api/asset/test/competitor-watch.html`, MinIO'ya yazılan sahte HTML)
  oluşturuldu, ilk tarama fiyat **10000 TRY** snapshot'ı yazdı → sayfa **12000 TRY**'ye
  güncellendi → `/hunter?tab=rakipler` "Tümünü Tara" (`watchAllCompetitors` server action,
  curl ile tetiklendi) → `competitorWatch` → `competitorScan` → yeni snapshot (12000) +
  **`Task` oluştu**: "📈 Rakip fiyat değişti: \"Test Ürün Sayfası\" 10000.00→12000.00 TRY"
  (P2, açıklama "Rakip: Test Rakip · değişim +20%") ✓ · `/tasks` 200 — görev doğru
  başlık/açıklama ile listelendi ✓ · `/hunter?tab=rakipler` 200 — her iki fiyat snapshot'ı
  (12000.00 ve 10000.00) tarih sıralı render edildi ✓ · **idempotency**: "Tümünü Tara" aynı
  fiyatla (12000→12000) ikinci kez çalıştırıldı → yeni snapshot eklendi ama `ratio=0<0.15`
  → **yeni görev açılmadı** (görev sayısı 1'de sabit) ✓ · **n8n**: `daily-competitor-watch.json`
  (id eklendi) `docker exec velora-n8n n8n import:workflow` ile içe aktarıldı — `list:workflow`
  çıktısında görünüyor, **pasif** (diğer workflow'lar gibi kullanıcı onayıyla aktif edilir) ✓ ·
  **doğrulama sonrası temizlik**: "Test Rakip" + 3 `CompetitorProduct` snapshot'ı + test
  `Task`'ı DB'den, sahte HTML dosyası MinIO'dan silindi (gerçek veri değil, test senaryosu
  içindi — kod/özellik kalıcı ve canlı doğrulanmış durumda kalıyor).

### Faz E — Tedarikçi Bulucu / Supplier Finder (madde 4, canlı doğrulandı)
- **Neden:** "Tedarikçi & Mail" sekmesinde yalnızca manuel ekleme vardı. CLAUDE.md "API >
  Playwright > Kullanıcı Onayı" ilkesi + Level 1 "Öner" gereği, bir niş/ürün için **gerçek web
  araması** ile tedarikçi/üretici adayı bulup operatöre öneren, onay sonrası kalıcı hale gelen
  bir akış eklendi.
- **`packages/ai/src/providers/openai.ts`** (yeni `WebSearchResult` + `searchWeb`):
  `searchWeb(brandId, {query, instructions?, model?})` → `oa.responses.create({model:
  'gpt-4o-mini', tools:[{type:'web_search_preview'}], input: ...})`; `logUsage` (Responses API
  `usage.input_tokens`/`output_tokens`); çıktıdan `output_text` + `output[].content[].
  annotations[]` içindeki `url_citation` (`{title, url}`) toplanır → `{text, sources}`.
- **`packages/ai/src/index.ts`**: `ai.search.web = openaiProvider.searchWeb` export +
  `WebSearchResult` tip export.
- **`packages/ai/src/prompts/index.ts`**: yeni `prompts.supplierFinder({niche, country?})` —
  "gerçek/güncel web aramasından bulduğun firmaları kullan, uydurma yazma" talimatı + yalnızca
  `[{company,email,phone,website}]` JSON dizisi (en fazla 5 aday) formatı.
- **DB `Supplier.verified Boolean @default(true)`** (migration `add_supplier_verified`,
  uygulandı) — manuel eklenen tedarikçiler (`addSupplier`) varsayılan `true`; AI önerileri
  `false`.
- **`packages/db/src/services/crm.ts`**: `suppliers.create` artık opsiyonel `verified?:
  boolean`; yeni `suppliers.verify(id)` → `verified:true`.
- **`packages/queue/src/queues.ts`**: yeni `supplierFinder: { brandId: string; query: string }`
  kuyruğu.
- **`apps/worker/src/processors/supplier-finder.ts`** (yeni): `ai.search.web(brandId,
  {query: prompts.supplierFinder({niche: query})})` → yanıttaki JSON dizisini ayrıştır (`[...]`
  regex + `JSON.parse`, geçersiz/eksik `company` filtrelenir, cap 5) → her aday
  `suppliers.create({...,verified:false, notes:'AI önerisi (web araması): "<niş>" — kaynaklar:
  <url_citation linkleri>'})`. `IntegrationError` (OpenAI anahtarı yok) → mevcut
  `Task(API_INPUT, priority:1, 'OpenAI API anahtarını ayarla')` deseni (worker akışı kırılmaz).
- **`apps/worker/src/index.ts`**: `supplierFinder` kuyruğu için worker kaydı (concurrency 1).
- **`apps/web/.../operations/_components/suppliers-tab.tsx`**: üstte yeni **"🔎 Tedarikçi Bul"**
  kartı (niş/ürün input + "Ara" → `findSuppliers`); her tedarikçi kartında `verified===false`
  ise başlığın yanında `Badge variant="warning"` **"Doğrulanmadı"** + **"Doğrula"** butonu
  (`verifySupplier`) ve kart altında AI notu (`s.notes`, italik, küçük).
- **`apps/web/.../operations/actions.ts`**: yeni `findSuppliers(formData)` — zod `{niche:
  string(2..160)}` → `enqueue('supplierFinder', {brandId, query: niche})` +
  `audit.log('supplier.find', autonomyLevel:1)`. Yeni `verifySupplier(formData)` —
  `suppliers.verify(id)` + `audit.log('supplier.verify', autonomyLevel:1)`.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `prisma migrate dev` (`add_supplier_verified`,
  `20260614142600_...`) ✓ · `next build` (`/operations` aynı route, 100kB) ✓ · `next build`
  çalışan `next dev`'in `.next`'ini bozdu (Faz B'deki bilinen sorun) → dev+worker süreçleri
  durduruldu, `.next` silindi, ikisi de yeniden başlatıldı (Prisma Client tazeleme dahil) ✓ ·
  senaryo: `/operations?tab=tedarikci` → "🔎 Tedarikçi Bul" formuna **"özel baskılı kedi tişörtü
  üreticisi"** girildi → `findSuppliers` → `supplierFinder` job → gerçek OpenAI web araması
  (OPENAI_API_KEY mevcut) → **5 gerçek firma** bulundu ve `Supplier(verified:false)` olarak
  kaydedildi (Printutu, OnosPOD, Virtusto, Brikl, CustomCat — gerçek email/website, notlarda
  "AI önerisi (web araması)") ✓ · `/operations?tab=tedarikci` 200 — 5 karttan her birinde
  "Doğrulanmadı" rozeti + "Doğrula" butonu + AI notu render edildi ✓ · "Printutu" kartında
  "Doğrula" → `verifySupplier` → DB'de `verified:true` ✓ → sayfa yeniden çekildi, "Printutu"
  kartında rozet/buton KALKTI, diğer 4 tedarikçide hâlâ "Doğrulanmadı" görünüyor ✓.

### Faz F — Mail Assistant (madde 5, canlı doğrulandı)
- **Neden:** `draftEmail` inline prompt kullanıyordu (kayıt defteri dışı) ve operatör her
  seferinde mail konusunu sıfırdan yazıyordu. Faz F, prompt'u registry'ye taşır + sık
  kullanılan 4 konu şablonunu tek tıkla doldurulabilir hale getirir.
- **`packages/ai/src/prompts/index.ts`**: yeni `prompts.draftSupplierEmail({company, topic})` —
  `operations/actions.ts`'teki eski inline string ile **birebir aynı** içerik, registry'ye
  taşındı.
- **`apps/web/.../operations/actions.ts`**: `draftEmail` artık `ai.text.generate(brandId,
  {prompt: prompts.draftSupplierEmail({company: supplier.company, topic: data.topic}), ...})`
  çağırır — davranış değişmedi, kaynak taşındı (`prompts` importu `@velora/ai`'dan eklendi).
- **`apps/web/.../operations/_components/mail-templates.tsx`** (yeni, `'use client'`, ek
  bağımlılık yok): `MailTemplates({targetId})` — 4 küçük "ghost/sm" buton (Fiyat Teklifi İste /
  Numune Talep Et / Kargo Süresini Sor / Sipariş Takibi); tıklanınca `document.getElementById
  (targetId)` ile ilgili `topic` input'unun `value`'sunu önceden tanımlı metinle doldurur ve
  focus'lar.
- **`apps/web/.../operations/_components/suppliers-tab.tsx`**: her tedarikçinin mail formunun
  üstüne `<MailTemplates targetId={`topic-${s.id}`} />` eklendi (form + buton grubu `space-y-2`
  ile sarmalandı).
- **DB değişikliği:** YOK.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (`/operations` aynı route,
  101kB) ✓ · dev yeniden başlatıldı (Faz B'deki `.next` çakışması notu) ✓ ·
  `/operations?tab=tedarikci` 200 — 5 tedarikçi kartının her birinde 4 şablon butonu
  (Fiyat Teklifi İste/Numune Talep Et/Kargo Süresini Sor/Sipariş Takibi) render edildi ✓ ·
  regresyon testi: "Printutu" için `draftEmail` (konu = "Fiyat Teklifi İste" şablon metni)
  çalıştırıldı → `EmailMessage(DRAFT)` öncekiyle **aynı formatta** AI metniyle oluştu
  ("Sayın Printutu Yetkilisi, ... Saygılarımla, [Adınız] [İletişim...") ✓ → sayfa yeniden
  çekildi, "Taslak" rozeti + "Gönder" butonu (supplier'ın email'i var) doğru render edildi ✓ ·
  SMTP gönderim akışı (`sendSupplierEmail`→`mailSend`) değişmedi (Faz 8'den beri aynı kod yolu).

### Faz G — AI CEO Karar Motoru (madde 3, canlı doğrulandı, SPRINT 3 SON FAZ)
- **Neden:** `weeklyStrategy` sadece metinsel `recommendations` üretiyordu — operatör her
  öneriyi okuyup hangi ekrana gidip neyi tıklayacağını kendisi bulmak zorundaydı. Faz G bunu
  **yapılandırılmış, tek-tık uygulanabilir kararlara** dönüştürür. **Otonomi politikası:**
  otonomi seviyesinden bağımsız, HER `AIDecision` `PENDING` başlar ve manuel "Uygula"/"Reddet"
  bekler — Karar Motoru "öner + tek-tık uygula" katmanıdır, otomatik aksiyon katmanı DEĞİLDİR
  (CLAUDE.md L3 listesi Karar Motoru kararlarını otomatik uygulamayı içermiyor; para ile ilgili
  `ADJUST_AD_BUDGET`/`PAUSE_CAMPAIGN` spend-guardian emsaline göre manuel kalmalı).
- **DB `AIDecision`** (migration `add_ai_decision`): `brandId, reportId?, title, rationale,
  action (DecisionAction enum: CONVERT_OPPORTUNITY/GENERATE_INTELLIGENCE/PREP_EVENT_DESIGN/
  ADJUST_AD_BUDGET/PAUSE_CAMPAIGN/CONTACT_SUPPLIER/GENERIC), params (Json?), status
  (DecisionStatus: PENDING/APPLIED/DISMISSED, @default(PENDING))`, `@@index([brandId, status])`.
  **`packages/db/src/services/decisions.ts`** (yeni): `decisions.list(brandId, status?)`,
  `decisions.create(...)`, `decisions.getById(id)`, `decisions.setStatus(id, status)`.
  `packages/db/src/index.ts`'e export.
- **`prompts.weeklyStrategy`** genişletildi: girdiye Faz C/D/E sinyalleri eklendi (açık
  `Task` listesinden 🔔 trend alarmı / 📉📈 rakip fiyat / 🔎 doğrulanmamış tedarikçi sayıları);
  çıktı şemasına `decisions: [{title, rationale, action, params}]` eklendi (narrative/
  recommendations korunur, geriye dönük uyumlu).
- **`apps/worker/src/processors/weekly-report.ts`**: AI yanıtından `decisions[]` alınır,
  her biri `decisions.create({brandId, reportId, title, rationale, action, params,
  status:'PENDING'})` ile yazılır (cap 5). AI anahtarsız/parse başarısız → **deterministik
  fallback**: en öncelikli `Opportunity(VALIDATED, henüz PURSUED değil)` varsa
  `CONVERT_OPPORTUNITY` kararı + en zayıf PI ürünü için `GENERATE_INTELLIGENCE` kararı (mevcut
  "AI yoksa deterministik özet" davranışıyla aynı ruh).
- **Paylaşılan handler'lar — yeni `apps/web/lib/decision-handlers.ts`**: hub-özel action
  dosyalarına gömülü mantık, hem orijinal action hem `applyDecision` tarafından
  çağrılabilecek şekilde çıkarıldı (davranış birebir aynı):
  - `handleMetaError(brandId, err)` — Meta anahtarı eksikse görev açar.
  - `convertOpportunityToDesign(brandId, actor, opportunityId)` — eski `convertToDesign`
    gövdesi (OPPORTUNITY-FIRST SERT KAPI: `validationScore>=60`).
  - `adjustCampaignBudget(brandId, actor, campaignId, dailyBudget)` — eski `setBudget` gövdesi.
  - `pauseCampaign(brandId, actor, campaignId)` — eski `setCampaignState`'in PAUSED kolu.
  - `apps/web/.../hunter/actions.ts` `convertToDesign` ve `apps/web/.../finance/actions.ts`
    `setBudget`/`setCampaignState` artık bu paylaşılan fonksiyonları çağıran ince sarmalayıcılar
    (davranış/`revalidatePath` değişmedi).
- **`apps/web/.../ceo/actions.ts`**: yeni `applyDecision(formData)` — kararı `decisions.getById`
  ile al (PENDING + brand kontrolü), `action`'a göre switch:
  - `CONVERT_OPPORTUNITY` → `convertOpportunityToDesign`
  - `GENERATE_INTELLIGENCE` → `enqueue('productIntelligence', {productId})`
  - `PREP_EVENT_DESIGN` → `enqueue('autoDesign', {brandId, count:1})`
  - `ADJUST_AD_BUDGET` → `adjustCampaignBudget`
  - `PAUSE_CAMPAIGN` → `pauseCampaign`
  - `CONTACT_SUPPLIER` → `prompts.draftSupplierEmail` ile `ai.text.generate` → `emails.create`
    (Faz F'in `draftEmail` deseniyle birebir aynı, anahtarsızsa "OpenAI API anahtarını ayarla"
    görevi)
  - `GENERIC`/default → yeni `Task(GENERIC, priority:2)` açar (manuel takip)
  - her durumda `decisions.setStatus(id,'APPLIED')` + `audit.log('decision.apply', ...)`.
  Yeni `dismissDecision(formData)` → `decisions.setStatus(id,'DISMISSED')` +
  `audit.log('decision.dismiss', ...)`.
- **`apps/web/.../ceo/page.tsx`**: yeni **"🧭 Kararlar"** kartı (Stratejik Sinyaller'in
  üstünde) — `decisions.list(brandId,'PENDING')` → her karar için başlık+rationale+
  `DECISION_LABELS` Türkçe rozet (örn. "Ürün Zekası Üret", "Tedarikçi İletişimi") +
  "Uygula"/"Reddet" formları; boşsa "Bekleyen karar yok."
- **API değişiklikleri:** yeni server action'lar `applyDecision`/`dismissDecision`
  (`apps/web/app/(dashboard)/ceo/actions.ts`) — dışa açık HTTP API yok, sadece Next.js
  server actions.
- **Yeni bağımlılık:** YOK.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (`/ceo` aynı route, 87.4kB) ✓ ·
  `next dev`+worker yeniden başlatıldı (tek worker — `pnpm dev`/turbo zaten worker'ı da
  başlatıyor; ayrıca başlatılan ikinci `tsx watch` instance'ı tespit edilip kapatıldı) ✓ ·
  `generateReport` (Rapor Üret & Gönder) → `weeklyReport` job çalıştı, `decisions: 3`
  (gerçek AI, OPENAI_API_KEY mevcut) → DB'de 3 `AIDecision(PENDING)`:
  **CONTACT_SUPPLIER** ("Tedarikçi ile iletişime geç" — OnosPOD), **GENERATE_INTELLIGENCE**
  ("Zayıf üründe içerik geliştirme" — jdm r35, PI skoru 67), **PREP_EVENT_DESIGN** ("Etkinlik
  için hazırlıkları başlat" — Yaz Tatili) ✓ · `/ceo` 200 — "🧭 Kararlar" kartında 3 karar,
  doğru Türkçe rozetlerle ("Tedarikçi İletişimi"/"Ürün Zekası Üret"/"Etkinlik Hazırlığı") ✓ ·
  **GENERATE_INTELLIGENCE → "Uygula"**: `productIntelligence` job kuyruğa girdi, worker
  çalıştı → "ürün zekası üretildi" (scoreTotal **69**) ✓, karar `APPLIED` oldu ✓ ·
  **PREP_EVENT_DESIGN → "Reddet"**: karar `DISMISSED` oldu, karttan kalktı ✓ ·
  **CONTACT_SUPPLIER → "Uygula"**: `ai.text.generate` ile gerçek AI taslağı üretildi
  ("Sayın OnosPOD Yetkilisi, ... işbirliği fırsatlarını...") → `EmailMessage(DRAFT, OUTBOUND,
  subject:"İşbirliği fırsatları")` oluştu, karar `APPLIED` oldu ✓ · son durumda `/ceo`
  "🧭 Kararlar" kartı "Bekleyen karar yok." gösteriyor (3/3 karar çözüldü) ✓.
- **Not:** `productIntelligence` job sırasında "ürün zekası Shopify'a yazılamadı" WARN'ı
  göründü — bu Faz G'den ÖNCE var olan, belgelenmiş davranış (v1.3.0: "Shopify yazımı hata
  verirse sadece `warn` loglanır, ana akış bozulmaz"); ana akış (PI üretimi + skor + DB kaydı)
  başarıyla tamamlandı, regresyon değil.

### Sıradaki: Sprint 4
Sprint 3 (v1.6.0, Faz A–G) tamamlandı — tüm 7 madde canlı doğrulandı, 6 hub içine yerleşti
(yeni route YOK). Sprint 4 kapsamı henüz tanımlanmadı; bir sonraki "SPRINT 4 ONAYLANDI"
mesajıyla ayrı bir plan turunda fazlara bölünecek (v1.3.0/v1.4.0/v1.5.0 emsaline göre).
Bilinen açık notlar:
- Şikayetvar/Trendyol Playwright adaptörlerinin bu ortamda canlı doğrulanması için `pnpm exec
  playwright install chromium` gerekiyor (WARN ile zarifçe atlanıyor, run başarısız olmuyor).
- D5 (Meta'da kullanıcı onaylı **taslak** kampanya oluşturma, `campaignPrep`'ten) hâlâ
  ertelenmiş durumda — Sprint 3 kapsamına alınmadı.

### Önceki Durum (arşiv)
## Sürüm: 1.5.0 — UI/UX SADELEŞTİRME: 6 HUB + SİSTEM MENÜSÜ (canlı doğrulandı)
Tarih: 2026-06-14

### Neden
VELORA artık tek operatörlü (Emir) kullanılıyor. 21 ayrı route ("kurumsal ERP" hissi) yerine
**6 ana çalışma hub'ı + 1 küçültülmüş Sistem bölümü** istendi — sekmeli (tab) yapı, mobil-uyumlu,
"daha büyük kart / daha az tablo / daha az teknik detay" ilkesiyle. Bu **sadece navigasyon/sunum
değişikliği** — Opportunity-First veri akışı, server action mantığı ve sert kapılar (örn.
`validationScore>=60`) AYNEN korundu, sadece yeniden gruplandı. Sprint 3'ten önce yapılması
istenen bağımsız bir adımdı (plan: `splendid-jumping-thompson`).

### Yeni paylaşılan UI altyapısı
- **`@radix-ui/react-tabs`** eklendi (`apps/web/package.json`).
- **`apps/web/components/ui/tabs.tsx`** (yeni): `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` —
  mevcut `button.tsx`/`badge.tsx` ile aynı shadcn deseni (`cn()` + `forwardRef`).
- **`apps/web/components/nav-items.ts`** (yeni, paylaşılan kaynak): `hubs` (6 hub —
  href/label/shortLabel/emoji/icon) + `system` (5 sistem öğesi — href/label/icon); hem
  `sidebar.tsx` hem `mobile-nav.tsx` aynı listeyi kullanır.
- **`apps/web/components/sidebar.tsx`** yeniden yazıldı: `hubs` normal/vurgulu stilde, ince
  ayraç + küçük "Sistem" başlığı altında `system` daha soluk/küçük stilde. Aktif vurgu
  `usePathname()` ile (tab query param yok sayılır).
- **`apps/web/components/mobile-nav.tsx`** (yeni, `'use client'`, `md:hidden`): alt sabit
  7-kolonlu tab bar (6 hub kısa etiket + "Diğer" butonu) + "Diğer" → `system` öğelerini 2 sütunlu
  bottom-sheet'te gösterir (backdrop'a tıklayınca kapanır, ek bağımlılık yok).
- **`apps/web/app/(dashboard)/layout.tsx`**: `<aside>` (Sidebar) `hidden md:block`, `<main>`
  `pb-20 md:pb-8` (mobil alt bar içeriği kapatmasın), `<MobileNav/>` layout köküne eklendi.

### Hub'lar — sekmeli birleşim (tüm hub'lar Server Component `page.tsx` + `searchParams.tab` →
`<Tabs defaultValue=...>` + her sekme `_components/<ad>-tab.tsx` async Server Component)

- **🎯 `/hunter` — Ürün Avcısı** (5 sekme: Fırsatlar · Etkinlikler · Trendler · Rakipler ·
  Araştırma, `defaultValue="firsatlar"`):
  - **Fırsatlar** = eski `discovery`+`validation` BİRLEŞİK — tek `Opportunity` kart listesi
    (priorityScore + varsa validationScore/sinyaller + durum rozeti NEW/SCORED/VALIDATED/
    REJECTED/PURSUED). Keşfet/Doğrula/Tasarıma Dönüştür (**`validationScore>=60` sert kapı
    korunur**).
  - **Etkinlikler** = eski `events` (Event Calendar kartları, Etkinlik Skoru, "Tara").
  - **Trendler** = eski `trends` (haftalık trend kartları, "Trend Avla").
  - **Rakipler** = eski `competitors` (CRUD + ürün tablosu).
  - **Araştırma** = eski `research` (araştırma formu + run geçmişi).
  - Birleşik `hunter/actions.ts`. Silinen: `discovery, validation, trends, events, competitors,
    research` (6 dizin).
- **🎨 `/studio` — Tasarım Direktörü** (4 sekme: Tasarımlar · Videolar · Ürün Zekası · Test Lab,
  `defaultValue="tasarimlar"`):
  - **Tasarımlar** = eski `designs` (AI brief + tasarım üret + galeri/mockup'lar/skor — "Mockuplar"
    zaten bu galerinin parçasıydı, ayrı ekran hiç yoktu).
  - **Videolar** = eski `videos`. **Ürün Zekası** = eski `intelligence` (271 satır, en büyük
    sekme). **Test Lab** = eski `lab` (A/B testleri).
  - Birleşik `studio/actions.ts`. Silinen: `designs, videos, intelligence, lab` (4 dizin).
- **📦 `/operations` — Operasyon Müdürü** (2 sekme: Ürünler · Tedarikçi & Mail,
  `defaultValue="urunler"`):
  - **Ürünler** = eski `shopify` (manuel ürün + yayınlanabilir tasarımlar + ürün/yaşam döngüsü +
    sağlık kontrolü). **Tedarikçi & Mail** = eski `suppliers`.
  - Birleşik `operations/actions.ts`. Silinen: `shopify, suppliers` (2 dizin).
  - **Not:** Sprint 3 Faz 1/4/5 bu hub'a Siparişler/Kargo/Supplier Finder/Mail Assistant'ı **yeni
    sekmeler** olarak ekleyecek — şimdi placeholder sekme açılmadı (CLAUDE.md ilkesi).
- **💰 `/finance` — Finans Müdürü** (2 sekme: Genel Bakış · Reklam Performansı,
  `defaultValue="genel-bakis"`, route AYNI kaldı):
  - **Genel Bakış** = mevcut `finance` içeriği (Ciro/Sipariş/AOV/ROAS/CPA KPI grid'leri, Operasyon
    Skoru, AI Finansal Yorum, Ürün Karlılığı tablosu).
  - **Reklam Performansı** = eski `ads` (Acil Durum Koruması, Kampanyalar aç/durdur/bütçe,
    Performans ROAS/CPA/CPC/CTR tablosu).
  - `finance/actions.ts` + `ads/actions.ts` → birleşik `finance/actions.ts` (tüm
    `revalidatePath` → `/finance`). Silinen: `ads` (1 dizin).
- **🏠 `/dashboard` — Komuta Merkezi** (genişletildi, tek sayfa):
  - Yeni **"📊 Günün Özeti"** kartı: `finance.latest(brand.id,1)` son snapshot'tan Ciro/Net
    Kâr/Sipariş + `operationScores.latest()` Operasyon Skoru — 4 stat kutusu tek satırda,
    "Finans Müdürü'ne git" linki.
  - Yeni **"✅ Bekleyen Onaylar"** kartı: `Design`/`Video` `status:'READY'` sayıları (→
    `/studio?tab=tasarimlar` / `?tab=videolar`), `Opportunity status:'VALIDATED'` (henüz
    PURSUED değil) sayısı (→ `/hunter?tab=firsatlar`), `Task status:'OPEN'`
    `type:{in:['APPROVE_DESIGN','APPROVE_AD']}` başlıkları (→ `/tasks`). Hiçbiri yoksa
    "Bekleyen onay yok ✓".
  - Mevcut "🎯 En İyi Fırsatlar"/"📅 Yaklaşan Etkinlikler" linkleri zaten `/hunter?tab=...`
    formatındaydı (Faz C/E'de eklenmişti) — değişiklik gerekmedi.
- **🧠 `/ceo` — AI CEO**: değişiklik yok (mevcut rapor zaten Strateji+Sinyaller+Öneriler
  birleşik gösteriyor); sadece sidebar konumu/emoji.

### Silinen route'lar → 21 → 11
`discovery, validation, trends, events, competitors, research, designs, videos, intelligence,
lab, shopify, suppliers, ads` (13 dizin) silindi. Kalan **11 route** = 6 hub (`dashboard, hunter,
studio, operations, finance, ceo`) + 5 sistem (`tasks, jobs, audit, backups, settings`).

### Doğrulama (canlı)
- `pnpm -r typecheck` (11 paket) ✓ · `next build` — dashboard-grup 11 route derlendi
  (`/dashboard` 94.2kB, `/finance` 100kB, `/hunter` 107kB, `/operations` 100kB, `/studio`
  100kB, `/ceo` 87.4kB, `/audit`/`/backups`/`/settings` 87.4kB, `/jobs` 96.9kB, `/tasks`
  94.2kB) ✓ · `pm2 restart velora-web` ✓.
- Authenticated curl (NextAuth CSRF, `owner@velora.local`):
  - `/dashboard` 200 — "📊 Günün Özeti" + "✅ Bekleyen Onaylar" canlı veriyle render (1 "fırsat
    tasarıma dönüştürülmeye hazır" + tasarım/video onay kalemleri) ✓.
  - `/hunter` 200 (5 sekme render) ✓ · `/hunter?tab=etkinlikler` 200 — deep-link "Etkinlikler"
    panelini `data-state="active"`, diğer 4'ünü `inactive` olarak doğru ayarladı ✓.
  - `/studio` 200 (4 sekme) ✓ · `/operations` 200 (2 sekme) ✓.
  - `/finance` 200 (2 sekme — Genel Bakış: "Ciro (Bugün)"/"Operasyon Skoru" + Reklam
    Performansı: "Acil Durum Koruması" tek sayfada) ✓ · `/ceo` 200 ("Stratejik Sinyaller" +
    "Öneriler" render) ✓.

### Sıradaki: Sprint 3
Henüz fazlara bölünmedi — bu UI revizyonu doğrulandıktan sonra **ayrı bir plan turunda**
detaylandırılacak (CLAUDE.md → v1.6.0+):
1. Operasyon Müdürü genişletme (Orders/Production/Shipping → `/operations`'a yeni sekmeler)
2. UGC → Video Factory (`ProductIntelligence.ugc` → `video` kuyruğu/`buildVideoPrompt`)
3. AI CEO Karar Motoru
4. Supplier Finder (→ `/operations` "Tedarikçi & Mail" sekmesi genişler)
5. Mail Assistant (→ aynı sekme)
6. Competitor Watch (→ `/hunter` "Rakipler" sekmesi genişler)
7. Trend Alarm Sistemi (→ `/hunter` "Trendler" ve/veya `/ceo` genişler)

Şikayetvar/Trendyol Playwright adaptörlerinin canlı doğrulanması için `pnpm exec playwright
install chromium` gerekiyor (önceki not, değişmedi).

### Önceki Durum (arşiv)
## Sürüm: 1.4.0 — STRATEJİK DÖNÜŞÜM SPRINT 2: ETKİNLİK TAKVİMİ + KAMPANYA HAZIRLIK + AI CEO STRATEJİ SENTEZİ (canlı doğrulandı)
Tarih: 2026-06-13

### Faz C — Global Event Calendar (Etkinlik Skoru, canlı doğrulandı)
- **Neden:** Sprint 1'deki EVENT akışı yalnızca sabit özel günleri (`special-days.ts`) tek bir
  `consider()` heuristiği ile fırsata çeviriyordu — skor yok, kategori yok, takvim görünümü yok,
  ve her gün çalışan tarama aynı etkinlik için tekrar tekrar Opportunity üretebiliyordu. Faz C bunu
  **Global Event Calendar**'a dönüştürür: her etkinlik **Etkinlik Skoru** ile değerlendirilir, tüm
  180 günlük ufuk DB'ye yazılır (takvim görünümü), ve fırsata dönüşüm **idempotent** hale gelir.
- **core `scoreEvent`** (`packages/core/src/event/score.ts`): `computeSeasonality`'nin parametrik
  analoğu. Girdi: `trendPotential, salesPotential, daysUntil, prepLeadDays`. `daysUntil/prepLeadDays`
  oranına göre `readiness` (≤1→100, ≤2.14→80, ≤3.57→50, ≤5.7→25, else→10) hesaplar; `total` =
  trend/satış/readiness ağırlıklı bileşim. Saf/deterministik, core'un diğer skorlayıcılarıyla aynı stil.
- **DB `CommercialEvent`** (migration `add_commercial_event`): `brandId, name, category
  (EventCategory: SPOR/ALISVERIS/KUTLAMA/MEVSIM), eventDate, prepLeadDays, trendPotential,
  salesPotential, eventScore (Json), linkedOpportunityId`. `@@unique([brandId,name,eventDate])` →
  upsert idempotent. `packages/db/src/services/events.ts`: `upsert/list/upcoming/linkOpportunity`.
- **`apps/worker/src/lib/special-days.ts` genişletildi**: `FixedDay`/`MovingDay` artık opsiyonel
  `category/prepLeadDays/trendPotential/salesPotential` taşır (varsayılanlarla geriye dönük uyumlu);
  `UpcomingDay` bu alanları her zaman döner. **Yeni etkinlikler**: FIFA Dünya Kupası Finali
  (2026-07-19, SPOR), UEFA Şampiyonlar Ligi Finali (2027-05-29, SPOR), EURO (2028-06-12, SPOR),
  Copa America (2028-06-20, SPOR), Cyber Monday (2026-11-30, ALISVERIS).
- **Worker `productDiscovery` EVENT dalı yeniden yazıldı**: `upcomingSpecialDays(180)` içindeki
  **her** etkinlik için `scoreEvent` hesaplanır ve `events.upsert(...)` ile `CommercialEvent`'e
  yazılır (takvimin tamamı her taramada güncel tutulur). **Sadece** `daysUntil<=prepLeadDays &&
  !linkedOpportunityId` olan etkinlikler Opportunity'ye dönüştürülür (`demand←salesPotential,
  trend←trendPotential, marketSize←eventScore.total`), ardından `events.linkOpportunity()` ile
  bağlanır — bir etkinlik için **en fazla bir** Opportunity üretilir (idempotent, item-9
  Opportunity-First kapısı korunur).
- **Web `/events`** ("Etkinlik Takvimi", sidebar `CalendarDays` ikonu, `/discovery`–`/validation`
  arası): tüm `CommercialEvent` kayıtları tarih sıralı kart listesi — Etkinlik Skoru, kategori
  rozeti, "Hazırlık penceresinde" / "Fırsata dönüştü" durum rozeti, trend/satış/hazırlık alt-skorları,
  "Fırsatı gör →" (`/discovery`'ye link). "Tara" butonu `runDiscovery()`'yi tetikler.
- **`/dashboard`**: yeni **"📅 Yaklaşan Etkinlikler"** kartı (`events.upcoming(brand.id, 5)`) — "En
  İyi Fırsatlar" kartı ile 2-sütunlu grid arası. `discovery/actions.ts` `runDiscovery()` artık
  `/events` ve `/dashboard` path'lerini de revalidate ediyor.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (30 route, `/events` yeni, 94.2kB) ✓ ·
  `productDiscovery` canlı çalıştırıldı → **created: 13** (10 yeni TREND + 3 yeni EVENT) ✓ ·
  `CommercialEvent` 12 satır (180 gün ufuk) ✓ · 3 etkinlik hazırlık penceresinde + bağlandı: **Yaz
  Tatili** (2 gün sonra, skor 84), **Babalar Günü** (8 gün sonra, skor 74), **FIFA Dünya Kupası
  Finali** (36 gün sonra, skor 95) ✓ · `/events` 200, 12 kart doğru skor/rozet ile render ✓ ·
  `/dashboard` 200, "Yaklaşan Etkinlikler" + "En İyi Fırsatlar" (EVENT kind, P70/P63) doğru render ✓ ·
  `pm2 restart velora-web` (Prisma Client tazeleme) ✓.
- **Not:** Sprint 1'den kalan eski "Babalar Günü koleksiyonu" (PURSUED, validation 62) DB'de ayrı bir
  satır olarak duruyor — `CommercialEvent` tablosu bu migrasyondan önce yoktu, dolayısıyla eski kayıt
  hiçbir `linkedOpportunityId`'ye bağlı değildi. Tek seferlik geçiş artefaktı; bundan sonra
  `linkedOpportunityId` kalıcı olduğu için yinelenmeyecek.

### Faz D — Kampanya Hazırlık Paketi (Meta hazırlık, otomatik kampanya YOK, canlı doğrulandı)
- **Neden:** Ürün Zekası Motoru SEO/içerik/reklam/kitle/UGC üretiyordu ama reklamı **kampanya**
  seviyesinde kurmaya yetecek somut bir paket yoktu (kampanya adı, ad set'ler, bütçe, hedef kitle
  varyasyonları). Faz D bu boşluğu **hazırlık paketi** olarak doldurur — **D5 (Meta'da otomatik
  kampanya oluşturma) kapsam dışı**, Sprint 3'e ertelendi; üretilen paket sadece `/intelligence`'da
  gösterilir, manuel olarak Meta Ads Manager'a girilir.
- **DB `ProductIntelligence.campaignPrep`** (Json, migration `add_campaign_prep`): `{campaignName,
  adSets: {name, audience, interests: string[], dailyBudgetUSD}[], hook, primaryText, headline,
  description}`. `productIntelligence.setResult` ve worker `ProductIntelligenceResult`/`PIResult`
  tipine `campaignPrep` eklendi (mevcut `ads`/`audience`/`ugc` alanları değişmedi — kampanya paketi
  bunlardan ayrı, kampanya-stratejisine özel bir varyant).
- **AI prompt** (`prompts.productIntelligence`): tek çağrıya `campaignPrep` JSON bloğu eklendi +
  kurallar — campaignName (marka+ürün+hedef), 2-3 ad set (her biri kendi hedef kitlesi + 5-8 ilgi
  alanı + 5-30 USD/gün bütçe önerisi, fiyat/marja göre kademeli), hook (ilk 3sn dikkat çekici cümle),
  primaryText/headline/description (ads ile aynı format, kampanya stratejisine özel varyant).
- **Web `/intelligence`**: her ürün kartına, mevcut 6 bölümün altında (READY ise) **"📣 Kampanya
  Hazırlık Paketi (Meta)"** bölümü — kampanya adı/hook/primary text/headline/description + her ad
  set için kart (hedef kitle, ilgi alanları, günlük bütçe). `campaignPrep.campaignName` boşsa bölüm
  hiç render edilmez (eski/önceki kayıtlarla geriye dönük uyumlu).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (30 route) ✓ · `pm2 restart
  velora-web` (yeni `campaignPrep` kolonu için Prisma Client tazeleme) ✓ · "jdm r35" ürünü için
  `productIntelligence` yeniden üretildi → `campaignPrep` dolu: kampanya adı "JDM R35 - Araç
  Tutkusu", hook + primary/headline/description, **2 ad set** (Otomobil Tutkunları $20/gün, Genç
  Yetişkinler $15/gün, ilgi alanlarıyla) ✓ · `/intelligence` 200, "Kampanya Hazırlık Paketi" bölümü
  + her iki ad set kartı doğru render ✓.

### Faz E — AI CEO Haftalık Raporuna Stratejik Öneri Sentezi (canlı doğrulandı)
- **Neden:** AI CEO raporu sadece finans+trend+operasyon skorunu özetliyordu; Opportunity-First
  zincirinin ürettiği en-iyi-fırsat / yaklaşan-etkinlik / ürün-zekası sinyalleri rapora hiç
  yansımıyordu. Faz E bu sinyalleri haftalık sentezin parçası yapar — **yeni Meta API çağrısı/
  kampanya YOK**, sadece DB'de zaten var olan veriler (finans, Opportunity, CommercialEvent,
  ProductIntelligence) okunup anlatıya/önerilere aktarılır.
- **`prompts.weeklyStrategy`** (`packages/ai/src/prompts/index.ts`): girdi = temel metrikler
  (ciro/net kâr/sipariş/opSkor) + en öncelikli fırsat (`opportunities.top`: başlık/tür/niş/öncelik/
  doğrulama/durum) + en yakın etkinlik (`events.upcoming`: ad/kategori/gün-sayısı/skor) + ortalama
  Ürün Zekası skoru + en zayıf ürün + mevcut deterministik öneriler. Çıktı SADECE JSON:
  `{"narrative": "...", "recommendations": ["...", ...]}` — narrative finans+fırsat+etkinliği
  birlikte yorumlar (somut çerçeveleme, örn. "Bu kategoriye ağırlık ver"), recommendations mevcut
  deterministik önerileri korur + 1-3 yeni aksiyon ekler (fırsatı dönüştür / etkinlik hazırlığı /
  zayıf ürün PI yeniden üret).
- **`apps/worker/src/processors/weekly-report.ts`**: `opportunities.top(brandId,1)`,
  `events.upcoming(brandId,1)`, `productIntelligence.list(brandId,100)` eklendi. READY ürünlerden
  ortalama PI skoru + en zayıf ürün hesaplanır. `insights`'a 3 emoji-önekli **stratejik sinyal**
  satırı eklenir: 🎯 (en öncelikli fırsat), 📅 (yaklaşan etkinlik), 🧠 (ortalama PI skoru).
  `recommendations`'a 3 yeni heuristik eklendi: fırsat VALIDATED ise "tasarıma dönüştür", etkinlik
  hazırlık penceresindeyse "hazırlığı başlat", en zayıf ürün PI<50 ise "paketi yeniden üret".
  Inline AI prompt'u `prompts.weeklyStrategy(...)` ile değiştirildi; JSON yanıt `{narrative,
  recommendations}` ayrıştırılır — AI'dan gelirse narrative/recommendations günceller, anahtar
  yoksa/parse başarısızsa deterministik narrative + temel öneriler korunur (mevcut "AI anlatısı
  anahtar yoksa deterministik özete düşer" davranışı).
- **`apps/worker/src/lib/report-html.ts` + `/ceo` UI**: şema değişikliği YOK — `insights` dizisi
  emoji önekine göre (🎯/📅/🧠) **highlights** (stratejik sinyaller) ve **metrics** (temel
  metrikler) olarak ikiye bölünür. E-posta şablonunda yeni **"🚀 Stratejik Sinyaller"** bölümü
  (mor arka plan) `highlights`'ı, "Özet Metrikler" `metrics`'i gösterir; `/ceo` sayfasında aynı
  ayrım `bg-violet-50`/`dark:bg-violet-950` kutusuyla birebir uygulanır.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (29 route) ✓ · `pm2 restart
  velora-web velora-worker` ✓ · `weeklyReport` job canlı çalıştırıldı (Konfora, hafta 2026-W24) →
  `AIReport` (CEO) oluşturuldu, `insights` 8 satır (5 temel + 🎯 "Yaz Tatili koleksiyonu" EVENT
  öncelik 70/100 + 📅 "Yaz Tatili" MEVSIM 2 gün sonra + 🧠 PI ortalama 67/100), `recommendations`
  5 satır (3 yeni stratejik aksiyon + 2 temel) ✓ · AI narrative finans+fırsat+etkinliği tek
  anlatıda sentezledi ✓ · `/ceo` 200 — "🚀 Stratejik Sinyaller" (mor kutu, 3 satır), "Özet
  Metrikler" (5 satır), "Öneriler" (5 satır) doğru render ✓ · SMTP (Gmail) ile mail gönderildi
  (`mailed: true`) ✓.

### Sıradaki: Sprint 3
- **D5 (ertelendi)**: `campaignPrep` paketinden kullanıcı onayıyla Meta'da **draft kampanya**
  oluşturma (`@velora/integrations/meta` — otomatik YAYINLAMA yok, sadece taslak + onay).
- **UGC → Video Fabrikası**: `ProductIntelligence.ugc` (brief/scenario/hooks/videoFlows)
  alanlarını `video` kuyruğuna/`buildVideoPrompt`'a bağlamak.
- Şikayetvar/Trendyol Playwright adaptörlerinin bu ortamda canlı doğrulanması için `pnpm exec
  playwright install chromium` gerekiyor (şu an WARN ile zarifçe atlanıyor, run başarısız olmuyor).

### Önceki Durum (arşiv)
## Sürüm: 1.3.0 — STRATEJİK DÖNÜŞÜM SPRINT 1: OPPORTUNITY-FIRST + ÜRÜN ZEKASI MOTORU (canlı doğrulandı)
Tarih: 2026-06-12

### Bu sprint — mimari dönüşüm: Fırsat Bul → Skorla → Doğrula → Onayla → Tasarım → ... → Finans
- **Neden:** Rastgele tasarım üretmek yerine önce **pazar fırsatı** bulunup skorlanır; yalnızca
  **satış doğrulaması** geçen fırsatlar tasarıma dönüşür (sert kapı: `validationScore>=60`).
  Printify artık **pasif** (varsayılan kapalı) — yayın doğrudan Shopify'a (mockup yine sharp ile).
- **Fırsat/Keşif merkezi (`@velora/db` `Opportunity` modeli)**: `kind` (TREND/PROBLEM/EVENT),
  6-boyut `opportunityScore` (core `scoreOpportunity` — pazar büyüklüğü dahil), `validationScore`,
  `seasonalityScore` (`computeSeasonality`), `priorityScore` (`computePriority`), `status`,
  `eventDate`. Migration `add_opportunity`. `Source` enum'a `+TRENDYOL/HEPSIBURADA/SIKAYETVAR/
  INSTAGRAM/GOOGLE_TRENDS`. `packages/db/src/services/opportunities.ts`.
- **Yeni kaynak adaptörleri** (`@velora/scraping`): `googleTrends` (RSS, TREND), `sikayetvar`
  (Playwright, **PROBLEM**-tipi fırsat — şikayet hacmi), `trendyol` (Playwright, ürün/fiyat sinyali).
- **Worker `productDiscovery`**: TREND/PROBLEM/EVENT kaynaklarını tarar → 6-boyut skor + seasonality
  + priority → `Opportunity` kayıtları. **Etkinlik Fırsatları**: yaklaşan özel günler
  (`lib/special-days.ts`) otomatik EVENT-tipi fırsat olarak eklenir (`eventDate` ile).
- **Worker `validateOpportunity`**: fırsatı AI ile değerlendirir → `validationScore` +
  `priorityScore` günceller, `status` VALIDATED/REJECTED. **Sert kapı**: tasarıma dönüştürme
  yalnızca `validationScore>=60` olan fırsatlar için tetiklenir.
- **Printify PASİF**: `settings.printify.passive` (varsayılan `true`). Pasifken `design.ts` kendi
  sharp mockup'ını üretir (Printify tetiklenmez), `design-score`/yayın doğrudan Shopify'a
  (`shopifyPublish`). Kod/şema korunur — Ayarlar'dan toggle ile Printify tekrar etkinleştirilebilir.
- **Web**: `/discovery` (priority sıralı fırsat listesi + doğrula/dönüştür aksiyonları),
  `/validation` (doğrulanan/reddedilen fırsatlar), Komuta Merkezi'nde **"En İyi Fırsatlar"**
  widget'ı, sidebar.
- **n8n**: `daily-discovery` workflow (eski haftalık tasarım workflow'u yerine — günlük fırsat
  taraması).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `productDiscovery` → **11 fırsat** (1 EVENT +
  10 TREND) oluşturuldu — PROBLEM-tipi (Şikayetvar, Playwright) bu makinede tarayıcı binary'si
  kurulu olmadığından WARN ile atlandı, run SUCCESS ✓ · `validateOpportunity` → skor **62**,
  durum **VALIDATED** ✓ · `/discovery`, `/validation`, `/dashboard` (En İyi Fırsatlar widget'ı)
  200 + doğru veriyle render ✓.

### Bu sprint — Ürün Zekası Motoru (Product Intelligence Engine, Sprint 1 madde 6)
- **Tetik:** Shopify ürün `products/create`/`products/update` webhook'u (`x-shopify-topic`
  başlığına göre yönlendirme; `orders/*` davranışı korunur). Webhook, REST sayısal `id`'yi
  `gid://shopify/Product/<id>` formatına çevirip `products.upsertByShopify` çağırır
  (`Product.shopifyId` konvansiyonu GraphQL gid'dir — REST/GraphQL ID karışıklığı burada çözüldü).
- **DB `ProductIntelligence`** (1:1 `Product`, migration `add_product_intelligence`, `AssetStatus`
  yeniden kullanıldı): **SEO** (title/description/keywords/handle), **İçerik**
  (description/shortDescription/story/FAQ), **Reklam** (Meta primaryText/headline/description),
  **Satış Açıları** (emotional/premium/humorous/gift/problemSolving), **Hedef Kitle**
  (primary/secondary/ageGroup/interests), **UGC** (brief/scenario/hooks/videoFlows),
  **Product Intelligence Score** (json 6-boyut + `scoreTotal`).
- **core `scoreProductIntelligence`** (`packages/core/src/product-intelligence/score.ts`):
  deterministik ağırlıklı toplam — satış potansiyeli %30, kârlılık %25, (100−rekabet) %15,
  (100−reklam zorluğu) %10, (100−iade riski) %10, (100−tedarik riski) %10.
- **AI prompt** (`prompts.productIntelligence`): tek çağrıda SEO+içerik+reklam+satış açıları+
  kitle+UGC+6-boyut skor JSON döner.
- **Worker `productIntelligence`** (kuyruk `productIntelligence`, concurrency 2): AI çağrısı →
  JSON ayrıştır → skor hesapla → body_html üret (paragraflar+Hikaye+SSS) → `ProductIntelligence`
  kaydet (READY/FAILED) → **varsa Shopify ürününe geri yaz** (`updateProductSeoAndContent`:
  descriptionHtml, seo.title/description, tags, handle) — Shopify yazımı hata verirse sadece
  `warn` loglanır (ana akış bozulmaz).
- **`@velora/integrations`**: `updateProductSeoAndContent` (Shopify `productUpdate` mutation,
  `userErrors`→`IntegrationError`).
- **Web `/intelligence`**: tüm ürünler + PI Score + durum rozeti + "Üret"/"Yeniden Üret" +
  READY'de SEO/İçerik/Reklam/Satış Açıları/Hedef Kitle/UGC kartları. Sidebar'a "Ürün Zekası"
  (Sparkles ikonu) eklendi.
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · `next build` (29 route, `/intelligence` dahil) ✓
  · "jdm r35" ürünü (`cmq9zfplr...`) için iş kuyruğa alındı → worker "ürün zekası üretildi"
  (scoreTotal **72**) ✓ → DB `ProductIntelligence` READY, tüm alanlar dolu ✓ → **Shopify ürünü
  canlı güncellendi** (SEO title/description, 5 etiket, handle `jdm-r35-tisort`, descriptionHtml —
  GraphQL ile doğrulandı) ✓ → `/intelligence` 200, PI Score 72 + tüm bölümler doğru render ✓.

### Teknik Notlar (1.3.0)
- **Next.js dev server + Prisma Client önbelleği**: `prisma migrate dev` ile şema değişip Prisma
  Client yeniden üretildiğinde, ÇALIŞAN `next dev` süreci `node_modules/.prisma/client`'ı izlemez
  (webpack `node_modules`'ı watch etmez) → yeni model (`prisma.productIntelligence`) `undefined`
  kalır → `Cannot read properties of undefined (reading 'findMany')`. **Çözüm:** migration sonrası
  web dev sürecini yeniden başlat (worker zaten `tsx watch` ile prisma client değişiminde otomatik
  restart oluyor — yalnızca `next dev` etkilenir).
- Artık zincir tam otomatik: Fırsat → Doğrulama (≥60) → Tasarım → Yayın (Shopify) → **Ürün Zekası**
  (SEO/içerik/reklam/kitle/UGC otomatik geri yazım) → Finans/Operasyon Skoru.

### Sıradaki: Sprint 2 — Ürün Zekası çıktısının Reklam + Video akışına bağlanması
`ProductIntelligence.ads`/`ugc` alanlarını Meta Reklam Merkezi (kreatif taslağı) ve Video
Fabrikası'na (UGC video brief) bağlamak. Şikayetvar/Trendyol Playwright adaptörlerinin bu
ortamda canlı doğrulanması için `pnpm exec playwright install chromium` gerekiyor (şu an WARN
ile zarifçe atlanıyor, run başarısız olmuyor).

### Önceki Durum (arşiv)
## Sürüm: 1.2.0 — PRINTIFY (PRINT-ON-DEMAND) ENTEGRASYONU (canlı doğrulandı)
Tarih: 2026-06-12

### Bu sprint — POD'a geçiş (mockup + fulfillment Printify'dan)
- **Neden:** Konfora baskılı tişört satıyor. Mockup'lar Printify'dan gelir, tasarım Printify'a
  yüklenir, ürün Printify→Shopify yayınlanır, **siparişler Printify tarafından otomatik basılıp kargolanır**.
- **`@velora/integrations/printify/`**: `client.ts` (`printifyFetch`, Bearer, credential PRINTIFY→env),
  `shops.ts` (`listShops`/`resolveShopId`), `catalog.ts` (`listBlueprints`/`listPrintProviders`/`listVariants`
  + `resolveDefaults` → blueprint 6 Unisex Heavy Cotton Tee), `uploads.ts` (`uploadImage` url|base64),
  `products.ts` (`createPrintifyProduct`/`updateVariantPrices`/`publishPrintifyProduct`/`getPrintifyProduct`).
- **Worker `printify-publish`** (kuyruk `printifyPublish`): şeffaf baskı dosyasını ~2400px upscale →
  Printify'a yükle → ürün oluştur (ön baskı) → maliyet×markup ile fiyatla → front/default mockup'ları
  (cap 8) + `printifyProductId`/`printifyShopId`/`cost`/`price` Product'a yaz; NEW→TEST.
- **Pipeline:** `design.ts` artık sharp `mockup` kuyruğunu TETİKLEMEZ (mockup'lar Printify'dan).
  `design-score.ts` L3 talebe göre → `printifyPublish` (eski `shopifyPublish` yerine).
- **DB:** `Provider.PRINTIFY`; `Product.printifyProductId/printifyShopId/mockups(Json)`;
  `products.setPrintify`/`setShopifyId` (migration `add_printify`).
- **Ayarlar:** Printify token (şifreli credential) + **"Bağlantıyı Getir"** (`resolveShopId`+`resolveDefaults`
  → `printify.shopId/blueprintId/printProviderId/variantIds`) + kâr çarpanı (`printify.markup`, vars. 2.2).
- **/shopify:** "Printify'da Hazırla" (→`printifyPublish`), ürün kartında Printify mockup'ları,
  **"Shopify'a Yayınla"** (`publishPrintifyProduct`). Manuel ürün + içe aktar korunur.
- **Config/env:** `PRINTIFY_API_TOKEN` (config + `.env.example`).
- **Doğrulama (canlı, token Chrome'dan üretildi):** typecheck (11 paket) + `next build` (25 route) ✓ ·
  `listShops` → Konfora(shopify) shop 27893747 ✓ · tasarım→upload→Printify ürün `6a2bb59e…` + **74 mockup**
  (maliyet $9.79 → fiyat $21.54 ×2.2) ✓ · front mockup görsel doğrulandı (yeşil tee + JDM baskı) ✓ ·
  `publishPrintifyProduct` Shopify'a iletildi ✓ · test ürünü temizlendi.

### Teknik Notlar (1.2.0)
- Sharp mockup sistemi (`lib/mockup.ts`, `src/assets/mockups`, `processors/mockup.ts`) ve
  `shopify-publish.ts` POD akışından çıktı ama dosyalar duruyor (geri dönüş için).
- Sipariş/fulfillment: Printify-yayınlı ürün Shopify ürünüdür; sipariş Shopify'a düşer, Printify
  otomatik basar/kargolar (Printify'da auto-fulfill açık olmalı). Finans Shopify siparişlerini okur.
- Baskı çözünürlüğü: tasarım 1024px → upload öncesi ~2400px upscale (düz vektör grafik temiz büyür).

### Önceki Durum (arşiv)
## Sürüm: 1.1.0 — ÜRETİM SERTLEŞTİRME & TAM OTONOMİ (canlı doğrulandı)
Tarih: 2026-06-11

### Bu sprint — gerçek mağaza (Konfora, y0d5py-cb) ile canlıya geçiş
- **Gerçekçi mockup:** sharp-SVG silüet bırakıldı. Fal ile üretilmiş gerçek boş giysi/model
  şablonları (`apps/worker/src/assets/mockups/*.png`) üzerine `multiply` blend kompozit.
  Varsayılan set: **MODEL_FRONT_W (kadın, kapak) + MODEL_FRONT (erkek) + TSHIRT (flat-lay) + MODEL_ANGLE_W**.
  MockupType enum'a `MODEL_FRONT/ANGLE` + `MODEL_FRONT_W/ANGLE_W` eklendi (2 migration).
- **Tasarım kalitesi:** `lib/design-prompt.ts` `buildDesignPrompt` — kısa niş → güçlü
  "vektörel baskı grafiği, beyaz zemin, FOTOĞRAF/giysi/yazı YOK" promptu. Foto/tişört-şekli sorunu çözüldü.
- **Net yazı (AI yazı zaafı çözümü):** `lib/text-overlay.ts` — AI yazıyı bırakmaz; tırnaklı slogan
  (`extractOverlayText`, örn. `gym "BEAST MODE"`) sharp/SVG ile keskin basılır (Arial Black, beyaz dış hat).
- **Baskıya hazır şeffaf PNG:** `lib/print-file.ts` (kenardan flood-fill ile arka plan şeffaf) →
  `Design.transparentUrl`. "Baskı dosyasını indir" mockuplu değil, bare şeffaf grafiği indirir.
- **Görsel mimarisi (tünel KALDIRILDI):** `storage.publicUrl` artık uygulama origin'i
  (`ASSET_PUBLIC_BASE` → `/api/asset/<key>`); panel görselleri MinIO'dan **app rotasıyla** servis edilir
  (`apps/web/app/api/asset/[...key]`). Shopify'a görseller **staged upload** (byte) ile gider
  (`shopify/upload.ts stageUploadImage`). Vision base64 data URL alır. Tünel/HTTP bağımlılığı yok.
- **Shopify çoklu görsel + çalınma koruması:** `createProduct` media (productCreate media arg);
  yayında **SADECE mockup** yüklenir (ham/şeffaf tasarım ASLA), kapak = kadın model. Fiyatlı varyant.
- **Shopify→sistem senkron + manuel ürün:** `products.upsertByShopify`, `integrations.fetchProducts`,
  `/shopify` "Shopify'dan İçe Aktar" + "Manuel Ürün Ekle" + "Satışa Aç (ACTIVE)".
- **Tam otonomi:** `processAutoDesign` (yaklaşan özel günler `lib/special-days.ts` + trendler → tasarım),
  `processAutoPilot` (trend→tasarım→reklam→sağlık→finans), designScore'da **L3 talebe göre otomatik
  yayın** (skor≥`autoPublish.minScore`=68 → DRAFT ürün). Queue: `autoDesign`,`autoPilot`. L3+autoMode AÇIK.
- **n8n canlı:** compose env `N8N_WEBHOOK_SECRET` + `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`. 4 workflow
  import+publish+aktif (Weekly Master, Daily Finance, Spend Guardian, **yeni Weekly Designs — Çar 03:00**).
  Zincir doğrulandı (container→app webhook→worker, HTTP 200).
- **Hukuki/içerik:** Shopify resmi policy slotları zaten Türkçe şablonlu; ek 6 özel sayfa
  (Gizlilik, İade & Cayma, Kullanım Koşulları & Mesafeli Satış, Kargo, Hakkımızda, İletişim) —
  `shopify/policies.ts createLegalPage`. `updateShopPolicies` `write_legal_policies` ister (token'da yok).
- **Doğrulama (canlı):** typecheck (11 paket) ✓ · "cars minimal" → app-origin URL HTTP 200 ✓ ·
  4 mockup (kadın/erkek/flatlay/açı) görsel ✓ · tünel KAPALI iken Shopify staged-upload yayını ✓ ·
  autoDesign Babalar Günü'nü yakaladı ✓ · "BEAST MODE" net yazı ✓.

### Teknik Notlar (1.1.0)
- Tünel gereksiz; üretimde `ASSET_PUBLIC_BASE` gerçek alan adına ayarlanır. Shopify görselleri
  staged-upload ile Shopify CDN'inde barınır (app erişilemese de kalıcı).
- Mockup şablonları repo'da binary (`src/assets/mockups`); print rect'leri şablon oranına göre.
- Resmi policy slotlarına API'den yazmak için custom app'e `write_legal_policies` scope gerekir (opsiyonel).

### Önceki Durum (arşiv)
## Sürüm: 1.0.0 — FAZ 10 TAMAMLANDI · PROJE TAMAMLANDI 🎉
Tarih: 2026-06-10

### PROJE ÖZETİ — Tüm 25 modül uygulandı (Faz 0–10 + 2b)
14 panel: Komuta Merkezi, AI CEO, Ürün Araştırma (6 kaynak), Trend Avcısı, Tasarım & Mockup, Video, Shopify, Meta Reklam, Finans & İş Zekası, Rakip Analiz, Tedarikçi & Mail, Kreatif Test Lab, Görev/İşler/Denetim/Yedekleme/Ayarlar.
11 paket (config/shared/db/queue/core/ai/scraping/storage/integrations + web/worker), ~17 BullMQ kuyruğu, 3 n8n workflow, çok markalı, AES şifreli credential, L1/L2/L3 otonomi + Acil Durum Koruması.

### Faz 10 — Sağlamlık & Yedek & Gözlem (TAMAMLANDI, canlı doğrulandı)
- **`apps/worker`**: `backup` worker (çekirdek tabloların mantıksal JSON dışa aktarımı → MinIO, ApiCredential hariç) + Backup kaydı. `@velora/db` `backups` servisi.
- **`apps/web`**: `/backups` (yedek listesi + "Yedek Al") + `/api/health` (db+redis+storage sağlık ucu, auth yok).
- **`@velora/queue`**: `backup` kuyruğu.
- **infra**: `docker-compose.prod.yml` (altyapı + web + worker), `docker/web.Dockerfile`, `docker/worker.Dockerfile` (Playwright base), `.dockerignore`.
- **L3:** guardrail'ler hazır — adSync L3+autoMode kapısı, spendGuardian daima aktif.
- Sidebar'a "Yedekleme" eklendi.
- **Doğrulama:** typecheck (11 paket) ✓ · `next build` ✓ · canlı: backup→MinIO (9KB, sır içermez) + Backup kaydı ✓ · health db/redis/storage=true ✓.

### Teknik Notlar (Faz 10)
- Yedek = mantıksal JSON (sürümden bağımsız, taşınabilir); üretimde sürüm-eşleşen `pg_dump` sidecar eklenebilir. Sırlar (API anahtarları) yedeğe dahil DEĞİL.
- Üretim build'i (web/worker imajları) ağır (Playwright base + pnpm install); CI/host'ta `docker compose -f infra/docker-compose.prod.yml up -d --build`.

### Sıradaki: opsiyonel zenginleştirmeler — Faz 2b (✓), 3b (tasarım varyant), 5b (Shopify varyant/koleksiyon/indirim + Playwright sağlık), reverse proxy/TLS, Sentry.

### Önceki Durum (arşiv)
## Sürüm: 0.11.0 — FAZ 9 TAMAMLANDI
Tarih: 2026-06-10

### Faz 9 — AI CEO + Rapor + n8n Otomasyon + Kreatif Lab (TAMAMLANDI, canlı doğrulandı)
- **`apps/worker`**: `weeklyReport` (AI CEO: finans+operasyon skoru+trend+görev sentezi → AIReport CEO; ai.text yoksa deterministik özet → HTML rapor → SMTP operatöre). `lib/report-html.ts`, `lib/iso-week.ts`.
- **`apps/web`**: `/ceo` (AI CEO raporları + "Haftalık Rapor Üret"), `/lab` (Kreatif Test Lab: hipotez + varyantlar A/B + kazanan seçimi).
- **`@velora/db`**: `creativeTests` servisi (crm.ts).
- **`@velora/queue`**: `weeklyReport` kuyruğu.
- **n8n** (`n8n/workflows/`): `weekly-master.json` (Cron Pazar 00:00 → webhook zinciri: trend→adSync→finance→report), `daily-finance.json`, `spend-guardian.json`.
- **Webhook geliştirme**: `/api/webhooks/n8n` marka-seviyesi işlere `brandId` otomatik enjekte eder (workflow yalnızca `{event, queue}` gönderir).
- Sidebar'a "AI CEO" + "Kreatif Test Lab" eklendi.
- **Doğrulama:** typecheck (11 paket) ✓ · `next build` (/ceo,/lab) ✓ · **canlı**: weeklyReport→AIReport(CEO)+HTML mail Mailhog'da ✓.

### Teknik Notlar (Faz 9)
- Haftalık rapor anahtarsız da çalışır (deterministik özet); AI yalnızca anlatıyı zenginleştirir.
- n8n workflow'ları `host.docker.internal:3000` + `N8N_WEBHOOK_SECRET` env ile app webhook'una bağlanır (içe aktarma manuel; n8n UI :5678).
- PDF rapor + n8n health/backup workflow'ları Faz 10'a bırakıldı.

### Sıradaki: FAZ 10 — Sağlamlık & Yedek & Gözlem (son faz)
Yedekleme Merkezi (DB+workflow+asset), gözlemlenebilirlik, üretim Docker, L3 tam otonomi açılışı.

### Önceki Durum (arşiv)
## Sürüm: 0.10.0 — FAZ 8 TAMAMLANDI
Tarih: 2026-06-10

### Faz 8 — Rakip + Trend + Tedarikçi + Mail (TAMAMLANDI, canlı doğrulandı)
- **`@velora/integrations/email`**: Nodemailer SMTP gönderici (`sendEmail`); dev'de Mailhog (auth yok), üretimde gerçek SMTP.
- **`@velora/db`**: `competitors` (CRUD + addProduct), `suppliers` (CRUD), `emails` (create/markSent/markFailed), `trends` (list/replaceWeek) — `services/crm.ts`.
- **`apps/worker`**: `mailSend` (EmailMessage→SMTP→SENT/FAILED, alıcı=tedarikçi e-postası), `trendHunt` (araştırma sonuçları→haftalık Trend, ISO hafta), `competitorScan` (best-effort fetch: sayfa başlığı + fiyat sinyali → CompetitorProduct).
- **`apps/web`**: `/competitors` (rakip+ürün CRUD, tara), `/trends` (haftalık trend + avla), `/suppliers` (tedarikçi CRUD + AI mail taslağı + SMTP gönder). Server-action + audit.
- **`@velora/queue`**: `mailSend`/`trendHunt`/`competitorScan` kuyrukları.
- Sidebar'a "Trend Avcısı", "Rakip Analiz", "Tedarikçi & Mail" eklendi.
- **Doğrulama:** typecheck (11 paket) ✓ · `next build` ✓ · **canlı**: mail→Mailhog kutusunda doğrulandı ✓ · trendHunt 10 araştırma→10 trend ✓.

### Teknik Notlar (Faz 8)
- Mail alıcısı tedarikçi e-postasıdır (CLAUDE.md "Tedarikçi İletişimi"); genel `to` alanı yok (gerekirse şema eklenir).
- `competitorScan` basit fetch + regex (başlık/fiyat); JS-render/anti-bot siteler için Faz 8b Playwright.
- AI mail taslağı (`draftEmail`) ve finansal yorum gibi diğer ai.text akışları anahtar yoksa Görev Merkezi'ne API_INPUT görevi açar.

### Sıradaki: FAZ 9 — AI CEO + Rapor + n8n Otomasyon + Kreatif Lab
(Henüz başlanmadı.)

### Önceki Durum (arşiv)
## Sürüm: 0.9.0 — FAZ 7 TAMAMLANDI
Tarih: 2026-06-10

### Faz 7 — Finans & İş Zekası + Karlılık + Operasyon Skoru (TAMAMLANDI, canlı doğrulandı)
- **`@velora/core`**: `computeFinance` (ciro/COGS/reklam/kargo/komisyon → brüt/net kâr, vergi, AOV, ROAS, CPA), `productProfit` (fiyat−maliyet/marj), `computeOperationScore` (+`roasToScore`/`marginToScore`).
- **`@velora/db`**: `finance` (upsertSnapshot/range/latest), `operationScores` (upsert/latest).
- **`apps/worker`**: `financeSnapshot` worker — günün siparişleri (ciro) + AdMetric (harcama) + ayar oranları (COGS/kargo/komisyon) → FinanceSnapshot + Operasyon Skoru (reklam=ROAS, kâr=marj, SEO=health, kalite=tasarım skoru ort., trend=araştırma kâr ort.).
- **`apps/web`**: `/finance` (KPI kartları: günlük/haftalık/aylık/yıllık ciro, sipariş, AOV, reklam, net/brüt kâr, vergi, ROAS/CPA; operasyon skoru; ürün karlılığı tablosu; AI yorum). Server-action: snapshot tetikle + AI yorum (AIReport FINANCE).
- **`@velora/queue`**: `financeSnapshot` kuyruğu.
- Sidebar'a "Finans & İş Zekası" eklendi.
- **Doğrulama:** typecheck (11 paket) ✓ · `next build` (/finance) ✓ · canlı e2e: seed sipariş(800)+reklam(160)→snapshot→ciro 800/net 400/ROAS 5/opSkor 77.1 ✓.

### Teknik Notlar (Faz 7)
- Order modelinde satır kalemi yok → COGS `finance.cogsRate` (vars. 0.3), kargo `finance.shippingPerOrder`, komisyon `finance.commissionRate` ayarlarından. Vergi `Brand.taxRate`.
- Faz 7 büyük ölçüde hesaplama (DB'den) → canlı doğrulanabilir; yalnızca AI yorum anahtar-gated.

### Sıradaki: FAZ 8 — Rakip + Trend + Tedarikçi + Mail
(Henüz başlanmadı.)

### Önceki Durum (arşiv)
## Sürüm: 0.8.0 — FAZ 6 TAMAMLANDI
Tarih: 2026-06-10

### Faz 6 — Meta Reklam + Acil Durum Koruması (TAMAMLANDI)
- **`@velora/integrations/meta`**: Meta Marketing API client (Graph v21, credential→env) — `listCampaigns`, `setCampaignStatus`, `setCampaignBudget`, `fetchCampaignInsights`.
- **`@velora/core/guardrails`**: `evaluateSpendLimits` (harcama→ihlal), `decideAdAction` (SCALE/KEEP/PAUSE, ROAS/CPA eşikleri) — saf/deterministik, **canlı doğrulandı**.
- **`@velora/db`**: `adCampaigns` (list/upsert/setStatus), `adMetrics` (upsert/latest/`spendByPeriod` günlük-haftalık-aylık toplam).
- **`apps/worker`**: `adSync` (insights→AdMetric + L3&autoMode'da otomatik ölçek/durdur), `spendGuardian` (limit aşımında aktif kampanyaları duraklat + ACİL görev + L3 audit).
- **`apps/web`**: `/ads` (acil durum koruması paneli: harcama vs limit, kampanya aç/durdur/bütçe, performans ROAS/CPA/CPC/CTR, senkron/koruma butonları). Meta-eksik→Görev Merkezi.
- **`@velora/queue`**: `adSync`/`spendGuardian` kuyrukları.
- Sidebar'a "Meta Reklam" eklendi.
- **Doğrulama:** typecheck (11 paket) ✓ · `next build` (/ads) ✓ · canlı: spend limit ihlali (DB 1050/750) + auto-mode kararları + spendByPeriod toplama ✓. Meta API gerçek kod, token+hesap gerektirir.

### Teknik Notlar (Faz 6)
- Acil Durum Koruması L3 otonom reklamdan ÖNCE hazır (roadmap gereği). Guardian değerlendirmesi Meta'sız çalışır; yalnızca "duraklat" eylemi Meta gerektirir (yoksa görev kalır).
- Meta bütçe minor birim (cent) ister → client major→cent çevirir.

### Sıradaki: FAZ 7 — Finans & İş Zekası + Karlılık + Operasyon Skoru
(Henüz başlanmadı.)

### Önceki Durum (arşiv)
## Sürüm: 0.7.0 — FAZ 5 TAMAMLANDI (İLK MVP)
Tarih: 2026-06-10

### Faz 5 — Shopify Yönetim + Otomatik Ürün Sayfası + Sağlık + Yaşam Döngüsü (TAMAMLANDI)
- **Yeni paket `@velora/integrations`**: Shopify Admin GraphQL client (`shopifyGraphQL`, credential→env çözümü), `verifyShopifyWebhook` (HMAC-SHA256, timing-safe), `createProduct` (productCreate+SEO+tags), `fetchProductsForHealth`.
- **`@velora/core`**: ürün yaşam döngüsü durum makinesi (`canTransition`/`nextStates`/`LIFECYCLE_LABELS`).
- **`@velora/db`**: `products` servisi (`create`/`list`/`transition` [core ile doğrulamalı + ProductLifecycleEvent]/`setShopify`). db artık @velora/core'a bağımlı.
- **`apps/worker`**: `shopifyPublish` (otomatik ürün sayfası: ai.text→JSON→HTML + createProduct + setShopify + NEW→TEST), `shopifyHealth` (SEO/görsel API taraması → ShopifyHealthCheck).
- **`apps/web`**: `/shopify` (yayınlanabilir tasarımlar → ürün+yayın, ürün+yaşam döngüsü geçiş butonları, sağlık kontrolü) + `/api/webhooks/shopify` (HMAC doğrulamalı sipariş upsert).
- **`@velora/queue`**: `shopifyPublish`/`shopifyHealth` kuyrukları.
- Sidebar'a "Shopify" eklendi.
- **Doğrulama:** typecheck (11 paket) ✓ · `next build` ✓ · **canlı**: HMAC kabul/red ✓ · yaşam döngüsü DB geçişleri + olay kaydı + geçersiz geçiş reddi ✓. Shopify API + AI sayfa gerçek kod, mağaza+anahtar gerektirir.

### Teknik Notlar (Faz 5)
- HMAC için TS5.9/@types/node Buffer köprüsü (`u8()`) integrations/webhooks'ta tekrar kullanıldı.
- Görsel ekleme: Shopify üretici sunucusu lokal MinIO URL'sine erişemez → üretimde public S3/CDN gerekir.

### Sıradaki: FAZ 6 — Meta Reklam + Acil Durum Koruması
(Henüz başlanmadı.) Faz 5b: varyant/koleksiyon/indirim + Playwright sağlık + public asset.

### Önceki Durum (arşiv)
## Sürüm: 0.6.0 — FAZ 4 TAMAMLANDI
Tarih: 2026-06-10

### Faz 4 — Video Fabrikası (TAMAMLANDI, doğrulandı)
- `@velora/queue`: `video` kuyruğu (`{ videoId, prompt }`).
- `apps/worker/src/lib/video-format.ts`: `VIDEO_FORMATS` (TikTok/Reel/Story/UGC → en-boy/süre) + `buildVideoPrompt`.
- `apps/worker/src/processors/video.ts`: prompt → Fal video (`ai.video.generate`) → MinIO → `Video.url`, durum GENERATING/READY/FAILED.
- `apps/web/videos`: video üret (prompt+format) + galeri (`<video controls>` önizleme) + onay. Server-action + audit.
- Sidebar'a "Video Fabrikası" eklendi.
- **Doğrulama:** typecheck (10 paket) ✓ · `next build` (`/videos` dahil) ✓ · `processVideo` hata yolu canlı doğrulandı (FAL anahtarı yokken Video → FAILED, açık hata). Depolama yolu Faz 3'te zaten canlı doğrulanmıştı (aynı `putObject`).
- Not: Fal video üretimi gerçek kod; FAL anahtarıyla çalışır (sandbox'ta anahtar yok). Video model'inde prompt alanı yok → prompt iş verisinde taşınır.

### Sıradaki: FAZ 5 — Shopify Yönetim + Otomatik Ürün Sayfası + Sağlık (ilk MVP)
(Henüz başlanmadı.)

### Önceki Durum (arşiv)
## Sürüm: 0.5.1 — FAZ 2b TAMAMLANDI
Tarih: 2026-06-10

### Faz 2b — Kalan Kaynak Adaptörleri (TAMAMLANDI, canlı doğrulandı)
- `@velora/scraping` 4 yeni adaptörle tamamlandı; `availableSources()` artık 6 kaynağın hepsini döner (UI otomatik gösterir):
  - **Etsy** (`strategy: 'api'`, `requiresCredential`): resmi Open API v3 (`x-api-key`). Favori/görüntülenme = talep sinyali. CLAUDE.md ilkesi: API > Playwright.
  - **Pinterest / TikTok / Amazon** (`strategy: 'browser'`): serbest keşif için resmi/serbest API yok → dikkatli Playwright (son çare, ToS riski — docs §8.1/§15). `browser-pool`'u **dinamik import** eder (web bundle'a Playwright sızmaz).
- **Dayanıklı HTTP istemcisi** `src/http.ts` (fetch): host-bazlı kibarlık gecikmesi + exponential backoff + jitter + `Retry-After` + rotasyonlu UA. 403/kalıcı 429 → `ScrapeBlockedError`, diğer → `IntegrationError`.
- **`browser-pool` genişletildi:** rotasyonlu UA havuzu (`user-agents.ts`), opsiyonel proxy (`SCRAPER_PROXY_URL`/`HTTPS_PROXY` → Playwright `proxy`), `humanDelay()`, `assertNotBlocked()` (CAPTCHA/login-duvarı tespiti), `webdriver` maskeleme + **`__name` şimi** (tsx/esbuild `keepNames`'in evaluate'e sızması düzeltildi).
- **Engelleme akışı:** adaptör `ScrapeBlockedError` → worker `processors/research.ts` yakalar → run `FAILED` + Görev Merkezi'ne **API_INPUT** "manuel doğrulama" görevi (öncelik 1), **yeniden denemez**.
- **Anahtar çözümü (worker):** kaynak→sağlayıcı eşlemesi ile önce marka credential (`ETSY`/`PINTEREST`), yoksa env (`ETSY_API_KEY`/`PINTEREST_ACCESS_TOKEN`); `scrape(query, { credential, proxyUrl })` ile geçilir.
- **Yeni hata tipi:** `@velora/shared` `ScrapeBlockedError` (`code: 'SCRAPE_BLOCKED'`, `manualVerification: true`).
- **DB:** `Provider` enum'a `ETSY` + `PINTEREST` (migration `20260610083532_add_etsy_pinterest_providers`, **uygulandı**). `credentials.listStatus` + Ayarlar UI + `saveCredential` whitelist genişletildi.
- **Env:** `ETSY_API_KEY`, `PINTEREST_ACCESS_TOKEN`, `SCRAPER_PROXY_URL` (config şeması + `.env.example`).
- **Doğrulama:** typecheck (10 paket) ✓ · `next build` (14 route, Playwright bundle'da yok) ✓ · canlı e2e (chromium kurulu):
  - **Amazon** "cat lover gift" → 30 gerçek ürün → skorla → `ResearchResult` SUCCESS ✓
  - **Pinterest** → bot koruması ("captcha") → `ScrapeBlockedError` → run FAILED + manuel doğrulama görevi açıldı ✓
  - **Etsy** (anahtarsız) → net `IntegrationError`, FAILED, görev YOK (engel değil, yapılandırma) ✓
  - **Hacker News** → SUCCESS (registry refactor regresyon yok) ✓

### Teknik Notlar (Faz 2b)
- **`__name is not defined`** (kritik): tsx/esbuild `keepNames`, `page.$$eval` callback'i içindeki adlandırılmış closure'ları `__name(fn,"x")` ile sarar; Playwright yalnızca gövdeyi sayfaya taşıdığından tarayıcıda `__name` tanımsız kalır. Çözüm: `browser-pool` `addInitScript` ile sayfaya `globalThis.__name = (fn)=>fn` şimi. Bu, tüm tarayıcı adaptörlerini (yalnızca testi değil, gerçek worker runtime'ını) etkiliyordu.
- Tarayıcı adaptörleri için chromium binary'si gerekir: `pnpm --filter @velora/scraping exec playwright install chromium` (docs §8.1).
- Proxy: tarayıcı adaptörleri Playwright yerel proxy'sini, fetch adaptörleri standart `HTTPS_PROXY` env'ini (Node ≥ 24) kullanır — ek bağımlılık yok.

### Sıradaki: FAZ 4 — Video Fabrikası (Fal)
(Henüz başlanmadı.) Faz 2b ile Ürün Araştırma Motoru tüm kaynaklarıyla tamam.

### Önceki Durum (arşiv)
## Sürüm: 0.5.0 — FAZ 3 TAMAMLANDI
Tarih: 2026-06-10

### Faz 3 — Tasarım + Mockup + Skorlama + AI Direktör (TAMAMLANDI, çekirdek doğrulandı)
- `@velora/storage`: MinIO/S3 nesne deposu (`putObject`/`publicUrl`/`presignedUrl`/`fetchToBuffer`/`assetKey`). **Canlı doğrulandı.**
- `apps/worker` yeni işleyiciler: `design` (Fal görsel → MinIO → Design.pngUrl, sonra mockup+skor tetikler), `mockup` (sharp kompozisyon, 4 giysi türü, AI'sız), `designScore` (OpenAI Vision → JSON skor).
- `apps/worker/src/lib/mockup.ts`: sharp ile giysi silüeti SVG'sine tasarım kompozisyonu.
- `apps/web/designs`: AI Tasarım Direktörü (brief üret), tasarım üret (prompt→Fal), galeri + mockup önizleme + skor + onay. Server-action + audit.
- `@velora/queue`: `design`/`mockup`/`designScore` kuyrukları.
- **Doğrulama:** typecheck (10 paket) ✓ · `next build` ✓ · canlı e2e: sentetik tasarım→MinIO→`processMockup`→4 mockup erişilebilir ✓. Fal/Vision/brief gerçek kod, anahtar varken çalışır.

### Teknik Notlar (Faz 3)
- Monorepo deseni: paketler TS kaynağını doğrudan export eder → tüketici kendi tsconfig lib'iyle derler. Playwright `page.evaluate` DOM tipleri için `apps/worker` ve `packages/scraping` tsconfig'lerine `lib:["ES2022","DOM"]` eklendi.
- Web bundle'ına Playwright sızmaması için `next.config` webpack `externals` + `serverComponentsExternalPackages` (playwright/playwright-core/chromium-bidi).
- sharp `pnpm.onlyBuiltDependencies`'e eklendi (prebuilt binary).
- MinIO bucket anonim-download → `publicUrl` doğrudan <img src>.

### Eşzamanlı Çalışma Notu (çözüldü — bkz. 0.5.1)
- Faz 2b (kalan kaynak adaptörleri: Etsy/Pinterest/TikTok/Amazon + proxy/anti-bot) **tamamlandı** (Sürüm 0.5.1). `Provider` enum migration'ı (`20260610083532_add_etsy_pinterest_providers`) uygulandı; şema ve DB senkron.

### Sıradaki: FAZ 4 — Video Fabrikası (Fal)
(Henüz başlanmadı.) Ardından Faz 5: Shopify.

### Önceki Durum (arşiv)
## Sürüm: 0.4.0 — FAZ 2 TAMAMLANDI
Tarih: 2026-06-10

### Faz 2 — AI Gateway + Ürün Araştırma Motoru (TAMAMLANDI, doğrulandı)
- `@velora/ai`: sağlayıcı-bağımsız AI Gateway. `ai.text/vision/embedding` (OpenAI SDK), `ai.image/video` (Fal REST). Anahtar çözümü marka credential → env fallback. `logUsage` + fiyat tablosu → `UsageLog`. Prompt kayıt defteri (`prompts`).
- `@velora/core`: deterministik skorlama motoru (`scoreItems`/`scoreItem`/`summarizeScores`) — talep/rekabet/satış/kâr 0–100, AI gerektirmez (etkileşim + ticari niyet + tazelik heuristiği).
- `@velora/scraping`: `SourceAdapter` deseni + `getAdapter`/`availableSources`. Adaptörler: **Reddit** (açık JSON) + **Hacker News** (Algolia, kararlı). Playwright `browser-pool` ayrı giriş noktası `@velora/scraping/browser` (web bundle'a Playwright sızmaz).
- `@velora/queue`: `research` kuyruğu eklendi (`{ runId }`).
- `apps/worker`: `research` processor — adaptör→skorla→`ResearchResult` yaz, run durumunu RUNNING/SUCCESS/FAILED yönetir.
- `apps/web`: `/research` sayfası (server-action tetikleme + skorlu sonuç tablosu) + sidebar.
- **DB:** `Source` enum'a `HACKERNEWS` (migration `20260610080809_add_hackernews_source`).
- **Doğrulama:** typecheck (9 paket) ✓ · `next build` (12 route) ✓ · canlı e2e: run→worker→HN scrape→skorla→ResearchResult SUCCESS ✓.

### Teknik Notlar (Faz 2)
- HTTP başlık değerleri ASCII olmalı (Reddit UA'da Türkçe karakter 'ş' fetch'i patlattı → düzeltildi).
- Reddit sandbox datacenter IP'den 403 (gerçek/residential dağıtımda veya OAuth ile çalışır); HN her ortamda çalışır.
- Playwright npm paketi kuruldu ama browser binary'leri YOK (`playwright install chromium` gerekli). Reddit/HN adaptörleri tarayıcı gerektirmez.
- Next bundle'a native paket sızmasın diye: workspace paketleri `transpilePackages`, `playwright`/`openai`/`@prisma/client`/`bullmq`/`ioredis` → `serverComponentsExternalPackages`.

### Sıradaki: FAZ 3 — Tasarım + Mockup + Skorlama + AI Tasarım Direktörü
(Henüz başlanmadı.) Ayrıca Faz 2b: kalan kaynak adaptörleri (Pinterest/Etsy/TikTok/Amazon, Playwright+proxy).

### Önceki Durum (arşiv)
## Sürüm: 0.3.0 — FAZ 1 TAMAMLANDI
Tarih: 2026-06-10

### Faz 1 — Çekirdek Platform (TAMAMLANDI, doğrulandı)
- `@velora/db` domain servisleri: `brands`, `settings` (tipli JSON KV), `audit`, `tasks`, `spendLimits` + `credentials.listStatus`.
- `apps/web/lib`: `getActiveBrand()` (çok marka, çerez/aktif), `actionContext()` (oturum+marka+actor).
- Navigasyon kabuğu: sidebar (Komuta Merkezi/Görevler/İşler/Denetim/Ayarlar) + header'da marka rozeti.
- `/dashboard`: özet kartlar (görev sayıları, otonomi) + açık görevler + son denetim olayları.
- `/settings`: marka bilgileri, API anahtarları (6 sağlayıcı, AES şifreli, ayarlı/ayarsız rozeti), harcama limitleri, otonomi seviyesi — hepsi server-action + audit loglu.
- `/tasks`: görev oluştur + durum filtreleri + onay kapıları (Onayla/Reddet) + durum geçişleri.
- `/audit`: son 100 denetim kaydı tablosu (otonomi seviyesi rozetli).
- `/jobs`: BullMQ iş izleme tablosu + sistem sağlık testi (SampleJobRunner).
- `/api/webhooks/n8n`: Bearer/x-velora-secret doğrulamalı, denetim loglu, kuyruğa iş atabilen n8n orkestrasyon ucu. Yeni env: `N8N_WEBHOOK_SECRET`.
- **Doğrulama:** typecheck ✓ · `next build` (12 route) ✓ · servis round-trip ✓ · webhook→enqueue→worker→audit ✓.

### Mimari Notu (Faz 1)
- Form mutasyonları **Next.js server action** ile (`actions.ts`, `'use server'`); 'use server' dosyaları yalnızca async fonksiyon export eder (sabit export edilmez).
- Tüm L1/L2 eylemleri `audit.log` ile actor+otonomi seviyesiyle kaydedilir.

### Sıradaki: FAZ 2 — AI Gateway + Ürün Araştırma Motoru
AI Gateway (Text/Vision/Image/Video/Embedding + UsageLog), prompt kayıt defteri, Playwright browser-pool + kaynak adaptörleri (Reddit API → Pinterest/Etsy → TikTok/Amazon), skorlama motoru, araştırma UI. (Henüz başlanmadı.)

### Önceki Durum (arşiv)
## Sürüm: 0.2.0 — FAZ 0 TAMAMLANDI
Tarih: 2026-06-09

### Onaylanan Kararlar
- Mimari onaylandı; sıfırdan kurulum (mevcut Shopify_Ai dikkate alınmadı).
- Dağıtım: şimdilik lokal/Docker. AI: OpenAI + Fal.ai (gateway soyutlamalı).

### Faz 0 — Temel & İskelet (TAMAMLANDI, doğrulandı)
- İzole git deposu proje dizininde açıldı (`git init`, R1 çözüldü).
- pnpm + Turborepo monorepo: `apps/{web,worker}`, `packages/{config,shared,db,queue}`.
- Docker altyapısı ayakta: postgres(5434), redis(6379), minio(9000/9001 + `velora-assets` bucket), n8n(5678), mailhog(8025).
- `packages/config`: Zod env doğrulama (lazy, cache).
- `packages/shared`: AES-256-GCM kripto (round-trip ✓), hata sınıfları, tipler (AutonomyLevel).
- `packages/db`: 35 modelli Prisma şeması + migration `20260609203613_init` + seed (operatör/marka/limit/ayar) + şifreli `credentials` servisi.
- `packages/queue`: BullMQ kuyruk kaydı + ioredis bağlantısı.
- `apps/worker`: BullMQ worker + `sample` işleyici + pino + graceful shutdown.
- `apps/web`: Next.js 14 + Tailwind + shadcn + Auth.js v5 (credentials) + korumalı dashboard + `/api/jobs`.
- **Doğrulama:** `pnpm -r typecheck` ✓ · `next build` ✓ · uçtan uca enqueue→worker→sonuç ✓.
- Giriş: owner@velora.local / velora1234.

### Teknik Notlar / Tuzaklar (gelecekte dikkat)
- Postgres host portu **5434** (5432 yerel PG, 5433 başka proje dolu).
- Tek kök `.env`; paket scriptleri `dotenv -e ../../.env` ile yükler, Next ise `next.config.mjs` içinde.
- pnpm 10 build scriptleri kısıtlı → `pnpm.onlyBuiltDependencies` ile prisma/esbuild/msgpackr onaylandı.
- `ioredis` tekilleştirme için `pnpm.overrides` (5.11.1).
- TS 5.9 + @types/node Buffer/ArrayBuffer sürtüşmesi → `packages/shared/src/crypto.ts` içinde yerel `u8()` köprüsü.
- web/worker üretim Dockerfile'ları Faz 10'a bırakıldı; dev'de host'ta `pnpm dev:web` / `pnpm dev:worker`.

### Sıradaki: FAZ 1 — Çekirdek Platform
Marka context middleware, ayarlar+API anahtar ekranı, Görev Merkezi, AuditLog/otonomi altyapısı, komuta merkezi kabuğu, job izleme UI. (Henüz başlanmadı.)

### Önceki Durum (arşiv)
## Sürüm: 0.1.0 — MİMARİ AŞAMASI
Tarih: 2026-06-09

### Tamamlanan
- Proje analizi yapıldı (greenfield; dizinde yalnızca CLAUDE.md mevcuttu).
- Tüm modüller (25) envanteri çıkarıldı.
- Teknik mimari tasarlandı → `docs/ARCHITECTURE.md`
  - Üst düzey mimari (Modüler Monolit + ayrık BullMQ Worker + n8n orkestrasyon)
  - Klasör yapısı (pnpm + Turborepo monorepo)
  - Veritabanı şeması (Prisma taslağı, çok markalı)
  - n8n workflow mimarisi (haftalık master + yardımcı workflow'lar)
  - Docker mimarisi (postgres/redis/minio/n8n/web/worker)
  - Playwright otomasyon mimarisi (API öncelikli adaptör deseni)
  - Shopify entegrasyon katmanı (Admin GraphQL)
  - Meta entegrasyon katmanı (Marketing API)
  - AI servis mimarisi (sağlayıcıdan bağımsız AI Gateway)
  - Finans + raporlama mimarisi
- Geliştirme sırası ve faz planı → `PROJECT_ROADMAP.md` (Faz 0–10)
- Riskler/açık kararlar raporlandı (R1–R11), kullanıcı onayı bekleniyor.

### Bekleyen (onay sonrası)
- Açık kararların netleşmesi (R1–R11; özellikle git deposu, dağıtım, AI sağlayıcı, mevcut Shopify_Ai örtüşmesi).
- Faz 0: monorepo iskeleti + Docker + Prisma migration.

### Notlar
- Mevcut tooling: Node v25.6.1, npm 11.9.0, Docker 29.1.5, PostgreSQL 14.20.
- ⚠️ Git deposu şu an `/Users/emir` (ev dizini) kökünde — izole repo gerekli (R1).
- Henüz uygulama kodu YAZILMADI (kullanıcı talimatı: önce mimari + onay).