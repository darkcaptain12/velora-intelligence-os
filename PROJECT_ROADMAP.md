# VELORA AI COMMERCE OS — PROJECT ROADMAP

> Durum: **MİMARİ TAMAMLANDI — ONAY BEKLENİYOR** · Sürüm: 0.1.0 · Tarih: 2026-06-09
> Teknik detay için bkz. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
> Geliştirme **yalnızca kullanıcı onayından sonra** başlar. Her faz sonunda CLAUDE.md güncellenir, sürüm yükseltilir.

---

## ÖNCELİK & STRATEJİ

Tek kişilik ekip için **dikey dilim (vertical slice)** stratejisi: her faz, çalışan ve değer üreten bir uçtan uca parça teslim eder. "Kazanan ürün" döngüsünün en erken çalışır hali Faz 5 sonunda ortaya çıkar; sonraki fazlar bunu zenginleştirir ve otomatikleştirir.

Öncelik seviyeleri: **P0** (zorunlu temel) · **P1** (ana değer) · **P2** (otomasyon/zenginleştirme) · **P3** (operasyonel sağlamlık).

---

## FAZ 0 — TEMEL & İSKELET  `P0`  ✅ TAMAMLANDI (2026-06-09)
**Amaç:** çalışan monorepo + altyapı + ortam.

