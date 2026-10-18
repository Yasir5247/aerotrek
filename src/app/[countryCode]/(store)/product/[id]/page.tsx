import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  listRelatedProducts,
  retrieveAerotrekProduct,
} from "@lib/data/products";
import { retrieveCart } from "@lib/data/cart";
import { CART_PAGE_FIELDS } from "@lib/cart/fields";
import { PDP_FIELDS } from "@lib/product/fields";
import { countryPath } from "@lib/navigation/country-path";
import { getStoreCode } from "@lib/store-code";
import { ProductPage } from "@/components/product";
import ProductJsonLd from "@/components/product/detail/ProductJsonLd";

const getProduct = cache((id: string, countryCode: string) =>
  retrieveAerotrekProduct(id, {
    countryCode,
    fields: PDP_FIELDS,
  })
);

type PageParams = {
  countryCode: string;
  id: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { countryCode, id } = await params;
  const product = await getProduct(id, countryCode);

  if (!product) {
    return { title: "Product" };
  }

  const description =
    product.shortDescription || "AeroTrek travel bags and accessories.";
  const image = product.image?.[0];
  const canonical = countryPath(countryCode, `/product/${id}`);

  return {
    title: product.name,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: product.name,
      description,
      url: canonical,
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
    other: image
      ? {
          "link:preload:image": image,
        }
      : undefined,
  };
}

export default async function ProductRoutePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { countryCode, id } = await params;
  const storeCode = getStoreCode();

  const [product, cart] = await Promise.all([
    getProduct(id, countryCode),
    retrieveCart(storeCode, undefined, CART_PAGE_FIELDS),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await listRelatedProducts({
    productId: id,
    collectionId: product.collection_id,
    tagIds: product.tag_ids,
    countryCode,
    limit: 4,
  }).catch(() => []);

  return (
    <>
      <ProductJsonLd product={product} countryCode={countryCode} />
      <ProductPage
        product={product}
        cart={cart}
        relatedProducts={relatedProducts}
        countryCode={countryCode}
      />
    </>
  );
}
