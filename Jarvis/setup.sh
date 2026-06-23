#!/bin/bash
# JARVIS macOS — Kurulum & Başlatma Scripti
# Çalıştır: bash setup.sh

set -e

echo ""
echo "╔══════════════════════════════════════╗"
echo "║     J.A.R.V.I.S  macOS Kurulum      ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Python sürümü kontrol
PYTHON=$(which python3)
VERSION=$($PYTHON --version 2>&1)
echo "✅ Python: $VERSION"

# PortAudio kontrolü (PyAudio için gerekli)
if ! brew list portaudio &>/dev/null 2>&1; then
    echo "📦 PortAudio kuruluyor (PyAudio için)..."
    if ! command -v brew &>/dev/null; then
        echo "⚠️  Homebrew bulunamadı. https://brew.sh adresinden kurun."
        echo "    Sonra: brew install portaudio"
    else
        brew install portaudio
    fi
else
    echo "✅ PortAudio zaten kurulu"
fi

# Virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Virtual environment oluşturuluyor..."
    $PYTHON -m venv venv
fi

source venv/bin/activate

echo "📦 Paketler yükleniyor..."
pip install --upgrade pip -q
pip install -r requirements.txt -q

echo ""
echo "╔══════════════════════════════════════╗"
echo "║         Kurulum Tamamlandı!          ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "🚀 JARVIS'i başlatmak için:"
echo "   source venv/bin/activate"
echo "   python main.py"
echo ""
echo "🎙️  Kullanım:"
echo "   • 'Jarvis' diyerek sesli komut verin"
echo "   • Yazı kutusuna yazıp Enter'a basın"
echo "   • F4 veya ⌘M ile mikrofonu susturun"
echo ""

# İstenirse hemen başlat
read -p "Şimdi başlatılsın mı? (e/h): " choice
if [[ "$choice" == "e" || "$choice" == "E" ]]; then
    python main.py
fi
