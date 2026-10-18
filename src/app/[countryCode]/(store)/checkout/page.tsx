import { redirect } from "next/navigation";
import { retrieveCart } from "@lib/data/cart";
import { retrieveCustomer } from "@lib/data/customer";
import { CheckoutStepKey, resolveCheckoutStep } from "@lib/checkout/steps";
import { countryPath } from "@lib/navigation/country-path";
import { getStoreCode } from "@lib/store-code";
import CheckoutForm from "@/components/store/checkout/checkout-form";
import CheckoutSummary from "@/components/store/checkout/checkout-summary";
import Breadcrumb from "@/components/layout/breadcrumb/Breadcrumb";

export const metadata = {
  title: "Checkout",
  description:
    "Complete your AeroTrek order — address, delivery, payment, and review.",
};

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>;
  searchParams: Promise<{ step?: string }>;
}) {
  const { countryCode } = await params;
  const storeCode = getStoreCode();
  const cart = await retrieveCart(storeCode);
  const routeParams = await searchParams;

  if (!cart || !cart.items?.length) {
    redirect(countryPath(countryCode, "/cart"));
  }

  if (!routeParams?.step) {
    redirect(countryPath(countryCode, "/checkout?step=address"));
  }

  const step = resolveCheckoutStep(routeParams.step, cart);
  if (routeParams.step !== step) {
    redirect(countryPath(countryCode, `/checkout?step=${step}`));
  }

  const customer = await retrieveCustomer(storeCode);

  return (
    <div className="bg-transparent pb-[80px] pt-2">
      <Breadcrumb
        variant="bare"
        className="border-b border-black/[0.06] py-4 max-[767px]:py-3"
        pages={[
          { label: "Home", path: countryPath(countryCode, "/") },
          { label: "Cart", path: countryPath(countryCode, "/cart") },
          { label: "Checkout", path: countryPath(countryCode, "/checkout") },
        ]}
      />
      <div className="grid gap-5 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-8">
        <CheckoutForm
          storeCode={storeCode}
          cart={cart}
          customer={customer}
          step={step}
          countryCode={countryCode}
        />
        <CheckoutSummary storeCode={storeCode} cart={cart} />
      </div>
    </div>
  );
}
