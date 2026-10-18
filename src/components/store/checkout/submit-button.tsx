"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className = "",
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#111] px-5 text-[13px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#5a5a5a] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}
