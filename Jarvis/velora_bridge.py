"""
VELORA Bridge — Python Jarvis'ten VELORA'ya HTTP köprüsü.

Akış: parse_velora_intent(text) → VELORA ise call_velora(text) → TTS
      UNKNOWN ise Gemini'ye bırak (main.py'da kontrol edilir)
"""

from __future__ import annotations

import os
import re
import subprocess
import threading
import time
from typing import Optional

import requests

from app_config import get_app_config_value

# ── Bağlantı ────────────────────────────────────────────────────────────────
VELORA_BASE_URL = "http://localhost:3000"

# ── Rate limiting (dakikada max 10 istek) ───────────────────────────────────
_rate_lock = threading.Lock()
_request_times: list[float] = []
MAX_PER_MINUTE = 10

# ── Kritik komutlar: sesli/UI onayı gerektirir ──────────────────────────────
CONFIRM_KEYWORDS = [
    'arşivle', 'nişten çık', 'kapat', 'toplu sil',
    'kampanya başlat', 'yayınla', 'yedek sil',
]

# ── Keyword Matcher — action-router/index.ts'in Python portu ────────────────
# Öncelik sırası: listedeki ilk eşleşme kazanır (TS ile birebir aynı mantık)
PATTERNS: list[tuple[str, list[str]]] = [
    ('HUNT_TRENDS',         ['trend avla', 'trendleri avla', 'trend av', 'trend tara', 'niş tara', 'trendleri bul']),
    ('WATCH_COMPETITORS',   ['rakipleri tara', 'rakip tara', 'tüm rakipleri', 'rakipleri izle', 'competitor tara']),
    ('FIND_SUPPLIERS',      ['tedarikçi bul', 'tedarikçi ara', 'supplier bul', 'supplier ara']),
    ('GENERATE_REPORT',     ['rapor üret', 'haftalık rapor', 'ceo raporu', 'rapor oluştur', 'raporu üret']),
    ('RUN_DISCOVERY',       ['fırsat bul', 'fırsatları tara', 'keşif başlat', 'keşfet', 'discovery başlat']),
    ('BACKFILL_PI',         ['ürün zekası üret', 'pi backfill', 'ürün zekası doldur', 'zeka üret', 'pi güncelle']),
    ('GENERATE_DESIGN',     ['tasarım üret', 'yeni tasarım', 'tasarım oluştur', 'otomatik tasarım']),
    ('GENERATE_VIDEO',      ['video üret', 'ugc üret', 'video oluştur', 'reel üret', 'tiktok videosu']),
    ('FINANCE_SNAPSHOT',    ['finans güncelle', 'gelir hesapla', 'finans snapshot', 'finans al', 'kâr hesapla']),
    ('SHOPIFY_IMPORT',      ['shopify içe aktar', 'ürünleri içe aktar', 'shopify senkron', 'shopify güncelle']),
    ('DRAFT_SUPPLIER_EMAIL',['mail yaz', 'mail taslağı', 'tedarikçi mail', 'mail oluştur']),
    ('SYNC_DEMAND',         ['talep senkronla', 'talep güncelle', 'davranış kaydet', 'demand sync', 'haftalık talep']),
    ('UPDATE_SEO',          ['seo güncelle', 'seo yenile', 'shopify seo', 'içerik güncelle', 'ürün içeriği güncelle']),
    ('PREPARE_ADS',         ['reklam hazırla', 'kampanya hazırla', 'meta kampanya', 'reklam taslağı']),
    ('SYNC_ADS',            ['reklamları senkronla', 'meta senkronla', 'reklam performansı', 'kampanyaları güncelle', 'reklam senkron']),
    ('RUN_BACKUP',          ['yedek al', 'yedekleme yap', 'backup al', 'veri yedekle', 'sistem yedekle']),
]


def parse_velora_intent(text: str) -> str:
    """
    Komut metninden VELORA niyet türü döner.
    Eşleşme yoksa 'UNKNOWN' döner.
    """
    normalized = text.lower().strip()
    for action_type, keywords in PATTERNS:
        for kw in keywords:
            if kw in normalized:
                return action_type
    return 'UNKNOWN'


