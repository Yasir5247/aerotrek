export function formatCartMoney(
  amount: number | null | undefined,
  currencyCode?: string | null
) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  const formatted = value.toFixed(2);
  if (currencyCode) return `${String(currencyCode).toUpperCase()} ${formatted}`;
  return formatted;
}

type CalculatedPrice = {
  calculated_amount?: number | null;
  original_amount?: number | null;
  currency_code?: string | null;
};

export function getVariantCalculatedPrice(
  calculatedPrice?: CalculatedPrice | null
) {
  const calculated = Number(calculatedPrice?.calculated_amount);
  const original = Number(calculatedPrice?.original_amount);
  const amount = Number.isFinite(calculated)
    ? calculated
    : Number.isFinite(original)
      ? original
      : 0;

  return {
    amount,
    originalAmount: Number.isFinite(original) ? original : amount,
    currencyCode: calculatedPrice?.currency_code || null,
    isOnSale:
      Number.isFinite(original) &&
      Number.isFinite(calculated) &&
      original > calculated,
  };
}

export function formatVariantPrice(
  calculatedPrice?: CalculatedPrice | null,
  options?: { symbol?: string }
) {
  const { amount, currencyCode } = getVariantCalculatedPrice(calculatedPrice);
  if (!Number.isFinite(amount) || amount <= 0) {
    return options?.symbol ? `${options.symbol}0.00` : "—";
  }

  const formatted = amount.toFixed(2);
  if (options?.symbol) {
    return `${options.symbol}${formatted}`;
  }

  if (currencyCode) {
    return `${String(currencyCode).toUpperCase()} ${formatted}`;
  }

  return formatted;
}

type MappedProductPrice = {
  price?: number | null;
  original_price?: number | null;
  discount?: number | null;
  currency_code?: string | null;
};

/** List/card price from region `calculated_price` (already mapped onto the product). */
export function getMappedProductPricing(product?: MappedProductPrice | null) {
  const currencyCode = product?.currency_code || null;
  const amount = Number(product?.price);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const originalFromApi = Number(product?.original_price);

  if (Number.isFinite(originalFromApi) && originalFromApi > safeAmount) {
    return {
      amount: safeAmount,
      originalAmount: originalFromApi,
      currencyCode,
      isOnSale: true,
    };
  }

  const pct = Number(product?.discount);
  if (Number.isFinite(pct) && pct > 0) {
    const sale = Math.round(safeAmount * (1 - pct / 100) * 100) / 100;
    return {
      amount: sale,
      originalAmount: safeAmount,
      currencyCode,
      isOnSale: sale < safeAmount,
    };
  }

  return {
    amount: safeAmount,
    originalAmount: safeAmount,
    currencyCode,
    isOnSale: false,
  };
}

export function formatMappedProductPrice(product?: MappedProductPrice | null) {
  const pricing = getMappedProductPricing(product);
  return {
    current: formatCartMoney(pricing.amount, pricing.currencyCode),
    original: pricing.isOnSale
      ? formatCartMoney(pricing.originalAmount, pricing.currencyCode)
      : null,
  };
}
