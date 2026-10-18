"use server";

import { HttpTypes } from "@aiminaabeejs/types";
import { sdk } from "@lib/config";
import { getStoreCode } from "@lib/store-code";
import { SortOptions, sortProducts } from "@lib/util/sort-products";
import { getRegion } from "./regions";
import { getVariantCalculatedPrice } from "@/lib/util/money";

const CATALOG_FIELDS =
  "id,title,handle,thumbnail,*variants,+variants.inventory_quantity,*variants.options,*options,+images,+metadata,+tags,+categories";
const PRICED_FIELDS =
  "id,title,handle,thumbnail,*variants,*variants.calculated_price,+variants.inventory_quantity,*variants.options,*options,+images,+metadata,+tags,+categories";

type ProductQueryParams = HttpTypes.StoreProductListParams;

const resolveRegionId = async ({
  storeCode,
  countryCode,
  regionId,
}: {
  storeCode: string;
  countryCode?: string;
  regionId?: string;
}): Promise<string | undefined> => {
  if (regionId) {
    return regionId;
  }

  if (countryCode) {
    const region = await getRegion(storeCode, countryCode);
    return region?.id;
  }

  return undefined;
};

const productQuery = ({
  regionId,
  countryCode,
  fields,
  ...rest
}: {
  regionId?: string;
  countryCode?: string;
  fields?: string;
} & HttpTypes.StoreProductListParams): HttpTypes.StoreProductListParams => {
  const requested = fields ?? (regionId ? PRICED_FIELDS : CATALOG_FIELDS);
  const safeFields =
    !regionId && requested.includes("calculated_price")
      ? CATALOG_FIELDS
      : requested;

  return {
    ...rest,
    ...(regionId ? { region_id: regionId } : {}),
    ...(countryCode ? { country_code: countryCode } : {}),
    fields: safeFields,
  };
};

export const listProducts = async ({
  storeCode = getStoreCode(),
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  storeCode?: string;
  pageParam?: number;
  queryParams?: ProductQueryParams;
  countryCode?: string;
  regionId?: string;
} = {}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: ProductQueryParams;
}> => {
  const limit = queryParams?.limit || 12;
  const _pageParam = Math.max(pageParam, 1);
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit;
  const resolvedRegionId = await resolveRegionId({
    storeCode,
    countryCode,
    regionId,
  });
  const { fields: requestedFields, ...restQueryParams } = queryParams ?? {};

  const { products, count }: HttpTypes.StoreProductListResponse =
    await sdk.store.product.list(
      storeCode,
      productQuery({
        regionId: resolvedRegionId,
        countryCode,
        fields: requestedFields,
        limit,
        offset,
        ...restQueryParams,
      })
    );

  const nextPage = count > offset + limit ? pageParam + 1 : null;

  return {
    response: {
      products,
      count,
    },
    nextPage,
    queryParams,
  };
};

export const retrieveProduct = async ({
  storeCode = getStoreCode(),
  productId,
  countryCode,
  regionId,
  fields,
}: {
  storeCode?: string;
  productId: string;
  countryCode?: string;
  regionId?: string;
  fields?: string;
}): Promise<HttpTypes.StoreProduct> => {
  const resolvedRegionId = await resolveRegionId({
    storeCode,
    countryCode,
    regionId,
  });

  const { product }: HttpTypes.StoreProductResponse =
    await sdk.store.product.retrieve(
      storeCode,
      productId,
      productQuery({
        regionId: resolvedRegionId,
        countryCode,
        fields,
      })
    );

  return product;
};

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  storeCode = getStoreCode(),
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  storeCode?: string;
  page?: number;
  queryParams?: ProductQueryParams;
  sortBy?: SortOptions;
  countryCode: string;
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: ProductQueryParams;
}> => {
  const limit = queryParams?.limit || 12;

  const {
    response: { products, count },
  } = await listProducts({
    storeCode,
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  });

  const sortedProducts = sortProducts(products, sortBy);

  const pageParam = (page - 1) * limit;

  const nextPage = count > pageParam + limit ? pageParam + limit : null;

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit);

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  };
};

function metaNumber(
  metadata: Record<string, unknown> | null | undefined,
  key: string
) {
  const n = Number(metadata?.[key]);
  return Number.isFinite(n) ? n : 0;
}

function optionValue(
  variant: HttpTypes.StoreProductVariant,
  names: string[]
) {
  const options = variant.options || [];
  const match = options.find((option) =>
    names.includes(
      String(option.option?.title || option.value || "").toLowerCase()
    )
  );

  return match?.value || null;
}

function variantImageUrl(
  variant: HttpTypes.StoreProductVariant,
  product: HttpTypes.StoreProduct,
  images: string[]
) {
  const variantImages = (variant as { images?: Array<{ url?: string }> }).images;
  const fromVariantImages = variantImages?.map((image) => image.url).find(Boolean);
  if (fromVariantImages) return fromVariantImages;

  if ("thumbnail" in variant && typeof variant.thumbnail === "string") {
    return variant.thumbnail;
  }

  return product.thumbnail || images[0] || null;
}

