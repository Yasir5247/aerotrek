import { retrieveCart } from "@lib/data/cart";
import { CART_PAGE_FIELDS } from "@lib/cart/fields";
import { getStoreCode } from "@lib/store-code";
import { CartView } from "@/components/store";

export const metadata = {
  title: "Cart",
  description: "Review the items in your AeroTrek cart.",
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const storeCode = getStoreCode();
  const cart = await retrieveCart(storeCode, undefined, CART_PAGE_FIELDS);

  return <CartView cart={cart} storeCode={storeCode} />;
}
