import {
  countryPath,
  pathWithoutCountry,
} from "@lib/navigation/country-path";

const FALLBACK = "/my-account";

export function getSafeRedirectPath(value?: string | null, fallback = FALLBACK) {
  if (!value || typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.startsWith("/login-register")) return fallback;

  const [pathPart, queryPart] = value.split("?");
  const segments = pathPart.split("/").filter(Boolean);
  const first = segments[0]?.toLowerCase();

  if (first && first.length === 2 && segments.length > 1) {
    const bare = `/${segments.slice(1).join("/")}`;
    return queryPart ? `${bare}?${queryPart}` : bare;
  }

  return value;
}

export function getSafeCountryRedirectPath(
  value: string | null | undefined,
  countryCode: string,
  fallback = FALLBACK
) {
  const bare = getSafeRedirectPath(value, fallback);
  return countryPath(countryCode, bare);
}

export function stripCountryFromRedirectPath(
  value: string,
  countryCode?: string | null
) {
  if (!countryCode) {
    return value;
  }

  const [pathPart, queryPart] = value.split("?");
  const bare = pathWithoutCountry(pathPart, countryCode);
  return queryPart ? `${bare}?${queryPart}` : bare;
}
