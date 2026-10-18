// Storefront navigation must use countryPath(), ensureCountryPath(), or StoreLink.
const DEFAULT_COUNTRY = (
  process.env.NEXT_PUBLIC_DEFAULT_REGION || "mv"
).toLowerCase();

const STORE_PATH_PREFIXES = [
  "shop",
  "cart",
  "checkout",
  "my-account",
  "my-orders",
  "product",
  "login-register",
  "wishlist",
  "compare",
  "contact",
  "forgot-password",
  "change-password",
  "place-order",
  "order",
];

/** Read country code from a pathname like `/mv` or `/mv/my-account`. */
export function countryCodeFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return DEFAULT_COUNTRY;
  }

  const first = segments[0].toLowerCase();
  if (STORE_PATH_PREFIXES.includes(first)) {
    return DEFAULT_COUNTRY;
  }

  return first;
}

/** Country-prefixed login route for the current or given pathname. */
export function getLoginPath(pathname?: string): string {
  const path =
    pathname ??
    (typeof window !== "undefined" ? window.location.pathname : "/");
  return countryPath(countryCodeFromPathname(path), "/login-register");
}

/** Build a country-prefixed storefront path, e.g. `/mv/shop`. */
export function countryPath(
  countryCode: string | undefined | null,
  path = "/"
): string {
  const code = (countryCode || DEFAULT_COUNTRY).toLowerCase();
  if (!path || path === "/") {
    return `/${code}`;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${code}${normalized}`;
}

/** Normalize any path to include the country prefix (strips duplicate prefix first). */
export function ensureCountryPath(
  pathname: string,
  countryCode?: string | null
): string {
  const code = (countryCode || DEFAULT_COUNTRY).toLowerCase();
  const bare = pathWithoutCountry(pathname, code);
  return countryPath(code, bare);
}

/** Strip the leading `/{countryCode}` segment from a pathname. */
export function pathWithoutCountry(
  pathname: string,
  countryCode?: string | null
): string {
  if (!countryCode) {
    return pathname || "/";
  }

  const prefix = `/${countryCode.toLowerCase()}`;
  if (pathname === prefix || pathname === `${prefix}/`) {
    return "/";
  }

  if (pathname.startsWith(`${prefix}/`)) {
    return pathname.slice(prefix.length) || "/";
  }

  return pathname || "/";
}

/** Whether a pathname matches a storefront route (ignoring country prefix). */
export function isStorePath(
  pathname: string,
  target: string,
  countryCode?: string | null
): boolean {
  const bare = pathWithoutCountry(pathname, countryCode);
  return bare === target || bare === `${target}/`;
}
