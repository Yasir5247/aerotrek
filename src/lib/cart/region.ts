/** Map Redux display currency to Aiminaabee region country ISO-2. */
export const CURRENCY_TO_COUNTRY: Record<string, string> = {
  MVR: "mv",
  USD: "us",
};

export function countryCodeForCurrency(currencyName?: string) {
  if (!currencyName) return null;
  return CURRENCY_TO_COUNTRY[currencyName] ?? null;
}
