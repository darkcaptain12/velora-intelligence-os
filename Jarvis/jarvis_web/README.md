# J.A.R.V.I.S Web

Telefon ve bilgisayar tarayıcısından çalışan JARVIS. Mac açıkken sistem
araçları (uygulama açma, takvim, shell...) Mac üzerinden yürütülür;
Mac kapalıyken konuşma, hava durumu, bellek ve tarayıcı kamerası çalışmaya
devam eder.

## Mimari

```
[Telefon tarayıcı]   [Bilgisayar tarayıcı]
        └──────────┬──────────┘
                   ▼
        ┌─────────────────────┐
        │  server.py (FastAPI) │ ← Gemini Live burada koşar
        └──────────┬──────────┘
                   │ websocket (Mac açıkken)
                   ▼
        ┌─────────────────────┐
        │  agent.py (Mac ajanı)│ ← takvim, shell, uygulama açma...
        └─────────────────────┘
```

## Kurulum

```bash
cd jarvis_web
pip3 install -r requirements.txt
```

Gemini API anahtarı ana projedeki `config/api_keys.json`'dan okunur
(masaüstü JARVIS ile aynı). Sunucu başka makinedeyse `GEMINI_API_KEY`
ortam değişkeni de kullanılabilir.

## Çalıştırma

**1. Sunucu** (Mac'te veya bulut sunucusunda):

```bash
python3 server.py
```

Sunucu iki port açar: **8765 (HTTP — bilgisayar için)** ve
**8766 (HTTPS — telefon için)**. İlk çalıştırmada bir **erişim token'ı**
üretilir ve ekrana basılır (`web_config.json` içinde saklanır).

**2. Mac ajanı** (sistem araçları için, ayrı terminalde):

```bash
python3 agent.py                                      # sunucu localhost'taysa
python3 agent.py --server ws://SUNUCU-IP:8765 --token TOKEN
```

**3. Tarayıcı:**

- Aynı Mac'te: `http://localhost:8765` (localhost'ta mikrofon HTTP'de çalışır)
- Telefondan: `https://<MAC-IP>:8766` (aynı Wi-Fi ağında)
- Telefonda ilk girişte sertifika uyarısı çıkar (kendinden imzalı):
  Safari'de **"Ayrıntıları Göster" → "Web Sitesini Ziyaret Et"**,
  Chrome'da **"Gelişmiş" → "Devam et"**
- Token sorulduğunda sunucunun bastığı token'ı gir (bir kez; tarayıcıda saklanır)

Mac'in IP'sini öğrenmek için: `ipconfig getifaddr en0`

## Kullanım

| Buton | İşlev |
|-------|-------|
| 🎙️ MIC | Mikrofonu aç/kapat — gerçek zamanlı konuşma |
| 📷 CAM | Tarayıcı kamerasını aç — JARVIS görür (1.5s/kare) |
| Yazı kutusu | Sesli konuşmadan yazılı komut gönder |

Üstteki rozetler: **SUNUCU** = backend bağlantısı, **MAC** = ajan bağlı mı.
MAC rozeti sönükken sistem araçları "bilgisayar bağlı değil" yanıtı verir.

## Güvenlik notları

- Token olmadan hiçbir websocket bağlantısı kabul edilmez.
- İnternete açmadan önce: gerçek bir TLS sertifikası (Let's Encrypt) ve
  güçlü token kullan; `shell_run` aracının tam yetkili olduğunu unutma.
- En güvenli kurulum: sunucu yalnızca yerel ağda, dışarıdan erişim için
  Tailscale/WireGuard VPN.
