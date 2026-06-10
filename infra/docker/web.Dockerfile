# VELORA web (Next.js) — üretim imajı
# Build context: repo kökü.  Build: docker build -f infra/docker/web.Dockerfile .
FROM node:20-bookworm-slim AS build
RUN corepack enable
WORKDIR /app

# Bağımlılıklar (workspace manifestleri önce → katman önbelleği)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json tsconfig.base.json .npmrc ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/worker/package.json ./apps/worker/package.json
COPY packages ./packages
RUN pnpm install --frozen-lockfile

# Kaynak + build
COPY apps ./apps
RUN pnpm --filter @velora/db run generate \
 && pnpm --filter @velora/web run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "--filter", "@velora/web", "run", "start"]
