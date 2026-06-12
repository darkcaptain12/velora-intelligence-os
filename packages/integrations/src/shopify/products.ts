import { IntegrationError } from '@velora/shared';
import { shopifyGraphQL } from './client';

export interface CreateProductInput {
  title: string;
  descriptionHtml: string;
  tags?: string[];
  status?: 'ACTIVE' | 'DRAFT';
  seoTitle?: string;
  seoDescription?: string;
  price?: number;
  /** Herkese açık görsel URL'leri (tasarım + mockup'lar). Shopify media olarak eklenir. */
  images?: string[];
}

interface ProductCreateResult {
  productCreate: {
    product: { id: string; handle: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
}

/** Shopify'da ürün oluşturur — çoklu görsel (media) + opsiyonel fiyatlı varyant. */
export async function createProduct(
  brandId: string,
  input: CreateProductInput,
): Promise<{ id: string; handle: string }> {
  const mutation = `
    mutation productCreate($input: ProductInput!, $media: [CreateMediaInput!]) {
      productCreate(input: $input, media: $media) {
        product { id handle }
        userErrors { field message }
      }
    }`;
  const media = (input.images ?? [])
    .filter(Boolean)
    .map((url) => ({ originalSource: url, mediaContentType: 'IMAGE' }));

  const variables = {
    input: {
      title: input.title,
      descriptionHtml: input.descriptionHtml,
      tags: input.tags ?? [],
      status: input.status ?? 'DRAFT',
      seo: { title: input.seoTitle, description: input.seoDescription },
    },
    media,
  };
  const data = await shopifyGraphQL<ProductCreateResult>(brandId, mutation, variables);
  const { product, userErrors } = data.productCreate;
  if (userErrors.length > 0) {
    throw new IntegrationError('SHOPIFY', 'Ürün oluşturulamadı', userErrors);
  }
  if (!product) {
    throw new IntegrationError('SHOPIFY', 'Ürün oluşturuldu ancak yanıt boş');
  }

  // Fiyat: varsayılan varyantı güncelle (varsa)
  if (input.price != null) {
    await setDefaultVariantPrice(brandId, product.id, input.price).catch(() => undefined);
  }
  return product;
}

async function setDefaultVariantPrice(brandId: string, productId: string, price: number): Promise<void> {
  const q = `query($id: ID!){ product(id:$id){ variants(first:1){ nodes { id } } } }`;
  const d = await shopifyGraphQL<{ product: { variants: { nodes: { id: string }[] } } }>(brandId, q, { id: productId });
  const variantId = d.product?.variants?.nodes?.[0]?.id;
  if (!variantId) return;
  const m = `mutation($pid: ID!, $variants: [ProductVariantsBulkInput!]!){
    productVariantsBulkUpdate(productId:$pid, variants:$variants){ userErrors{ message } } }`;
  await shopifyGraphQL(brandId, m, { pid: productId, variants: [{ id: variantId, price: price.toFixed(2) }] });
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  status: string;
  featuredImage: { url: string } | null;
  variants: { nodes: { price: string }[] };
}

/** Mağazadaki ürünleri çeker (sisteme senkron için). */
export async function fetchProducts(brandId: string, first = 100): Promise<ShopifyProductNode[]> {
  const query = `
    query syncProducts($first: Int!) {
      products(first: $first, sortKey: UPDATED_AT, reverse: true) {
        nodes {
          id title handle status
          featuredImage { url }
          variants(first: 1) { nodes { price } }
        }
      }
    }`;
  const data = await shopifyGraphQL<{ products: { nodes: ShopifyProductNode[] } }>(brandId, query, { first });
  return data.products.nodes;
}

export interface UpdateProductSeoInput {
  descriptionHtml?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  handle?: string;
}

interface ProductUpdateResult {
  productUpdate: {
    product: { id: string; handle: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
}

/** Shopify üründe SEO + içerik + etiket + handle günceller (Product Intelligence Engine). */
export async function updateProductSeoAndContent(
  brandId: string,
  shopifyProductId: string,
  input: UpdateProductSeoInput,
): Promise<{ id: string; handle: string }> {
  const mutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product { id handle }
        userErrors { field message }
      }
    }`;
  const variables = {
    input: {
      id: shopifyProductId,
      ...(input.descriptionHtml != null ? { descriptionHtml: input.descriptionHtml } : {}),
      ...(input.tags ? { tags: input.tags } : {}),
      ...(input.handle ? { handle: input.handle } : {}),
      ...(input.seoTitle != null || input.seoDescription != null
        ? { seo: { title: input.seoTitle, description: input.seoDescription } }
        : {}),
    },
  };
  const data = await shopifyGraphQL<ProductUpdateResult>(brandId, mutation, variables);
  const { product, userErrors } = data.productUpdate;
  if (userErrors.length > 0) {
    throw new IntegrationError('SHOPIFY', 'Ürün güncellenemedi', userErrors);
  }
  if (!product) {
    throw new IntegrationError('SHOPIFY', 'Ürün güncellendi ancak yanıt boş');
  }
  return product;
}

interface ProductsHealthResult {
  products: {
    nodes: {
      id: string;
      title: string;
      handle: string;
      featuredImage: { url: string } | null;
      seo: { title: string | null; description: string | null };
    }[];
  };
}

/** SEO/görsel sağlık taraması için ürünleri getirir. */
export async function fetchProductsForHealth(
  brandId: string,
  first = 50,
): Promise<ProductsHealthResult['products']['nodes']> {
  const query = `
    query healthProducts($first: Int!) {
      products(first: $first) {
        nodes {
          id title handle
          featuredImage { url }
          seo { title description }
        }
      }
    }`;
  const data = await shopifyGraphQL<ProductsHealthResult>(brandId, query, { first });
  return data.products.nodes;
}
