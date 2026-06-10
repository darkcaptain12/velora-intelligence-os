import nodemailer from 'nodemailer';
import { serverEnv } from '@velora/config';

/**
 * SMTP mail gönderimi (Nodemailer). Geliştirmede Mailhog (localhost:1025, auth yok).
 * Üretimde gerçek SMTP sağlayıcısı (auth ile).
 */
export async function sendEmail(input: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}): Promise<string> {
  const env = serverEnv();
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
  const info = await transport.sendMail({
    from: env.SMTP_FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text ?? input.html?.replace(/<[^>]+>/g, ''),
  });
  return info.messageId;
}
