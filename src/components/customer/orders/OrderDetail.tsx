"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { getOrderTimelineEvents } from "@/lib/util/orderTimeline";
import {
  formatMoney,
  formatOrderDate,
  getOrderDisplayId,
  getOrderItemImage,
  getOrderItemName,
  getOrderItemProductId,
  getOrderItems,
  getOrderShipTo,
} from "@/lib/helpers/account-order";
import { useCountryPath } from "@/hooks/use-country-path";

const timelineDotTone: Record<string, string> = {
  info: "border-[rgba(90,90,90,0.35)] bg-[rgba(90,90,90,0.12)] text-[#5a5a5a]",
  success: "border-[rgba(39,174,96,0.35)] bg-[rgba(39,174,96,0.12)] text-[#1e8449]",
  danger: "border-[rgba(192,57,43,0.35)] bg-[rgba(192,57,43,0.12)] text-[#c0392b]",
  warn: "border-[rgba(243,156,18,0.35)] bg-[rgba(243,156,18,0.12)] text-[#d68910]",
};

export default function OrderDetail({ order }: { order?: any }) {
  const toCountryPath = useCountryPath();
  const currency = useSelector((state: any) => state.currency);
  const items = getOrderItems(order);
  const shipTo = getOrderShipTo(order);
  const timeline = getOrderTimelineEvents(order, { audience: "customer" });
  const totalLabel = formatMoney(
    order.total,
    order.currency_code || order.currency,
    currency?.currencySymbol
  );

  return (
    <div className="bg-white">
      <article className="overflow-hidden rounded-[18px] bg-white p-4 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
        <div className="mb-3.5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[15px] font-extrabold tracking-[-0.01em] text-[#111]">
              {formatOrderDate(order.created_at)}
            </div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.06em] text-black/[0.48]">
              Order {getOrderDisplayId(order)}
            </div>
          </div>
        </div>
        <div className="rounded-[14px] border border-black/[0.08] bg-white p-3.5 px-4">
          <div className="grid grid-cols-4 gap-3 pb-1 max-md:grid-cols-2">
            <div>
              <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-black/45">
                Status
              </span>
              <span className="break-words text-sm font-extrabold text-[#111]">
                {order.status || order.fulfillment_status || "—"}
              </span>
            </div>
            <div>
              <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-black/45">
                Total
              </span>
              <span className="break-words text-sm font-extrabold text-[#111]">{totalLabel}</span>
            </div>
            {shipTo ? (
              <div className="col-span-2 max-md:col-span-2">
                <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-black/45">
                  Ship to
                </span>
                <span className="break-words text-sm font-extrabold text-[#111]">{shipTo}</span>
              </div>
            ) : null}
          </div>

          {items.length > 0 ? (
            <ul className="mt-2.5 flex list-none flex-col gap-2.5 border-t border-black/[0.06] p-0 pt-3">
              {items.map((item) => {
                const imageSrc = getOrderItemImage(item);
                const name = getOrderItemName(item);
                const productId = getOrderItemProductId(item);
                return (
                  <li
                    className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3"
                    key={item.id}
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-xl border border-black/[0.06] bg-[#f5f5f5]">
                      {imageSrc ? (
                        <img className="h-full w-full object-cover" src={imageSrc} alt={name} />
                      ) : (
                        <div
                          className="h-full w-full bg-[linear-gradient(135deg,#f3f4f7_0%,#e9ebf0_100%)]"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div>
                      {productId ? (
                        <Link
                          className="line-clamp-2 text-sm font-extrabold leading-[1.35] text-[#111] no-underline hover:text-[#5a5a5a]"
                          href={`/product/${productId}`}
                        >
                          {name}
                        </Link>
                      ) : (
                        <span className="line-clamp-2 text-sm font-extrabold leading-[1.35] text-[#111]">
                          {name}
                        </span>
                      )}
                      <div className="mt-1 text-xs text-black/[0.55]">Qty {item.quantity}</div>
                    </div>
                    <div className="whitespace-nowrap text-[13px] font-extrabold text-[#111]">
                      {formatMoney(
                        item.total ?? item.unit_price,
                        order.currency_code || order.currency,
                        currency?.currencySymbol
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-[13px] text-black/50">No line items on this order.</p>
          )}
        </div>

        {timeline.length ? (
          <div className="mt-3.5 overflow-hidden rounded-xl border border-black/[0.06] bg-[#fafafa]">
            <ol className="m-0 flex list-none flex-col p-0">
              {timeline.map((event, index) => {
                const Icon = event.Icon;
                const isLatest = index === timeline.length - 1;
                const toneClass = timelineDotTone[event.tone] || timelineDotTone.info;
                return (
                  <li
                    key={event.id || `${event.type}-${event.created_at}-${index}`}
                    className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-x-3 pb-3.5 last:pb-0"
                  >
                    <span className="relative flex justify-center" aria-hidden="true">
                      <span
                        className="absolute bottom-0 top-5 w-px bg-black/[0.08] last:hidden"
                        aria-hidden="true"
                      />
                      <span
                        className={clsx(
                          "relative z-[1] flex h-8 w-8 items-center justify-center rounded-full border",
                          toneClass,
                          isLatest && "ring-2 ring-black/[0.06]"
                        )}
                      >
                        <Icon size={14} strokeWidth={2.25} />
                      </span>
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <strong className="text-sm font-extrabold text-[#111]">{event.title}</strong>
                        <time
                          className="text-xs font-semibold text-black/50"
                          dateTime={event.created_at || undefined}
                        >
                          {formatOrderDate(event.created_at, true)}
                        </time>
                      </div>
                      {event.message ? (
                        <p className="mb-0 mt-1 text-[13px] leading-[1.5] text-black/[0.62]">
                          {event.message}
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}
      </article>
      <div className="mt-[18px] flex justify-start">
        <Link
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/10 bg-transparent px-4 text-xs font-extrabold uppercase tracking-[0.06em] text-black/[0.86] no-underline transition hover:-translate-y-px hover:border-black/[0.18] hover:bg-black/[0.03] hover:text-[#111] focus-visible:border-[rgba(90,90,90,0.5)] focus-visible:shadow-[0_0_0_3px_rgba(90,90,90,0.16)] focus-visible:outline-none"
          href={toCountryPath("/my-orders")}
        >
          Back to orders
        </Link>
      </div>
    </div>
  );
}
