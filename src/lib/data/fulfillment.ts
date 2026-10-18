"use server";

import { HttpTypes } from "@aiminaabeejs/types";
import { sdk } from "@lib/config";
import { getAuthHeaders } from "./cookies";

export const listCartShippingMethods = async (
  storeCode: string,
  cartId: string
): Promise<{
  shipping_options: HttpTypes.StoreCartShippingOption[];
  error: string | null;
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  try {
    const { shipping_options }: HttpTypes.StoreShippingOptionListResponse =
      await sdk.store.fulfillment.listCartOptions(
        storeCode,
        {
          cart_id: cartId,
          fields:
            "+service_zone.fulfillment_set.type,*service_zone.fulfillment_set.location.address",
        },
        headers
      );

    return {
      shipping_options: shipping_options || [],
      error: null,
    };
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : "Could not load shipping options for this cart.";

    return {
      shipping_options: [],
      error: message,
    };
  }
};

export const calculatePriceForShippingOption = async (
  storeCode: string,
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
): Promise<HttpTypes.StoreCartShippingOption | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const body: HttpTypes.StoreCalculateShippingOptionPrice = {
    cart_id: cartId,
    ...(data ? { data } : {}),
  };

  return sdk.store.fulfillment
    .calculate(storeCode, optionId, body, {}, headers)
    .then(
      ({ shipping_option }: HttpTypes.StoreShippingOptionResponse) =>
        shipping_option
    )
    .catch(() => null);
};
