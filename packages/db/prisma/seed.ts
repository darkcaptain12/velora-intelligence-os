import bcrypt from 'bcryptjs';
import { serverEnv } from '@velora/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const env = serverEnv();

  // --- İlk operatör (OWNER) ---
  const passwordHash = await bcrypt.hash(env.SEED_OWNER_PASSWORD, 10);
  const user = await prisma.user.upsert({
    where: { email: env.SEED_OWNER_EMAIL },
    update: {},
    create: {
      email: env.SEED_OWNER_EMAIL,
      name: 'Operatör',
      passwordHash,
      role: 'OWNER',
    },
  });
  console.log(`✓ Operatör hazır: ${user.email}`);

  // --- Aktif marka (şimdilik tek) ---
  const brand = await prisma.brand.upsert({
    where: { slug: env.SEED_BRAND_SLUG },
    update: {},
    create: {
      name: env.SEED_BRAND_NAME,
      slug: env.SEED_BRAND_SLUG,
      active: true,
      currency: 'TRY',
    },
  });
  console.log(`✓ Marka hazır: ${brand.name} (${brand.slug})`);

  // --- Varsayılan harcama limitleri (Acil Durum Koruması temeli) ---
  const limits: { period: 'DAILY' | 'WEEKLY' | 'MONTHLY'; amount: number }[] = [
    { period: 'DAILY', amount: 500 },
    { period: 'WEEKLY', amount: 3000 },
    { period: 'MONTHLY', amount: 10000 },
  ];
  for (const limit of limits) {
    await prisma.spendLimit.upsert({
      where: { brandId_period: { brandId: brand.id, period: limit.period } },
      update: {},
      create: { brandId: brand.id, period: limit.period, amount: limit.amount, active: true },
    });
  }
  console.log(`✓ Varsayılan harcama limitleri eklendi`);

  // --- Varsayılan ayarlar ---
  const settings: { key: string; value: unknown }[] = [
    { key: 'autonomy.level', value: 1 },
    { key: 'ads.autoMode', value: false },
    { key: 'ai.textProvider', value: 'OPENAI' },
    { key: 'ai.imageProvider', value: 'FAL' },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { brandId_key: { brandId: brand.id, key: s.key } },
      update: {},
      create: { brandId: brand.id, key: s.key, value: s.value as object },
    });
  }
  console.log(`✓ Varsayılan ayarlar eklendi`);

  console.log('\nSeed tamamlandı. Giriş: %s', env.SEED_OWNER_EMAIL);
}

main()
  .catch((e) => {
    console.error('Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
