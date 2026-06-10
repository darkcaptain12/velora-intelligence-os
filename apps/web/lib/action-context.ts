import { auth } from '@/lib/auth';
import { getActiveBrand } from '@/lib/brand';
import { UnauthorizedError } from '@velora/shared';

/** Server action'lar için ortak bağlam: oturum doğrulama + aktif marka + actor. */
export async function actionContext() {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  const brand = await getActiveBrand();
  return {
    session,
    brandId: brand.id,
    actor: session.user.email ?? session.user.id,
  };
}
