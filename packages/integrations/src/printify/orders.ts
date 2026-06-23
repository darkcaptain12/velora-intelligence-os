import { printifyFetch } from './client';

export interface PrintifyOrderLineItem {
  product_id: string;
  variant_id: number;
  quantity: number;
  status: string;
  metadata?: { title?: string; price?: number; variant_label?: string };
}

export interface PrintifyShipment {
  carrier?: string;
  number?: string;
  url?: string;
  delivered_at?: string | null;
}

interface PrintifyOrder {
  id: string;
  status: string;
  total_price: number;
  total_shipping: number;
  line_items: PrintifyOrderLineItem[];
  shipments?: PrintifyShipment[];
  created_at: string;
}

interface PrintifyOrdersResponse {
  data: PrintifyOrder[];
}

export interface PrintifyOrderSummary {
  id: string;
  status: string;
  /** Toplam tutar (cent'ten dönüştürülmüş, ana para birimi). */
  totalPrice: number;
  lineItems: { title: string; quantity: number; status: string }[];
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
}

/** Printify shop'undaki siparişleri (üretim/kargo durumu) döner. */
export async function listPrintifyOrders(
  brandId: string,
  shopId: number,
  limit = 50,
): Promise<PrintifyOrderSummary[]> {
  const res = await printifyFetch<PrintifyOrdersResponse>(
    brandId,
    'GET',
    `/shops/${shopId}/orders.json?limit=${limit}`,
  );
  return (res.data ?? []).map((o) => {
    const shipment = o.shipments?.[0];
    return {
      id: o.id,
      status: o.status,
      totalPrice: (o.total_price ?? 0) / 100,
      lineItems: (o.line_items ?? []).map((li) => ({
        title: li.metadata?.title ?? 'Ürün',
        quantity: li.quantity,
        status: li.status,
      })),
      trackingNumber: shipment?.number,
      trackingUrl: shipment?.url,
      createdAt: o.created_at,
    };
  });
}
