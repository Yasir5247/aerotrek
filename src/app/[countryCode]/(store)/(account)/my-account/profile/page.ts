import { redirect } from "next/navigation";
import { countryPath } from "@lib/navigation/country-path";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ countryCode: string }>;
}) {
  const { countryCode } = await params;
  redirect(countryPath(countryCode, "/my-account?tab=profile"));
}
