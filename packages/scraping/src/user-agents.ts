/**
 * Rotasyonlu masaüstü User-Agent havuzu.
 * Bot parmak izini dağıtmak için fetch ve Playwright context'lerinde kullanılır.
 * Değerler ASCII olmalı (HTTP başlık kısıtı — bkz. reddit adaptörü notu).
 */
export const USER_AGENTS: readonly string[] = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
];

/** Havuzdan rastgele bir User-Agent döner. */
export function randomUserAgent(): string {
  const i = Math.floor(Math.random() * USER_AGENTS.length);
  return USER_AGENTS[i] ?? USER_AGENTS[0]!;
}