function buildVariationGroups(
  variants: HttpTypes.StoreProductVariant[],
  product: HttpTypes.StoreProduct,
  images: string[]
) {
  const groups = new Map<
    string,
    {
      color: string;
      image: string | null;
      size: Array<{
        name: string;
        stock: number;
        variationId: string;
        sku?: string | null;
        priceOverride: number | null;
        calculatedAmount: number;
        manage_inventory?: boolean;
        allow_backorder?: boolean;
        inventory_quantity?: number | null;
      }>;
    }
  >();

  for (const variant of variants) {
    const color = optionValue(variant, ["color", "colour"]) || "Default";
    const sizeName =
      optionValue(variant, ["size"]) || variant.title || "One Size";
    const { amount: calculatedAmount } = getVariantCalculatedPrice(
      variant.calculated_price
    );
    const priceOverride = variant.calculated_price ? calculatedAmount : null;

    const sizeEntry = {
      name: sizeName,
      stock: Number(variant.inventory_quantity) || 0,
      variationId: variant.id,
      sku: variant.sku,
      priceOverride,
      calculatedAmount,
      manage_inventory: variant.manage_inventory,
      allow_backorder: variant.allow_backorder,
      inventory_quantity: variant.inventory_quantity,
    };

    const existing = groups.get(color);
    if (existing) {
      existing.size.push(sizeEntry);
      if (!existing.image) {
        existing.image = variantImageUrl(variant, product, images);
      }
      continue;
    }

    groups.set(color, {
      color,
      image: variantImageUrl(variant, product, images),
      size: [sizeEntry],
    });
  }

  return Array.from(groups.values());
}

export async function mapStoreProduct(product: HttpTypes.StoreProduct) {
  const variants = product.variants || [];
  const firstVariant = variants[0];
  const images = [
    product.thumbnail,
    ...(product.images || []).map((image) => image.url),
  ].filter(Boolean) as string[];
  const price = firstVariant
    ? getVariantCalculatedPrice(firstVariant.calculated_price).amount
    : 0;
  const firstVariantPricing = getVariantCalculatedPrice(firstVariant?.calculated_price);

  const variation = buildVariationGroups(variants, product, images);
  const variantPrices = Object.fromEntries(
    variants.map((variant) => [
      variant.id,
      getVariantCalculatedPrice(variant.calculated_price).amount,
    ])
  );

  return {
    id: product.id,
    sku: firstVariant?.sku || product.handle || product.id,
    name: product.title || "Untitled product",
    price,
    discount: metaNumber(product.metadata, "discount"),
    offerEnd:
      (typeof product.metadata?.offer_end === "string"
        ? product.metadata.offer_end
        : null) ||
      (typeof product.metadata?.offerEnd === "string"
        ? product.metadata.offerEnd
        : null) ||
      null,
    new: Boolean(product.metadata?.is_new || product.metadata?.is_featured),
    rating: metaNumber(product.metadata, "rating"),
    saleCount: metaNumber(product.metadata, "sale_count"),
    category:
      product.categories
        ?.map((category) => category.handle || category.name)
        .filter(Boolean) || [],
    tag: product.tags?.map((tag) => tag.value).filter(Boolean) || [],
    collection_id: product.collection_id || product.collection?.id || null,
    tag_ids: product.tags?.map((tag) => tag.id).filter(Boolean) || [],
    currency_code:
      firstVariantPricing.currencyCode ||
      firstVariant?.calculated_price?.currency_code ||
      product.variants?.[0]?.calculated_price?.currency_code ||
      null,
    original_price: firstVariantPricing.originalAmount,
    isOnSale: firstVariantPricing.isOnSale,
    variantPrices,
    variation,
    image: images,
    shortDescription: product.subtitle || product.description || "",
    fullDescription: product.description || "",
    status: product.status || "published",
  };
}

export async function listAerotrekProducts(
  options: {
    storeCode?: string;
    pageParam?: number;
    queryParams?: ProductQueryParams;
    countryCode?: string;
    regionId?: string;
  } = {}
) {
  const {
    response: { products },
  } = await listProducts({
    ...options,
    countryCode:
      options.countryCode ?? process.env.NEXT_PUBLIC_DEFAULT_REGION,
    queryParams: { limit: 100, ...options.queryParams },
  });

  return Promise.all(products.map(mapStoreProduct));
}

export async function retrieveAerotrekProduct(
  productId: string,
  options: {
    storeCode?: string;
    countryCode?: string;
    regionId?: string;
    fields?: string;
  } = {}
) {
  const countryCode =
    options.countryCode ?? process.env.NEXT_PUBLIC_DEFAULT_REGION;
  const storeCode = options.storeCode ?? getStoreCode();
  const region =
    options.regionId != null
      ? { id: options.regionId }
      : await getRegion(storeCode, countryCode);
  const regionId = options.regionId ?? region?.id;

  try {
    const product = await retrieveProduct({
      productId,
      countryCode,
      regionId,
      storeCode,
      fields: options.fields,
    });

    if (product) return mapStoreProduct(product);
  } catch {
    // Some storefront retrieve-by-id responses 404 even when the product is listable.
  }

  const listed = await listAerotrekProducts({
    countryCode,
    regionId,
    storeCode: options.storeCode,
    queryParams: { id: [productId], limit: 1 },
  }).catch(() => []);

  return listed.find((product) => product.id === productId) || null;
}

export async function listRelatedProducts({
  productId,
  collectionId,
  tagIds = [],
  countryCode,
  limit = 4,
}: {
  productId: string;
  collectionId?: string | null;
  tagIds?: string[];
  countryCode?: string;
  limit?: number;
}) {
  const resolvedCountry =
    countryCode ?? process.env.NEXT_PUBLIC_DEFAULT_REGION ?? "mv";

  const query: HttpTypes.StoreProductListParams = {
    limit,
    fields:
      "id,title,handle,thumbnail,*variants.calculated_price,+variants.inventory_quantity,*variants.options,*options,+images,+metadata,+tags,+categories",
  };

  if (collectionId) {
    query.collection_id = [collectionId];
  } else if (tagIds.length) {
    query.tag_id = tagIds;
  }

  const {
    response: { products },
  } = await listProducts({
    countryCode: resolvedCountry,
    queryParams: query,
  });

  const filtered = products.filter((product) => product.id !== productId);
  return Promise.all(filtered.slice(0, limit).map(mapStoreProduct));
}
