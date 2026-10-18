import { redirect } from "next/navigation";
import { countryPath } from "@lib/navigation/country-path";

export const metadata = {
  title: "Place Order",
  description: "Checkout has moved to the stepped Aiminaabee checkout flow.",
};

/** Legacy place-order route — redirects into the SDK checkout. */
export default async function PlaceOrderPage({
  params,
}: {
  params: Promise<{ countryCode: string }>;
}) {
  const { countryCode } = await params;
  redirect(countryPath(countryCode, "/checkout?step=address"));
}
