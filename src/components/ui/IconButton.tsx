import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { buttonVariants } from "@/lib/ui/button";

type IconButtonProps = ComponentPropsWithoutRef<"button"> & {
  label: string;
};

export default function IconButton({
  className,
  label,
  children,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={clsx(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "border-black/[0.06] bg-white/[0.38] hover:-translate-y-px hover:border-black/10 hover:bg-white/[0.58] lg:hidden",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
