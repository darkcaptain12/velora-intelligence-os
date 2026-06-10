# VELORA AI COMMERCE OS — TEKNİK MİMARİ

> Durum: **TASARIM AŞAMASI (kod yazılmadı)** · Sürüm: 0.1.0-architecture · Tarih: 2026-06-09
> Bu doküman CLAUDE.md'de tanımlı tüm modüllerin teknik tasarımını içerir. Onay sonrası geliştirme bu dokümana göre yapılacaktır.

---

## 1. PROJENİN NİHAİ HEDEFİ (ÖZET)

Tek kişi tarafından işletilen ancak kurumsal seviyede çalışan, **yapay zeka destekli, tam otomasyonlu bir E-Ticaret Operasyon Sistemi** kurmak.

Sistem uçtan uca şu döngüyü kendi başına yürütebilmelidir:

```
Trend/Ürün Araştır → Tasarım Üret → Mockup Üret → Video Üret →
Shopify'a Yükle (ürün sayfası + SEO) → Meta'da Reklam Aç →
Performansı Ölç (ROAS/CPA) → Karlılık Analiz Et →
Optimize Et / Ölçekle / Kapat → Haftalık Rapor + AI CEO Yorumu
```

Üç otonomi seviyesinde çalışır:
- **L1 – Öner:** analiz eder, öneri sunar, onay bekler.
- **L2 – Yap & Raporla:** işlemi yapar, sonucu raporlar.
- **L3 – Tam Otomatik:** insan müdahalesi olmadan tüm zinciri yürütür (sert güvenlik limitleriyle).

Mimari **modüler** ve **çoklu markaya hazır** (şimdilik tek marka aktif) olacak şekilde tasarlanır.

---

## 2. MODÜL ENVANTERİ (25 MODÜL)

| # | Modül | Otonomi | Bağımlılık |
|---|-------|---------|-----------|
| 1 | AI Komuta Merkezi | L1-L3 | Tüm modüller |
| 2 | Ürün Araştırma Motoru | L2 | AI, Scraping |
| 3 | Tasarım Fabrikası | L3 | AI (Fal.ai/OpenAI), Storage |
| 4 | Mockup Fabrikası | L3 | Tasarım, Storage |
| 5 | Video Fabrikası | L3 | Fal.ai, Storage |
| 6 | Shopify Yönetim Merkezi | L2-L3 | Shopify API |
| 7 | Meta Reklam Merkezi | L1-L3 | Meta API, Acil Durum Koruması |
| 8 | Rakip Analiz Merkezi | L2 | Scraping, AI |
| 9 | Trend Avcısı | L2 | Scraping, AI |
| 10 | Karlılık Analizi | L2 | Finans, Shopify, Meta |
| 11 | Tasarım Skorlama | L2 | AI (Vision) |
| 12 | Tedarikçi Merkezi | L2 | Scraping, Mail |
| 13 | Mail Merkezi | L1-L2 | SMTP, AI |
| 14 | Görev Merkezi | L1 | Tüm modüller |
| 15 | AI CEO | L1 | Finans, Operasyon Skoru, AI |
| 16 | Ürün Yaşam Döngüsü | L2 | Shopify, Meta, Finans |
| 17 | Kreatif Test Laboratuvarı | L2-L3 | Meta, Tasarım, Video |
| 18 | Shopify Sağlık Kontrolü | L2 | Shopify, Playwright |
| 19 | AI Tasarım Direktörü | L1 | Trend, Rakip, Satış geçmişi, AI |
| 20 | Otomatik Ürün Sayfası | L3 | AI, Shopify |
| 21 | Acil Durum Koruması | L3 | Meta, Finans |
| 22 | Yedekleme Merkezi | L2 | DB, Storage, n8n |
| 23 | Çoklu Marka Altyapısı | — | Çekirdek |
| 24 | Operasyon Skoru | L2 | Tüm metrikler |
| 25 | Finans ve İş Zekası Merkezi | L2 | Shopify, Meta, Maliyetler |

---

## 3. TEKNİK MİMARİ (ÜST DÜZEY)

### 3.1 Mimari Stili
**Modüler Monolit + Ayrık Worker** yaklaşımı (tek kişi için mikroservis aşırı karmaşık olur; ileride bölünebilir şekilde paketlenir).

