# VELORA AI COMMERCE OS

Yapay zeka destekli, tam otomasyonlu, çok markaya hazır e-ticaret operasyon sistemi.
Tek operatör, kurumsal seviye: ürün araştır → tasarım üret → gerçekçi mockup → Shopify'a yayınla →
reklam → finans → haftalık AI CEO raporu. **Sürüm 1.1.0 — canlı (Konfora mağazası).**

> Kullanım kılavuzu: [KULLANIM.md](KULLANIM.md) · Mimari: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · Proje hafızası: [CLAUDE.md](CLAUDE.md)

## Teknoloji

Next.js 14 · TypeScript · TailwindCSS + shadcn · PostgreSQL + Prisma · BullMQ (Redis) · n8n · MinIO · sharp · Playwright · OpenAI + Fal.ai · Docker

## Monorepo Yapısı

```
apps/
  web/          Next.js — panel UI + API + Auth + /api/asset (görsel servis)
  worker/       BullMQ tüketici (tasarım/mockup/video/Shopify/reklam/finans/otonomi)
packages/
  config/       Çevre değişkeni doğrulama (Zod)
  shared/       Kripto (AES-256-GCM), hatalar, tipler
  db/           Prisma şema + servisler + seed
  queue/        BullMQ kuyruk tanımları (17 kuyruk)
  core/         Skorlama, yaşam döngüsü, guardrail, finans, operasyon skoru
  ai/           AI Gateway (OpenAI metin/vision + Fal görsel/video)
  scraping/     Kaynak adaptörleri (Reddit/HN/Etsy/Pinterest/TikTok/Amazon)
  storage/      MinIO/S3 nesne deposu
  integrations/ Shopify (GraphQL + staged upload + policies) · Meta · SMTP
infra/          Docker Compose (postgres, redis, minio, n8n, mailhog)
n8n/workflows/  Zamanlanmış otomasyon (master, finans, guardian, weekly-designs)
```

## Gereksinimler

- Node 20+ · pnpm 10+ · Docker Desktop

## Kurulum

```bash
cp .env.example .env          # anahtarları doldur (bkz. KULLANIM.md)
pnpm install
pnpm infra:up                 # postgres/redis/minio/n8n/mailhog
pnpm db:generate && pnpm db:migrate
pnpm dev:worker               # 1. terminal
pnpm dev:web                  # 2. terminal → http://localhost:3000
```

Giriş: `owner@velora.local` / `velora1234` (varsayılan, `.env`'den).

## Servis Portları (yerel)

| Servis | Port |
|--------|------|
| Web (panel) | 3000 |
| PostgreSQL | 5434 |
| Redis | 6379 |
| MinIO API / Konsol | 9000 / 9001 |
| n8n | 5678 |
| Mailhog UI | 8025 |

## Durum

**v1.1.0** — Tüm 25 modül + üretim sertleştirme (gerçekçi mockup, tünelsiz görsel mimarisi,
tam otonomi). Detaylı sürüm geçmişi: [CLAUDE.md](CLAUDE.md). Günlük kullanım: [KULLANIM.md](KULLANIM.md).
