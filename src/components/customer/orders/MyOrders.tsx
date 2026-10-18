"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Paginator from "react-hooks-paginator";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { fetchUserOrders } from "@/lib/actions/orderService";
import Badge, { precheckBadgeVariant, statusBadgeVariant } from "@/components/ui/Badge";
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

const ORDERS_PAGE_SIZE = 15;

const STATUS_LABELS = {
  PENDING: "Pending",
  PAID: "Paid",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  REVIEW_REQUIRED: "Review required",
  AWAITING_SLIP: "Awaiting slip",
  REJECTED: "Rejected",
  UNFULFILLED: "Unfulfilled",
  PROCESSING: "Processing",
  READY_TO_SHIP: "Ready to ship",
  RETURNED: "Returned",
  PARTIALLY_REFUNDED: "Partially refunded",
};

const PRECHECK_LABELS = {
  PASS: "Precheck pass",
  WARN: "Needs review",
  FAIL: "Precheck fail",
};

const timelineDotClass = (tone, isLatest) => {
  const toneMap = {
    info: "border-[rgba(29,78,216,0.2)] bg-blue-50 text-blue-700",
    success: "border-[rgba(21,128,61,0.22)] bg-green-50 text-green-700",
    danger: "border-[rgba(185,28,28,0.22)] bg-red-50 text-red-700",
    warn: "border-[rgba(180,83,9,0.22)] bg-amber-50 text-amber-700",
  };
  const latestShadow = {
    info: "",
    success: isLatest ? "shadow-[0_0_0_3px_rgba(21,128,61,0.12)]" : "",
    danger: "",
    warn: "",
  };
  return clsx(
    "relative z-[1] inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white text-black/55 shadow-sm",
    toneMap[tone] || "",
    isLatest && !toneMap[tone] ? "shadow-[0_0_0_3px_rgba(0,0,0,0.04)]" : latestShadow[tone]
  );
};

