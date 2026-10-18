"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { HttpTypes } from "@aiminaabeejs/types";
import { Trash2 } from "lucide-react";
import { deleteLineItem, updateLineItem } from "@lib/data/cart";
import { getStoreCode } from "@lib/store-code";
import { getCheckoutStep } from "@lib/checkout/steps";
import { sortCartItems } from "@lib/util/cart";
import Breadcrumb from "@/components/layout/breadcrumb/Breadcrumb";
import DiscountCode from "@/components/store/checkout/discount-code";
import CartTotals from "@/components/store/cart/CartTotals";
import Container from "@/components/ui/Container";
import clsx from "clsx";
import cogoToast from "cogo-toast";
import { useCountryPath } from "@/hooks/use-country-path";

const qtyBtnClass =
  "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-black/[0.1] bg-[#f5f5f5] p-0 text-base font-medium leading-none text-[#111] transition hover:bg-[#ececec] disabled:cursor-not-allowed disabled:opacity-35";

export default function CartView({
  cart,
  storeCode,
}: {
  cart: HttpTypes.StoreCart | null;
  storeCode: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const toCountryPath = useCountryPath();
  const currency = useSelector((state: any) => state.currency);
  const currencySymbol = currency?.currencySymbol ?? "";
  const items = useMemo(() => sortCartItems(cart?.items ?? []), [cart?.items]);
  const [displayItems, setDisplayItems] = useState(items);
  const hasItems = displayItems.length > 0;
  const checkoutStep = cart ? getCheckoutStep(cart) : "address";
  const [pendingLineId, setPendingLineId] = useState<string | null>(null);

  useEffect(() => {
    setDisplayItems(items);
  }, [items]);

  const refreshCart = () => router.refresh();

  const handleUpdateQty = async (lineId: string, quantity: number) => {
    if (!lineId) return;

    const nextQty = Math.floor(Number(quantity));
    if (!Number.isFinite(nextQty) || nextQty < 1) {
      await handleRemove(lineId);
      return;
    }

    setPendingLineId(lineId);
    try {
      await updateLineItem({ storeCode, lineId, quantity: nextQty });
      refreshCart();
    } catch (error: any) {
      cogoToast.error(error?.message || "Could not update quantity");
    } finally {
      setPendingLineId(null);
    }
  };

  const handleRemove = async (lineId: string) => {
    if (!lineId) {
      cogoToast.error("Could not remove item");
      return;
    }

    setPendingLineId(lineId);
    const previousItems = displayItems;
    setDisplayItems((current) => current.filter((item) => item.id !== lineId));

    try {
      await deleteLineItem(storeCode, lineId);
      refreshCart();
    } catch (error: any) {
      setDisplayItems(previousItems);
      cogoToast.error(error?.message || "Could not remove item");
    } finally {
      setPendingLineId(null);
    }
  };

  return (
    <div className="bg-transparent pb-[80px] pt-2">
      <Breadcrumb
        variant="bare"
        className="border-b border-black/[0.06] bg-transparent py-4 max-[767px]:py-3"
        pages={[
          { label: "Home", path: toCountryPath("/") },
          { label: "Cart", path: pathname },
        ]}
      />
      <div
        className={clsx(
          "pt-6",
          !hasItems && "bg-gradient-to-b from-[#f8f9fb] to-white"
        )}
      >
        <div className="mx-auto w-full">
          {hasItems && cart ? (
            <Fragment>
              <div className="mb-[18px]">
                <h3 className="mb-1.5 text-[28px] font-extrabold tracking-[-0.02em] text-[#111] max-md:text-2xl">
                  Your cart
                </h3>
                <p className="m-0 text-sm text-black/[0.58]">
                  Review your items and continue to checkout.
                </p>
              </div>

              <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-8">
                <div className="min-w-0">
                  <ul className="m-0 grid list-none gap-3 p-0">
                    {displayItems.map((item) => {
                      const productId = item.product_id || item.product?.id;
                      const lineTotal = Number(item.total) || 0;
                      const unitPrice =
                        lineTotal / Math.max(Number(item.quantity) || 1, 1);
                      const isPending = pendingLineId === item.id;

                      return (
                        <li key={item.id}>
                          <Container className="!p-0">
                            <div className="flex gap-3.5 p-3.5 md:gap-4 md:p-4">
                            <Link
                              href={productId ? toCountryPath(`/product/${productId}`) : toCountryPath("/shop")}
                              className="block h-[92px] w-[92px] shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5] md:h-[108px] md:w-[108px]"
                            >
                              {item.thumbnail ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  className="h-full w-full object-cover"
                                  src={item.thumbnail}
                                  alt={item.title || ""}
                                />
                              ) : null}
                            </Link>

                            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                              <div className="flex items-start justify-between gap-3">
                                <Link
                                  href={productId ? toCountryPath(`/product/${productId}`) : toCountryPath("/shop")}
                                  className="line-clamp-2 text-[13px] font-semibold uppercase leading-[1.35] tracking-[0.02em] text-[#1a1a1a] hover:text-[#5a5a5a] md:text-sm"
                                >
                                  {item.title || item.product_title}
                                </Link>
                                <button
                                  type="button"
                                  aria-label="Remove item"
                                  className="inline-flex shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[#1a1a1a] transition hover:text-[#c0392b] disabled:opacity-40"
                                  onClick={() => handleRemove(item.id)}
                                  disabled={isPending}
                                >
                                  <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
                                </button>
                              </div>

                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 text-[13px] leading-[1.55] text-[#666]">
                                  {item.variant?.title ? (
                                    <p className="m-0">
                                      Variant:{" "}
                                      <span className="font-semibold text-[#1a1a1a]">
                                        {item.variant.title}
                                      </span>
                                    </p>
                                  ) : null}
                                </div>
                                <div className="shrink-0 text-right">
                                  <span className="text-[15px] font-bold text-[#1a1a1a]">
                                    {currencySymbol}
                                    {unitPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-auto flex items-center gap-2 pt-0.5">
                                <button
                                  type="button"
                                  className={qtyBtnClass}
                                  aria-label="Decrease quantity"
                                  onClick={() =>
                                    handleUpdateQty(
                                      item.id,
                                      Number(item.quantity) - 1
                                    )
                                  }
                                  disabled={isPending}
                                >
                                  −
                                </button>
                                <span className="min-w-[1.25rem] text-center text-sm font-semibold text-[#1a1a1a]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  className={qtyBtnClass}
                                  aria-label="Increase quantity"
                                  onClick={() =>
                                    handleUpdateQty(
                                      item.id,
                                      Number(item.quantity) + 1
                                    )
                                  }
                                  disabled={isPending}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            </div>
                          </Container>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-1.5 flex justify-between gap-2.5 py-[22px] pb-0 max-md:block max-md:py-[18px] max-md:pb-0">
                    <div>
                      <Link
                        href={toCountryPath("/shop")}
                        className="inline-block rounded-xl bg-[#f2f2f2] px-[18px] py-3.5 text-sm font-bold tracking-[0.04em] text-[#363f4d] transition hover:bg-[#5a5a5a] hover:text-white max-md:w-full max-md:text-center"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>

                <aside className="w-full lg:sticky lg:top-24">
                  <Container className="px-[18px] pt-6 pb-5 md:px-[22px] md:pt-6 md:pb-5">
                    <h4 className="m-0 mb-4 text-lg font-extrabold tracking-[-0.01em] text-[#111]">
                      Order summary
                    </h4>
                    <CartTotals cart={cart} showTotalLabel={false} className="mb-4" />
                    <DiscountCode storeCode={storeCode} cart={cart} />
                    <Link
                      href={toCountryPath(`/checkout?step=${checkoutStep}`)}
                      className="mt-5 block w-full rounded-full border-0 bg-[#5a5a5a] px-2.5 py-[18px] text-center text-sm font-medium uppercase leading-none text-white hover:bg-[#333]"
                    >
                      Proceed to Checkout
                    </Link>
                  </Container>
                </aside>
              </div>
            </Fragment>
          ) : (
            <div className="flex min-h-[clamp(320px,46vh,520px)] items-center justify-center max-md:min-h-0">
              <div className="mx-auto w-full max-w-3xl">
                <div className="mt-2 rounded-[18px] border border-black/[0.08] bg-gradient-to-b from-white to-[#fafafa] px-[26px] py-11 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_56px_rgba(0,0,0,0.06)] max-md:rounded-[14px] max-md:px-4 max-md:py-[30px]">
                  <div className="mx-auto mb-3.5 flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[rgba(90,90,90,0.08)] max-md:mb-2.5 max-md:h-[74px] max-md:w-[74px]">
                    <i className="pe-7s-cart text-[52px] text-[rgba(90,90,90,0.75)] max-md:text-[40px]" />
                  </div>
                  <h4 className="m-0 mb-2 text-[26px] font-extrabold tracking-[-0.02em] text-[#111] max-md:mb-1.5 max-md:text-[22px]">
                    Your cart is empty
                  </h4>
                  <p className="m-0 mb-[18px] text-[15px] leading-[1.65] text-black/[0.55] max-md:mb-4 max-md:text-sm">
                    Add your favorite travel bags and accessories to get started.
                  </p>
                  <Link
                    href={toCountryPath("/shop")}
                    className="inline-flex h-[46px] min-w-[170px] items-center justify-center rounded-xl bg-[#111] px-5 text-[13px] font-extrabold uppercase tracking-[0.06em] text-white transition hover:-translate-y-px hover:bg-[#5a5a5a] max-md:h-11 max-md:w-full max-md:min-w-0 max-md:text-xs"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
