import { HttpTypes } from "@aiminaabeejs/types";
import { listCartShippingMethods } from "@lib/data/fulfillment";
import { listCartPaymentMethods } from "@lib/data/payment";
import { CheckoutStepKey } from "@lib/checkout/steps";
import Addresses from "./addresses";
import Shipping from "./shipping";
import Payment from "./payment";
import Review from "./review";

export default async function CheckoutForm({
  storeCode,
  cart,
  customer,
  step,
  countryCode,
}: {
  storeCode: string;
  cart: HttpTypes.StoreCart;
  customer: HttpTypes.StoreCustomer | null;
  step: CheckoutStepKey;
  countryCode: string;
}) {
  switch (step) {
    case CheckoutStepKey.ADDRESS:
      return (
        <Addresses cart={cart} customer={customer} countryCode={countryCode} />
      );

    case CheckoutStepKey.DELIVERY: {
      const { shipping_options: shippingMethods, error: shippingError } =
        await listCartShippingMethods(storeCode, cart.id);

      return (
        <Shipping
          storeCode={storeCode}
          cart={cart}
          countryCode={countryCode}
          availableShippingMethods={shippingMethods}
          shippingOptionsError={shippingError}
        />
      );
    }

    case CheckoutStepKey.PAYMENT: {
      const paymentMethods = await listCartPaymentMethods(
        storeCode,
        cart.region?.id ?? ""
      );

      return (
        <Payment
          storeCode={storeCode}
          cart={cart}
          countryCode={countryCode}
          availablePaymentMethods={paymentMethods}
        />
      );
    }

    case CheckoutStepKey.REVIEW:
      return (
        <Review storeCode={storeCode} cart={cart} countryCode={countryCode} />
      );

    default:
      return (
        <Addresses cart={cart} customer={customer} countryCode={countryCode} />
      );
  }
}
