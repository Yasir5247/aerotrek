import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { selectionCardClass } from "./RadioIndicator";

type SelectionCardProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  disabled?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
};

export default function SelectionCard({
  active = false,
  disabled,
  leading,
  trailing,
  children,
  className,
  type = "button",
  ...rest
}: SelectionCardProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(selectionCardClass(active, disabled), className)}
      {...rest}
    >
      <span className="flex min-w-0 flex-1 items-start gap-3">{leading}{children}</span>
      {trailing}
    </button>
  );
}
