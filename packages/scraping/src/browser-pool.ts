import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import type { ResearchSource } from '@velora/shared';
import { ScrapeBlockedError } from '@velora/shared';
import { randomUserAgent } from './user-agents';

/**
 * Paylaşılan headless tarayıcı havuzu (API'si olmayan kaynak adaptörleri için).
 * Tarayıcı tek sefer başlatılır; her iş izole bir context'te koşar.
 *
 * Yetenekler (CLAUDE.md §8): rotasyonlu User-Agent, opsiyonel proxy, insan benzeri
 * gecikme, bot-koruması (CAPTCHA/login duvarı) tespiti → `ScrapeBlockedError`.
 *
 * NOT: Çalışması için tarayıcı binary'leri gerekir →
 *   `pnpm --filter @velora/scraping exec playwright install chromium`
 * Reddit/HN/Etsy adaptörleri tarayıcı GEREKTİRMEZ (fetch tabanlı).
 */
let browser: Browser | null = null;
let launchedProxy: string | undefined;

/** Playwright `proxy` nesnesini env/parametre URL'sinden üretir. */
function resolveProxy(proxyUrl?: string):
  | { server: string; username?: string; password?: string }
  | undefined {
  const raw = proxyUrl || process.env.SCRAPER_PROXY_URL || process.env.HTTPS_PROXY || '';
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    const server = `${u.protocol}//${u.host}`;
    return {
      server,
      ...(u.username ? { username: decodeURIComponent(u.username) } : {}),
      ...(u.password ? { password: decodeURIComponent(u.password) } : {}),
    };
  } catch {
    // Kullanıcı/parola içermeyen düz "host:port" formatı.
    return { server: raw };
  }
}

export async function getBrowser(proxyUrl?: string): Promise<Browser> {
  const proxy = resolveProxy(proxyUrl);
  const proxyKey = proxy?.server;
  // Proxy değiştiyse tarayıcıyı yeniden başlat.
  if (browser && browser.isConnected() && launchedProxy === proxyKey) return browser;
  if (browser) await browser.close().catch(() => undefined);
  browser = await chromium.launch({
    headless: true,
    ...(proxy ? { proxy } : {}),
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
  });
  launchedProxy = proxyKey;
  return browser;
}

export interface PageOptions {
  proxyUrl?: string;
  userAgent?: string;
  locale?: string;
}

/** İzole bir sayfada çalışır; context'i her durumda kapatır. */
export async function withPage<T>(
  fn: (page: Page, context: BrowserContext) => Promise<T>,
  opts: PageOptions = {},
): Promise<T> {
  const b = await getBrowser(opts.proxyUrl);
  const context = await b.newContext({
    userAgent: opts.userAgent ?? randomUserAgent(),
    locale: opts.locale ?? 'en-US',
    viewport: { width: 1366, height: 900 },
  });
  // Basit otomasyon parmak izi azaltma + esbuild/tsx `keepNames` şimi.
  // tsx, evaluate fonksiyonları içindeki adlandırılmış closure'ları `__name(fn, "x")`
  // ile sarar; Playwright yalnızca fonksiyon gövdesini sayfaya taşıdığından `__name`
  // tarayıcıda tanımsız kalır. Bu şim onu kimlik fonksiyonuyla karşılar.
  await context.addInitScript(() => {
    const g = globalThis as unknown as { __name?: (fn: unknown, name?: string) => unknown };
    if (typeof g.__name !== 'function') g.__name = (fn: unknown) => fn;
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  const page = await context.newPage();
  try {
    return await fn(page, context);
  } finally {
    await context.close();
  }
}

/** İnsan benzeri rastgele gecikme (ms). */
export function humanDelay(min = 400, max = 1200): Promise<void> {
  const ms = min + Math.floor(Math.random() * Math.max(0, max - min));
  return new Promise((r) => setTimeout(r, ms));
}

const BLOCK_MARKERS = [
  'captcha',
  'are you a human',
  'enter the characters you see',
  'unusual traffic',
  'verify you are human',
  'access denied',
  'robot check',
  'press & hold',
  'tiklayin ve basili tutun',
  'log in to continue',
  'sign up to see more',
];

/**
 * Sayfanın bot-koruması/CAPTCHA/login duvarına takılıp takılmadığını sezgisel kontrol eder.
 * Takıldıysa `ScrapeBlockedError` fırlatır (worker → manuel doğrulama görevi).
 */
export async function assertNotBlocked(
  page: Page,
  source: ResearchSource,
): Promise<void> {
  let body = '';
  try {
    body = (await page.content()).toLowerCase();
  } catch {
    return;
  }
  const hit = BLOCK_MARKERS.find((m) => body.includes(m));
  if (hit) {
    throw new ScrapeBlockedError(
      source,
      `${source} bot korumasına takıldı ("${hit}") — manuel doğrulama gerekli`,
      { url: page.url() },
    );
  }
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close().catch(() => undefined);
    browser = null;
    launchedProxy = undefined;
  }
}