| Görev | Durum |
|------|-----------|
| 0.1 İzole git deposu (ev dizini sorunu çözülür) | ✅ `git init` proje dizininde |
| 0.2 pnpm + Turborepo monorepo iskeleti | ✅ apps/* + packages/* |
| 0.3 Docker Compose (postgres, redis, minio, n8n, mailhog) | ✅ tümü ayakta (web/worker dev'de host'ta) |
| 0.4 `.env.example` + Zod env doğrulama (`packages/config`) | ✅ |
| 0.5 Prisma şema (35 model) + ilk migration + seed | ✅ `20260609203613_init` uygulandı |
| 0.6 Next.js iskelet + Tailwind + Shadcn + Auth (NextAuth v5) | ✅ prod build geçti |
| 0.7 BullMQ worker + örnek job + durum izleme | ✅ uçtan uca doğrulandı |
| 0.8 Gizli anahtar şifreleme (AES-256-GCM) + ApiCredential | ✅ round-trip doğrulandı |

**Doğrulama:** `pnpm -r typecheck` ✓ · `next build` ✓ · enqueue→worker→sonuç ✓ · 6 servis portu açık ✓
**Not:** Postgres host portu `5434` (5432 yerel PG, 5433 başka proje tarafından dolu). web/worker üretim Dockerfile'ları Faz 10'a bırakıldı (lokal geliştirme host'ta koşuyor).

---

## FAZ 1 — ÇEKİRDEK PLATFORM  `P0`  ✅ TAMAMLANDI (2026-06-10)
**Amaç:** tüm modüllerin üzerine oturacağı ortak zemin.
**Bağımlılık:** Faz 0.

| Görev | Durum |
|------|------|
| 1.1 Çok marka altyapısı (brand context) | ✅ `brands` servisi + `getActiveBrand()` (çerez/aktif) |
| 1.2 Ayarlar ekranı: marka, API anahtarları, harcama limitleri | ✅ `/settings` + server actions + şifreli credential |
| 1.3 Görev Merkezi (Task CRUD + onay kapısı) | ✅ `/tasks` + onayla/reddet/durum geçişleri |
| 1.4 AuditLog + otonomi seviyesi altyapısı | ✅ `audit` servisi + `/audit` + otonomi ayarı |
| 1.5 AI Komuta Merkezi kabuğu (shell + navigasyon) | ✅ sidebar + komuta merkezi özeti |
| 1.6 Job izleme UI + webhook uçları | ✅ `/jobs` + `/api/webhooks/n8n` (sır doğrulamalı) |

**Doğrulama:** typecheck ✓ · `next build` (12 route) ✓ · servis round-trip ✓ · n8n webhook→enqueue→worker→denetim ✓
**Yeni:** `@velora/db` servisleri (brands/settings/audit/tasks/spendLimits + credentials.listStatus) · `listRecentJobs` · `N8N_WEBHOOK_SECRET` env · server-action tabanlı formlar.

**Çıktı:** modüllerin takılacağı kararlı çekirdek.

---

## FAZ 2 — AI GATEWAY + ÜRÜN ARAŞTIRMA MOTORU  `P1`  ✅ TAMAMLANDI (2026-06-10)
**Bağımlılık:** Faz 1.

| Görev | Durum |
|------|------|
| 2.1 AI Gateway (Text/Vision/Image/Video/Embedding) + UsageLog | ✅ `@velora/ai` (OpenAI + Fal), anahtar çözümü (marka→env), maliyet kaydı |
| 2.2 Prompt kayıt defteri | ✅ `packages/ai/src/prompts` |
| 2.3 Playwright browser-pool + adaptör deseni | ✅ `@velora/scraping/browser` + `SourceAdapter` arayüzü |
| 2.4 Kaynak adaptörleri | ✅ Reddit (canlı, no-auth) + **Hacker News** (kararlı, no-auth) · ⏳ Pinterest/Etsy/TikTok/Amazon → Faz 2b |
| 2.5 Skorlama motoru (talep/rekabet/satış/kâr) | ✅ `@velora/core` heuristik v1 (deterministik, AI gerektirmez) |
| 2.6 Araştırma UI + sonuç listesi | ✅ `/research` + server-action tetikleme + skorlu tablo |

**Doğrulama:** typecheck (9 paket) ✓ · `next build` (12 route) ✓ · skorlama deterministik ✓ · **canlı e2e**: research run → worker → Hacker News scrape → skorla → ResearchResult (SUCCESS, 5 skorlu sonuç) ✓
**Not:** Reddit sandbox datacenter IP'den 403 (gerçek dağıtımda/residential IP'de çalışır); Hacker News Algolia API kararlı çalışıyor. `Source` enum'a `HACKERNEWS` eklendi (migration `add_hackernews_source`).

### Faz 2b (devam) — Kalan kaynak adaptörleri `P2`
Pinterest/Etsy/TikTok/Amazon — Playwright browser-pool üzerine, proxy + anti-bot + rate-limit ile. (Beklemede.)

**Çıktı:** araştır → skorla → aday ürün listesi. **(Çekirdek araştırma döngüsü çalışıyor)**

---

## FAZ 3 — TASARIM + MOCKUP + SKORLAMA + DİREKTÖR  `P1`  ✅ TAMAMLANDI (2026-06-10)
**Bağımlılık:** Faz 2 (AI Gateway).

| Görev | Durum |
|------|------|
| 3.1 AI Tasarım Direktörü (niş/kitle → brief) | ✅ `generateBrief` (ai.text); anahtar yoksa Görev Merkezi'ne API_INPUT görevi |
| 3.2 Tasarım Fabrikası — Fal.ai | ✅ `design` worker (Fal görsel → MinIO → Design.pngUrl). ⏳ SVG/transparent/baskıya-hazır varyantları → Faz 3b (Fal bg-removal/upscale) |
| 3.3 Mockup Fabrikası (4 giysi türü) | ✅ `mockup` worker (sharp kompozisyon, AI'sız) — **canlı doğrulandı** |
| 3.4 Tasarım Skorlama (Vision) | ✅ `designScore` worker (OpenAI Vision → JSON skor) |
| 3.5 Asset depolama (MinIO) + UI galeri/onay | ✅ `@velora/storage` (MinIO) — **canlı doğrulandı** · `/designs` galeri + onay |

**Doğrulama:** typecheck (10 paket) ✓ · `next build` (/designs) ✓ · **canlı e2e**: sentetik tasarım → MinIO (HTTP 200) → `processMockup` → 4 mockup (TSHIRT/HOODIE/SWEATSHIRT/OVERSIZE) MinIO'da erişilebilir ✓
**Not:** Fal görsel üretimi + Vision skorlama gerçek kod; FAL/OPENAI anahtarı varken çalışır (sandbox'ta anahtar yok). MinIO depolama + mockup kompozisyonu anahtar gerektirmez, canlı doğrulandı.

### Faz 3b (devam) — Tasarım varyantları `P2`
Transparent PNG (Fal bg-removal), baskıya-hazır (yüksek DPI/upscale), SVG vektörleştirme. (Beklemede.)

**Çıktı:** brief → tasarım → mockup → skor. **(Tasarım→mockup→depolama döngüsü çalışıyor)**

---

## FAZ 4 — VIDEO FABRİKASI  `P1`  ✅ TAMAMLANDI (2026-06-10)
**Bağımlılık:** Faz 3.

| Görev | Durum |
|------|------|
| 4.1 Video üretim job (Fal.ai) — TikTok/Reel/Story/UGC | ✅ `video` worker (Fal → MinIO → Video.url), hata yolu doğrulandı |
| 4.2 Şablon/format yönetimi + UI önizleme/onay | ✅ `VIDEO_FORMATS` + `/videos` galeri + `<video>` önizleme + onay |

**Doğrulama:** typecheck (10 paket) ✓ · `next build` (/videos) ✓ · `processVideo` hata yolu canlı (anahtarsız → FAILED) ✓.
**Not:** Fal video gerçek kod, FAL anahtarıyla çalışır. Prompt iş verisinde taşınır (Video model'inde prompt alanı yok).

---

## FAZ 5 — SHOPIFY YÖNETİM + OTOMATİK ÜRÜN SAYFASI + SAĞLIK  `P1`  ✅ TAMAMLANDI (2026-06-10)
**Bağımlılık:** Faz 3 (asset), Faz 2 (AI metin). **İlk uçtan uca MVP.**

| Görev | Durum |
|------|------|
| 5.1 Shopify Admin GraphQL client | ✅ `@velora/integrations` (credential→env çözümü) |
| 5.2 Ürün/SEO/etiket işlemleri | ✅ `createProduct` (productCreate + SEO + tags). Varyant/koleksiyon/indirim → Faz 5b |
| 5.3 Otomatik Ürün Sayfası (açıklama+SEO+FAQ+satış metni) | ✅ `shopifyPublish` worker (ai.text → JSON → HTML) |
| 5.4 Sipariş webhook'ları (HMAC) → Order | ✅ `/api/webhooks/shopify` (HMAC **canlı doğrulandı**) |
| 5.5 Shopify Sağlık Kontrolü (SEO/görsel) | ✅ `shopifyHealth` worker (API tabanlı) + UI. Kırık-sayfa/perf (Playwright) → Faz 5b |
| 5.6 Ürün Yaşam Döngüsü durum makinesi | ✅ `@velora/core` (canTransition/nextStates) + db.products.transition — **canlı doğrulandı** |

**Doğrulama:** typecheck (11 paket) ✓ · `next build` (/shopify + webhook) ✓ · **canlı**: HMAC kabul/red ✓, yaşam döngüsü geçişleri + olay kaydı + geçersiz geçiş reddi ✓.
**Not:** Shopify GraphQL + AI ürün sayfası gerçek kod; mağaza/token + OpenAI anahtarıyla çalışır. Görsel ekleme public asset URL gerektirir (lokal MinIO erişilemez → üretimde public S3).

### Faz 5b (devam) — Shopify zenginleştirme `P2`
Varyant/koleksiyon/indirim/kampanya, Playwright kırık-sayfa+performans sağlık taraması, public asset (görsel ekleme).

---

## FAZ 6 — META REKLAM + ACİL DURUM KORUMASI  `P1`  ✅ TAMAMLANDI (2026-06-10)
**Bağımlılık:** Faz 5.

| Görev | Durum |
|------|------|
| 6.1 Meta Marketing API client | ✅ `@velora/integrations/meta` (Graph API v21, credential→env) |
| 6.2 Manuel mod (aç/durdur/bütçe) + UI | ✅ `/ads` + server-action'lar (setCampaignStatus/Budget) + Meta-eksik→görev |
| 6.3 Insights senkron (ROAS/CPA/CPC/CTR) → AdMetric | ✅ `adSync` worker (insights → AdMetric, ROAS/CPA türetme) |
| 6.4 Acil Durum Koruması (spend-guardian) | ✅ `spendGuardian` worker + `@velora/core` evaluateSpendLimits — **canlı doğrulandı** |
| 6.5 Otomatik mod (ölçekle/durdur) — feature-flag | ✅ `decideAdAction` (saf, doğrulandı) + adSync'te L3+autoMode kapısı |

**Doğrulama:** typecheck (11 paket) ✓ · `next build` (/ads) ✓ · **canlı**: evaluateSpendLimits (saf + DB toplamı 1050/750→ihlal) ✓, decideAdAction SCALE/PAUSE/KEEP ✓, spendByPeriod toplama ✓.
**Not:** Meta Graph API çağrıları gerçek kod; token + ad account (App Review/Business doğrulama) gerektirir. Guardian/karar mantığı Meta'sız çalışır ve doğrulandı.

---

## FAZ 7 — FİNANS & İŞ ZEKASI + KARLILIK + OPERASYON SKORU  `P1`  ✅ TAMAMLANDI (2026-06-10)
**Bağımlılık:** Faz 5 (sipariş), Faz 6 (harcama).

| Görev | Durum |
|------|------|
| 7.1 Finans hesap motoru + günlük FinanceSnapshot | ✅ `@velora/core` computeFinance + `financeSnapshot` worker — **canlı doğrulandı** |
| 7.2 Karlılık Analizi (ürün bazlı kâr) | ✅ `productProfit` (fiyat−maliyet, marj %) + /finance tablosu |
| 7.3 Finans dashboard (ciro/sipariş/AOV/ROAS/CPA/vergi) | ✅ `/finance` (günlük/haftalık/aylık/yıllık rollup) |
| 7.4 Operasyon Skoru (ağırlıklı genel skor) | ✅ `computeOperationScore` (reklam/SEO/kâr/kalite/trend) — **canlı doğrulandı** |
| 7.5 AI finansal yorum katmanı | ✅ `generateFinancialComment` (ai.text → AIReport FINANCE), anahtar yoksa görev |

**Doğrulama:** typecheck (11 paket) ✓ · `next build` (/finance) ✓ · **canlı e2e**: seed sipariş(800)+reklam(160) → financeSnapshot → ciro 800/net 400/ROAS 5/opSkor 77.1 DB'ye yazıldı ✓.
**Not:** COGS/kargo/komisyon ayar oranlarından (Order satır kalemi yok); nakit akışı snapshot zaman serisinden türetilir.

---

## FAZ 8 — RAKİP + TREND + TEDARİKÇİ + MAIL  `P2`  ✅ TAMAMLANDI (2026-06-10)
**Bağımlılık:** Faz 2 (scraping), Faz 1 (SMTP altyapısı).

| Görev | Durum |
|------|------|
| 8.1 Rakip Analiz Merkezi | ✅ Competitor/CompetitorProduct CRUD + `competitorScan` (best-effort fetch: başlık+fiyat) + `/competitors` |
| 8.2 Trend Avcısı | ✅ `trendHunt` worker (araştırma sonuçları→haftalık trend) + `/trends` — **canlı doğrulandı** |
| 8.3 Tedarikçi Merkezi | ✅ Supplier CRUD + `/suppliers` |
| 8.4 Mail Merkezi (AI yaz + SMTP gönder) | ✅ `@velora/integrations/email` (nodemailer) + `draftEmail` (ai.text) + `mailSend` worker — **Mailhog'a canlı gönderim doğrulandı** |

**Doğrulama:** typecheck (11 paket) ✓ · `next build` (/competitors,/trends,/suppliers) ✓ · **canlı**: EmailMessage→processMailSend→Mailhog kutusunda mail bulundu ✓ · trendHunt 10 araştırma→10 Trend (2026-W24) ✓.
**Not:** Mail alıcısı = tedarikçi e-postası. Rakip derin tarama (JS-render/anti-bot) Faz 8b'de Playwright ile. Tedarikçi otomatik "bulma" (scraping) Faz 8b.

---

## FAZ 9 — AI CEO + RAPOR + n8n OTOMASYON + KREATİF LAB  `P2`  ✅ TAMAMLANDI (2026-06-10)
**Bağımlılık:** Faz 7, Faz 8.

| Görev | Durum |
|------|------|
| 9.1 AI CEO haftalık sentez raporu (AIReport) | ✅ `weeklyReport` worker (finans+opSkor+trend+görev sentezi → AIReport CEO; AI yoksa deterministik özet) |
| 9.2 HTML rapor + SMTP gönderimi | ✅ `report-html.ts` + SMTP → operatör — **Mailhog'a canlı gönderim doğrulandı** |
| 9.3 n8n `weekly-master` workflow | ✅ `n8n/workflows/weekly-master.json` (Cron Pazar 00:00 → webhook zinciri) |
| 9.4 n8n yardımcı workflow'lar | ✅ `daily-finance.json`, `spend-guardian.json` |
| 9.5 Kreatif Test Laboratuvarı (A/B) | ✅ `/lab` (CreativeTest CRUD + varyant + kazanan seçimi) |

**Doğrulama:** typecheck (11 paket) ✓ · `next build` (/ceo,/lab) ✓ · **canlı**: weeklyReport→AIReport(CEO 2026-W24)+HTML mail Mailhog kutusunda (MIME-encoded subject) ✓.
**Not:** Webhook marka-seviyesi işlere `brandId` otomatik enjekte eder. PDF + n8n health/backup workflow'ları Faz 10'da.

**Çıktı:** Pazar 00:00 tam otomatik haftalık döngü (n8n → webhook → worker → rapor + mail).

---

## FAZ 10 — SAĞLAMLIK & YEDEK & GÖZLEM  `P3`  ✅ TAMAMLANDI (2026-06-10)
**Bağımlılık:** Faz 9.

| Görev | Durum |
|------|------|
| 10.1 Yedekleme Merkezi + restore | ✅ `backup` worker (DB mantıksal JSON → MinIO, sırlar hariç) + `/backups` — **canlı doğrulandı** |
| 10.2 Gözlemlenebilirlik + sağlık uçları | ✅ `/api/health` (db+redis+storage) — **canlı doğrulandı** · Pino yapılandırılmış log |
| 10.3 Üretim Docker (`prod.yml` + Dockerfile) | ✅ `infra/docker-compose.prod.yml` + `web.Dockerfile` + `worker.Dockerfile` (Playwright base) + `.dockerignore` |
| 10.4 L3 tam otonomi açılışı | ✅ guardrail'ler hazır: adSync L3+autoMode kapısı, spendGuardian her zaman aktif (Acil Durum Koruması) |

**Doğrulama:** typecheck (11 paket) ✓ · `next build` (/backups,/api/health) ✓ · **canlı**: backup→MinIO (9KB, sır içermez, HTTP 200) + Backup kaydı ✓ · health db/redis/storage=true ✓.
**Not:** Üretimde sürüm-eşleşen `pg_dump` cron sidecar eklenebilir; reverse proxy/TLS (Traefik/Caddy) dağıtım ortamına bırakıldı. Sentry opsiyonel (SENTRY_DSN hook).

---

## BAĞIMLILIK GRAFİĞİ (ÖZET)

```
Faz0 → Faz1 → Faz2 → Faz3 → Faz4
                 └→ Faz3 → Faz5 → Faz6 → Faz7 → Faz9 → Faz10
                 └→ Faz8 ─────────────────┘
```

## TAHMİNİ GELİŞTİRME SIRASI
`Faz0 → Faz1 → Faz2 → Faz3 → Faz4 → Faz5 (MVP) → Faz6 → Faz7 → Faz8 → Faz9 → Faz10`

---

## RİSKLER & AÇIK KARARLAR

| # | Risk / Karar | Öneri |
|---|--------------|-------|
| R1 | **Git deposu `/Users/emir`'de** (tüm ev dizini, .env/.ssh dahil izlenir) | Proje dizininde izole repo başlat |
| R2 | **Scraping ToS/yasal** (TikTok/Amazon vb.) | Resmi API önceliği; Playwright son çare + rate-limit |
| R3 | **Meta API erişimi** (App Review + Business doğrulama gecikmesi) | Erken başvuru; manuel mod ile başla |
| R4 | **L3 otonom reklam harcaması** finansal risk | Acil Durum Koruması Faz 6'da; L3 en sona |
| R5 | **AI maliyeti** (Fal.ai video/OpenAI token) | UsageLog + bütçe tavanı baştan |
| R6 | **AI sağlayıcı** (OpenAI vs Anthropic akıl yürütme) | Geçit ile her ikisi; varsayılan OpenAI |
| R7 | **Mevcut Shopify_Ai projesi örtüşmesi** | Yeniden kullanım/migrasyon kararı gerekli |
| R8 | **Dağıtım** (Vercel worker/n8n/Playwright çalıştıramaz) | VPS/Railway + Docker |
| R9 | **KVKK/GDPR** (sipariş + tedarikçi PII) | Şifreleme + saklama politikası |
| R10 | **Telif/IP** (AI tasarım, POD) | İçerik filtresi + insan onayı |
| R11 | **Kapsam** (25 modül, tek kişi) | Dikey dilim MVP (Faz 5) |
