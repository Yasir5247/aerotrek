import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { buttonVariants, type ButtonSize, type ButtonVariant } from "@/lib/ui/button";

type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function Button<T extends ElementType = "button">({
  as,
  children,
  className,
  variant = "secondary",
  size = "md",
  fullWidth,
  ...rest
}: ButtonProps<T>) {
  const Component = as || "button";
  const isNativeButton = Component === "button";

  return (
    <Component
      className={clsx(
        buttonVariants({ variant, size }),
        fullWidth && "w-full",
        className
      )}
      {...(isNativeButton ? { type: "button" as const } : {})}
      {...rest}
    >
      {children}
    </Component>
  );
}
