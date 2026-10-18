"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HttpTypes } from "@aiminaabeejs/types";
import { setShippingMethod } from "@lib/data/cart";
import { calculatePriceForShippingOption } from "@lib/data/fulfillment";
import { countryPath } from "@lib/navigation/country-path";
import { formatCartMoney } from "@lib/util/money";
import CheckoutStepActions from "./checkout-step-actions";
import ErrorMessage from "./error-message";
import ShippingItemSelector from "./shipping-item-selector";
import CheckoutRadio, { selectionCardClass } from "./checkout-radio";

const PICKUP_OPTION_ON = "__PICKUP_ON";
const PICKUP_OPTION_OFF = "__PICKUP_OFF";

type CartShippingOption = HttpTypes.StoreCartShippingOption & {
  insufficient_inventory?: boolean;
  service_zone?: {
    fulfillment_set?: {
      type?: string;
      location?: {
        address?: HttpTypes.StoreCartAddress;
      };
    };
  };
};

function formatAddress(address?: HttpTypes.StoreCartAddress) {
  if (!address) return "";

  const parts = [
    address.address_1,
    address.address_2,
    [address.postal_code, address.city].filter(Boolean).join(" "),
    address.province,
    address.country_code?.toUpperCase(),
  ].filter(Boolean);

  return parts.join(", ");
}

