export const DEFAULT_SHIPPING_SETTINGS = {
  shippingRate: 50,
  freeShippingEnabled: true,
  freeShippingThreshold: 3084,
};

let cached: any = null;
let cachedAt = 0;
const CACHE_MS = 60_000;

/** Load storefront shipping settings (cached briefly). */
export async function fetchShippingSettings({ force = false }: any = {}) {
  const now = Date.now();
  if (!force && cached && now - cachedAt < CACHE_MS) {
    return cached;
  }

  cached = { ...DEFAULT_SHIPPING_SETTINGS };

  cachedAt = now;
  return cached;
}

/** Flat shipping for a cart subtotal (after discounts, before shipping). */
export function calcShippingCost(subtotal?: any, settings: any = DEFAULT_SHIPPING_SETTINGS) {
  const rate = Number(settings.shippingRate) || 0;
  if (
    settings.freeShippingEnabled &&
    Number(subtotal) >= Number(settings.freeShippingThreshold || 0)
  ) {
    return 0;
  }
  return rate;
}

export function clearShippingSettingsCache() {
  cached = null;
  cachedAt = 0;
}
