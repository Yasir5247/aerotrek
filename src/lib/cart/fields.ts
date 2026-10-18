/** Lighter payload for header mini-cart / layout. */
export const CART_DROPDOWN_FIELDS =
  "id, *items, total, currency_code, region_id";

/** Full cart for cart page, checkout, and promos. */
export const CART_PAGE_FIELDS =
  "*items, *region, *region.countries, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name, *shipping_address, *billing_address, subtotal, discount_total, shipping_total, shipping_subtotal, tax_total, total, currency_code";
