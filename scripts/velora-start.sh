#!/bin/bash
# ══════════════════════════════════════════════════════════════════
# VELORA AI Commerce OS — Tek Tık Başlatma
# Docker + Next.js Web + BullMQ Worker + Jarvis Desktop
# ══════════════════════════════════════════════════════════════════
set -euo pipefail

PROJECT="/Users/emir/Projects/e_ticaret_ai"
LOGS="$PROJECT/logs"
PNPM="/opt/homebrew/bin/pnpm"
PIDFILE="$LOGS/velora.pids"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

log()  { echo -e "${CYAN}[VELORA]${NC} $1"; }
ok()   { echo -e "${GREEN}[VELORA] ✅${NC} $1"; }
warn() { echo -e "${YELLOW}[VELORA] ⚠️${NC} $1"; }
err()  { echo -e "${RED}[VELORA] ❌${NC} $1"; }

cleanup() {
    log "Kapatılıyor..."
    if [[ -f "$PIDFILE" ]]; then
        while read -r pid; do
            kill "$pid" 2>/dev/null && log "PID $pid durduruldu"
        done < "$PIDFILE"
        rm -f "$PIDFILE"
    fi
    ok "VELORA kapatıldı."
}
trap cleanup EXIT INT TERM

mkdir -p "$LOGS"
cd "$PROJECT"

# ── 1. Docker Desktop ───────────────────────────────────────────
log "Docker kontrol ediliyor..."
if ! docker info &>/dev/null; then
    log "Docker Desktop başlatılıyor..."
    open -a Docker
    local_timeout=60
    while ! docker info &>/dev/null; do
        sleep 2
        local_timeout=$((local_timeout - 2))
        if [[ $local_timeout -le 0 ]]; then
            err "Docker başlatılamadı (60s timeout)"
            exit 1
        fi
    done
fi
ok "Docker çalışıyor"

# ── 2. Docker Compose servisleri ─────────────────────────────────
log "Altyapı servisleri başlatılıyor (postgres/redis/minio/n8n)..."
docker compose -f infra/docker-compose.yml up -d --remove-orphans 2>&1 | tail -3

log "Postgres bekleniyor..."
for i in $(seq 1 30); do
    docker exec velora-postgres pg_isready -U velora &>/dev/null && break
    sleep 1
done
log "Redis bekleniyor..."
for i in $(seq 1 15); do
    docker exec velora-redis redis-cli ping &>/dev/null && break
    sleep 1
done
ok "Altyapı hazır (Postgres + Redis + MinIO + n8n)"

# ── 3. Eski süreçleri temizle ────────────────────────────────────
if [[ -f "$PIDFILE" ]]; then
    warn "Eski PID dosyası tespit edildi, temizleniyor..."
    while read -r pid; do
        kill "$pid" 2>/dev/null || true
    done < "$PIDFILE"
    rm -f "$PIDFILE"
fi

# Port 3000-3002 temizle (Next.js kayma sorunu)
for port in 3000 3001 3002; do
    OLD_PIDS=$(lsof -ti:$port 2>/dev/null || true)
    if [[ -n "$OLD_PIDS" ]]; then
        warn "Port $port'de eski süreç var, temizleniyor..."
        echo "$OLD_PIDS" | xargs kill -9 2>/dev/null || true
    fi
done

# Kalan velora node süreçlerini temizle
pkill -f "@velora/web" 2>/dev/null || true
pkill -f "@velora/worker" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
sleep 2

# Port 3000 boş olduğundan emin ol
if lsof -ti:3000 &>/dev/null; then
    err "Port 3000 hâlâ meşgul!"
    lsof -i:3000 | head -3
    exit 1
fi

# ── 4. Next.js Web Server ───────────────────────────────────────
log "VELORA Web başlatılıyor (port 3000)..."
$PNPM --filter @velora/web run dev > "$LOGS/web.log" 2>&1 &
WEB_PID=$!
echo "$WEB_PID" > "$PIDFILE"
log "  Web PID: $WEB_PID (log: $LOGS/web.log)"

# ── 5. BullMQ Worker ────────────────────────────────────────────
log "VELORA Worker başlatılıyor..."
$PNPM --filter @velora/worker run dev > "$LOGS/worker.log" 2>&1 &
WORKER_PID=$!
echo "$WORKER_PID" >> "$PIDFILE"
log "  Worker PID: $WORKER_PID (log: $LOGS/worker.log)"

# ── 6. Web hazır olana kadar bekle ──────────────────────────────
log "Web sunucusu bekleniyor..."
for i in $(seq 1 45); do
    if curl -sf http://localhost:3000/api/health &>/dev/null; then
        break
    fi
    sleep 2
done
if curl -sf http://localhost:3000/api/health &>/dev/null; then
    ok "VELORA Web hazır → http://localhost:3000"
else
    warn "Web 90s içinde yanıt vermedi, yine de devam ediliyor..."
fi

# ── 7. Tarayıcı aç ──────────────────────────────────────────────
open "http://localhost:3000/dashboard"

# ── 8. Jarvis Desktop ───────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  VELORA AI Commerce OS — Tüm Sistemler Aktif${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "  🌐 Web:    http://localhost:3000"
echo -e "  ⚙️  Worker: aktif (log: $LOGS/worker.log)"
echo -e "  📦 Docker: postgres/redis/minio/n8n"
echo -e "  🤖 Jarvis: başlatılıyor..."
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""

cd "$PROJECT/Jarvis"
source venv/bin/activate
python main.py

# Jarvis kapanınca cleanup tetiklenir (trap EXIT)
