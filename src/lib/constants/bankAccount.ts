// Shared AeroTrek bank account used on checkout + OCR precheck.
// Replace with the real account number when ready.
export const AEROTREK_BANK_ACCOUNT_NUMBER = "7770000239126";

export function isPlaceholderAccount(accountNumber: any = AEROTREK_BANK_ACCOUNT_NUMBER) {
  const digits = String(accountNumber).replace(/\D/g, "");
  return !digits || /^0+$/.test(digits) || /x/i.test(String(accountNumber));
}
