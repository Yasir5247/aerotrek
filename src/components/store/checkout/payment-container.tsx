"use client";

import { paymentMethodsData } from "@lib/checkout/payment-methods";
import CheckoutRadio, { selectionCardClass } from "./checkout-radio";

export default function PaymentContainer({
  paymentProviderId,
  selectedPaymentOptionId,
  disabled,
  onSelect,
  children,
}: {
  paymentProviderId: string;
  selectedPaymentOptionId: string | null;
  disabled?: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
}) {
  const isSelected = selectedPaymentOptionId === paymentProviderId;
  const info = paymentMethodsData[paymentProviderId];

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onSelect}
        className={selectionCardClass(isSelected, disabled)}
      >
        <span className="flex items-center gap-3">
          <CheckoutRadio checked={isSelected} />
          <span className="text-sm font-semibold text-zinc-900">
            {info?.title || paymentProviderId}
          </span>
        </span>
        <span className="text-zinc-700">{info?.icon}</span>
      </button>
      {isSelected ? children : null}
    </div>
  );
}
