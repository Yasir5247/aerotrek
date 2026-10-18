import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { GLASS_PANEL_CLASS } from "@/lib/ui/glass-panel";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  children?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: ContainerProps<T>) {
  const Component = as || "div";

  return (
    <Component className={clsx(GLASS_PANEL_CLASS, className)} {...rest}>
      {children}
    </Component>
  );
}
