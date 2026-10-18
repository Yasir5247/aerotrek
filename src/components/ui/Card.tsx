import clsx from "clsx";
import { GLASS_PANEL_RADIUS_CLASS } from "@/lib/ui/glass-panel";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const CARD_VARIANT_CLASS = {
  solid: "border border-black/[0.06] bg-white",
  muted: "border border-black/[0.06] bg-white/80",
  dashed: "border border-dashed border-black/10 bg-[#fafafa]",
} as const;

type CardVariant = keyof typeof CARD_VARIANT_CLASS;

type CardProps<T extends ElementType = "div"> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  variant?: CardVariant;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function Card<T extends ElementType = "div">({
  as,
  children,
  className,
  variant = "solid",
  ...rest
}: CardProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={clsx(GLASS_PANEL_RADIUS_CLASS, CARD_VARIANT_CLASS[variant], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
