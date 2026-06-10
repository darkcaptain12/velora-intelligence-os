import { cookies } from 'next/headers';
import { brands } from '@velora/db';

/**
 * Aktif markayı çözer (çok marka altyapısı). Operatör tek aktif markayla çalışır;
 * `velora_brand` çerezi varsa o markayı, yoksa aktif/ilk markayı döner.
 * Yalnızca sunucu bağlamında (server component / server action) kullanılır.
 */
export async function getActiveBrand() {
  const selected = cookies().get('velora_brand')?.value;
  if (selected) {
    const byCookie = await brands.getById(selected);
    if (byCookie) return byCookie;
  }
  const active = await brands.getActive();
  if (!active) {
    throw new Error('Aktif marka bulunamadı. Lütfen `pnpm db:seed` çalıştırın.');
  }
  return active;
}
