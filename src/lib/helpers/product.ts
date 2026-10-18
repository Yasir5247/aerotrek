// get products
export const getProducts = (products?: any, category?: any, type?: any, limit?: any) => {
  const finalProducts = category
    ? products.filter(
        product => product.category.filter(single => single === category)[0]
      )
    : products;

  if (type && type === "new") {
    const newProducts = finalProducts.filter(single => single.new);
    return newProducts.slice(0, limit ? limit : newProducts.length);
  }
  if (type && type === "bestSeller") {
    return finalProducts
      .sort((a, b) => {
        return b.saleCount - a.saleCount;
      })
      .slice(0, limit ? limit : finalProducts.length);
  }
  if (type && type === "saleItems") {
    const saleItems = finalProducts.filter(
      single => single.discount && single.discount > 0
    );
    return saleItems.slice(0, limit ? limit : saleItems.length);
  }
  return finalProducts.slice(0, limit ? limit : finalProducts.length);
};

/** Unit price for the selected color/size, falling back to product.price. */
export function getSelectedVariantPrice(
  product?: any,
  color?: string | null,
  size?: string | null
) {
  if (!product) return 0;

  const groups = Array.isArray(product.variation) ? product.variation : [];
  for (const group of groups) {
    if (color && group.color && group.color !== color) continue;
    const sizes = Array.isArray(group.size) ? group.size : [];
    for (const entry of sizes) {
      if (size && entry.name !== size) continue;
      if (entry.priceOverride != null) {
        const override = Number(entry.priceOverride);
        if (Number.isFinite(override)) return override;
      }
      break;
    }
  }

  const base = Number(product.price);
  return Number.isFinite(base) ? base : 0;
}

/** Resolve unit price for a selected variation row (PDP / cart). */
export function getListingVariantPrice(
  product?: any,
  selectedSizeEntry?: {
    variationId?: string;
    priceOverride?: number | null;
    calculatedAmount?: number | null;
  } | null,
  color?: string | null,
  size?: string | null
) {
  if (!product) return 0;

  const variantId = selectedSizeEntry?.variationId;
  if (variantId && product.variantPrices?.[variantId] != null) {
    const fromMap = Number(product.variantPrices[variantId]);
    if (Number.isFinite(fromMap)) return fromMap;
  }

  if (selectedSizeEntry?.calculatedAmount != null) {
    const amount = Number(selectedSizeEntry.calculatedAmount);
    if (Number.isFinite(amount)) return amount;
  }

  if (selectedSizeEntry?.priceOverride != null) {
    const amount = Number(selectedSizeEntry.priceOverride);
    if (Number.isFinite(amount)) return amount;
  }

  return getSelectedVariantPrice(product, color, size);
}

// get product discount price (percent off, rounded to 2dp to match checkout RPC)
export const getDiscountPrice = (price?: any, discount?: any) => {
  if (!(discount && discount > 0)) return null;
  const base = Number(price);
  const pct = Number(discount);
  if (!Number.isFinite(base) || !Number.isFinite(pct)) return null;
  return Math.round(base * (1 - pct / 100) * 100) / 100;
};

export function isVariantInStock(variant?: {
  manage_inventory?: boolean | null;
  allow_backorder?: boolean | null;
  inventory_quantity?: number | null;
  stock?: number | null;
}) {
  if (!variant) return false;

  if (variant.stock != null) {
    const stock = Number(variant.stock);
    if (Number.isFinite(stock)) {
      return stock > 0;
    }
  }

  const manageInventory = Boolean(variant.manage_inventory);
  const allowBackorder = Boolean(variant.allow_backorder);
  const inventoryQuantity = Number(variant.inventory_quantity);

  if (!manageInventory) {
    return true;
  }

  if (allowBackorder) {
    return true;
  }

  return Number.isFinite(inventoryQuantity) && inventoryQuantity > 0;
}

// get product cart quantity
export const getProductCartQuantity = (cartItems?: any, product?: any, color?: any, size?: any) => {
  let productInCart = cartItems.find(
    single =>
      single.id === product.id &&
      (single.selectedProductColor
        ? single.selectedProductColor === color
        : true) &&
      (single.selectedProductSize ? single.selectedProductSize === size : true)
  );
  if (cartItems.length >= 1 && productInCart) {
    if (product.variation) {
      return cartItems.find(
        single =>
          single.id === product.id &&
          single.selectedProductColor === color &&
          single.selectedProductSize === size
      ).quantity;
    } else {
      return cartItems.find(single => product.id === single.id).quantity;
    }
  } else {
    return 0;
  }
};

