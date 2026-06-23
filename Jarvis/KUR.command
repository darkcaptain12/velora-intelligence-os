#!/bin/bash
# ╔══════════════════════════════════════════════════════════╗
# ║   J.A.R.V.I.S — ÇİFT TIKLA KURULUM (macOS)                ║
# ║   Bu dosyaya çift tıkla, gerisini o halleder.            ║
# ╚══════════════════════════════════════════════════════════╝

# Bu script nerede ise oraya geç (kullanıcı nereye koyduysa çalışır)
cd "$(dirname "$0")" || exit 1
BASE_DIR="$(pwd)"

clear
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║          J.A.R.V.I.S  KURULUM  —  Lütfen bekleyin         ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── 0) Karantina temizle + çalıştırma izni ───────────────────
# Zip'ten çıkan dosyalarda macOS "geliştirici doğrulanamadı" engeli olur.
# Kullanıcı bu KUR dosyasını zaten onayladı; tüm klasörü güvenli işaretle.
xattr -r -d com.apple.quarantine "$BASE_DIR" 2>/dev/null || true
chmod +x "$BASE_DIR/BASLAT.command" 2>/dev/null || true

# Klasör Downloads/Desktop/Documents içindeyse macOS izin sorabilir — uyar
case "$BASE_DIR" in
    "$HOME/Downloads"/*|"$HOME/Desktop"/*|"$HOME/Documents"/*)
        echo "ℹ️  Not: JARVIS ilk açılışta klasör erişim izni isteyebilir."
        echo "   Çıkan pencerede 'İzin Ver' demen yeterli."
        echo ""
        ;;
esac

# ── 1) Homebrew ──────────────────────────────────────────────
if ! command -v brew &>/dev/null; then
    echo "📦 Homebrew kuruluyor (bir kerelik)..."
    echo "   Mac şifreni isteyebilir — yaz ve Enter'a bas."
    echo ""
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # Apple Silicon'da brew yolunu bu oturuma ekle
    if [ -x /opt/homebrew/bin/brew ]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [ -x /usr/local/bin/brew ]; then
        eval "$(/usr/local/bin/brew shellenv)"
    fi
else
    echo "✅ Homebrew zaten kurulu"
fi

# ── 2) Python 3 ──────────────────────────────────────────────
# macOS'ta /usr/bin/python3 bir "stub" olabilir: var görünür ama Xcode
# araçları kurulu değilse çalışmaz. O yüzden önce Homebrew python'unu tercih
# et, yoksa sistemdekini GERÇEKTEN çalışıyor mu diye test et, o da yoksa kur.
PYTHON=""
for cand in /opt/homebrew/bin/python3 /usr/local/bin/python3; do
    if [ -x "$cand" ]; then PYTHON="$cand"; break; fi
done
if [ -z "$PYTHON" ] && command -v python3 &>/dev/null && python3 --version &>/dev/null; then
    PYTHON="$(command -v python3)"
fi
if [ -z "$PYTHON" ]; then
    echo "📦 Python kuruluyor (Homebrew ile)..."
    brew install python
    for cand in /opt/homebrew/bin/python3 /usr/local/bin/python3; do
        if [ -x "$cand" ]; then PYTHON="$cand"; break; fi
    done
    [ -z "$PYTHON" ] && PYTHON="$(command -v python3)"
fi

if [ -z "$PYTHON" ] || ! "$PYTHON" --version &>/dev/null; then
    echo ""
    echo "❌ Python kurulamadı. Lütfen https://www.python.org/downloads/"
    echo "   adresinden Python 3'ü kurup KUR.command'ı tekrar çalıştır."
    read -p "Kapatmak için Enter'a bas..."
    exit 1
fi
echo "✅ Python: $("$PYTHON" --version 2>&1)  ($PYTHON)"

# ── 3) PortAudio (mikrofon için) ─────────────────────────────
if ! brew list portaudio &>/dev/null 2>&1; then
    echo "📦 PortAudio kuruluyor (mikrofon için)..."
    brew install portaudio
else
    echo "✅ PortAudio zaten kurulu"
fi

# ── 4) Sanal ortam + paketler ────────────────────────────────
if [ ! -d "venv" ]; then
    echo "📦 Sanal ortam oluşturuluyor..."
    "$PYTHON" -m venv venv
fi
source venv/bin/activate

echo "📦 Gerekli paketler yükleniyor (birkaç dakika sürebilir)..."
pip install --upgrade pip -q
pip install -r requirements.txt -q

# ── 5) Masaüstü kısayolu (otomatik) ──────────────────────────
echo "🖥️  Masaüstüne JARVIS kısayolu ekleniyor..."
python make_shortcut.py || echo "   (kısayol atlandı — BASLAT.command ile yine açabilirsin)"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                  ✅  KURULUM TAMAMLANDI                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Masaüstündeki  JARVIS  ikonuna çift tıklayarak açabilirsin."
echo "(veya bu klasördeki BASLAT.command dosyasına)"
echo ""
echo "İlk açılışta Gemini API anahtarı istenir:"
echo "  1. https://aistudio.google.com/apikey adresinden ücretsiz al"
echo "  2. JARVIS ayarlar panelinden yapıştır"
echo ""
read -p "JARVIS'i şimdi başlatmak ister misin? (e/h): " choice
if [[ "$choice" == "e" || "$choice" == "E" ]]; then
    python main.py
fi
