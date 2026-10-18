import { getDiscountPrice, getSelectedVariantPrice } from "./product";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value?: any) {
  return typeof value === "string" && UUID_RE.test(value);
}

/** SDK variant ids are typically `variant_…`, not UUIDs. */
export function isResolvableVariantId(value?: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Resolve catalog product_variations.id for a cart line.
 * Never use cartItemId — that is a client-only line key.
 */
export function resolveCartVariationId(item?: any) {
  if (!item) return null;

  if (isResolvableVariantId(item.variationId)) return item.variationId;
  if (isResolvableVariantId(item.variation_id)) return item.variation_id;

  const color = item.selectedProductColor || null;
  const size = item.selectedProductSize || null;
  const groups = Array.isArray(item.variation) ? item.variation : [];

  for (const group of groups) {
    if (color && group.color && group.color !== color) continue;
    const sizes = Array.isArray(group.size) ? group.size : [];
    for (const entry of sizes) {
      if (size && entry.name !== size) continue;
      if (isResolvableVariantId(entry.variationId)) return entry.variationId;
    }
  }

  // Fallback: first active size on the matching color (or first color).
  const preferred =
    (color && groups.find((g?: any) => g.color === color)) || groups[0];
  const firstSize = preferred?.size?.[0];
  if (isResolvableVariantId(firstSize?.variationId)) return firstSize.variationId;

  return null;
}

/** Attach variationId (+ optional price override) from selected color/size before add-to-cart. */
export function withSelectedVariation(product?: any, color?: any, size?: any) {
  const selectedProductColor = color ?? product?.selectedProductColor ?? null;
  const selectedProductSize = size ?? product?.selectedProductSize ?? null;
  const resolved = {
    ...product,
    selectedProductColor,
    selectedProductSize,
  };
  const variationId = resolveCartVariationId(resolved);

  let priceOverride = product?.priceOverride ?? product?.price_override ?? null;
  const groups = Array.isArray(product?.variation) ? product.variation : [];
  for (const group of groups) {
    if (selectedProductColor && group.color && group.color !== selectedProductColor) {
      continue;
    }
    const sizes = Array.isArray(group.size) ? group.size : [];
    for (const entry of sizes) {
      if (selectedProductSize && entry.name !== selectedProductSize) continue;
      if (entry.priceOverride != null && Number.isFinite(Number(entry.priceOverride))) {
        priceOverride = Number(entry.priceOverride);
      }
      break;
    }
  }

  return {
    ...resolved,
    variationId: variationId || undefined,
    priceOverride:
      priceOverride != null && Number.isFinite(Number(priceOverride))
        ? Number(priceOverride)
        : undefined,
  };
}

/**
 * Unit price for a cart line:
 * variation price_override if set, else product price with percent discount.
 */
export function getCartLineUnitPrice(item?: any) {
  if (!item) return 0;
  if (item.priceOverride != null && Number.isFinite(Number(item.priceOverride))) {
    return Math.round(Number(item.priceOverride) * 100) / 100;
  }

  const variantPrice = getSelectedVariantPrice(
    item,
    item.selectedProductColor,
    item.selectedProductSize
  );
  const base = variantPrice > 0 ? variantPrice : Number(item.price);

  const discounted = getDiscountPrice(base, item.discount);
  if (discounted != null) return discounted;
  return Number.isFinite(base) ? Math.round(base * 100) / 100 : 0;
}
