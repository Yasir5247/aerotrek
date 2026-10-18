import clsx from "clsx";
import type { ReactNode } from "react";
import { FIELD_CLASS, FIELD_GRID_CLASS } from "@/lib/ui/form";
import Label from "./Label";
import type { LabelVariant } from "@/lib/ui/form";

type FieldProps = {
  label?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
  labelVariant?: LabelVariant;
  compact?: boolean;
};

export default function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
  labelVariant = "storefront",
  compact = false,
}: FieldProps) {
  return (
    <div className={clsx(compact ? FIELD_GRID_CLASS : FIELD_CLASS, className)}>
      {label ? (
        <Label variant={labelVariant} htmlFor={htmlFor}>
          {label}
        </Label>
      ) : null}
      {children}
      {hint ? (
        <p className="mt-1.5 text-[13px] leading-snug text-black/60">{hint}</p>
      ) : null}
      {error ? (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
