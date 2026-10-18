import { HttpTypes } from "@aiminaabeejs/types";
import clsx from "clsx";
import { formatCartMoney } from "@lib/util/money";

export default function CartTotals({
  cart,
  className,
  showTotalLabel = true,
}: {
  cart: HttpTypes.StoreCart;
  className?: string;
  showTotalLabel?: boolean;
}) {
  const currency = cart.currency_code;
  const discountTotal = Number(cart.discount_total) || 0;
  const taxTotal = Number(cart.tax_total) || 0;

  return (
    <dl className={clsx("m-0 grid gap-2 text-sm", className)}>
      <div className="flex justify-between gap-3">
        <dt className="text-black/50">Subtotal</dt>
        <dd className="m-0 font-semibold text-[#111]">
          {formatCartMoney(cart.subtotal as number, currency)}
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
            (cart.shipping_subtotal ?? cart.shipping_total) as number,
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
        <dt className="font-extrabold text-[#111]">
          {showTotalLabel ? "Total" : "Grand Total"}
        </dt>
        <dd className="m-0 font-extrabold text-[#111]">
          {formatCartMoney(cart.total as number, currency)}
        </dd>
      </div>
    </dl>
  );
}
