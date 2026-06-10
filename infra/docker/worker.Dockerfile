# VELORA worker (BullMQ + Playwright) — üretim imajı
# Playwright resmi imajı tarayıcı bağımlılıklarını + Node 20'yi içerir.
# Build context: repo kökü.  Build: docker build -f infra/docker/worker.Dockerfile .
FROM mcr.microsoft.com/playwright:v1.49.1-noble
RUN corepack enable
WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json tsconfig.base.json .npmrc ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/worker/package.json ./apps/worker/package.json
COPY packages ./packages
RUN pnpm install --frozen-lockfile

COPY apps ./apps
RUN pnpm --filter @velora/db run generate

ENV NODE_ENV=production
CMD ["pnpm", "--filter", "@velora/worker", "run", "start"]