```
┌──────────────────────────────────────────────────────────────────┐
│                         KULLANICI (Tek Operatör)                    │
└───────────────────────────────┬────────────────────────────────────┘
                                 │ HTTPS
                ┌────────────────▼─────────────────┐
                │     apps/web  (Next.js 14)        │
                │  • UI (Shadcn + Tailwind + FM)    │
                │  • API Routes (REST + tRPC ops)   │
                │  • Auth (NextAuth)                │
                │  • AI Komuta Merkezi UI           │
                └───────┬──────────────────┬────────┘
                        │ enqueue          │ read/write
                ┌───────▼────────┐   ┌─────▼──────────┐
                │  Redis (BullMQ)│   │  PostgreSQL    │
                │  Job Queue     │   │  + Prisma      │
                └───────┬────────┘   └─────▲──────────┘
                        │ consume          │
                ┌───────▼──────────────────┴────────┐
                │     apps/worker  (Node.js)         │
                │  • AI üretim işleri (görsel/video) │
                │  • Playwright scraping             │
                │  • Shopify/Meta senkronizasyon     │
                │  • Finans hesaplama, rapor üretimi │
                └───┬─────────┬──────────┬──────────┬┘
                    │         │          │          │
            ┌───────▼──┐ ┌────▼────┐ ┌───▼────┐ ┌───▼──────┐
            │ Fal.ai / │ │ Shopify │ │ Meta   │ │ SMTP /   │
            │ OpenAI   │ │ Admin   │ │ Mktg   │ │ MinIO    │
            │ (AI GW)  │ │ GraphQL │ │ API    │ │ (Storage)│
            └──────────┘ └─────────┘ └────────┘ └──────────┘
                                 ▲
                ┌────────────────┴─────────────────┐
                │          n8n (Orkestrasyon)        │
                │  • Zamanlama (Her Pazar 00:00)     │
                │  • Çok adımlı workflow tetikleme   │
                │  • Webhook ↔ app entegrasyonu      │
                └────────────────────────────────────┘
```

### 3.2 Sorumluluk Ayrımı (Kritik Karar)
- **n8n = Orkestratör/Zamanlayıcı.** Workflow'u tetikler, adımları sıralar, app'in REST uçlarını çağırır, tamamlanma webhook'larını bekler. İş mantığı n8n içinde YAZILMAZ.
- **BullMQ Worker = Yürütücü.** Tüm ağır iş (AI üretim, scraping, API senkron) burada koşar. Retry, rate-limit, eşzamanlılık kontrolü buradadır.
- **Next.js = Arayüz + Komuta.** UI, manuel komutlar, onay kapıları, job tetikleme ve durum izleme.

Bu ayrım sayesinde uzun süren işler HTTP zaman aşımına takılmaz; tek bir "gerçek kaynak" (DB) tüm bileşenlerce paylaşılır.

### 3.3 Teknoloji Yığını
| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn UI, Framer Motion, TanStack Query |
| Backend API | Next.js Route Handlers + (opsiyonel tRPC), Zod doğrulama |
| Worker | Node.js + BullMQ |
| DB | PostgreSQL 15 |
| ORM | Prisma |
| Kuyruk | Redis 7 (BullMQ) |
| Depolama | MinIO (S3-uyumlu) — görsel/video/baskı dosyaları |
| Otomasyon | n8n |
| AI | AI Gateway → OpenAI (metin/vision/embedding), Fal.ai (görsel/video) |
| Tarayıcı Otom. | Playwright |
| Email | Nodemailer (SMTP) |
| Container | Docker + Docker Compose |
| Auth | NextAuth (credentials) |
| Gizli Anahtar | DB'de AES-256-GCM şifreli + env (KMS opsiyonel) |
| Gözlemlenebilirlik | Pino log + (opsiyonel) Sentry |

---

## 4. KLASÖR YAPISI

pnpm workspaces + Turborepo monorepo.

