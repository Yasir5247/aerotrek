import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { textareaVariants, type InputVariant } from "@/lib/ui/input";

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  variant?: InputVariant;
};

export default function Textarea({
  className,
  variant = "review",
  ...rest
}: TextareaProps) {
  return (
    <textarea
      className={clsx(textareaVariants({ variant }), className)}
      {...rest}
    />
  );
}
