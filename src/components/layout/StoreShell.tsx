import { HttpTypes } from "@aiminaabeejs/types";
import { listAerotrekProducts } from "@lib/data/products";
import { retrieveCart } from "@lib/data/cart";
import { CART_DROPDOWN_FIELDS } from "@lib/cart/fields";
import { listRegions } from "@lib/data/regions";
import { getStoreCode } from "@lib/store-code";
import { CatalogProvider } from "@/providers/catalog-provider";
import LayoutOne from "@/components/layout/LayoutOne";

export default async function StoreShell({
  children,
  countryCode,
}: {
  children?: React.ReactNode;
  countryCode: string;
}) {
  const storeCode = getStoreCode();
  const [products, cart, regions] = await Promise.all([
    listAerotrekProducts({ countryCode }).catch(() => []),
    retrieveCart(storeCode, undefined, CART_DROPDOWN_FIELDS),
    listRegions(storeCode).catch(() => [] as HttpTypes.StoreRegion[]),
  ]);

  return (
    <CatalogProvider products={products}>
      <LayoutOne
        cart={cart}
        regions={regions}
        headerPaddingClass="header-padding-2"
        headerPositionClass="header-overlay"
      >
        {children}
      </LayoutOne>
    </CatalogProvider>
  );
}
