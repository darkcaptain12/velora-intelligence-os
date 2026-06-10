# VELORA — n8n Orkestrasyon

n8n yalnızca **zamanlayıcı/orkestratör**tür; iş mantığı app webhook'u → BullMQ worker'da koşar
(bkz. docs/ARCHITECTURE.md §3.2, §6).

## Workflow'lar (`workflows/`)
| Dosya | Zamanlama | Çağırdığı kuyruk(lar) |
|------|-----------|----------------------|
| `weekly-master.json` | Pazar 00:00 | trendHunt → financeSnapshot → weeklyReport (rapor + mail) |
| `daily-finance.json` | Her gün 00:30 | financeSnapshot |
| `spend-guardian.json` | Saatlik | spendGuardian (Acil Durum Koruması) |

> Tasarım/Mockup/Video adımları ürün/brief bağlamı gerektirir; AI Tasarım Direktörü
> brief'i üretildikten sonra `design`/`video` kuyrukları tetiklenir (Faz 9b / manuel).

## İçe Aktarma
1. n8n arayüzü: http://localhost:5678
2. Her workflow JSON'unu **Import from File** ile içe aktarın.
3. n8n ortamına `N8N_WEBHOOK_SECRET` değişkenini ekleyin (kök `.env` ile aynı değer).
   Docker compose'da n8n servisine env olarak geçirilebilir.
4. Webhook ucu: `POST http://web:3000/api/webhooks/n8n` (compose ağı içinden `web` servis adı;
   host'tan `http://localhost:3000`). Header: `Authorization: Bearer <N8N_WEBHOOK_SECRET>`.
5. Workflow'u **Active** yapın.

## Webhook sözleşmesi
```
POST /api/webhooks/n8n
Authorization: Bearer <N8N_WEBHOOK_SECRET>
{ "event": "weekly.trend", "queue": "trendHunt", "data": { } }
```
- `queue` kayıtlı bir kuyruk adıysa iş kuyruğa eklenir; `brandId` otomatik (aktif marka) enjekte edilir.
- Her çağrı `AuditLog`'a (actor=n8n) yazılır.