```
e_ticaret_ai/
├── apps/
│   ├── web/                         # Next.js 14 — UI + API + Auth
│   │   ├── app/
│   │   │   ├── (auth)/login/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── command/         # AI Komuta Merkezi
│   │   │   │   ├── research/        # Ürün Araştırma
│   │   │   │   ├── designs/         # Tasarım + Mockup + Skorlama
│   │   │   │   ├── videos/          # Video Fabrikası
│   │   │   │   ├── shopify/         # Shopify Yönetim + Sağlık
│   │   │   │   ├── ads/             # Meta Reklam Merkezi
│   │   │   │   ├── competitors/     # Rakip Analiz
│   │   │   │   ├── trends/          # Trend Avcısı
│   │   │   │   ├── suppliers/       # Tedarikçi + Mail
│   │   │   │   ├── finance/         # Finans & İş Zekası
│   │   │   │   ├── tasks/           # Görev Merkezi
│   │   │   │   ├── ceo/             # AI CEO + Raporlar
│   │   │   │   └── settings/        # Marka, API anahtarları, limitler
│   │   │   └── api/                 # Route handlers + webhooks
│   │   │       ├── jobs/            # Job tetikleme/durum
│   │   │       ├── webhooks/shopify/
│   │   │       ├── webhooks/meta/
│   │   │       └── webhooks/n8n/
│   │   └── components/              # UI bileşenleri (shadcn)
│   └── worker/                      # BullMQ tüketici süreç
│       ├── src/
│       │   ├── queues/              # kuyruk tanımları
│       │   ├── processors/          # iş işleyiciler
│       │   │   ├── research/
│       │   │   ├── design/
│       │   │   ├── mockup/
│       │   │   ├── video/
│       │   │   ├── shopify/
│       │   │   ├── ads/
│       │   │   ├── finance/
│       │   │   └── report/
│       │   └── scheduler.ts
├── packages/
│   ├── db/                          # Prisma şema + client + migration + seed
│   │   └── prisma/schema.prisma
│   ├── core/                        # Domain mantığı (framework-bağımsız)
│   │   ├── product-lifecycle/
│   │   ├── scoring/                 # talep/rekabet/karlılık/tasarım skorları
│   │   ├── finance/                 # ROAS/CPA/kar hesap motoru
│   │   ├── operation-score/
│   │   └── guardrails/              # Acil durum koruması kuralları
│   ├── ai/                          # AI Gateway
│   │   ├── providers/openai.ts
│   │   ├── providers/fal.ts
│   │   ├── providers/anthropic.ts   # (opsiyonel akıl yürütme)
│   │   ├── prompts/                 # prompt kayıt defteri
│   │   └── usage-tracker.ts         # token/maliyet takibi
│   ├── integrations/
│   │   ├── shopify/                 # Admin GraphQL client
│   │   ├── meta/                    # Marketing API client
│   │   └── email/                   # Nodemailer SMTP
│   ├── scraping/                    # Playwright adaptörleri
│   │   ├── browser-pool.ts
│   │   ├── adapters/tiktok.ts
│   │   ├── adapters/pinterest.ts
│   │   ├── adapters/etsy.ts
│   │   ├── adapters/amazon.ts
│   │   └── adapters/reddit.ts       # (API öncelikli)
│   ├── config/                      # env doğrulama (Zod), sabitler
│   └── shared/                      # tipler, util, hata sınıfları
├── n8n/
│   └── workflows/                   # dışa aktarılmış workflow JSON'ları
├── infra/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── docker/web.Dockerfile
│   ├── docker/worker.Dockerfile
│   └── .env.example
├── docs/
│   ├── ARCHITECTURE.md  (bu dosya)
│   ├── DATABASE.md
│   ├── INTEGRATIONS.md
│   └── RUNBOOK.md
├── PROJECT_ROADMAP.md
├── turbo.json
├── pnpm-workspace.yaml
└── CLAUDE.md
```

---

## 5. VERİTABANI ŞEMASI (TASARIM — Prisma taslağı)

Çok markalı yapı için neredeyse tüm tablolar `brandId` taşır. Aşağıda taslak; onay sonrası `schema.prisma`'ya dökülecek.

