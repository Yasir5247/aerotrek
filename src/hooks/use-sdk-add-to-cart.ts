"use client";

import { useCallback, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import cogoToast from "cogo-toast";
import { addToCart as addToCartAction } from "@lib/data/cart";
import { getStoreCode } from "@lib/store-code";
import { resolveCartVariationId } from "@/lib/helpers/cartVariation";
import { useCartDrawer } from "@/providers/cart-drawer-provider";

type UseSdkAddToCartOptions = {
  openDrawerOnSuccess?: boolean;
};

export function useSdkAddToCart(options: UseSdkAddToCartOptions = {}) {
  const { openDrawerOnSuccess = true } = options;
  const router = useRouter();
  const { countryCode } = useParams();
  const { openCart } = useCartDrawer();
  const [isAdding, setIsAdding] = useState(false);

  const addProductToCart = useCallback(
    async (product: any, quantity = 1) => {
      const variantId = resolveCartVariationId(product);
      if (!variantId) {
        cogoToast.error("Could not resolve product variant", {
          position: "top-center",
        });
        return false;
      }

      const resolvedCountry =
        String(countryCode || process.env.NEXT_PUBLIC_DEFAULT_REGION || "mv").toLowerCase();

      setIsAdding(true);
      try {
        await addToCartAction({
          storeCode: getStoreCode(),
          variantId,
          quantity,
          countryCode: resolvedCountry,
        });
        cogoToast.success("Added to cart", { position: "top-center" });
        router.refresh();

        if (
          openDrawerOnSuccess &&
          typeof window !== "undefined" &&
          window.matchMedia("(min-width: 1024px)").matches
        ) {
          openCart();
        }

        return true;
      } catch (error: any) {
        cogoToast.error(error?.message || "Could not add to cart", {
          position: "top-center",
        });
        return false;
      } finally {
        setIsAdding(false);
      }
    },
    [countryCode, openCart, openDrawerOnSuccess, router]
  );

  return { addProductToCart, isAdding };
}
