"use server";

import { HttpTypes } from "@aiminaabeejs/types";
import { sdk } from "@lib/config";

export const listCategories = async (
  storeCode: string,
  query?: HttpTypes.FindParams & HttpTypes.StoreProductCategoryListParams
): Promise<HttpTypes.StoreProductCategory[]> => {
  const { product_categories }: HttpTypes.StoreProductCategoryListResponse =
    await sdk.store.category.list(storeCode, {
      fields:
        "*category_children, *products, *parent_category, *parent_category.parent_category",
      limit: query?.limit || 100,
      ...query,
    });

  return product_categories;
};

export const getCategoryByHandle = async (
  storeCode: string,
  categoryHandle: string[]
): Promise<HttpTypes.StoreProductCategory> => {
  const handle = categoryHandle.join("/");

  const { product_categories }: HttpTypes.StoreProductCategoryListResponse =
    await sdk.store.category.list(storeCode, {
      fields: "*category_children, *products",
      handle,
    });

  return product_categories[0];
};