```prisma
// ---- ÇEKİRDEK / AUTH / MARKA ----
model User    { id String @id @default(cuid()) email String @unique passwordHash String role Role @default(OWNER) createdAt DateTime @default(now()) }
model Brand   { id String @id @default(cuid()) name String slug String @unique active Boolean @default(true) currency String @default("TRY") createdAt DateTime @default(now()) }
model ApiCredential { id String @id @default(cuid()) brandId String provider Provider keyEncrypted String meta Json? createdAt DateTime @default(now()) } // AES-256-GCM
model Setting { id String @id @default(cuid()) brandId String key String value Json @@unique([brandId,key]) }
model AuditLog { id String @id @default(cuid()) brandId String actor String action String entity String entityId String? payload Json autonomyLevel Int createdAt DateTime @default(now()) }

// ---- ÜRÜN ARAŞTIRMA & TREND & RAKİP ----
model ResearchRun   { id String @id @default(cuid()) brandId String source Source status JobStatus createdAt DateTime @default(now()) results ResearchResult[] }
model ResearchResult{ id String @id @default(cuid()) runId String title String url String? demandScore Float competitionScore Float salesPotential Float profitScore Float raw Json }
model Trend         { id String @id @default(cuid()) brandId String week String niche String theme String score Float source Source createdAt DateTime @default(now()) }
model Competitor    { id String @id @default(cuid()) brandId String name String url String products CompetitorProduct[] ads CompetitorAd[] }
model CompetitorProduct { id String @id @default(cuid()) competitorId String title String price Decimal currency String seenAt DateTime @default(now()) }
model CompetitorAd  { id String @id @default(cuid()) competitorId String platform String creativeUrl String? copy String? seenAt DateTime @default(now()) }

// ---- TASARIM / MOCKUP / VIDEO ----
model Design  { id String @id @default(cuid()) brandId String prompt String briefId String? svgUrl String? pngUrl String? transparentUrl String? printReadyUrl String? scores Json status AssetStatus createdAt DateTime @default(now()) mockups Mockup[] }
model DesignBrief { id String @id @default(cuid()) brandId String summary String targetAudience String trendRefs Json createdAt DateTime @default(now()) }
model Mockup  { id String @id @default(cuid()) brandId String designId String type MockupType url String createdAt DateTime @default(now()) }
model Video   { id String @id @default(cuid()) brandId String productId String? type VideoType url String status AssetStatus createdAt DateTime @default(now()) }

// ---- ÜRÜN & YAŞAM DÖNGÜSÜ ----
model Product { id String @id @default(cuid()) brandId String title String description String? status LifecycleStatus @default(NEW) designId String? shopifyId String? cost Decimal? price Decimal? createdAt DateTime @default(now()) lifecycleEvents ProductLifecycleEvent[] }
model ProductLifecycleEvent { id String @id @default(cuid()) productId String from LifecycleStatus to LifecycleStatus reason String createdAt DateTime @default(now()) }

// ---- SHOPIFY ----
model ShopifyCollection { id String @id @default(cuid()) brandId String shopifyId String title String }
model ShopifyHealthCheck{ id String @id @default(cuid()) brandId String type String passed Boolean detail Json createdAt DateTime @default(now()) }

// ---- META REKLAM ----
model AdCampaign { id String @id @default(cuid()) brandId String metaId String name String status String objective String dailyBudget Decimal? adsets AdSet[] }
model AdSet      { id String @id @default(cuid()) campaignId String metaId String name String budget Decimal? ads Ad[] }
model Ad         { id String @id @default(cuid()) adsetId String metaId String name String creativeUrl String? }
model AdMetric   { id String @id @default(cuid()) brandId String level String refId String date DateTime spend Decimal roas Float? cpa Float? cpc Float? ctr Float? impressions Int clicks Int @@index([brandId,date]) }
model CreativeTest{ id String @id @default(cuid()) brandId String hypothesis String variants Json status JobStatus winner String? createdAt DateTime @default(now()) }

// ---- TEDARİKÇİ & MAIL ----
model Supplier { id String @id @default(cuid()) brandId String company String email String? phone String? website String? notes String? createdAt DateTime @default(now()) }
model EmailMessage { id String @id @default(cuid()) brandId String supplierId String? direction MailDir subject String body String status MailStatus sentAt DateTime? createdAt DateTime @default(now()) }

// ---- FİNANS & RAPOR & SKOR ----
model Order        { id String @id @default(cuid()) brandId String shopifyId String total Decimal currency String createdAt DateTime }
model FinanceSnapshot { id String @id @default(cuid()) brandId String date DateTime revenue Decimal adSpend Decimal cogs Decimal shipping Decimal commission Decimal grossProfit Decimal netProfit Decimal taxEstimate Decimal orders Int aov Decimal @@unique([brandId,date]) }
model OperationScore { id String @id @default(cuid()) brandId String date DateTime adScore Float seoScore Float profitScore Float qualityScore Float trendScore Float overall Float @@unique([brandId,date]) }
model AIReport   { id String @id @default(cuid()) brandId String type ReportType period String summary String insights Json recommendations Json createdAt DateTime @default(now()) }

// ---- GÖREV / İŞ / KORUMA / YEDEK ----
model Task     { id String @id @default(cuid()) brandId String title String description String? type TaskType status TaskStatus @default(OPEN) priority Int @default(3) dueAt DateTime? createdAt DateTime @default(now()) }
model Job      { id String @id @default(cuid()) brandId String queue String name String status JobStatus payload Json result Json? error String? createdAt DateTime @default(now()) finishedAt DateTime? }
model SpendLimit { id String @id @default(cuid()) brandId String period LimitPeriod amount Decimal active Boolean @default(true) }
model Backup   { id String @id @default(cuid()) brandId String? type BackupType location String sizeBytes BigInt createdAt DateTime @default(now()) }
model UsageLog { id String @id @default(cuid()) brandId String provider Provider model String tokensIn Int? tokensOut Int? cost Decimal createdAt DateTime @default(now()) }

// ---- ENUM'lar ----
enum Role { OWNER ADMIN }
enum Provider { OPENAI FAL ANTHROPIC SHOPIFY META SMTP }
enum Source { TIKTOK PINTEREST ETSY AMAZON REDDIT }
enum JobStatus { QUEUED RUNNING SUCCESS FAILED }
enum AssetStatus { DRAFT GENERATING READY FAILED PUBLISHED }
enum MockupType { TSHIRT HOODIE SWEATSHIRT OVERSIZE }
enum VideoType { TIKTOK REEL STORY UGC }
enum LifecycleStatus { NEW TEST WINNER SCALING DECLINING CLOSED }
enum MailDir { INBOUND OUTBOUND }
enum MailStatus { DRAFT SENT FAILED }
enum TaskType { API_INPUT APPROVE_DESIGN APPROVE_AD GENERIC }
enum TaskStatus { OPEN IN_PROGRESS DONE CANCELLED }
enum LimitPeriod { DAILY WEEKLY MONTHLY }
enum BackupType { DATABASE WORKFLOW ASSETS }
enum ReportType { WEEKLY CEO FINANCE }
```

