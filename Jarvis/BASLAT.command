#!/bin/bash
# ╔══════════════════════════════════════════════════════════╗
# ║   J.A.R.V.I.S — ÇİFT TIKLA BAŞLAT (macOS)                 ║
# ╚══════════════════════════════════════════════════════════╝

cd "$(dirname "$0")" || exit 1

# Kurulum yapılmış mı?
if [ ! -d "venv" ]; then
    clear
    echo ""
    echo "⚠️  JARVIS henüz kurulmamış."
    echo "   Önce  KUR.command  dosyasına çift tıkla."
    echo ""
    read -p "Kapatmak için Enter'a bas..."
    exit 1
fi

source venv/bin/activate
clear
echo "🚀 JARVIS başlatılıyor..."
python main.py

# ── JARVIS kapandı → bu Terminal penceresini otomatik kapat ──
# python bittiği için pencerede çalışan başka işlem kalmaz; macOS
# "işlem çalışıyor" uyarısı vermeden kendi penceremizi kapatabiliriz.
MY_TTY="$(tty)"
osascript >/dev/null 2>&1 <<OSA || true
tell application "Terminal"
    repeat with w in windows
        repeat with t in tabs of w
            try
                if tty of t is "$MY_TTY" then
                    close w
                end if
            end try
        end repeat
    end repeat
end tell
OSA
