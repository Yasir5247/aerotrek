const STORAGE_KEY = "aerotrek:browsing-history";
const MAX_ITEMS = 24;

export type BrowsingHistoryEntry = {
  id: string;
  name: string;
  image?: string;
  price?: number;
  original_price?: number;
  currency_code?: string;
  discount?: number;
  brand?: string;
  stock?: number;
  viewedAt: number;
  snapshot?: Record<string, unknown>;
};

function readRaw(): BrowsingHistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(items: BrowsingHistoryEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getBrowsingHistory(): BrowsingHistoryEntry[] {
  return readRaw().sort((a, b) => b.viewedAt - a.viewedAt);
}

export function addToBrowsingHistory(product: {
  id: string;
  name?: string;
  image?: string[];
  price?: number;
  discount?: number;
  brand?: string;
  stock?: number;
  [key: string]: unknown;
}) {
  if (!product?.id || typeof window === "undefined") return;

  const entry: BrowsingHistoryEntry = {
    id: String(product.id),
    name: String(product.name || "Product"),
    image: Array.isArray(product.image) ? product.image[0] : undefined,
    price: Number(product.price) || 0,
    original_price:
      product.original_price != null ? Number(product.original_price) : undefined,
    currency_code: product.currency_code
      ? String(product.currency_code)
      : undefined,
    discount: product.discount ? Number(product.discount) : undefined,
    brand: product.brand ? String(product.brand) : undefined,
    stock: product.stock != null ? Number(product.stock) : undefined,
    viewedAt: Date.now(),
    snapshot: product as Record<string, unknown>,
  };

  const existing = readRaw().filter((item) => item.id !== entry.id);
  writeRaw([entry, ...existing].slice(0, MAX_ITEMS));

  window.dispatchEvent(new CustomEvent("browsing-history:updated"));
}

export function clearBrowsingHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("browsing-history:updated"));
}
