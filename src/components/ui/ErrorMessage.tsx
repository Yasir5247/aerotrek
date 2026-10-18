import clsx from "clsx";
import type { HTMLAttributes } from "react";

type ErrorMessageProps = HTMLAttributes<HTMLDivElement> & {
  error?: string | null;
};

export default function ErrorMessage({
  error,
  className,
  ...rest
}: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div
      className={clsx(
        "mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700",
        className
      )}
      role="alert"
      {...rest}
    >
      {error}
    </div>
  );
}
