import { redirect } from "next/navigation";
import LoginRegister from "@/components/auth/LoginRegister";
import { retrieveCustomer } from "@lib/data/customer";
import { getSafeRedirectPath } from "@lib/util/safe-redirect";
import { countryPath } from "@lib/navigation/country-path";

export const metadata = {
  title: "Login",
  description: "Sign in or create your AeroTrek account.",
};

export default async function LoginRegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>;
  searchParams?: Promise<{ redirect?: string }>;
}) {
  const { countryCode } = await params;
  const query = await searchParams;
  const next = getSafeRedirectPath(query?.redirect);
  const customer = await retrieveCustomer();

  if (customer) {
    redirect(countryPath(countryCode, next));
  }

  return <LoginRegister redirectTo={next} />;
}
