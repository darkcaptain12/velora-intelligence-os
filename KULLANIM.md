# VELORA — Kullanım Kılavuzu

Bu sistem Shopify mağazanı (Konfora) **A'dan Z'ye** yönetir: tasarım üretir, gerçekçi mockup
hazırlar, ürün sayfası yazar, mağazaya yükler, reklam/finans/rapor yönetir. **Senin tek görevin
siparişleri takip edip kargolamak.**

---

## 1. Günlük açma / kapama

```bash
# Sabah (sistemi ayağa kaldır)
cd ~/Projects/e_ticaret_ai
pnpm infra:up          # postgres/redis/minio/n8n (Docker)
pnpm dev:worker        # 1. terminal — arka plan işçisi
pnpm dev:web           # 2. terminal — panel
```

- **Panel:** http://localhost:3000 — Giriş: `owner@velora.local` / `velora1234`
- Kapatmak için terminalleri kapat; altyapı: `pnpm infra:down`.

> **Not:** Sistem ancak bilgisayar + bu iki süreç (worker + web) açıkken çalışır. "Ben yokken
> dahi işlesin" için bilgisayarın açık kalmalı veya ileride bir sunucuya taşınmalı.

---

## 2. Panel sayfaları (ne işe yarar)

| Sayfa | İş |
|-------|----|
| **Komuta Merkezi** | Özet: görevler, otonomi, son olaylar |
| **AI CEO** | Haftalık analiz/rapor üret (mail olarak da gider) |
| **Ürün Araştırma** | 6 kaynaktan niş/talep araştır + skorla |
| **Trend Avcısı** | Araştırma sonuçlarından haftalık trend çıkar (önce araştırma yap!) |
| **Tasarım** | Tasarım üret (aşağıya bak), galeri, **baskı dosyasını indir**, onayla |
| **Video** | Reklam videosu üret (TikTok/Reel/Story) |
| **Shopify** | Tasarımı ürün yap & yayınla, içe aktar, manuel ürün, **Satışa Aç** |
| **Meta Reklam** | Kampanya aç/kapat/bütçe + acil durum koruması (Meta anahtarı gelince) |
| **Finans** | Ciro, kâr, ROAS, operasyon skoru + AI yorum |
| **Rakip / Tedarikçi / Lab / Görevler / Yedekleme / Ayarlar** | İlgili modüller |

---

## 3. Tasarım üretme (önemli kurallar)

Tasarım sayfasında konuyu yaz. Sistem otomatik olarak **baskıya hazır vektörel grafik** üretir
(fotoğraf değil, giysi şekli çizmez).

- **Sadece görsel istiyorsan:** `retro JDM japon spor araba sunset`
- **Yazı da istiyorsan tırnak içine al** (yazıyı AI değil, sistem net basar):
  `gym motivasyon "BEAST MODE"` · `babalar günü bıyık kravat "BEST DAD EVER"`

Her tasarım otomatik olarak: **4 gerçekçi mockup** (kadın model + erkek model + düz + açılı) +
**şeffaf baskı dosyası** üretir ve skorlanır.

> **Baskı dosyası:** "⬇ Baskı dosyasını indir" → mockup değil, **şeffaf arka planlı bare grafik**
> (doğrudan baskıya gönderebilirsin).

---

## 4. Mağazaya yayınlama

1. **Shopify** sayfası → hazır tasarımdan "Yayınla" → sistem AI ürün sayfası (açıklama+SEO+FAQ)
   yazar, **4 mockup'ı** yükler (ham tasarım ASLA yüklenmez — çalınma koruması), kapak = kadın model.
2. Ürün **DRAFT (taslak)** olarak gider — gerçek mağazana kötü bir şey kendiliğinden çıkmaz.
3. Beğenince **"Satışa Aç"** → ürün canlıya (ACTIVE) geçer.

**Mağazadan içe aktar:** "Shopify'dan İçe Aktar" → mevcut mağaza ürünlerini sisteme çeker.
**Manuel ürün:** "Manuel Ürün Ekle" formu.

---

## 5. Tam otonomi (L3) — sistem kendi kendine

Ayarlar → Otonomi **L3** + Reklam otomatik modu **açık** (şu an aktif).

Otomatik çalışan döngü:
- **Haftalık tasarım** (n8n, Çarşamba 03:00): yaklaşan **özel günleri** (bayram, Sevgililer,
  Babalar Günü, Black Friday…) + trendleri yakalar, tasarım üretir.
- **Talebe göre yayın:** skoru yüksek tasarımlar otomatik **DRAFT ürün** olur (sen "Satışa Aç" dersin).
- **Reklam:** harcama limiti aşılırsa kampanyalar otomatik durur (Spend Guardian, saatlik).
- **Finans:** günlük anlık görüntü (00:30) + **haftalık AI CEO raporu** (Pazar 00:00, mail).

n8n panel: http://localhost:5678 (4 workflow aktif).

---

## 6. Anahtarlar (Ayarlar → API Anahtarları)

Hepsi şifreli saklanır. Mevcut: **OpenAI, Fal.ai, Shopify, SMTP**.
Eksik: **Meta** (reklam için; geldiğinde Ayarlar'dan gir, reklam modülü devreye girer).

---

## 7. Önemli notlar

- **Görseller artık kırılmaz:** uygulamanın kendi adresinden servis edilir; Shopify'a görseller
  doğrudan yüklenir. Tünel/3. parti gerekmez.
- **Üretime (gerçek alan adı) taşırken:** `.env` içinde `ASSET_PUBLIC_BASE`'i mağazanın canlı
  domain'ine ayarla (panel görselleri için). Shopify görselleri zaten Shopify CDN'inde kalıcıdır.
- **Yedek:** Yedekleme sayfasından DB yedeği al (API anahtarları yedeğe DAHİL EDİLMEZ).
- **Senin görevin:** siparişleri takip et + kargola. Gerisi otomatik.
