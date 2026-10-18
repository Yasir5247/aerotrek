import StoreShell from "@/components/layout/StoreShell";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ countryCode: string }>;
}) {
  const { countryCode } = await params;

  return <StoreShell countryCode={countryCode}>{children}</StoreShell>;
}
