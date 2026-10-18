import { listAerotrekProducts } from "@lib/data/products";
import ShopListTwoColumn from "@/components/product/listing/ShopListTwoColumn";

export const metadata = {
  title: "Shop",
  description:
    "Browse AeroTrek travel bags—Maldivian-designed backpacks with vacuum-compressible storage. Filter by category, color, or size.",
};

export default async function ShopPage({
  params,
}: {
  params: Promise<{ countryCode: string }>;
}) {
  const { countryCode } = await params;
  const products = await listAerotrekProducts({ countryCode }).catch(() => []);
  const List = ShopListTwoColumn as any;
  return <List products={products} />;
}
