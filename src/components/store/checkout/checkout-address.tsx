import { HttpTypes } from "@aiminaabeejs/types";

type AddressLike =
  | HttpTypes.StoreCartAddress
  | HttpTypes.StoreCustomerAddress
  | HttpTypes.StoreOrderAddress
  | null
  | undefined;

function formatLines(address?: AddressLike) {
  if (!address) return [];

  return [
    [address.first_name, address.last_name].filter(Boolean).join(" "),
    address.company,
    address.address_1,
    address.address_2,
    [address.city, address.province].filter(Boolean).join(", "),
    [address.postal_code, address.country_code?.toUpperCase()]
      .filter(Boolean)
      .join(" "),
    address.phone,
  ].filter(Boolean) as string[];
}

export default function CheckoutAddress({
  address,
  className = "",
}: {
  address?: AddressLike;
  className?: string;
}) {
  const lines = formatLines(address);

  if (!lines.length) {
    return <p className="m-0 text-sm text-zinc-500">Not provided</p>;
  }

  return (
    <div className={`text-sm leading-relaxed text-zinc-600 ${className}`}>
      {lines.map((line) => (
        <p key={line} className="m-0">
          {line}
        </p>
      ))}
    </div>
  );
}

export function addressesMatch(
  shipping?: HttpTypes.StoreCartAddress | null,
  billing?: HttpTypes.StoreCartAddress | null
) {
  if (!shipping || !billing) return false;

  return (
    String(shipping.address_1 || "") === String(billing.address_1 || "") &&
    String(shipping.city || "") === String(billing.city || "") &&
    String(shipping.postal_code || "") === String(billing.postal_code || "") &&
    String(shipping.country_code || "").toLowerCase() ===
      String(billing.country_code || "").toLowerCase()
  );
}
