"use client";

import clsx from "clsx";
import { useSdkAddToCart } from "@/hooks/use-sdk-add-to-cart";

function canQuickAdd(product?: any) {
  if (!product || product.affiliateLink) return false;
  if (!product.stock || product.stock <= 0) return false;

  const variations = product.variation || [];
  if (variations.length > 1) return false;
  if (variations.length === 1 && (variations[0].size?.length ?? 0) > 1) {
    return false;
  }

  return true;
}

export default function ProductQuickAddButton({
  product,
  compact = false,
}: {
  product: any;
  compact?: boolean;
}) {
  const { addProductToCart, isAdding } = useSdkAddToCart();

  if (!canQuickAdd(product)) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => addProductToCart(product, 1)}
      disabled={isAdding}
      className={clsx(
        "absolute bottom-2 left-2 right-2 z-[2] rounded-rounded bg-grey-90 text-center font-semibold uppercase tracking-[0.08em] text-white opacity-0 transition-all duration-200 hover:bg-black group-hover:opacity-100",
        compact ? "min-h-[32px] px-2 py-1.5 text-[10px]" : "min-h-[40px] px-3 py-2 text-[11px]",
        isAdding && "opacity-100"
      )}
    >
      {isAdding ? "Adding…" : "Add to cart"}
    </button>
  );
}