def requires_confirmation(text: str) -> bool:
    """Kritik operasyonlar için UI onayı gerekip gerekmediğini kontrol eder."""
    normalized = text.lower()
    return any(kw in normalized for kw in CONFIRM_KEYWORDS)


def _check_rate_limit() -> bool:
    """Dakikada MAX_PER_MINUTE istek sınırı. Aşılırsa False döner."""
    now = time.time()
    with _rate_lock:
        recent = [t for t in _request_times if now - t < 60]
        if len(recent) >= MAX_PER_MINUTE:
            return False
        recent.append(now)
        _request_times.clear()
        _request_times.extend(recent)
    return True


def get_velora_token() -> Optional[str]:
    """config/api_keys.json veya VELORA_API_TOKEN env'inden token okur."""
    token = get_app_config_value('velora_api_token')
    if not token:
        token = os.environ.get('VELORA_API_TOKEN', '')
    return token.strip() if token else None


def push_state(status: str, command: str = '') -> None:
    """
    Orb durum güncellemesini VELORA'ya sessizce gönderir.
    Fire-and-forget: hata olursa ana akış etkilenmez.
    Rate limiting uygulanmaz (hafif iç sinyal).
    """
    token = get_velora_token()
    if not token:
        return

    body: dict = {'status': status}
    if command:
        body['lastCommand'] = command[:200]

    def _push():
        try:
            requests.post(
                f"{VELORA_BASE_URL}/api/jarvis/state",
                json=body,
                headers={
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json',
                },
                timeout=5,
            )
        except Exception:  # noqa: BLE001
            pass  # state push hatası asla ana akışı kırmasın

    threading.Thread(target=_push, daemon=True).start()


def call_velora(command: str) -> dict:
    """
    VELORA HTTP API'sini çağırır.
    Döner: {"ok": bool, "message": str}
    """
    if not _check_rate_limit():
        return {"ok": False, "message": "Rate limit aşıldı. Biraz bekle."}

    token = get_velora_token()
    if not token:
        return {
            "ok": False,
            "message": "VELORA API token ayarlanmamış. Ayarlar ekranından 'velora_api_token' gir.",
        }

    push_state('LISTENING', command)  # komut gönderilmeden önce LISTENING

    try:
        r = requests.post(
            f"{VELORA_BASE_URL}/api/jarvis/command",
            json={"command": command},
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            timeout=15,
        )
        if r.status_code == 401:
            return {"ok": False, "message": "VELORA token geçersiz. Ayarları kontrol et."}
        if r.status_code in (502, 503, 504):
            return {"ok": False, "message": "VELORA çalışmıyor. Docker ve Next.js başlatıldı mı?"}
        r.raise_for_status()
        data = r.json()
        return {"ok": bool(data.get("ok")), "message": str(data.get("message", ""))}
    except requests.exceptions.ConnectionError:
        return {"ok": False, "message": "VELORA'ya bağlanılamıyor. localhost:3000 erişilebilir mi?"}
    except requests.exceptions.Timeout:
        return {"ok": False, "message": "VELORA yanıt vermedi (15 sn timeout)."}
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "message": f"VELORA hatası: {e}"}


def speak_result(message: str, on_end=None):
    """
    macOS 'say' komutu ile VELORA sonucunu seslendirir.
    Daemon thread içinde çalışır — UI'ı bloklamaz.
    on_end: say bittikten sonra çağrılacak callback (WakeWord unmute için).
    """
    def _say():
        try:
            # Emoji ve Unicode özel karakterleri temizle
            clean = re.sub(r'[^\w\s.,!?:;()\-/]', ' ', message, flags=re.UNICODE)
            clean = ' '.join(clean.split())  # Fazla boşlukları sıkıştır
            if clean:
                subprocess.run(['say', '-r', '200', clean], timeout=30, check=False)
        except Exception:  # noqa: BLE001
            pass
        finally:
            if on_end:
                try:
                    on_end()
                except Exception:  # noqa: BLE001
                    pass

    threading.Thread(target=_say, daemon=True).start()


def is_velora_available() -> bool:
    """VELORA'nın ayakta olup olmadığını hızlıca kontrol eder."""
    try:
        r = requests.get(f"{VELORA_BASE_URL}/api/health", timeout=3)
        return r.status_code == 200
    except Exception:  # noqa: BLE001
        return False
