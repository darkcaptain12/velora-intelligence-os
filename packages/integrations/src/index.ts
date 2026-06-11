export { shopifyGraphQL } from './shopify/client';
export { verifyShopifyWebhook } from './shopify/webhooks';
export {
  createProduct,
  fetchProducts,
  fetchProductsForHealth,
  type CreateProductInput,
  type ShopifyProductNode,
} from './shopify/products';
export { stageUploadImage } from './shopify/upload';
export { updateShopPolicies, createLegalPage, type ShopPolicyInput } from './shopify/policies';
export {
  listCampaigns,
  setCampaignStatus,
  setCampaignBudget,
  fetchCampaignInsights,
  type MetaCampaign,
  type MetaInsight,
} from './meta/client';
export { sendEmail } from './email/smtp';
