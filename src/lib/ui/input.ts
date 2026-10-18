import clsx from "clsx";

export const INPUT_VARIANT_CLASS = {
  storefront:
    "h-11 w-full rounded-xl border border-black/10 bg-white/85 px-[15px] text-black transition-[border-color,box-shadow] duration-200 focus:border-[rgba(90,90,90,0.45)] focus:shadow-[0_0_0_4px_rgba(90,90,90,0.12)] focus:outline-none",
  auth:
    "h-[46px] w-full rounded-xl border border-black/[0.12] bg-white/90 px-3.5 text-sm text-[#111] transition-[border-color,box-shadow,background-color] placeholder:text-black/[0.42] hover:border-black/[0.18] focus:border-[rgba(90,90,90,0.45)] focus:bg-white focus:outline-none focus:shadow-[0_0_0_4px_rgba(90,90,90,0.14)]",
  review:
    "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-[#111] outline-none transition focus:border-[#111]",
  checkout:
    "mt-1.5 block h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400",
} as const;

export type InputVariant = keyof typeof INPUT_VARIANT_CLASS;

export function inputVariants({
  variant = "storefront",
  className,
}: {
  variant?: InputVariant;
  className?: string;
} = {}) {
  return clsx(INPUT_VARIANT_CLASS[variant], className);
}

export function textareaVariants({
  variant = "review",
  className,
}: {
  variant?: InputVariant;
  className?: string;
} = {}) {
  return clsx(INPUT_VARIANT_CLASS[variant], "resize-y", className);
}
