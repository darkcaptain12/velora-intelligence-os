export { shopifyGraphQL } from './shopify/client';
export { verifyShopifyWebhook } from './shopify/webhooks';
export {
  createProduct,
  fetchProducts,
  fetchProductsForHealth,
  updateProductSeoAndContent,
  type CreateProductInput,
  type ShopifyProductNode,
  type UpdateProductSeoInput,
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

// Printify (print-on-demand)
export { printifyFetch } from './printify/client';
export { listShops, resolveShopId, type PrintifyShop } from './printify/shops';
export {
  listBlueprints,
  listPrintProviders,
  listVariants,
  resolveDefaults,
  type Blueprint,
  type PrintProvider,
  type PrintifyDefaults,
} from './printify/catalog';
export { uploadImage, type PrintifyImage } from './printify/uploads';
export {
  createPrintifyProduct,
  updateVariantPrices,
  publishPrintifyProduct,
  getPrintifyProduct,
  type PrintifyProduct,
  type PrintifyVariant,
  type CreatePrintifyInput,
} from './printify/products';
