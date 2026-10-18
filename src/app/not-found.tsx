import StoreShell from "@/components/layout/StoreShell";
import NotFoundView from "@/components/not-found/NotFoundView";

export const metadata = {
  title: "Not Found",
};

const DEFAULT_COUNTRY = (
  process.env.NEXT_PUBLIC_DEFAULT_REGION || "mv"
).toLowerCase();

export default function NotFound() {
  return (
    <StoreShell countryCode={DEFAULT_COUNTRY}>
      <NotFoundView />
    </StoreShell>
  );
}
