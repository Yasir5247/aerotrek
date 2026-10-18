import clsx from "clsx";
import type { HTMLAttributes } from "react";

const BADGE_VARIANT_CLASS = {
  default: "border border-black/[0.08] bg-black/[0.03] text-black/75",
  dark: "border border-black/10 bg-[#fafafa] text-[#111]",
  status: "border border-black/[0.08] bg-white/80 text-black/70",
  new: "border-0 bg-[rgba(17,17,17,0.92)] text-white",
  success: "border-[rgba(39,174,96,0.35)] bg-[rgba(39,174,96,0.08)] text-[#1e8449]",
  info: "border-[rgba(90,90,90,0.4)] bg-[rgba(90,90,90,0.1)] text-[#454545]",
  danger: "border-[rgba(192,57,43,0.35)] bg-[rgba(192,57,43,0.08)] text-[#c0392b]",
  muted: "border-black/10 bg-black/[0.02] text-black/70",
} as const;

export type BadgeVariant = keyof typeof BADGE_VARIANT_CLASS;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export default function Badge({
  className,
  variant = "default",
  ...rest
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex h-7 items-center justify-center whitespace-nowrap rounded-full px-3 text-[11px] font-extrabold uppercase tracking-[0.08em]",
        BADGE_VARIANT_CLASS[variant],
        className
      )}
      {...rest}
    />
  );
}

const STATUS_LABELS: Record<string, BadgeVariant> = {
  DELIVERED: "success",
  PAID: "success",
  SHIPPED: "info",
  CANCELLED: "danger",
  REFUNDED: "danger",
};

export function statusBadgeVariant(status?: string | null): BadgeVariant {
  const key = String(status || "").toUpperCase();
  return STATUS_LABELS[key] || "muted";
}

export function precheckBadgeVariant(precheck?: string | null): BadgeVariant {
  const key = String(precheck || "").toUpperCase();
  if (key === "PASS") return "success";
  if (key === "WARN") return "info";
  if (key === "FAIL") return "danger";
  return "muted";
}
