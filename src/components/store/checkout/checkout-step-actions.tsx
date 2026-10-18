"use client";

import clsx from "clsx";
import Button from "@/components/ui/Button";

export default function CheckoutStepActions({
  onBack,
  backLabel = "Back",
  showBack = true,
  onPrimary,
  primaryLabel,
  primaryDisabled,
  primaryLoading,
  primaryTestId,
  primaryType = "button",
}: {
  onBack?: () => void;
  backLabel?: string;
  showBack?: boolean;
  onPrimary?: () => void;
  primaryLabel: string;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  primaryTestId?: string;
  primaryType?: "button" | "submit";
}) {
  return (
    <div className="flex items-center gap-4">
      {showBack && onBack ? (
        <Button type="button" variant="checkoutSecondary" size="checkout" onClick={onBack}>
          {backLabel}
        </Button>
      ) : null}
      <Button
        type={primaryType}
        variant="checkoutPrimary"
        size="checkout"
        disabled={primaryDisabled || primaryLoading}
        onClick={primaryType === "button" ? onPrimary : undefined}
        data-testid={primaryTestId}
        className={clsx(!showBack && "w-full flex-[1_1_100%]")}
      >
        {primaryLoading ? "Please wait…" : primaryLabel}
      </Button>
    </div>
  );
}
