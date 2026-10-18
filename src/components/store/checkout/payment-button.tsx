"use client";

import { useState } from "react";
import { HttpTypes } from "@aiminaabeejs/types";
import { placeOrder } from "@lib/data/cart";
import { isManual } from "@lib/constants";
import {
  getActivePaymentSession,
  isPaidWithGiftCard,
} from "@lib/checkout/payment";
import ErrorMessage from "./error-message";
import Button from "@/components/ui/Button";

export default function PaymentButton({
  storeCode,
  cart,
  countryCode,
  className = "",
}: {
  storeCode: string;
  cart: HttpTypes.StoreCart;
  countryCode: string;
  className?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paidByGiftCard = isPaidWithGiftCard(cart);
  const notReady =
    !cart?.shipping_address ||
    !cart?.billing_address ||
    !cart?.email ||
    (cart.shipping_methods?.length ?? 0) < 1;

  const session = getActivePaymentSession(cart);
  const canPlace = paidByGiftCard || isManual(session?.provider_id);

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await placeOrder(storeCode, undefined, countryCode);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not place order");
      setSubmitting(false);
    }
  };

  if (!paidByGiftCard && !session) {
    return (
      <Button
        type="button"
        disabled
        data-testid="place-order-button"
        variant="checkoutPrimary"
        size="checkout"
        fullWidth
        className={className}
      >
        Select a payment method
      </Button>
    );
  }

  if (!canPlace) {
    return (
      <p className="m-0 flex-1 text-sm text-zinc-500">
        Only manual payment is supported in AeroTrek checkout. Choose the manual
        payment provider to continue.
      </p>
    );
  }

  return (
    <div className={`flex-1 ${className}`}>
      <Button
        type="button"
        disabled={notReady || submitting}
        onClick={handlePlaceOrder}
        data-testid="place-order-button"
        variant="checkoutPrimary"
        size="checkout"
        fullWidth
      >
        {submitting ? "Placing order…" : "Place order"}
      </Button>
      <ErrorMessage error={error} />
    </div>
  );
}
