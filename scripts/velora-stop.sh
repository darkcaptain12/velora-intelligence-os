#!/bin/bash
# VELORA — Tüm Servisleri Durdur
PROJECT="/Users/emir/Projects/e_ticaret_ai"
PIDFILE="$PROJECT/logs/velora.pids"

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}[VELORA]${NC} Durduruluyor..."

# PID dosyasından süreçleri kapat
if [[ -f "$PIDFILE" ]]; then
    while read -r pid; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null
            echo -e "${CYAN}[VELORA]${NC} PID $pid durduruldu"
        fi
    done < "$PIDFILE"
    rm -f "$PIDFILE"
fi

# Kalan node süreçlerini temizle (velora'ya ait)
pkill -f "@velora/web" 2>/dev/null || true
pkill -f "@velora/worker" 2>/dev/null || true
pkill -f "Jarvis/main.py" 2>/dev/null || true

# Docker durdur (opsiyonel — -d ile çalıştırıldıysa Docker isteğe bağlı)
read -p "Docker servislerini de durdur? (e/h): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ee]$ ]]; then
    docker compose -f "$PROJECT/infra/docker-compose.yml" stop
    echo -e "${GREEN}[VELORA] ✅${NC} Docker servisleri durduruldu"
fi

echo -e "${GREEN}[VELORA] ✅${NC} Tüm VELORA servisleri kapatıldı."
