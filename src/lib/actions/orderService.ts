"use server";

import { listOrders } from "@lib/data/orders";

export async function fetchUserOrders({
  page = 1,
  pageSize = 15,
}: { page?: number; pageSize?: number } = {}) {
  const offset = (page - 1) * pageSize;
  const result = await listOrders(undefined, pageSize, offset, {
    fields:
      "*items,*items.product,*items.variant,*shipping_address,*fulfillments,*payment_collections",
  });

  return { orders: result.orders ?? [], total: result.total ?? 0, page, pageSize };
}
