"use client";

import { useRouter } from "next/navigation";
import { HttpTypes } from "@aiminaabeejs/types";
import { isPaidWithGiftCard } from "@lib/checkout/payment";
import { countryPath } from "@lib/navigation/country-path";
import { formatCartMoney } from "@lib/util/money";
import { getActivePaymentSession } from "@lib/checkout/payment";
import CheckoutAddress, { addressesMatch } from "./checkout-address";
import PaymentMethodInfo from "./payment-method-info";
import PaymentButton from "./payment-button";
import Button from "@/components/ui/Button";

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-zinc-200 pb-6 last:border-b-0 last:pb-0">
      <h3 className="m-0 mb-2 text-base font-semibold text-zinc-900">{title}</h3>
      {children}
    </div>
  );
}

export default function Review({
  storeCode,
  cart,
  countryCode,
}: {
  storeCode: string;
  cart: HttpTypes.StoreCart;
  countryCode: string;
}) {
  const router = useRouter();
  const paidByGiftCard = isPaidWithGiftCard(cart);
  const paymentSession = getActivePaymentSession(cart);
  const shippingMethod = cart.shipping_methods?.[0];
  const sameBilling = addressesMatch(
    cart.shipping_address,
    cart.billing_address
  );

  const goToStep = (step: string) => {
    router.push(countryPath(countryCode, `/checkout?step=${step}`), {
      scroll: false,
    });
  };

  return (
    <section className="flex flex-col gap-8 rounded-[10px] border border-black/[0.07] bg-white/[0.92] p-4 shadow-[0_4px_18px_rgba(0,0,0,0.04)] md:p-6">
      <div>
        <h2 className="m-0 text-lg font-extrabold text-zinc-900">Review</h2>
        <p className="m-0 mt-1 text-sm text-zinc-500">
          Confirm your order details before placing your order.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <ReviewSection title="Shipping address">
          <CheckoutAddress address={cart.shipping_address} />
          {cart.email ? (
            <p className="m-0 mt-2 text-sm text-zinc-600">{cart.email}</p>
          ) : null}
        </ReviewSection>

        <ReviewSection title="Shipping method">
          {shippingMethod ? (
            <div className="flex items-center justify-between gap-3 text-sm text-zinc-600">
              <span>{shippingMethod.name || "Delivery"}</span>
              <span className="font-semibold text-zinc-900">
                {formatCartMoney(
                  shippingMethod.amount as number,
                  cart.currency_code
                )}
              </span>
            </div>
          ) : (
            <p className="m-0 text-sm text-zinc-500">Not selected</p>
          )}
        </ReviewSection>

        <ReviewSection title="Billing address">
          {sameBilling ? (
            <p className="m-0 text-sm text-zinc-600">Same as shipping address</p>
          ) : (
            <CheckoutAddress address={cart.billing_address} />
          )}
        </ReviewSection>

        <ReviewSection title="Payment method">
          {paidByGiftCard ? (
            <p className="m-0 text-sm text-zinc-600">Gift card</p>
          ) : (
            <PaymentMethodInfo session={paymentSession} />
          )}
        </ReviewSection>
      </div>

      <p className="m-0 text-sm leading-relaxed text-zinc-600">
        When you place your order, your payment will be authorized for the total
        amount shown. You will receive a confirmation email once your order is
        placed.
      </p>

      <div className="flex items-start gap-4">
        <Button type="button" variant="checkoutSecondary" size="checkout" onClick={() => goToStep("payment")}>
          Back
        </Button>
        <PaymentButton
          storeCode={storeCode}
          cart={cart}
          countryCode={countryCode}
        />
      </div>
    </section>
  );
}
