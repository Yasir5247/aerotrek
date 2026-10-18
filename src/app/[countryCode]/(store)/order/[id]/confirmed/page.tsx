import Link from "next/link";
import { notFound } from "next/navigation";
import { retrieveOrder } from "@lib/data/orders";
import { countryPath } from "@lib/navigation/country-path";
import { getStoreCode } from "@lib/store-code";
import { formatCartMoney } from "@lib/util/money";
import Breadcrumb from "@/components/layout/breadcrumb/Breadcrumb";

export const metadata = {
  title: "Order confirmed",
  description: "Your AeroTrek order was placed successfully.",
};

function formatAddress(address?: {
  first_name?: string | null;
  last_name?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country_code?: string | null;
  phone?: string | null;
}) {
  if (!address) return "—";

  const lines = [
    [address.first_name, address.last_name].filter(Boolean).join(" "),
    address.address_1,
    address.address_2,
    [address.city, address.province, address.postal_code].filter(Boolean).join(", "),
    address.country_code?.toUpperCase(),
    address.phone,
  ].filter(Boolean);

  return lines.join("\n");
}

export default async function OrderConfirmedPage({
  params,
}: {
  params: Promise<{ id: string; countryCode: string }>;
}) {
  const { id, countryCode } = await params;
  const order = await retrieveOrder(getStoreCode(), id);

  if (!order) {
    notFound();
  }

  const currency = order.currency_code;
  const discountTotal = Number(order.discount_total) || 0;
  const taxTotal = Number(order.tax_total) || 0;

  return (
    <div className="bg-transparent pb-[80px] pt-2">
      <Breadcrumb
        variant="bare"
        className="border-b border-black/[0.06] py-4 max-[767px]:py-3"
        pages={[
          { label: "Home", path: countryPath(countryCode, "/") },
          { label: "Order confirmed", path: countryPath(countryCode, `/order/${id}/confirmed`) },
        ]}
      />
      <div className="mx-auto max-w-3xl pt-8">
        <div className="rounded-[10px] border border-black/[0.07] bg-white/[0.92] p-6 shadow-[0_4px_18px_rgba(0,0,0,0.04)] md:p-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-black/40">
            Thank you
          </p>
          <h1 className="m-0 mb-3 text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold tracking-[-0.02em] text-[#111]">
            Order confirmed
          </h1>
          <p className="m-0 mb-6 text-sm leading-relaxed text-black/55">
            Your order{" "}
            <strong className="text-[#111]">{order.display_id ?? order.id}</strong>{" "}
            has been placed.
            {order.email ? ` A confirmation was sent to ${order.email}.` : ""}
          </p>

          <section className="mb-6 text-left">
            <h2 className="m-0 mb-3 text-base font-extrabold text-[#111]">Items</h2>
            <ul className="m-0 grid list-none gap-3 border-b border-black/[0.06] p-0 pb-4">
              {(order.items || []).map((item) => (
                <li key={item.id} className="flex gap-3">
                  {item.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.thumbnail}
                      alt={item.title || ""}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-[#f3f3f3]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="m-0 truncate text-sm font-semibold text-[#111]">
                      {item.title || item.product_title}
                    </p>
                    <p className="m-0 text-xs text-black/45">Qty {item.quantity}</p>
                    <p className="m-0 text-sm font-bold text-black/70">
                      {formatCartMoney(item.total as number, currency)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <section>
              <h2 className="m-0 mb-2 text-sm font-extrabold uppercase tracking-[0.08em] text-black/45">
                Shipping
              </h2>
              <p className="m-0 whitespace-pre-line text-sm leading-relaxed text-black/70">
                {formatAddress(order.shipping_address ?? undefined)}
              </p>
            </section>
            <section>
              <h2 className="m-0 mb-2 text-sm font-extrabold uppercase tracking-[0.08em] text-black/45">
                Billing
              </h2>
              <p className="m-0 whitespace-pre-line text-sm leading-relaxed text-black/70">
                {formatAddress(order.billing_address ?? undefined)}
              </p>
            </section>
          </div>

          <dl className="m-0 mb-6 grid gap-2 border-t border-black/[0.06] pt-4 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-black/50">Subtotal</dt>
              <dd className="m-0 font-semibold text-[#111]">
                {formatCartMoney(order.subtotal as number, currency)}
              </dd>
            </div>
            {discountTotal > 0 ? (
              <div className="flex justify-between gap-3">
                <dt className="text-black/50">Discount</dt>
                <dd className="m-0 font-semibold text-[#111]">
                  −{formatCartMoney(discountTotal, currency)}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3">
              <dt className="text-black/50">Shipping</dt>
              <dd className="m-0 font-semibold text-[#111]">
                {formatCartMoney(
                  (order.shipping_subtotal ?? order.shipping_total) as number,
                  currency
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-black/50">Tax</dt>
              <dd className="m-0 font-semibold text-[#111]">
                {formatCartMoney(taxTotal, currency)}
              </dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-black/[0.06] pt-2 text-base">
              <dt className="font-extrabold text-[#111]">Total</dt>
              <dd className="m-0 font-extrabold text-[#111]">
                {formatCartMoney(order.total as number, currency)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link
              href={countryPath(countryCode, "/my-orders")}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#111] px-5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white hover:bg-[#5a5a5a]"
            >
              View orders
            </Link>
            <Link
              href={countryPath(countryCode, "/shop")}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/12 bg-white px-5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#111] hover:border-black/25"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
