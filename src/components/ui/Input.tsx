import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { inputVariants, type InputVariant } from "@/lib/ui/input";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  variant?: InputVariant;
};

export default function Input({
  className,
  variant = "storefront",
  ...rest
}: InputProps) {
  return (
    <input className={clsx(inputVariants({ variant }), className)} {...rest} />
  );
}
