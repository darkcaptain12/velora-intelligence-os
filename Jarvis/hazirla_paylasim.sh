#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT_DIR="${1:-$SCRIPT_DIR/../JARVIS MAC CODEX SHAREABLE}"

echo ""
echo "Paylasilabilir paket hazirlaniyor..."
echo "Kaynak : $SCRIPT_DIR"
echo "Cikti  : $OUT_DIR"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

rsync -a \
  --exclude 'venv/' \
  --exclude '__pycache__/' \
  --exclude '*.pyc' \
  --exclude '.DS_Store' \
  --exclude '.vscode/' \
  --exclude '.claude/' \
  --exclude '.swift-cache/' \
  --exclude '.swift-home/' \
  --exclude 'jarvis_web/' \
  --exclude 'jarvis.log' \
  --exclude 'jarvis_error.log' \
  --exclude '{actions,core,memory,config}' \
  --exclude 'config/api_keys.json' \
  --exclude 'memory/memory.json' \
  --exclude 'memory/phone_book.json' \
  "$SCRIPT_DIR/" "$OUT_DIR/"

cat > "$OUT_DIR/config/api_keys.json" <<'EOF'
{
  "gemini_api_key": "",
  "voice": "Charon",
  "youtube_api_key": "",
  "youtube_channel_handle": ""
}
EOF

cat > "$OUT_DIR/memory/memory.json" <<'EOF'
{
  "identity": {},
  "preferences": {},
  "whatsapp_contacts": {}
}
EOF

cat > "$OUT_DIR/memory/phone_book.json" <<'EOF'
{}
EOF

echo ""
echo "Hazir. Bu klasoru zipleyip takipcilerinle paylasabilirsin:"
echo "$OUT_DIR"
echo ""
echo "Not: API anahtarlari, kisiler ve kisisel bellek bu pakete dahil edilmedi."
