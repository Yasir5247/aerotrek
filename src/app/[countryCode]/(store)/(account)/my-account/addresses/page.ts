import { redirect } from "next/navigation";
import { countryPath } from "@lib/navigation/country-path";

export default async function AddressesPage({
  params,
}: {
  params: Promise<{ countryCode: string }>;
}) {
  const { countryCode } = await params;
  redirect(countryPath(countryCode, "/my-account?tab=addresses"));
}
