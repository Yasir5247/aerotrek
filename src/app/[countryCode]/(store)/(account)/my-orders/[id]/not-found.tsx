"use client";

import Link from "next/link";
import { useCountryPath } from "@/hooks/use-country-path";

export default function OrderNotFound() {
  const toCountryPath = useCountryPath();

  return (
    <div>
      <div className="mb-[18px]">
        <h1 className="mb-1.5 text-2xl font-black tracking-[-0.03em] text-[#111]">Order not found</h1>
        <p className="m-0 text-sm text-black/60">We could not find that order.</p>
      </div>
      <Link
        className="flex w-full flex-col items-start gap-1 rounded-[18px] border border-black/[0.06] bg-white/75 p-4 text-left text-inherit no-underline shadow-[0_12px_32px_rgba(0,0,0,0.04)] transition-[border-color] hover:border-[rgba(90,90,90,0.35)]"
        href={toCountryPath("/my-orders")}
      >
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/45">
          Orders
        </span>
        <span className="text-sm font-extrabold text-[#111]">Back to order list</span>
      </Link>
    </div>
  );
}
