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