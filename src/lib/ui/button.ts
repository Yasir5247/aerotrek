import clsx from "clsx";

const buttonBase =
  "inline-flex cursor-pointer items-center justify-center font-extrabold uppercase tracking-[0.06em] transition duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none";

export const BUTTON_VARIANT_CLASS = {
  primary:
    "border border-[#111] bg-[#111] text-white hover:border-[#5a5a5a] hover:bg-[#5a5a5a] hover:text-white",
  secondary:
    "border border-black/10 bg-white text-[#111] hover:-translate-y-px hover:border-[rgba(90,90,90,0.35)] hover:text-[#5a5a5a]",
  ghost:
    "border border-black/10 bg-transparent text-black/[0.86] hover:-translate-y-px hover:border-black/[0.18] hover:bg-black/[0.03] hover:text-[#111]",
  danger:
    "border border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700 hover:text-white",
  auth:
    "min-h-12 w-full rounded-xl border border-black/85 bg-gradient-to-b from-[#111] to-black px-[18px] py-3.5 text-sm tracking-[0.08em] text-white hover:-translate-y-px hover:bg-gradient-to-b hover:from-[#2b2b2b] hover:to-[#0f0f0f] hover:shadow-[0_16px_44px_rgba(0,0,0,0.18)]",
  pill:
    "rounded-full bg-[#1c1917] px-6 text-xs tracking-[0.1em] text-white hover:bg-[#5a5a5a]",
  accountSubmit:
    "rounded-full bg-[#111] px-[26px] py-3.5 text-[11px] tracking-[0.12em] text-white hover:bg-[#5a5a5a]",
  pdp:
    "rounded-sm border-0 bg-[#171717] text-white hover:bg-black hover:text-white",
  pdpMuted:
    "rounded-sm border-0 bg-[#efefef] text-[#171717] hover:bg-[#e4e4e4] hover:text-[#171717]",
  checkoutPrimary:
    "rounded-xl bg-zinc-900 text-[13px] tracking-[0.08em] text-white hover:bg-zinc-800",
  checkoutSecondary:
    "rounded-xl border border-zinc-200 bg-white text-[13px] tracking-[0.08em] text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50",
  wishlistDanger:
    "h-11 rounded-xl border border-[rgba(192,57,43,0.35)] bg-white px-4 text-xs tracking-[0.06em] text-[#c0392b] hover:border-[rgba(192,57,43,0.55)] hover:bg-[rgba(192,57,43,0.06)] hover:text-[#c0392b]",
  wishlistGhost:
    "h-11 rounded-xl border border-black/10 bg-transparent px-4 text-xs tracking-[0.06em] text-black/[0.86] hover:-translate-y-px hover:border-black/[0.18] hover:bg-black/[0.03] hover:text-[#111]",
} as const;

export const BUTTON_SIZE_CLASS = {
  sm: "min-h-[44px] rounded-xl px-4 text-xs",
  md: "min-h-[46px] min-w-[170px] rounded-xl px-5 text-[13px] max-md:h-11 max-md:w-full max-md:min-w-0 max-md:text-xs",
  lg: "min-h-[52px] rounded-sm px-5 py-3.5 text-[0.8125rem]",
  checkout: "min-h-[48px] flex-1 rounded-xl px-5 text-[13px]",
  account: "min-h-0 rounded-full px-[26px] py-3.5 text-[11px]",
  icon: "h-11 w-11 shrink-0 rounded-xl p-0",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANT_CLASS;
export type ButtonSize = keyof typeof BUTTON_SIZE_CLASS;

export function buttonVariants({
  variant = "secondary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return clsx(buttonBase, BUTTON_SIZE_CLASS[size], BUTTON_VARIANT_CLASS[variant], className);
}
