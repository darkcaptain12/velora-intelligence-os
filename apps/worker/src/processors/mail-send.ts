import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { emails, prisma } from '@velora/db';
import { sendEmail } from '@velora/integrations';
import { logger } from '../logger';

/**
 * Mail gönderim işi: EmailMessage → SMTP gönder → SENT/FAILED.
 * Alıcı, ilişkili tedarikçinin e-postasıdır (Tedarikçi İletişimi).
 */
export async function processMailSend(job: Job<JobDataMap['mailSend']>) {
  const { emailId } = job.data;
  const email = await prisma.emailMessage.findUnique({
    where: { id: emailId },
    include: { supplier: true },
  });
  if (!email) throw new Error(`Mail bulunamadı: ${emailId}`);

  const to = email.supplier?.email;
  if (!to) {
    await emails.markFailed(emailId);
    throw new Error('Alıcı e-postası yok (tedarikçinin e-postası tanımlı değil)');
  }

  try {
    const messageId = await sendEmail({ to, subject: email.subject, html: email.body });
    await emails.markSent(emailId);
    logger.info({ emailId, to, messageId }, 'mail gönderildi');
    return { messageId };
  } catch (err) {
    await emails.markFailed(emailId);
    logger.error({ emailId, err: (err as Error).message }, 'mail gönderilemedi');
    throw err;
  }
}