---

## 6. n8n WORKFLOW MİMARİSİ

### 6.1 Ana Haftalık Workflow — `weekly-master` (Cron: Pazar 00:00)
n8n her adımda app'in REST ucunu çağırır → app job kuyruğa atar → n8n tamamlanma webhook'unu bekler → sonraki adıma geçer.

```
[Cron Pazar 00:00]
   → POST /api/jobs/trend-analysis      → bekle webhook
   → POST /api/jobs/competitor-analysis → bekle webhook
   → POST /api/jobs/design-generate     → bekle webhook
   → POST /api/jobs/mockup-generate     → bekle webhook
   → POST /api/jobs/video-generate      → bekle webhook
   → POST /api/jobs/profitability       → bekle webhook
   → POST /api/jobs/weekly-report       → bekle webhook
   → POST /api/jobs/send-report-mail    → done
   → [Hata yakalama dalı → Görev Merkezi'ne task + uyarı maili]
```

### 6.2 Diğer Workflow'lar
- `daily-finance-sync` (00:30): Shopify sipariş + Meta harcama → FinanceSnapshot + Operasyon Skoru.
- `spend-guardian` (saatlik): harcama limiti kontrolü → aşımda Meta kampanyalarını duraklat (Acil Durum Koruması).
- `shopify-health` (günlük): sağlık kontrolü.
- `backup-nightly` (03:00): DB + workflow + asset yedeği.

**İlke:** n8n yalnızca tetikler ve sıralar; tüm hesap/IO worker'da. Workflow JSON'ları `n8n/workflows/` altında versiyonlanır.

---

## 7. DOCKER MİMARİSİ

`infra/docker-compose.yml` servisleri:

| Servis | İmaj/Build | Açıklama |
|--------|-----------|----------|
| `postgres` | postgres:15 | Ana veritabanı (volume) |
| `redis` | redis:7 | BullMQ kuyruğu |
| `minio` | minio/minio | S3-uyumlu asset deposu |
| `web` | docker/web.Dockerfile | Next.js (port 3000) |
| `worker` | docker/worker.Dockerfile | BullMQ + Playwright (Playwright base image) |
| `n8n` | n8nio/n8n | Orkestrasyon (port 5678, volume) |
| `mailhog` *(dev)* | mailhog/mailhog | SMTP test |

- Sağlık kontrolleri (healthcheck) + `depends_on` ile sıralı başlatma.
- Geliştirme: `docker-compose.yml`; üretim: `docker-compose.prod.yml` (reverse proxy + TLS + sınırlı portlar).
- Tüm gizli anahtarlar `.env` ile (repoya girmez); `.env.example` şablon olur.
- Worker, Playwright resmi imajı (`mcr.microsoft.com/playwright`) üzerine kurulur (tarayıcı bağımlılıkları hazır).

