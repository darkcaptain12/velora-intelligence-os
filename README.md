# VELORA AI COMMERCE OS

Yapay zeka destekli, tam otomasyonlu, çok markaya hazır e-ticaret operasyon sistemi.

> Mimari: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · Yol haritası: [PROJECT_ROADMAP.md](PROJECT_ROADMAP.md)

## Teknoloji

Next.js 14 · TypeScript · TailwindCSS + shadcn · PostgreSQL + Prisma · BullMQ (Redis) · n8n · MinIO · Playwright · OpenAI + Fal.ai · Docker

## Monorepo Yapısı

```
apps/
  web/      Next.js — UI + API + Auth
  worker/   BullMQ tüketici (AI üretim, scraping, senkron)
packages/
  config/   Çevre değişkeni doğrulama (Zod)
  shared/   Kripto (AES-256-GCM), hatalar, tipler
  db/       Prisma şema + client + seed
  queue/    BullMQ kuyruk tanımları
infra/      Docker Compose (postgres, redis, minio, n8n, mailhog)
```

## Gereksinimler

- Node 20+ (test edildi: 20 LTS; host 25 ile de çalışır)
- pnpm 10+
- Docker Desktop

## Kurulum

```bash
# 1) .env oluştur
cp .env.example .env
#    NEXTAUTH_SECRET   → openssl rand -base64 32
#    CREDENTIAL_ENCRYPTION_KEY → openssl rand -hex 32

# 2) Bağımlılıklar
pnpm install

# 3) Altyapıyı başlat (postgres:5433, redis:6379, minio:9000/9001, n8n:5678, mailhog:8025)
pnpm infra:up

# 4) Veritabanı
pnpm db:generate
pnpm db:migrate     # şema + seed (operatör + marka + limitler)

# 5) Geliştirme (iki ayrı terminal)
pnpm dev:worker
pnpm dev:web        # http://localhost:3000
```

Giriş: `.env`'deki `SEED_OWNER_EMAIL` / `SEED_OWNER_PASSWORD` (varsayılan `owner@velora.local` / `velora1234`).

## Servis Portları (yerel)

| Servis | Port |
|--------|------|
| Web | 3000 |
| PostgreSQL | 5434 (host) → 5432 |
| Redis | 6379 |
| MinIO API / Konsol | 9000 / 9001 |
| n8n | 5678 |
| Mailhog UI | 8025 |

## Faz Durumu

Bkz. [PROJECT_ROADMAP.md](PROJECT_ROADMAP.md). Şu an: **Faz 0 — Temel & İskelet**.