export const cartItemStock = (item?: any, color?: any, size?: any) => {
  if (!item) return null;
  if (item.stock != null && item.stock !== "") {
    const stock = Number(item.stock);
    return Number.isFinite(stock) ? stock : null;
  }
  try {
    const variation = item.variation?.find((single) => single.color === color);
    const sizeRow = variation?.size?.find((single) => single.name === size);
    const stock = Number(sizeRow?.stock);
    return Number.isFinite(stock) ? stock : null;
  } catch {
    return null;
  }
};

//get products based on category
export const getSortedProducts = (products?: any, sortType?: any, sortValue?: any) => {
  if (products && sortType && sortValue) {
    if (sortType === "category") {
      return products.filter(
        product => product.category.filter(single => single === sortValue)[0]
      );
    }
    if (sortType === "tag") {
      return products.filter(
        product => product.tag.filter(single => single === sortValue)[0]
      );
    }
    if (sortType === "color") {
      return products.filter(
        product =>
          product.variation &&
          product.variation.filter(single => single.color === sortValue)[0]
      );
    }
    if (sortType === "size") {
      return products.filter(
        product =>
          product.variation &&
          product.variation.filter(
            single => single.size.filter(single => single.name === sortValue)[0]
          )[0]
      );
    }
    if (sortType === "filterSort") {
      let sortProducts = [...products];
      if (sortValue === "default") {
        return sortProducts;
      }
      if (sortValue === "priceHighToLow") {
        return sortProducts.sort((a, b) => {
          return b.price - a.price;
        });
      }
      if (sortValue === "priceLowToHigh") {
        return sortProducts.sort((a, b) => {
          return a.price - b.price;
        });
      }
    }
  }
  return products;
};

// get individual element
const getIndividualItemArray = array => {
  let individualItemArray = array.filter(function(v, i, self) {
    return i === self.indexOf(v);
  });
  return individualItemArray;
};

// get individual categories
export const getIndividualCategories = products => {
  let productCategories: any[] = [];
  products &&
    products.map(product => {
      return (
        product.category &&
        product.category.map(single => {
          return productCategories.push(single);
        })
      );
    });
  const individualProductCategories = getIndividualItemArray(productCategories);
  return individualProductCategories;
};

// get individual tags
export const getIndividualTags = products => {
  let productTags: any[] = [];
  products &&
    products.map(product => {
      return (
        product.tag &&
        product.tag.map(single => {
          return productTags.push(single);
        })
      );
    });
  const individualProductTags = getIndividualItemArray(productTags);
  return individualProductTags;
};

// get individual colors
export const getIndividualColors = products => {
  let productColors: any[] = [];
  products &&
    products.map(product => {
      return (
        product.variation &&
        product.variation.map(single => {
          return productColors.push(single.color);
        })
      );
    });
  const individualProductColors = getIndividualItemArray(productColors);
  return individualProductColors;
};

// get individual sizes
export const getProductsIndividualSizes = products => {
  let productSizes: any[] = [];
  products &&
    products.map(product => {
      return (
        product.variation &&
        product.variation.map(single => {
          return single.size.map(single => {
            return productSizes.push(single.name);
          });
        })
      );
    });
  const individualProductSizes = getIndividualItemArray(productSizes);
  return individualProductSizes;
};

// get product individual sizes
export const getIndividualSizes = product => {
  let productSizes: any[] = [];
  product.variation &&
    product.variation.map(singleVariation => {
      return (
        singleVariation.size &&
        singleVariation.size.map(singleSize => {
          return productSizes.push(singleSize.name);
        })
      );
    });
  const individualSizes = getIndividualItemArray(productSizes);
  return individualSizes;
};

export const setActiveSort = e => {
  const filterButtons = document.querySelectorAll(
    ".sidebar-widget-list-left button, .sidebar-widget-tag button, .product-filter button"
  );
  filterButtons.forEach(item => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

export const setActiveLayout = e => {
  const gridSwitchBtn = document.querySelectorAll(".shop-tab button");
  gridSwitchBtn.forEach(item => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

export const toggleShopTopFilter = (e?: any) => {
  const shopTopFilterWrapper = document.querySelector(
    "#product-filter-wrapper"
  ) as HTMLElement | null;
  if (!shopTopFilterWrapper) return;
  shopTopFilterWrapper.classList.toggle("active");
  if (shopTopFilterWrapper.style.height) {
    shopTopFilterWrapper.style.height = "";
  } else {
    shopTopFilterWrapper.style.height =
      shopTopFilterWrapper.scrollHeight + "px";
  }
  e?.currentTarget?.classList.toggle("active");
};