---

## 8. PLAYWRIGHT OTOMASYON MİMARİSİ

**İlke (CLAUDE.md): API > Playwright > Kullanıcı onayı.** Resmi API olan kaynakta API; yoksa Playwright.

- `browser-pool.ts`: sınırlı sayıda eşzamanlı headless tarayıcı (kaynak kontrolü).
- Kaynak bazlı **adaptör** deseni: her adaptör `scrape(query): Promise<RawResult[]>` döner.
- Ortak yetenekler: rate-limit, exponential backoff, rotasyonlu user-agent, opsiyonel proxy, oturum/çerez kalıcılığı, insan benzeri gecikme.
- Sonuç → normalize → `core/scoring` → `ResearchResult`.
- **Kaynak stratejisi:**
  - Reddit → **resmi API** (Playwright değil).
  - Pinterest / Etsy → resmi API varsa API, yoksa dikkatli Playwright.
  - TikTok / Amazon → agresif bot korumalı; **resmi/iş ortağı API tercih edilir**, Playwright son çare (ToS riski — bkz. §15).
- Hata/CAPTCHA → Görev Merkezi'ne "manuel doğrulama" görevi (kullanıcı onayı katmanı).

### 8.1 Uygulanan Adaptörler (Faz 2 + 2b)

`packages/scraping` — her adaptör `SourceAdapter` arayüzünü uygular (`source`, `strategy: 'api' | 'browser'`, opsiyonel `requiresCredential`, `scrape(query, opts)`).

| Kaynak | Strateji | Erişim | Not |
|---|---|---|---|
| **Reddit** | `api` | Açık search JSON | Geçerli ASCII User-Agent ister; datacenter IP'de 403 olası. |
| **Hacker News** | `api` | Algolia search API | Kimliksiz, her ortamda kararlı. |
| **Etsy** | `api` | Open API v3 (`x-api-key`) | `requiresCredential`; anahtar Ayarlar→Etsy (marka credential) veya `ETSY_API_KEY`. |
| **Pinterest** | `browser` | Playwright (arama sayfası) | Resmi API'de serbest keşif araması yok; login duvarı sık → manuel doğrulama görevi. |
| **TikTok** | `browser` | Playwright (arama) | Agresif bot koruması; "press & hold" doğrulaması olası → manuel doğrulama görevi. |
| **Amazon** | `browser` | Playwright (`/s?k=`) | İnceleme sayısı = talep sinyali; CAPTCHA olası → manuel doğrulama görevi. |

- **Dayanıklı HTTP istemcisi** (`src/http.ts`, yalnızca fetch): host-bazlı kibarlık gecikmesi, geçici hatalarda (429/5xx/ağ) exponential backoff + jitter, `Retry-After` saygısı, her denemede rotasyonlu User-Agent. 403/kalıcı 429 → `ScrapeBlockedError`; diğer kalıcı hatalar → `IntegrationError`.
- **Tarayıcı havuzu** (`src/browser-pool.ts`, `@velora/scraping/browser`): rotasyonlu UA, opsiyonel proxy (`SCRAPER_PROXY_URL`/`HTTPS_PROXY`), insan benzeri gecikme, `assertNotBlocked()` ile CAPTCHA/login-duvarı tespiti → `ScrapeBlockedError`. Tarayıcı adaptörleri `browser-pool`'u **dinamik import** eder → web bundle'ına Playwright sızmaz.
- **Engelleme akışı:** adaptör `ScrapeBlockedError` fırlatır → worker (`processors/research.ts`) bunu yakalar, run'ı `FAILED` yapar, Görev Merkezi'ne **API_INPUT** tipli "manuel doğrulama" görevi (öncelik 1) açar ve **yeniden denemez** (kalıcı engel).
- **Anahtar çözümü:** worker, kaynak→sağlayıcı eşlemesiyle önce marka credential'ını (`ETSY`/`PINTEREST` provider), yoksa env fallback'i çözer ve `scrape(query, { credential, proxyUrl })` ile geçirir.
- **Proxy:** tarayıcı adaptörleri Playwright'ın yerel proxy desteğini (`SCRAPER_PROXY_URL`) kullanır; fetch adaptörleri standart `HTTPS_PROXY`/`HTTP_PROXY` env'ini (Node ≥ 24) kullanır — ek bağımlılık yok.
- **Kurulum (zorunlu):** tarayıcı adaptörleri için chromium binary'si gerekir →
  `pnpm --filter @velora/scraping exec playwright install chromium`.

