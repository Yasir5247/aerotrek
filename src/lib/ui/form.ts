import clsx from "clsx";

export const LABEL_VARIANT_CLASS = {
  storefront:
    "text-[11px] font-black uppercase tracking-[0.12em] text-black/50",
  auth:
    "text-[11px] font-black uppercase tracking-[0.12em] text-black/[0.52]",
  checkout:
    "text-[11px] font-extrabold uppercase tracking-[0.1em] text-zinc-500",
} as const;

export type LabelVariant = keyof typeof LABEL_VARIANT_CLASS;

export function labelVariants({
  variant = "storefront",
  className,
}: {
  variant?: LabelVariant;
  className?: string;
} = {}) {
  return clsx(LABEL_VARIANT_CLASS[variant], className);
}

export const FIELD_CLASS = "mb-5";
export const FIELD_GRID_CLASS = "mb-3.5 grid gap-2";
export const FORM_ACTIONS_CLASS = "mt-2.5 flex justify-end";