export default function Shipping({
  storeCode,
  cart,
  countryCode,
  availableShippingMethods,
  shippingOptionsError = null,
}: {
  storeCode: string;
  cart: HttpTypes.StoreCart;
  countryCode: string;
  availableShippingMethods: CartShippingOption[] | null;
  shippingOptionsError?: string | null;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF);
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  );

  const methods = useMemo(
    () => availableShippingMethods ?? [],
    [availableShippingMethods]
  );

  const shippingMethods = useMemo(
    () =>
      methods.filter(
        (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
      ),
    [methods]
  );

  const pickupMethods = useMemo(
    () =>
      methods.filter(
        (sm) => sm.service_zone?.fulfillment_set?.type === "pickup"
      ),
    [methods]
  );

  const hasPickupOptions = pickupMethods.length > 0;
  const hasDeliveryOptions =
    shippingMethods.length > 0 || pickupMethods.length > 0;

  useEffect(() => {
    setShippingMethodId(
      cart.shipping_methods?.at(-1)?.shipping_option_id || null
    );
  }, [cart.shipping_methods]);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingPrices(true);

    const calculatedOptions = methods.filter(
      (sm) => sm.price_type === "calculated"
    );

    if (!calculatedOptions.length) {
      setCalculatedPricesMap({});
      setIsLoadingPrices(false);
      return;
    }

    Promise.allSettled(
      calculatedOptions.map((option) =>
        calculatePriceForShippingOption(storeCode, option.id, cart.id)
      )
    ).then((results) => {
      if (cancelled) return;

      const pricesMap: Record<string, number> = {};
      results.forEach((result) => {
        if (result.status !== "fulfilled" || !result.value) return;
        const option = result.value;
        if (option.id && typeof option.amount === "number") {
          pricesMap[option.id] = option.amount;
        }
      });

      setCalculatedPricesMap(pricesMap);
      setIsLoadingPrices(false);
    });

    return () => {
      cancelled = true;
    };
  }, [methods, cart.id, storeCode]);

  useEffect(() => {
    if (pickupMethods.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON);
    }
  }, [pickupMethods, shippingMethodId]);

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null);

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON);
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF);
    }

    let currentId: string | null = null;
    setIsLoading(true);
    setShippingMethodId((prev) => {
      currentId = prev;
      return id;
    });

    try {
      await setShippingMethod({
        storeCode,
        cartId: cart.id,
        shippingMethodId: id,
      });
      router.refresh();
    } catch (e: unknown) {
      setShippingMethodId(currentId);
      setError(e instanceof Error ? e.message : "Could not set shipping method");
    } finally {
      setIsLoading(false);
    }
  };

  const renderOptionPrice = (option: CartShippingOption) => {
    if (option.price_type === "flat") {
      return formatCartMoney(option.amount as number, cart.currency_code);
    }

    const calculatedAmount = calculatedPricesMap[option.id];
    if (typeof calculatedAmount === "number") {
      return formatCartMoney(calculatedAmount, cart.currency_code);
    }

    return "Calculating…";
  };

  const goToStep = (step: string) => {
    router.push(countryPath(countryCode, `/checkout?step=${step}`), {
      scroll: false,
    });
  };

  return (
    <section className="flex flex-col gap-8 rounded-[10px] border border-black/[0.07] bg-white/[0.92] p-4 shadow-[0_4px_18px_rgba(0,0,0,0.04)] md:p-6">
      <div>
        <h2 className="m-0 text-lg font-extrabold text-zinc-900">Delivery</h2>
        <p className="m-0 mt-1 text-sm text-zinc-500">
          How would you like your order delivered?
        </p>
      </div>

      {shippingOptionsError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="m-0 text-sm font-semibold text-zinc-900">
            Could not load delivery options
          </p>
          <p className="m-0 mt-1 text-sm text-zinc-600">{shippingOptionsError}</p>
        </div>
      ) : !hasDeliveryOptions ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
          <p className="m-0 text-sm font-semibold text-zinc-900">
            No delivery options are available for this cart.
          </p>
          <p className="m-0 mt-1 text-sm text-zinc-500">
            Check that the cart address, region, products, and fulfillment setup
            match a configured shipping option.
          </p>
        </div>
      ) : (
        <div className="grid gap-2">
          {hasPickupOptions ? (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                const id = pickupMethods.find(
                  (option) => !option.insufficient_inventory
                )?.id;
                if (id) {
                  void handleSetShippingMethod(id, "pickup");
                }
              }}
              className={selectionCardClass(
                showPickupOptions === PICKUP_OPTION_ON,
                isLoading
              )}
            >
              <span className="flex items-center gap-3">
                <CheckoutRadio checked={showPickupOptions === PICKUP_OPTION_ON} />
                <span className="text-sm font-semibold text-zinc-900">
                  Pick up your order
                </span>
              </span>
              <span className="text-sm font-semibold text-zinc-700">—</span>
            </button>
          ) : null}

          {shippingMethods.map((option) => {
            const isCalculatedPending =
              option.price_type === "calculated" &&
              typeof calculatedPricesMap[option.id] !== "number";
            const active =
              showPickupOptions !== PICKUP_OPTION_ON &&
              shippingMethodId === option.id;

            return (
              <ShippingItemSelector
                key={option.id}
                shippingOption={option}
                isSelected={active}
                disabled={isLoading || isCalculatedPending}
                priceLabel={renderOptionPrice(option)}
                onSelect={() => handleSetShippingMethod(option.id, "shipping")}
              />
            );
          })}

          {isLoadingPrices ? (
            <p className="m-0 px-1 text-sm text-zinc-500">
              Calculating remaining delivery prices…
            </p>
          ) : null}
        </div>
      )}

      {showPickupOptions === PICKUP_OPTION_ON && hasPickupOptions ? (
        <div>
          <h3 className="m-0 text-base font-semibold text-zinc-900">Store</h3>
          <p className="m-0 mb-3 mt-1 text-sm text-zinc-500">
            Choose a store near you
          </p>
          <div className="grid gap-2">
            {pickupMethods.map((option) => {
              const active = shippingMethodId === option.id;
              const isCalculatedPending =
                option.price_type === "calculated" &&
                typeof calculatedPricesMap[option.id] !== "number";
              const disabled =
                Boolean(option.insufficient_inventory) || isCalculatedPending;

              return (
                <ShippingItemSelector
                  key={option.id}
                  shippingOption={option}
                  isSelected={active}
                  disabled={isLoading || disabled}
                  priceLabel={renderOptionPrice(option)}
                  description={
                    formatAddress(
                      option.service_zone?.fulfillment_set?.location?.address
                    ) || "Store pickup"
                  }
                  onSelect={() => handleSetShippingMethod(option.id, "pickup")}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      <ErrorMessage error={error} />

      <CheckoutStepActions
        onBack={() => goToStep("address")}
        primaryLabel="Continue to payment"
        primaryDisabled={!cart.shipping_methods?.[0] || isLoading}
        primaryLoading={isLoading}
        onPrimary={() => goToStep("payment")}
      />
    </section>
  );
}
