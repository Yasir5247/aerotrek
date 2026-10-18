export function getOrderItems(order?: any) {
  return order?.items || order?.order_items || [];
}

export function getOrderItemName(item?: any) {
  return (
    item?.product?.title ||
    item?.title ||
    item?.product_name ||
    item?.variant?.title ||
    item?.sku ||
    "Product"
  );
}

export function getOrderItemImage(item?: any) {
  const product = item?.product || item?.products;
  const image =
    item?.thumbnail ||
    product?.thumbnail ||
    product?.image?.[0] ||
    item?.variant?.thumbnail ||
    null;
  if (Array.isArray(image)) return image[0] || null;
  return image || null;
}

export function getOrderItemProductId(item?: any) {
  return item?.product_id || item?.product?.id || item?.products?.id || null;
}

export function getOrderDisplayId(order?: any) {
  return order?.display_id || order?.order_number || String(order?.id || "").slice(0, 8).toUpperCase();
}

export function getOrderShipTo(order?: any) {
  const address = order?.shipping_address;
  if (address) {
    return [address.address_1, address.city, address.province, address.country_code]
      .filter(Boolean)
      .join(", ");
  }

  return [order?.ship_island, order?.ship_atoll, order?.ship_country].filter(Boolean).join(", ");
}

export function formatOrderDate(value?: any, withTime: any = false) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

export function formatMoney(amount?: any, currencyCode?: any, fallbackSymbol?: any) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  const formatted = value.toFixed(2);
  if (currencyCode) return `${String(currencyCode).toUpperCase()} ${formatted}`;
  return `${fallbackSymbol || ""}${formatted}`;
}

export function getCustomerAddresses(customer?: any) {
  const list = customer?.addresses || customer?.shipping_addresses || [];
  return Array.isArray(list) ? list : [];
}
