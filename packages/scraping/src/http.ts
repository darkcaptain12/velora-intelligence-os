import type { ResearchSource } from '@velora/shared';
import { IntegrationError, ScrapeBlockedError } from '@velora/shared';
import { randomUserAgent, USER_AGENTS } from './user-agents';

/**
 * Kaynak adaptörleri için dayanıklı HTTP istemcisi (yalnızca fetch — Playwright değil).
 *
 * Ortak yetenekler (CLAUDE.md §8):
 *  - Host bazlı kibarlık gecikmesi (rate-limit).
 *  - Geçici hatalarda (429/5xx/ağ) exponential backoff + jitter, `Retry-After` saygısı.
 *  - Her denemede rotasyonlu User-Agent.
 *  - 403 / kalıcı 429 → `ScrapeBlockedError` (manuel doğrulama görevine yol açar).
 *  - Diğer 4xx → `IntegrationError` (yapılandırma/anahtar sorunu).
 *
 * NOT (proxy): fetch tabanlı adaptörler standart `HTTPS_PROXY`/`HTTP_PROXY` env
 * değişkenlerini Node'un yerleşik proxy desteğiyle (`NODE_USE_ENV_PROXY=1`, Node ≥ 24)
 * kullanır — ek bağımlılık yoktur. Tarayıcı adaptörleri proxy'i `browser-pool` üzerinden
 * (`SCRAPER_PROXY_URL`) alır.
 */

export interface FetchOptions {
  /** Hata etiketlemesi için kaynak. */
  source: ResearchSource;
  headers?: Record<string, string>;
  /** Geçici hatalarda yeniden deneme sayısı (varsayılan 3). */
  retries?: number;
  /** Backoff taban gecikmesi ms (varsayılan 500). */
  baseDelayMs?: number;
  /** Tek istek zaman aşımı ms (varsayılan 15000). */
  timeoutMs?: number;
  /** Her denemede User-Agent rotasyonu (varsayılan true). */
  rotateUserAgent?: boolean;
}

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
const lastRequestAt = new Map<string, number>();
const MIN_HOST_INTERVAL_MS = 800; // aynı host'a istekler arası minimum boşluk

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/** Aynı host'a çok hızlı ardışık istekleri yumuşatır. */
async function politeWait(host: string): Promise<void> {
  const prev = lastRequestAt.get(host);
  const now = Date.now();
  if (prev !== undefined) {
    const wait = MIN_HOST_INTERVAL_MS - (now - prev);
    if (wait > 0) await sleep(wait + Math.floor(Math.random() * 250));
  }
  lastRequestAt.set(host, Date.now());
}

/** `Retry-After` başlığını ms'ye çevirir (saniye veya HTTP-date). */
function parseRetryAfter(header: string | null): number | undefined {
  if (!header) return undefined;
  const asSeconds = Number(header);
  if (!Number.isNaN(asSeconds)) return asSeconds * 1000;
  const asDate = Date.parse(header);
  if (!Number.isNaN(asDate)) return Math.max(0, asDate - Date.now());
  return undefined;
}

async function rawFetch(
  url: string,
  opts: FetchOptions,
  userAgent: string,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 15_000);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': userAgent,
        'Accept-Language': 'en-US,en;q=0.9',
        ...opts.headers,
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * JSON döndüren bir ucu dayanıklı şekilde çeker.
 * Engelleme/erişim hatalarında `ScrapeBlockedError`, kalıcı diğer hatalarda
 * `IntegrationError` fırlatır.
 */
export async function fetchJson<T>(url: string, opts: FetchOptions): Promise<T> {
  const res = await fetchWithRetry(url, { Accept: 'application/json', ...opts.headers }, opts);
  return (await res.json()) as T;
}

/** HTML/metin döndüren bir ucu dayanıklı şekilde çeker. */
export async function fetchText(url: string, opts: FetchOptions): Promise<string> {
  const res = await fetchWithRetry(url, opts.headers, opts);
  return res.text();
}

async function fetchWithRetry(
  url: string,
  headers: Record<string, string> | undefined,
  opts: FetchOptions,
): Promise<Response> {
  const retries = opts.retries ?? 3;
  const base = opts.baseDelayMs ?? 500;
  const host = hostOf(url);
  let lastErr: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    await politeWait(host);
    // Her denemede (opsiyonel) yeni User-Agent — bot parmak izini dağıtır.
    const userAgent = opts.rotateUserAgent === false ? USER_AGENTS[0]! : randomUserAgent();
    try {
      const res = await rawFetch(url, { ...opts, headers }, userAgent);

      // Bot koruması / erişim engeli → yeniden deneme anlamsız.
      if (res.status === 403 || res.status === 401) {
        throw new ScrapeBlockedError(
          opts.source,
          `${opts.source} erişimi engellendi (HTTP ${res.status}) — manuel doğrulama gerekli`,
          { url, status: res.status },
        );
      }

      if (res.ok) return res;

      if (RETRYABLE_STATUS.has(res.status) && attempt < retries) {
        const retryAfter = parseRetryAfter(res.headers.get('retry-after'));
        const backoff = retryAfter ?? base * 2 ** attempt + Math.floor(Math.random() * 250);
        lastErr = new IntegrationError(opts.source, `geçici hata HTTP ${res.status}`);
        await sleep(backoff);
        continue;
      }

      // Kalıcı 429 → engelleme; diğer kalıcı 4xx/5xx → entegrasyon hatası.
      if (res.status === 429) {
        throw new ScrapeBlockedError(
          opts.source,
          `${opts.source} hız limiti aşıldı (HTTP 429, ${retries + 1} deneme) — manuel doğrulama`,
          { url },
        );
      }
      throw new IntegrationError(opts.source, `${opts.source} isteği başarısız (HTTP ${res.status})`, {
        url,
        status: res.status,
      });
    } catch (err) {
      // Engelleme/entegrasyon hatalarını olduğu gibi yukarı taşı.
      if (err instanceof ScrapeBlockedError) throw err;
      if (err instanceof IntegrationError && attempt >= retries) throw err;
      // Ağ/abort hataları → backoff ile yeniden dene.
      lastErr = err;
      if (attempt < retries) {
        await sleep(base * 2 ** attempt + Math.floor(Math.random() * 250));
        continue;
      }
      throw new IntegrationError(
        opts.source,
        `${opts.source} ağ hatası: ${(err as Error).message}`,
        { url },
      );
    }
  }
  throw new IntegrationError(opts.source, `${opts.source} isteği tüm denemelerde başarısız`, {
    url,
    lastErr: (lastErr as Error)?.message,
  });
}
