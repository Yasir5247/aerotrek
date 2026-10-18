"use client";

import { HttpTypes } from "@aiminaabeejs/types";
import CheckoutRadio, { selectionCardClass } from "./checkout-radio";

export default function ShippingItemSelector({
  shippingOption,
  isSelected,
  disabled,
  priceLabel,
  onSelect,
  description,
}: {
  shippingOption: HttpTypes.StoreCartShippingOption;
  isSelected: boolean;
  disabled?: boolean;
  priceLabel: string;
  onSelect: () => void;
  description?: string | null;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={selectionCardClass(isSelected, disabled)}
    >
      <span className="flex min-w-0 items-start gap-3">
        <CheckoutRadio checked={isSelected} />
        <span className="min-w-0 text-left">
          <span className="block text-sm font-semibold text-zinc-900">
            {shippingOption.name}
          </span>
          {description ? (
            <span className="mt-0.5 block text-xs leading-relaxed text-zinc-500">
              {description}
            </span>
          ) : null}
        </span>
      </span>
      <span className="shrink-0 text-sm font-semibold text-zinc-700">
        {priceLabel}
      </span>
    </button>
  );
}