const MyOrders = ({ initialOrders }: { initialOrders?: any }) => {
  const toCountryPath = useCountryPath();
  const currency = useSelector((state: any) => state.currency);

  const [orders, setOrders] = useState(initialOrders?.orders ?? []);
  const [totalRecords, setTotalRecords] = useState(initialOrders?.total ?? 0);
  const [currentPage, setCurrentPage] = useState(initialOrders?.page ?? 1);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(!initialOrders);
  const [error, setError] = useState("");
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const toggleOrderDetails = (orderId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const pageLimit = ORDERS_PAGE_SIZE;

  const loadOrders = useCallback(
    async (page) => {
      setLoading(true);
      setError("");
      try {
        const result = await fetchUserOrders({ page, pageSize: pageLimit });
        setOrders(result.orders);
        setTotalRecords(result.total);
      } catch (err: any) {
        console.error("Failed to load orders:", err);
        setOrders([]);
        setTotalRecords(0);
        setError(err?.message || "Could not load your orders.");
      } finally {
        setLoading(false);
      }
    },
    [pageLimit]
  );

  useEffect(() => {
    const page = Math.floor(offset / pageLimit) + 1;
    setCurrentPage(page);
    if (page === 1 && offset === 0 && initialOrders?.orders) {
      setOrders(initialOrders.orders);
      setTotalRecords(initialOrders.total);
      setLoading(false);
      return;
    }
    loadOrders(page);
  }, [offset, pageLimit, loadOrders, initialOrders]);

  const isEmpty = !loading && !error && orders.length < 1;
  const showList = !loading && !error && orders.length >= 1;

  return (
    <div
      className={clsx(
        "bg-transparent p-0",
        isEmpty && "bg-gradient-to-b from-[#f8f9fb] to-white"
      )}
    >
      <div className="mb-[18px]">
        <div className="flex flex-wrap items-end justify-between gap-3.5">
          <div>
            <h1 className="m-0 mb-1.5 text-xl font-extrabold tracking-[-0.02em] text-[#111] max-md:text-2xl">
              My Orders
            </h1>
            <p className="m-0 text-sm text-black/[0.58]">
              {loading
                ? "Loading your orders…"
                : `${totalRecords} order${totalRecords === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className="my-2 mb-[18px] rounded-[14px] border border-black/[0.08] bg-black/[0.02] px-[18px] py-4 text-sm text-black/[0.62]"
          role="status"
          aria-live="polite"
        >
          Loading orders…
        </div>
      ) : null}

      {error ? (
        <div
          className="my-2 mb-[18px] rounded-[14px] border border-[rgba(192,57,43,0.28)] bg-[rgba(192,57,43,0.06)] px-[18px] py-4 text-sm text-[#c0392b]"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {isEmpty ? (
        <div className="mt-2 rounded-[18px] border border-black/[0.08] bg-gradient-to-b from-white to-[#fafafa] px-[26px] py-11 text-center shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_20px_56px_rgba(0,0,0,0.06)] max-md:rounded-[14px] max-md:px-4 max-md:py-[30px]">
          <div className="mx-auto mb-3.5 flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[rgba(90,90,90,0.08)] max-md:mb-2.5 max-md:h-[74px] max-md:w-[74px]">
            <i className="pe-7s-shopbag text-[52px] text-[rgba(90,90,90,0.75)] max-md:text-[40px]" />
          </div>
          <div>
            <h4 className="m-0 mb-2 text-[26px] font-extrabold tracking-[-0.02em] text-[#111] max-md:mb-1.5 max-md:text-[22px]">
              No orders yet
            </h4>
            <p className="mx-auto mb-[18px] max-w-prose text-[15px] leading-relaxed text-black/55 max-md:mb-4 max-md:text-sm">
              When you place an order, it will show up here with dates and details.
            </p>
            <Link
              href={toCountryPath("/shop")}
              className="inline-flex h-[46px] min-w-[190px] items-center justify-center rounded-xl bg-[#111] px-5 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition-[background,transform] duration-200 hover:-translate-y-px hover:bg-[#5a5a5a] max-md:w-full max-md:min-w-0"
            >
              Browse products
            </Link>
          </div>
        </div>
      ) : null}

      {showList ? (
        <Fragment>
          <div className="mt-1.5 flex flex-col gap-3.5">
            {orders.map((order) => {
              const items = getOrderItems(order);
              const itemCount = items.reduce(
                (sum, item) => sum + (Number(item.quantity) || 0),
                0
              );
              const shipTo = getOrderShipTo(order);
              const timeline = getOrderTimelineEvents(order, {
                audience: "customer",
              });
              const timelineId = `order-timeline-${order.id}`;
              const isTimelineOpen = expandedIds.has(order.id);
              const totalLabel = formatMoney(
                order.total,
                order.currency_code || order.currency,
                currency.currencySymbol
              );
              const latestUpdate = timeline.length ? timeline[timeline.length - 1] : null;

              return (
                <article
                  className="overflow-hidden rounded-[18px] bg-white p-4 shadow-[0_18px_60px_rgba(0,0,0,0.06)] max-md:rounded-[14px]"
                  key={order.id}
                >
                  <div className="mb-3.5 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-[15px] font-extrabold tracking-[-0.01em] text-[#111]">
                        {formatOrderDate(order.created_at)}
                      </div>
                      <div className="mt-1 text-xs font-bold uppercase tracking-[0.06em] text-black/[0.48]">
                        <Link href={toCountryPath(`/my-orders/${order.id}`)}>
                          Order {getOrderDisplayId(order)}
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <Badge variant={statusBadgeVariant(order.payment_status || order.status)}>
                        Pay:{" "}
                        {STATUS_LABELS[order.payment_status] ||
                          STATUS_LABELS[order.status] ||
                          order.payment_status ||
                          order.status ||
                          "Unknown"}
                      </Badge>
                      <Badge variant={statusBadgeVariant(order.fulfillment_status || order.status)}>
                        Ship:{" "}
                        {STATUS_LABELS[order.fulfillment_status] ||
                          order.fulfillment_status ||
                          STATUS_LABELS[order.status] ||
                          "—"}
                      </Badge>
                      {order.payment_precheck ? (
                        <Badge
                          variant={precheckBadgeVariant(order.payment_precheck)}
                          title="Automatic slip check — final confirmation is still done by AeroTrek"
                        >
                          {PRECHECK_LABELS[order.payment_precheck] ||
                            order.payment_precheck}
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-[14px] border border-black/[0.08] bg-white px-4 py-3.5 max-md:px-3.5 max-md:py-3">
                    <div className="grid grid-cols-4 gap-3 pb-1 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-2.5">
                      <div>
                        <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-black/45">
                          Total
                        </span>
                        <span className="break-words text-sm font-extrabold text-[#111]">
                          {totalLabel}
                        </span>
                      </div>
                      <div>
                        <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-black/45">
                          Items
                        </span>
                        <span className="break-words text-sm font-extrabold text-[#111]">
                          {itemCount} item{itemCount === 1 ? "" : "s"}
                        </span>
                      </div>
                      {shipTo ? (
                        <div>
                          <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-black/45">
                            Ship to
                          </span>
                          <span className="break-words text-sm font-extrabold text-[#111]">
                            {shipTo}
                          </span>
                        </div>
                      ) : null}
                      {order.delivered_at ? (
                        <div>
                          <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-black/45">
                            Delivered
                          </span>
                          <span className="break-words text-sm font-extrabold text-[#111]">
                            {formatOrderDate(order.delivered_at)}
                          </span>
                        </div>
                      ) : null}
                      {order.tracking_number ? (
                        <div>
                          <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-black/45">
                            Tracking
                          </span>
                          <span className="break-words text-sm font-extrabold text-[#111]">
                            {order.tracking_url ? (
                              <a
                                href={order.tracking_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {order.carrier ? `${order.carrier} · ` : ""}
                                {order.tracking_number}
                              </a>
                            ) : (
                              <>
                                {order.carrier ? `${order.carrier} · ` : ""}
                                {order.tracking_number}
                              </>
                            )}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {items.length > 0 ? (
                      <ul className="m-0 mt-2.5 flex list-none flex-col gap-2.5 border-t border-black/[0.06] p-0 pt-3">
                        {items.map((item) => {
                          const imageSrc = getOrderItemImage(item);
                          const name = getOrderItemName(item);
                          const productId = getOrderItemProductId(item);
                          const lineTotal =
                            item.total ??
                            Number(item.unit_price) * Number(item.quantity || 0);

                          return (
                            <li
                              className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 max-md:grid-cols-[56px_minmax(0,1fr)] max-md:gap-2.5"
                              key={item.id}
                            >
                              <div className="h-16 w-16 overflow-hidden rounded-xl border border-black/[0.06] bg-[#f5f5f5] max-md:h-14 max-md:w-14 max-md:rounded-[10px]">
                                {imageSrc ? (
                                  <img
                                    src={imageSrc}
                                    alt={name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div
                                    className="h-full w-full bg-gradient-to-br from-[#f3f4f7] to-[#e9ebf0]"
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                              <div>
                                {productId ? (
                                  <Link
                                    className="line-clamp-2 text-sm font-extrabold leading-snug text-[#111] no-underline hover:text-[#5a5a5a]"
                                    href={toCountryPath(`/product/${productId}`)}
                                  >
                                    {name}
                                  </Link>
                                ) : (
                                  <span className="line-clamp-2 text-sm font-extrabold leading-snug text-[#111]">
                                    {name}
                                  </span>
                                )}
                                <div className="mt-1 text-xs text-black/55">
                                  Qty {item.quantity}
                                  {item.unit_price != null
                                    ? ` · ${formatMoney(
                                        item.unit_price,
                                        order.currency_code || order.currency,
                                        currency.currencySymbol
                                      )} each`
                                    : ""}
                                </div>
                              </div>
                              <div className="whitespace-nowrap text-[13px] font-extrabold text-[#111] max-md:col-start-2 max-md:justify-self-start">
                                {formatMoney(
                                  lineTotal,
                                  order.currency_code || order.currency,
                                  currency.currencySymbol
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-3 text-[13px] text-black/50">
                        No line items on this order.
                      </p>
                    )}
                  </div>

                  {timeline.length ? (
                    <div
                      className={clsx(
                        "mt-3.5 overflow-hidden rounded-xl border border-black/[0.06] bg-[#fafafa]"
                      )}
                    >
                      <button
                        type="button"
                        className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-3.5 py-3 text-left hover:bg-black/[0.02] focus-visible:shadow-[inset_0_0_0_2px_rgba(90,90,90,0.35)] focus-visible:outline-none max-md:items-start max-md:gap-2.5 max-md:p-3"
                        aria-expanded={isTimelineOpen}
                        aria-controls={timelineId}
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="mb-0.5 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-black/45">
                            Updates
                          </span>
                          <span className="text-xs font-semibold leading-snug text-black/55">
                            {latestUpdate
                              ? `${latestUpdate.title}${
                                  latestUpdate.created_at
                                    ? ` · ${formatOrderDate(
                                        latestUpdate.created_at,
                                        true
                                      )}`
                                    : ""
                                }`
                              : `${timeline.length} update${
                                  timeline.length === 1 ? "" : "s"
                                }`}
                          </span>
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.06em] text-black/55">
                          <span>{isTimelineOpen ? "Hide" : "Show"}</span>
                          <ChevronDown
                            size={18}
                            strokeWidth={2.25}
                            className={clsx(
                              "text-black/55 transition-transform duration-200",
                              isTimelineOpen && "rotate-180"
                            )}
                            aria-hidden="true"
                          />
                        </span>
                      </button>
                      <div
                        id={timelineId}
                        className="border-t border-black/[0.06] px-3.5 pb-3.5"
                        hidden={!isTimelineOpen}
                      >
                        <ol className="m-0 flex list-none flex-col p-0">
                          {timeline.map((event, index) => {
                            const Icon = event.Icon;
                            const isLatest = index === timeline.length - 1;
                            return (
                              <li
                                key={
                                  event.id ||
                                  `${event.type}-${event.created_at}-${index}`
                                }
                                className="group relative grid grid-cols-[32px_minmax(0,1fr)] gap-x-3 pb-3.5 last:pb-0"
                              >
                                <span
                                  className="relative flex items-start justify-center before:absolute before:bottom-[-14px] before:left-1/2 before:top-7 before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-black/[0.12] before:to-black/[0.05] before:content-[''] group-last:before:hidden"
                                  aria-hidden="true"
                                >
                                  <span className={timelineDotClass(event.tone, isLatest)}>
                                    <Icon size={14} strokeWidth={2.25} />
                                  </span>
                                </span>
                                <div className="min-w-0 pt-0.5">
                                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2">
                                    <strong className="text-[13px] font-[750] tracking-[-0.01em] text-[#111]">
                                      {event.title}
                                    </strong>
                                    <time
                                      className="whitespace-nowrap text-[11px] font-[650] text-black/45"
                                      dateTime={event.created_at || undefined}
                                    >
                                      {formatOrderDate(event.created_at, true)}
                                    </time>
                                  </div>
                                  {event.message ? (
                                    <p className="mt-0.5 text-xs font-[550] leading-snug text-black/55">
                                      {event.message}
                                    </p>
                                  ) : null}
                                </div>
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          {totalRecords > pageLimit ? (
            <div className="mt-[30px] text-center [&_ul_li]:mx-1 [&_ul_li]:inline-block [&_ul_li_a]:inline-flex [&_ul_li_a]:h-10 [&_ul_li_a]:min-w-10 [&_ul_li_a]:items-center [&_ul_li_a]:justify-center [&_ul_li_a]:rounded-full [&_ul_li_a]:border [&_ul_li_a]:border-black/10 [&_ul_li_a]:bg-white [&_ul_li_a]:px-3 [&_ul_li_a]:text-sm [&_ul_li_a]:font-bold [&_ul_li_a]:text-[#111] [&_ul_li_a]:shadow-[0_4px_14px_rgba(0,0,0,0.06)] [&_ul_li_a]:transition [&_ul_li_a:hover]:border-[#5a5a5a] [&_ul_li_a:hover]:text-[#5a5a5a] [&_ul_li_a.active]:border-[#5a5a5a] [&_ul_li_a.active]:bg-[#5a5a5a] [&_ul_li_a.active]:text-white [&_ul_li_button]:inline-flex [&_ul_li_button]:h-10 [&_ul_li_button]:min-w-10 [&_ul_li_button]:items-center [&_ul_li_button]:justify-center [&_ul_li_button]:rounded-full [&_ul_li_button]:border [&_ul_li_button]:border-black/10 [&_ul_li_button]:bg-white [&_ul_li_button]:px-3 [&_ul_li_button]:text-sm [&_ul_li_button]:font-bold [&_ul_li_button]:text-[#111] [&_ul_li_button]:shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
              <Paginator
                totalRecords={totalRecords}
                pageLimit={pageLimit}
                pageNeighbours={2}
                setOffset={setOffset}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageContainerClass="mb-0 mt-0"
                pagePrevText="«"
                pageNextText="»"
              />
            </div>
          ) : null}

          <div className="mt-[18px] flex justify-start">
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-transparent px-4 text-xs font-extrabold uppercase tracking-[0.06em] text-black/[0.86] no-underline transition-[transform,background,border-color,color] duration-200 hover:-translate-y-px hover:border-black/[0.18] hover:bg-black/[0.03] hover:text-[#111] focus-visible:border-[rgba(90,90,90,0.5)] focus-visible:shadow-[0_0_0_3px_rgba(90,90,90,0.16)] focus-visible:outline-none max-md:w-full"
              href={toCountryPath("/shop")}
            >
              Continue shopping
            </Link>
          </div>
        </Fragment>
      ) : null}
    </div>
  );
};

export default MyOrders;
