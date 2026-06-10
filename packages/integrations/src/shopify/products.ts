import { IntegrationError } from '@velora/shared';
import { shopifyGraphQL } from './client';

export interface CreateProductInput {
  title: string;
  descriptionHtml: string;
  tags?: string[];
  status?: 'ACTIVE' | 'DRAFT';
  seoTitle?: string;
  seoDescription?: string;
}

interface ProductCreateResult {
  productCreate: {
    product: { id: string; handle: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
}

/** Shopify'da ürün oluşturur (Admin GraphQL `productCreate`). */
export async function createProduct(
  brandId: string,
  input: CreateProductInput,
): Promise<{ id: string; handle: string }> {
  const mutation = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product { id handle }
        userErrors { field message }
      }
    }`;
  const variables = {
    input: {
      title: input.title,
      descriptionHtml: input.descriptionHtml,
      tags: input.tags ?? [],
      status: input.status ?? 'DRAFT',
      seo: { title: input.seoTitle, description: input.seoDescription },
    },
  };
  const data = await shopifyGraphQL<ProductCreateResult>(brandId, mutation, variables);
  const { product, userErrors } = data.productCreate;
  if (userErrors.length > 0) {
    throw new IntegrationError('SHOPIFY', 'Ürün oluşturulamadı', userErrors);
  }
  if (!product) {
    throw new IntegrationError('SHOPIFY', 'Ürün oluşturuldu ancak yanıt boş');
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
