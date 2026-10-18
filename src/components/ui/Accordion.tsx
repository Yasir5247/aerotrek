"use client";

import clsx from "clsx";
import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";

type AccordionItemProps = {
  id: string;
  title: string;
  openId: string | null;
  onToggle: (id: string) => void;
  children: ReactNode;
  className?: string;
};

export default function AccordionItem({
  id,
  title,
  openId,
  onToggle,
  children,
  className,
}: AccordionItemProps) {
  const open = openId === id;

  return (
    <div className={clsx("border-b border-[#e8e8e8]", className)}>
      <button
        type="button"
        className="flex min-h-14 w-full cursor-pointer items-center justify-between border-0 bg-transparent py-3 text-left text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-[#171717] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
        aria-expanded={open}
        aria-controls={`accordion-${id}`}
        onClick={() => onToggle(id)}
      >
        <span>{title}</span>
        {open ? (
          <Minus className="shrink-0" size={18} strokeWidth={1.75} />
        ) : (
          <Plus className="shrink-0" size={18} strokeWidth={1.75} />
        )}
      </button>
      {open ? (
        <div
          id={`accordion-${id}`}
          className="pb-[18px] text-[0.9375rem] leading-[1.65] text-[#404040] [&_p+p]:mt-2.5"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
