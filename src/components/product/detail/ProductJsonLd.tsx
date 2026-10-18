type ProductJsonLdProps = {
  product: {
    id: string;
    name: string;
    shortDescription?: string;
    fullDescription?: string;
    image?: string[];
    price?: number;
    currency_code?: string | null;
    variation?: Array<{
      size?: Array<{
        stock?: number;
        manage_inventory?: boolean;
        allow_backorder?: boolean;
        inventory_quantity?: number | null;
      }>;
    }>;
  };
  countryCode: string;
};

function productAvailability(product: ProductJsonLdProps["product"]) {
  const sizes = product.variation?.flatMap((group) => group.size || []) || [];
  const inStock = sizes.some((size) => {
    if (!size.manage_inventory) return true;
    if (size.allow_backorder) return true;
    return Number(size.inventory_quantity ?? size.stock) > 0;
  });

  return inStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}

export default function ProductJsonLd({
  product,
  countryCode,
}: ProductJsonLdProps) {
  const price = Number(product.price);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.fullDescription || "",
    image: product.image || [],
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `/${countryCode}/product/${product.id}`,
      priceCurrency: (product.currency_code || "USD").toUpperCase(),
      price: Number.isFinite(price) ? price.toFixed(2) : undefined,
      availability: productAvailability(product),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
