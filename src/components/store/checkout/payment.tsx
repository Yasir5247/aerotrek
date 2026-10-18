"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HttpTypes } from "@aiminaabeejs/types";
import { initiatePaymentSession } from "@lib/data/cart";
import { isManual } from "@lib/constants";
import {
  getActivePaymentSession,
  isPaidWithGiftCard,
} from "@lib/checkout/payment";
import { countryPath } from "@lib/navigation/country-path";
import CheckoutStepActions from "./checkout-step-actions";
import ErrorMessage from "./error-message";
import PaymentContainer from "./payment-container";

export default function Payment({
  storeCode,
  cart,
  countryCode,
  availablePaymentMethods,
}: {
  storeCode: string;
  cart: HttpTypes.StoreCart;
  countryCode: string;
  availablePaymentMethods: HttpTypes.StorePaymentProvider[] | null;
}) {
  const router = useRouter();

  const activeSession = getActivePaymentSession(cart);
  const paidByGiftCard = isPaidWithGiftCard(cart);

  const [selected, setSelected] = useState(activeSession?.provider_id ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = availablePaymentMethods || [];

  const handleSelect = useCallback(
    async (providerId: string) => {
      setError(null);
      setSelected(providerId);
      setIsLoading(true);
      try {
        await initiatePaymentSession(storeCode, cart, {
          provider_id: providerId,
        });
        router.refresh();
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Could not start payment session"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [cart, router, storeCode]
  );

  useEffect(() => {
    if (paidByGiftCard || activeSession || !methods.length || selected) return;
    void handleSelect(methods[0].id);
  }, [
    activeSession,
    handleSelect,
    methods,
    paidByGiftCard,
    selected,
  ]);

  const goToStep = (step: string) => {
    router.push(countryPath(countryCode, `/checkout?step=${step}`), {
      scroll: false,
    });
  };

  const handleContinue = async () => {
    if (paidByGiftCard) {
      goToStep("review");
      return;
    }

    if (!selected) return;

    setIsLoading(true);
    setError(null);
    try {
      if (!activeSession || activeSession.provider_id !== selected) {
        await initiatePaymentSession(storeCode, cart, { provider_id: selected });
        router.refresh();
      }
      goToStep("review");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not continue to review");
    } finally {
      setIsLoading(false);
    }
  };

  const canContinue =
    paidByGiftCard || Boolean(selected && (activeSession || isManual(selected)));

  return (
    <section className="flex flex-col gap-8 rounded-[10px] border border-black/[0.07] bg-white/[0.92] p-4 shadow-[0_4px_18px_rgba(0,0,0,0.04)] md:p-6">
      <div>
        <h2 className="m-0 text-lg font-extrabold text-zinc-900">Payment</h2>
        <p className="m-0 mt-1 text-sm text-zinc-500">
          Choose how you would like to pay.
        </p>
      </div>

      {paidByGiftCard ? (
        <div data-testid="payment-method-summary">
          <p className="m-0 text-sm font-medium text-zinc-900">Payment method</p>
          <p className="m-0 mt-1 text-sm text-zinc-600">Gift card</p>
        </div>
      ) : !methods.length ? (
        <p className="m-0 text-sm text-zinc-500">
          No payment providers are available for this region. Enable a provider
          (e.g. manual / system default) in the store admin.
        </p>
      ) : (
        <div className="grid gap-2">
          {methods.map((method) => (
            <PaymentContainer
              key={method.id}
              paymentProviderId={method.id}
              selectedPaymentOptionId={selected}
              disabled={isLoading}
              onSelect={() => void handleSelect(method.id)}
            />
          ))}
        </div>
      )}

      <ErrorMessage
        error={error}
        data-testid="payment-method-error-message"
      />

      <CheckoutStepActions
        onBack={() => goToStep("delivery")}
        primaryLabel="Continue to review"
        primaryDisabled={!canContinue || isLoading}
        primaryLoading={isLoading}
        primaryTestId="submit-payment-button"
        onPrimary={() => void handleContinue()}
      />
    </section>
  );
}
