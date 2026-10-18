"use client";

import Link from "next/link";
import {
  formatMoney,
  formatOrderDate,
  getOrderDisplayId,
  getOrderItems,
} from "@/lib/helpers/account-order";

import Container from "@/components/ui/Container";
import { useCountryPath } from "@/hooks/use-country-path";

export default function ProfileOverview({ customer,
  orders = [],
  orderTotal = 0,
  onOpenTab, }: { customer?: any; orders?: any; orderTotal?: any; onOpenTab?: any }) {
  const toCountryPath = useCountryPath();
  const firstName = customer?.first_name || "there";

  return (
    <div>
      <div className="mb-[18px]">
        <h1 className="mb-1.5 text-2xl font-black tracking-[-0.03em] text-[#111]">
          Hello {firstName}
        </h1>
        <p className="m-0 text-sm text-black/60">
          Manage your profile, addresses, and orders from this account area.
        </p>
      </div>

      <div className="mb-[22px] grid grid-cols-1 gap-3 md:grid-cols-3">
        <Container className="!p-0">
          <button
            type="button"
            className="flex w-full cursor-pointer flex-col items-start gap-1 p-4 text-left text-inherit no-underline transition-[border-color] hover:border-[rgba(90,90,90,0.35)]"
            onClick={() => onOpenTab?.("profile")}
          >
            <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/45">
              Profile
            </span>
            <span className="text-sm font-extrabold text-[#111]">Name, email, phone</span>
          </button>
        </Container>
        <Container className="!p-0">
          <button
            type="button"
            className="flex w-full cursor-pointer flex-col items-start gap-1 p-4 text-left text-inherit no-underline transition-[border-color] hover:border-[rgba(90,90,90,0.35)]"
            onClick={() => onOpenTab?.("addresses")}
          >
            <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/45">
              Addresses
            </span>
            <span className="text-sm font-extrabold text-[#111]">Delivery details</span>
          </button>
        </Container>
        <Container className="!p-0">
          <Link
            className="flex w-full flex-col items-start gap-1 p-4 text-left text-inherit no-underline transition-[border-color] hover:border-[rgba(90,90,90,0.35)]"
            href={toCountryPath("/my-orders")}
          >
            <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/45">
              Orders
            </span>
            <span className="text-sm font-extrabold text-[#111]">
              {orderTotal} order{orderTotal === 1 ? "" : "s"}
            </span>
          </Link>
        </Container>
      </div>

      <div>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="m-0 text-base font-black">Recent orders</h2>
          <Link href={toCountryPath("/my-orders")} className="text-[13px] font-extrabold text-[#5a5a5a]">
            View all
          </Link>
        </div>
        {orders.length < 1 ? (
          <p className="m-0 text-sm text-black/[0.58]">You have not placed an order yet.</p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {orders.filter((order) => order?.id).map((order) => {
              const items = getOrderItems(order);
              return (
                <li key={order.id}>
                  <Container className="!p-0">
                    <Link
                      className="flex flex-col gap-1 p-3.5 px-4 text-inherit no-underline transition-[border-color] hover:border-[rgba(90,90,90,0.35)]"
                      href={toCountryPath(`/my-orders/${order.id}`)}
                    >
                    <span className="text-sm font-black text-[#111]">
                      Order {getOrderDisplayId(order)}
                    </span>
                    <span className="text-[13px] text-black/[0.55]">
                      {formatOrderDate(order.created_at)} · {items.length} item
                      {items.length === 1 ? "" : "s"} ·{" "}
                      {formatMoney(order.total, order.currency_code || order.currency)}
                    </span>
                    </Link>
                  </Container>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
