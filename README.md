# VELORA INTELLIGENCE OS

Yapay zeka destekli, tam otomasyonlu e-ticaret istihbarat ve operasyon sistemi.
Fırsat bul → Risk analiz et → Tasarım üret → Shopify'a yayınla → Reklam → Finans → AI CEO karar al.
Sesli komutla (Jarvis) tüm sistemi yönet.

**Sürüm 2.3.0** — Risk Engine + Daily Brief + AI CEO 2.0 (Claude) + Jarvis Voice + Tek-Tık Başlatma.

> [API Kurulum Rehberi](docs/API-SETUP-GUIDE.md) · [Mimari](docs/ARCHITECTURE.md) · [Proje Hafızası](CLAUDE.md)

## Teknoloji

Next.js 14 · TypeScript · TailwindCSS + shadcn · PostgreSQL + Prisma · BullMQ (Redis) · n8n · MinIO · sharp · Playwright · OpenAI · Claude (Anthropic) · Gemini · Fal.ai · Printify (POD) · Shopify · Meta · Docker

## Monorepo Yapısı

```
apps/
  web/          Next.js — panel UI + API + Auth + Jarvis HTTP endpoint
  worker/       BullMQ tüketici (20 kuyruk: tasarım/video/PI/risk/CEO/finans/reklam)
packages/
  config/       Çevre değişkeni doğrulama (Zod)
  shared/       Kripto (AES-256-GCM), hatalar, tipler
  db/           Prisma şema (40+ model) + servisler + seed
  queue/        BullMQ kuyruk tanımları (20 kuyruk)
  core/         Risk Engine, skorlama, yaşam döngüsü, guardrail, action-router
  ai/           AI Gateway (OpenAI + Claude + Fal — metin/vision/görsel/video/arama)
  scraping/     Kaynak adaptörleri (Reddit/HN/Etsy/Pinterest/TikTok/Amazon)
  storage/      MinIO/S3 nesne deposu
  integrations/ Shopify (GraphQL) · Printify (POD) · Meta (Ads + Ad Library) · SMTP
Jarvis/         Python sesli asistan (WakeWord + Gemini Live + VELORA Bridge)
scripts/        Tek-tık başlatma + sesli wake-word dinleyici
infra/          Docker Compose (postgres, redis, minio, n8n, mailhog)
n8n/workflows/  Zamanlanmış otomasyon (daily-brief, weekly-master, finans, guardian)
```

## 6 Hub

| Hub | URL | İçerik |
|-----|-----|--------|
| Komuta Merkezi | `/dashboard` | Günün Özeti + Risk Durumu + Bekleyen Onaylar + Jarvis |
| Ürün Avcısı | `/hunter` | Fırsatlar · Etkinlikler · Trendler · Rakipler · Araştırma |
| Tasarım Direktörü | `/studio` | Tasarımlar · Videolar · Ürün Zekası · Test Lab |
| Operasyon Müdürü | `/operations` | Ürünler · Siparişler · Üretim · Kargo · Tedarikçi · Arşiv |
| Finans Müdürü | `/finance` | Genel Bakış · Reklam Performansı |
| AI CEO | `/ceo` | Günlük Brifing · Kararlar · Haftalık Raporlar · Stratejik Sinyaller |

## Başlatma (3 yol)

### 1. Sesli — "Jarvis" de
macOS açılışında otomatik başlayan wake-word dinleyici. "Jarvis" deyince tüm stack başlar.

### 2. Masaüstü — VELORA.app çift tıkla
`~/Desktop/VELORA.app` — Docker + Web + Worker + Jarvis tek seferde.

### 3. Terminal
```bash
./scripts/velora-start.sh
```

### Manuel Kurulum (ilk kez)
```bash
cp .env.example .env          # anahtarları doldur (bkz. docs/API-SETUP-GUIDE.md)
pnpm install
docker compose -f infra/docker-compose.yml up -d
pnpm --filter @velora/db exec dotenv -e ../../.env -- prisma migrate dev
./scripts/velora-start.sh     # tek-tık: Docker + Web + Worker + Jarvis
```

Giriş: `owner@velora.local` / `velora1234`

## Jarvis Sesli Komutlar