---

## 9. SHOPIFY ENTEGRASYON KATMANI

- **Erişim:** Custom App + Admin API access token (gerekli scope'lar: `write_products, read_products, write_inventory, write_publications, write_price_rules, write_discounts, read_orders`).
- **API:** Admin **GraphQL** API (2024-10+), `@shopify/admin-api-client`. Toplu işlemler için bulkOperation.
- **Yetenekler:** ürün/varyant oluştur-güncelle, koleksiyon, SEO (metafields + `seo` alanı), etiket, indirim (discountCode/automaticDiscount), yayınlama (publication).
- **Otomatik Ürün Sayfası:** AI ile açıklama + SEO + FAQ + satış metni → Shopify ürünü olarak yayınla.
- **Webhook'lar:** `orders/create`, `orders/paid` → `/api/webhooks/shopify` (HMAC doğrulama) → Order + Finans güncelle.
- **Sağlık Kontrolü:** SEO eksikleri, görsel eksiği, kırık sayfa (Playwright ile crawl), performans → `ShopifyHealthCheck`.
- **Idempotency:** her ürün `Product.shopifyId` ile eşlenir; tekrarlı yayınlama engellenir.

---

## 10. META ENTEGRASYON KATMANI

- **Erişim:** Meta App + Marketing API, `facebook-nodejs-business-sdk`, uzun ömürlü system-user token. Gerekli izin: `ads_management`, `ads_read` (App Review + Business doğrulaması gerekir — bkz. §15).
- **Manuel Mod (L1/L2):** kampanya aç/durdur, bütçe değiştir.
- **Otomatik Mod (L3):** reklam testi (CreativeTest), optimizasyon, ölçekleme — **sert limitlerle**.
- **Insights:** günlük ROAS/CPA/CPC/CTR/impressions/clicks → `AdMetric`.
- **Acil Durum Koruması bağı:** `spend-guardian` limit aşımında tüm aktif kampanyaları `PAUSED` yapar + Görev + mail.
- **Idempotency & güvenlik:** her bütçe/durum değişikliği `AuditLog`'a (otonomi seviyesiyle) yazılır; L3 değişiklikleri için onay kapısı bayrağı (feature flag).

---

## 11. AI SERVİS MİMARİSİ (AI GATEWAY)

Sağlayıcıdan bağımsız tek bir geçit. İş kodu sağlayıcıyı bilmez; arayüzlerle konuşur.

```
packages/ai/
  TextService     → generate(), classify(), summarize()   [OpenAI; akıl yürütme için Anthropic opsiyonu]
  VisionService   → scoreDesign(), describeImage()         [OpenAI Vision]
  ImageService    → generate(), removeBg(), upscale()      [Fal.ai]
  VideoService    → generate(type, brief)                  [Fal.ai]
  EmbeddingService→ embed()                                [OpenAI]
```

- **Prompt Kayıt Defteri:** tüm promptlar `packages/ai/prompts/` altında, sürümlü ve test edilebilir.
- **Maliyet/Kullanım Takibi:** her çağrı `UsageLog`'a (token, maliyet) → bütçe kontrolü + Finans'a yansır.
- **Yeniden deneme & fallback:** sağlayıcı hatasında backoff; kritik akışta alternatif model.
- **Not:** CLAUDE.md birincil AI olarak OpenAI + Fal.ai belirtir; geçit Anthropic'i (AI CEO akıl yürütmesi için) opsiyonel sağlayıcı olarak destekler — seçim §15'te onaya sunuldu.

---

## 12. FİNANS SİSTEMİ MİMARİSİ

Girdiler: Shopify siparişleri (ciro), Meta harcaması, ürün maliyeti (COGS), kargo, komisyon.

Hesap motoru (`core/finance`):
```
grossProfit = revenue - cogs
netProfit   = grossProfit - adSpend - shipping - commission - opex
ROAS = revenue_from_ads / adSpend
CPA  = adSpend / conversions
CPC  = adSpend / clicks
CTR  = clicks / impressions
AOV  = revenue / orders
taxEstimate = netProfit * vergiOranı   (yapılandırılabilir)
cashFlow   = girişler - çıkışlar (zaman serisi)
```

- Günlük `FinanceSnapshot` üretilir (idempotent, tarih başına tek kayıt).
- Günlük/haftalık/aylık/yıllık ciro = snapshot toplamları.
- AI yorum katmanı: TextService snapshot'ları okuyup finansal yorum üretir (AI CEO ile paylaşılır).

---

## 13. RAPORLAMA SİSTEMİ MİMARİSİ

- **Operasyon Skoru:** reklam, SEO, karlılık, ürün kalitesi, trend uyumu → ağırlıklı genel skor (`core/operation-score`), günlük `OperationScore`.
- **AI CEO:** haftalık; finans + operasyon skoru + trend + rakip verilerini sentezler → `AIReport` (özet + içgörü + öneriler). Örn: "Evcil hayvan ürünleri daha iyi performans gösteriyor, bu kategoriye ağırlık ver."
- **Haftalık Rapor:** HTML şablon (React-email/MJML) → PDF (opsiyonel) → SMTP ile gönderim.
- **Dashboard:** AI Komuta Merkezi'nde özet kartlar + grafikler (TanStack Query ile canlı).

---

## 14. GÜVENLİK & ÇOK MARKA & GÖZLEMLENEBİLİRLİK

- **Çok marka:** her sorgu `brandId` ile kapsanır (middleware'de aktif marka). Şimdilik tek marka seed'lenir.
- **Gizli anahtarlar:** `ApiCredential.keyEncrypted` AES-256-GCM (anahtar env'de / KMS). Repoda asla düz metin yok.
- **RBAC:** tek operatör (OWNER); ileride genişletilebilir.
- **AuditLog:** tüm L2/L3 eylemleri otonomi seviyesiyle loglanır.
- **Idempotency & retry:** dış API çağrıları idempotent anahtar + BullMQ retry.
- **Loglama:** Pino (yapılandırılmış), opsiyonel Sentry.
- **Yedekleme:** gece DB dump + n8n workflow export + MinIO asset snapshot → `Backup`.

---

## 15. RİSKLER & AÇIK KARARLAR (ONAY GEREKLİ)

Detaylı liste ve öneriler kullanıcıya sunulan mesajda + PROJECT_ROADMAP.md "Riskler" bölümünde. Özet başlıklar:

1. **Git deposu ev dizininde (`/Users/emir`)** — kritik; izole repo gerekli.
2. **Scraping ToS/yasal riski** (TikTok/Amazon/Etsy/Pinterest) — API önceliği.
   - **Durum (Faz 2b):** Etsy resmi Open API v3 ile (ToS uyumlu). Pinterest/TikTok/Amazon'da serbest keşif için resmi/serbest API yok; bu kaynaklar **Playwright son çare** olarak çekilir. Bu, ilgili platform Hizmet Şartlarına aykırı olabilir ve hukuki/erişim riski taşır (üretimde kullanım kullanıcının sorumluluğundadır).
   - **Uygulanan azaltıcılar:** kibarlık gecikmesi + backoff + rotasyonlu UA (aşırı yük bindirmemek), `robots`/oran sınırlarına saygı amaçlı düşük eşzamanlılık, opsiyonel proxy, bot-koruması/CAPTCHA tespitinde **otomatik durdurma + manuel doğrulama görevi** (insan onayı katmanı, CLAUDE.md: API > Playwright > Kullanıcı onayı).
   - **Öneri:** ölçekli/üretim kullanımı için resmi/iş-ortağı API'lerine geçiş (Amazon Product Advertising API, TikTok Research/Display API, Pinterest partner erişimi) ve yalnızca kamuya açık, kişisel veri içermeyen sinyallerin saklanması (KVKK/GDPR — bkz. madde 9).
3. **Meta API erişimi** (App Review + Business doğrulama süresi).
4. **L3 finansal risk** (otonom reklam harcaması) — sert limit + onay kapıları.
5. **AI maliyet kontrolü** (Fal.ai video/OpenAI token).
6. **AI sağlayıcı kararı** (OpenAI vs Anthropic akıl yürütme).
7. **Mevcut Shopify_Ai projesi** ile örtüşme/yeniden kullanım.
8. **Dağıtım hedefi** (Vercel worker/n8n/Playwright çalıştıramaz → VPS/Railway).
9. **KVKK/GDPR** (sipariş + tedarikçi PII).
10. **Telif/IP** (AI tasarım, print-on-demand).
11. **Kapsam büyüklüğü** (tek kişi → dikey dilim MVP yaklaşımı).
```
