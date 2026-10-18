import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { labelVariants, type LabelVariant } from "@/lib/ui/form";

type LabelProps = ComponentPropsWithoutRef<"label"> & {
  variant?: LabelVariant;
};

export default function Label({
  className,
  variant = "storefront",
  ...rest
}: LabelProps) {
  return (
    <label className={clsx(labelVariants({ variant }), className)} {...rest} />
  );
}
