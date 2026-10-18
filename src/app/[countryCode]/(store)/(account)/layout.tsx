import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountShell from "@/components/customer/account-shell";
import { retrieveCustomer } from "@lib/data/customer";
import {
  countryCodeFromPathname,
  countryPath,
} from "@lib/navigation/country-path";
import { getSafeRedirectPath } from "@lib/util/safe-redirect";

export default async function AccountLayout({ children }: { children?: any }) {
  const customer = await retrieveCustomer();
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") || "/my-account";

  if (!customer) {
    const countryCode = countryCodeFromPathname(pathname);
    const next = getSafeRedirectPath(pathname);
    redirect(
      countryPath(
        countryCode,
        `/login-register?redirect=${encodeURIComponent(next)}`
      )
    );
  }

  return <AccountShell customer={customer}>{children}</AccountShell>;
}
