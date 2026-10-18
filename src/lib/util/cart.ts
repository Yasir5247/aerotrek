import { HttpTypes } from "@aiminaabeejs/types";

export function sortCartItems<T extends { created_at?: string | Date | null }>(
  items?: T[] | null
): T[] {
  if (!items?.length) return [];
  return [...items].sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return aTime - bTime;
  });
}

export function getCartItemCount(cart?: HttpTypes.StoreCart | null) {
  if (!cart?.items?.length) return 0;
  return cart.items.reduce(
    (sum, item) => sum + Math.max(Number(item.quantity) || 0, 0),
    0
  );
}

export function getVariantCartQuantity(
  cart?: HttpTypes.StoreCart | null,
  variantId?: string | null
) {
  if (!cart?.items?.length || !variantId) return 0;

  return cart.items.reduce((sum, item) => {
    const itemVariantId = item.variant_id || item.variant?.id;
    if (itemVariantId !== variantId) return sum;
    return sum + Math.max(Number(item.quantity) || 0, 0);
  }, 0);
}
