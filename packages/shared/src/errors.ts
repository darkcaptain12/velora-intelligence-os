/** Uygulama genelinde tutarlı hata hiyerarşisi. */
export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(message: string, code = 'APP_ERROR', statusCode = 500, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Doğrulama hatası', details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Kayıt bulunamadı') {
    super(message, 'NOT_FOUND', 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Yetkisiz') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

/** Dış servis (Shopify/Meta/AI/SMTP) entegrasyon hatası. */
export class IntegrationError extends AppError {
  readonly provider: string;
  constructor(provider: string, message: string, details?: unknown) {
    super(message, 'INTEGRATION_ERROR', 502, details);
    this.provider = provider;
  }
}

/** Acil durum koruması / guardrail ihlali. */
export class GuardrailError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'GUARDRAIL_VIOLATION', 403, details);
  }
}

/**
 * Kaynak erişimi engellendi: CAPTCHA, bot koruması, 403/429 (kalıcı) veya login duvarı.
 * Bu hata otomatik yeniden denenmez; worker bunu yakalayıp Görev Merkezi'ne
 * "manuel doğrulama" görevi açar (CLAUDE.md: API > Playwright > Kullanıcı onayı).
 */
export class ScrapeBlockedError extends AppError {
  readonly provider: string;
  readonly manualVerification = true as const;
  constructor(provider: string, message: string, details?: unknown) {
    super(message, 'SCRAPE_BLOCKED', 403, details);
    this.provider = provider;
  }
}
