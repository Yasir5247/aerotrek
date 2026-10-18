import { HttpTypes } from "@aiminaabeejs/types";
import { paymentMethodsData } from "@lib/checkout/payment-methods";

export default function PaymentMethodInfo({
  session,
}: {
  session?: HttpTypes.StorePaymentSession | null;
}) {
  if (!session?.provider_id) {
    return <p className="m-0 text-sm text-zinc-500">Not selected</p>;
  }

  const info = paymentMethodsData[session.provider_id];

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-700">
      {info?.icon}
      <span className="font-medium text-zinc-900">
        {info?.title || session.provider_id}
      </span>
    </div>
  );
}