| Komut | İşlev |
|-------|-------|
| "Jarvis trend avla" | Trend taraması |
| "Jarvis rakipleri tara" | Tüm rakip taraması |
| "Jarvis tedarikçi bul [niş]" | Web aramasıyla tedarikçi öner |
| "Jarvis rapor üret" | Haftalık CEO raporu |
| "Jarvis fırsat bul" | Fırsat keşfi |
| "Jarvis tasarım üret" | Otomatik tasarım |
| "Jarvis video üret" | UGC video |
| "Jarvis günlük brifing" | Risk analizi + AI CEO sentez |
| "Jarvis bugün ne yapmalıyım" | Daily Brief |
| "Jarvis finans güncelle" | Finans snapshot |
| "Jarvis seo güncelle" | SEO/içerik yenile |
| "Jarvis yedek al" | Sistem yedekleme |

## Intelligence OS Modülleri

| Modül | Durum | Açıklama |
|-------|-------|----------|
| Opportunity Scanner | ✅ | Reddit/Trends/Etsy/Amazon — Fırsat Skoru 0-100 |
| Product DNA | ✅ | SEO/içerik/reklam/kitle/UGC — PI Score 6 boyut |
| Trend Radar | ✅ | Haftalık trend + HIGH/RISING alarm |
| Jarvis Layer | ✅ | WakeWord + 19 ActionType + sesli komut + TTS + Orb UI |
| Risk Engine | ✅ | 5 sinyal birleşik risk skoru 0-100 (harcama/reklam/talep/rakip/trend) |
| Daily Brief | ✅ | Günlük 03:00 pipeline + Risk Engine + Claude CEO sentez |
| AI CEO 2.0 | ✅ | Claude ile günlük analiz + güven skoru + haftalık karar motoru |
| Market X-Ray | 🔶 | Rakip tarama var — SWOT/fiyat gap genişletilecek |
| Notification Center | 🔴 | OneSignal push (Sprint 10) |
| Mobil PWA | 🔴 | next-pwa (Sprint 10) |

## Servis Portları

| Servis | Port |
|--------|------|
| Web (panel) | 3000 |
| PostgreSQL | 5434 |
| Redis | 6379 |
| MinIO API / Konsol | 9000 / 9001 |
| n8n | 5678 |
| Mailhog UI | 8025 |

## AI Sağlayıcılar

| Sağlayıcı | Kullanım | ENV |
|-----------|----------|-----|
| OpenAI (GPT-4o-mini) | Metin, vision, web arama, PI üretimi | `OPENAI_API_KEY` |
| Claude (Sonnet) | CEO günlük analiz, karar sentezi | `ANTHROPIC_API_KEY` |
| Gemini (Flash) | Jarvis sesli asistan (Live API) | `GEMINI_API_KEY` |
| Fal.ai | Görsel + video üretimi | `FAL_KEY` |

## Sürüm Geçmişi

| Sürüm | Tarih | İçerik |
|-------|-------|--------|
| 2.3.0 | 2026-06-23 | Risk Engine + Daily Brief + AI CEO 2.0 (Claude) |
| 2.2.0 | 2026-06-18 | Jarvis Orb UI (6-state animated) |
| 2.1.0 | 2026-06-18 | Jarvis + VELORA entegrasyonu |
| 2.0.0 | 2026-06-18 | Jarvis tamamlama (17 ActionType) |
| 1.9.0 | 2026-06-17 | Tedarikçi Skoru V2 + Jarvis V2 + Rakip Alarm V2 |
| 1.8.0 | 2026-06-17 | Stabilizasyon + Jarvis + Davranış Sinyalleri |
| 1.7.0 | 2026-06-15 | Talep/Maliyet + Rakip Reklam + Meta Taslak + Karar V2 |
| 1.6.0 | 2026-06-14 | Operasyon + Otomasyon + Karar Zekası (7 faz) |
| 1.5.0 | 2026-06-14 | 6 Hub + Sistem Menüsü UI/UX sadeleştirme |
| 1.4.0 | 2026-06-13 | Etkinlik Takvimi + Kampanya Hazırlık + CEO Sentez |
| 1.3.0 | 2026-06-12 | Opportunity-First + Ürün Zekası Motoru |
| 1.2.0 | 2026-06-12 | Printify POD entegrasyonu |
| 1.1.0 | 2026-06-11 | Üretim sertleştirme + tam otonomi |
| 1.0.0 | 2026-06-10 | 25 modül tamamlandı |

Detaylı sürüm notları: [CLAUDE.md](CLAUDE.md)
