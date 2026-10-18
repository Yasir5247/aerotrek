import { HttpTypes } from "@aiminaabeejs/types";

export function getActivePaymentSession(cart?: HttpTypes.StoreCart | null) {
  if (!cart?.payment_collection?.payment_sessions?.length) {
    return null;
  }

  return (
    cart.payment_collection.payment_sessions.find(
      (session) => session.status === "pending"
    ) ?? cart.payment_collection.payment_sessions[0]
  );
}

export function isPaidWithGiftCard(
  cartOrOrder?: HttpTypes.StoreCart | HttpTypes.StoreOrder | null
) {
  if (!cartOrOrder) return false;

  const giftCards =
    "gift_cards" in cartOrOrder && Array.isArray(cartOrOrder.gift_cards)
      ? cartOrOrder.gift_cards
      : [];

  return giftCards.length > 0 && Number(cartOrOrder.total) === 0;
}
