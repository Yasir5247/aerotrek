import { HttpTypes } from "@aiminaabeejs/types";
import { formatCartMoney } from "@lib/util/money";
import CartTotals from "@/components/store/cart/CartTotals";
import DiscountCode from "./discount-code";

export default function CheckoutSummary({
  storeCode,
  cart,
}: {
  storeCode: string;
  cart: HttpTypes.StoreCart;
}) {
  const currency = cart.currency_code;

  return (
    <aside className="h-fit self-start rounded-[10px] border border-black/[0.07] bg-white/[0.92] p-4 shadow-[0_4px_18px_rgba(0,0,0,0.04)] md:sticky md:top-24 md:p-5">
      <h2 className="m-0 mb-4 text-lg font-extrabold text-[#111]">In your cart</h2>
      <ul className="m-0 mb-4 grid list-none gap-3 border-b border-black/[0.06] p-0 pb-4">
        {(cart.items || []).map((item) => (
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
                {item.title}
              </p>
              <p className="m-0 text-xs text-black/45">Qty {item.quantity}</p>
              <p className="m-0 text-sm font-bold text-black/70">
                {formatCartMoney(item.total as number, currency)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <CartTotals cart={cart} className="mb-4" />
      <DiscountCode storeCode={storeCode} cart={cart} />
    </aside>
  );
}
