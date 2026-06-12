export { prisma } from './client';
export { credentials } from './credentials';

// Domain veri-erişim servisleri
export { brands } from './services/brands';
export { settings } from './services/settings';
export { audit, type AuditInput } from './services/audit';
export { tasks } from './services/tasks';
export { spendLimits } from './services/spendLimits';
export { products } from './services/products';
export { adCampaigns, adMetrics, type AdMetricInput } from './services/ads';
export {
  finance,
  operationScores,
  type SnapshotData,
  type OperationScoreData,
} from './services/finance';
export { competitors, suppliers, emails, trends, creativeTests } from './services/crm';
export { opportunities } from './services/opportunities';
export { backups } from './services/backups';

// Prisma'nın ürettiği tüm tip ve enum'ları @velora/db üzerinden yeniden dışa aktar.
// Böylece diğer paketler doğrudan @prisma/client'a bağımlı olmaz.
export * from '@prisma/client';
