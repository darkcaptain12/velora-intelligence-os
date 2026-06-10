export { shopifyGraphQL } from './shopify/client';
export { verifyShopifyWebhook } from './shopify/webhooks';
export { createProduct, fetchProductsForHealth, type CreateProductInput } from './shopify/products';
export {
  listCampaigns,
  setCampaignStatus,
  setCampaignBudget,
  fetchCampaignInsights,
  type MetaCampaign,
  type MetaInsight,
} from './meta/client';
export { sendEmail } from './email/smtp';
