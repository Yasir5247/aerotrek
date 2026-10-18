import { HttpTypes } from "@aiminaabeejs/types";
import { isPaidWithGiftCard } from "./payment";

export enum CheckoutStepKey {
  ADDRESS = "address",
  DELIVERY = "delivery",
  PAYMENT = "payment",
  REVIEW = "review",
}

const STEP_ORDER: CheckoutStepKey[] = [
  CheckoutStepKey.ADDRESS,
  CheckoutStepKey.DELIVERY,
  CheckoutStepKey.PAYMENT,
  CheckoutStepKey.REVIEW,
];

function hasAddress(cart: HttpTypes.StoreCart) {
  return Boolean(
    cart.shipping_address?.address_1 &&
      cart.billing_address?.address_1 &&
      cart.email
  );
}

function hasShipping(cart: HttpTypes.StoreCart) {
  return (cart.shipping_methods?.length ?? 0) > 0;
}

function hasPaymentSession(cart: HttpTypes.StoreCart) {
  if (isPaidWithGiftCard(cart)) return true;
  return (cart.payment_collection?.payment_sessions?.length ?? 0) > 0;
}

export function isStepComplete(
  cart: HttpTypes.StoreCart,
  step: CheckoutStepKey
): boolean {
  switch (step) {
    case CheckoutStepKey.ADDRESS:
      return hasAddress(cart);
    case CheckoutStepKey.DELIVERY:
      return hasShipping(cart);
    case CheckoutStepKey.PAYMENT:
      return hasPaymentSession(cart);
    case CheckoutStepKey.REVIEW:
      return false;
    default:
      return false;
  }
}

/** Next incomplete step — used for cart → checkout CTA. */
export function getCheckoutStep(cart: HttpTypes.StoreCart): CheckoutStepKey {
  for (const step of STEP_ORDER) {
    if (step === CheckoutStepKey.REVIEW) {
      break;
    }
    if (!isStepComplete(cart, step)) {
      return step;
    }
  }
  return CheckoutStepKey.REVIEW;
}

/** Resolve allowed step from URL param + cart state (server redirect helper). */
export function resolveCheckoutStep(
  requested: string | undefined,
  cart: HttpTypes.StoreCart
): CheckoutStepKey {
  const normalized = requested?.toLowerCase();
  const isValid = STEP_ORDER.includes(normalized as CheckoutStepKey);
  const requestedStep = isValid
    ? (normalized as CheckoutStepKey)
    : CheckoutStepKey.ADDRESS;

  const requestedIndex = STEP_ORDER.indexOf(requestedStep);

  for (let i = 0; i < requestedIndex; i++) {
    const prior = STEP_ORDER[i];
    if (!isStepComplete(cart, prior)) {
      return prior;
    }
  }

  return requestedStep;
}

export function previousStepsCompleted(
  cart: HttpTypes.StoreCart,
  upTo: CheckoutStepKey
): boolean {
  const upToIndex = STEP_ORDER.indexOf(upTo);
  for (let i = 0; i < upToIndex; i++) {
    if (!isStepComplete(cart, STEP_ORDER[i])) {
      return false;
    }
  }
  return true;
}
