# VELORA Intelligence OS — API Kurulum Rehberi

Aşağıdaki servislerden API anahtarı alıp `.env` dosyasına yazman gerekiyor.

> ⚠️ API anahtarlarını ASLA kaynak koduna, README'ye veya log'lara yazma.
> Sadece `.env` dosyasında tut (gitignore'da).

---

## ✅ Mevcut (zaten ayarlı)

| Servis | ENV Değişkeni | Durum |
|--------|--------------|-------|
| OpenAI | `OPENAI_API_KEY` | ✅ |
| Fal.ai | `FAL_KEY` | ✅ |
| Shopify | `SHOPIFY_ADMIN_ACCESS_TOKEN` | ✅ |
| Printify | `PRINTIFY_API_TOKEN` | ✅ |
| Gmail SMTP | `SMTP_*` | ✅ |
| Gemini | `GEMINI_API_KEY` | ✅ |
| Claude | `ANTHROPIC_API_KEY` | ✅ |

---

## 🔴 Eksik — Manuel Oluştur

### 1. OneSignal (Push Bildirim)

**Ne İçin:** Mobil/web push bildirimler (KRİTİK/UYARI/FIRSAT/ÖNEMLİ)

**Adımlar:**
1. https://app.onesignal.com adresine git
2. Hesap yoksa oluştur (ücretsiz plan yeterli)
3. "New App" → uygulama adı: `VELORA`
4. Platform: **Web Push** seç
5. Site URL: `http://localhost:3000` (geliştirme)
6. Dashboard'dan al:
   - **App ID** (Settings → Keys & IDs)
   - **REST API Key** (Settings → Keys & IDs)

**`.env` dosyasına yaz:**
```
ONESIGNAL_APP_ID=buraya-app-id-yaz
ONESIGNAL_API_KEY=buraya-rest-api-key-yaz
```

---

### 2. Reddit API (Trend/Fırsat Tarama)

**Ne İçin:** Reddit'ten trend/problem/fırsat tespiti

**Adımlar:**
1. https://www.reddit.com/prefs/apps adresine git (Reddit hesabıyla giriş yap)
2. Sayfanın altında "create another app..." butonuna tıkla
3. Ayarlar:
   - **name:** `VELORA`
   - **type:** `script` seç
   - **redirect uri:** `http://localhost:8080`
   - **description:** `E-commerce intelligence`
4. "create app" tıkla
5. Oluşan kutuda al:
   - **Client ID** — uygulama adının hemen altındaki kısa kod
   - **Client Secret** — `secret` yazan satırdaki değer

**`.env` dosyasına yaz:**
```
REDDIT_CLIENT_ID=buraya-client-id-yaz
REDDIT_CLIENT_SECRET=buraya-client-secret-yaz
```

---

### 3. SerpAPI (Google Arama Sonuçları)

**Ne İçin:** Google Trends, arama sonuçları, SEO verileri

**Adımlar:**
1. https://serpapi.com adresine git
2. Hesap oluştur (ücretsiz plan: 100 arama/ay)
3. Dashboard'a git → API Key kopyala

**`.env` dosyasına yaz:**
```
SERPAPI_API_KEY=buraya-api-key-yaz
```

---

### 4. Meta (Facebook/Instagram Reklam) — Opsiyonel

**Ne İçin:** Meta reklam kampanya yönetimi, Ad Library taraması

**Adımlar:**
1. https://developers.facebook.com → uygulama oluştur
2. Marketing API erişimi al
3. Access Token üret (uzun ömürlü)

**`.env` dosyasına yaz:**
```
META_ACCESS_TOKEN=buraya-access-token-yaz
META_AD_ACCOUNT_ID=act_123456789
META_APP_SECRET=buraya-app-secret-yaz
```

---

## 📁 `.env` Dosyası Nerede?

```
/Users/emir/Projects/e_ticaret_ai/.env
```

Bu dosya `gitignore`'da — commit edilmez, güvende.

---

## 🧪 Test

Anahtarları ekledikten sonra test:

```bash
# Sistemi yeniden başlat
./scripts/velora-start.sh

# Jarvis ile test
"Jarvis trend avla"       → Reddit + SerpAPI kullanır
"Jarvis günlük brifing"   → Risk Engine + Daily Brief
"Jarvis rapor üret"       → AI CEO (Claude/OpenAI)
```

---

## Jarvis Sesli Komutlar (tüm liste)

| Komut | İşlev |
|-------|-------|
| "Jarvis trend avla" | Trend taraması |
| "Jarvis rakipleri tara" | Tüm rakip taraması |
| "Jarvis tedarikçi bul [niş]" | Web aramasıyla tedarikçi öner |
| "Jarvis rapor üret" | Haftalık CEO raporu |
| "Jarvis fırsat bul" | Fırsat keşfi |
| "Jarvis ürün zekası üret" | PI backfill |
| "Jarvis tasarım üret" | Otomatik tasarım |
| "Jarvis video üret" | UGC video |
| "Jarvis finans güncelle" | Finans snapshot |
| "Jarvis shopify içe aktar" | Shopify senkron |
| "Jarvis mail yaz" | Tedarikçi mail taslağı |
| "Jarvis talep senkronla" | Davranış sinyalleri |
| "Jarvis seo güncelle" | SEO/içerik yenile |
| "Jarvis reklam hazırla" | Kampanya taslağı |
| "Jarvis reklamları senkronla" | Meta reklam performansı |
| "Jarvis yedek al" | Sistem yedekleme |
| "Jarvis günlük brifing" | Risk + Daily Brief |
| "Jarvis bugün ne yapmalıyım" | Daily Brief |
| "Jarvis kapat" | Sistemi durdur (wakeword) |
