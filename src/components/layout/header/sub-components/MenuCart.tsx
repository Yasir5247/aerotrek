"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { HttpTypes } from "@aiminaabeejs/types";
import { X } from "lucide-react";
import clsx from "clsx";
import { deleteLineItem } from "@lib/data/cart";
import { getStoreCode } from "@lib/store-code";
import { sortCartItems } from "@lib/util/cart";
import { formatCartMoney } from "@lib/util/money";
import useGsapLiftHover from "@/hooks/use-gsap-lift-hover";
import { useCountryPath } from "@/hooks/use-country-path";

const cartDropdownClass =
  "invisible absolute right-0 top-[calc(100%+12px)] z-[10050] mt-2 mb-2 w-[min(360px,calc(100vw-24px))] min-h-0 origin-[center_top] border-0 bg-transparent p-0 opacity-0 shadow-none backdrop-blur-none transition-all duration-500 [transform:rotateX(90deg)] max-lg:[transform:none] [&.active]:visible [&.active]:opacity-100 [&.active]:[transform:rotateX(0deg)]";

const cartBtnClass =
  "relative inline-flex !m-0 items-center justify-center rounded-full border border-black/[0.12] bg-white px-3.5 py-3 text-[11px] font-extrabold uppercase leading-[1.2] tracking-[0.1em] text-[#111] no-underline transition hover:border-black/[0.18] hover:bg-black/[0.04] hover:text-black";

const cartBtnCheckoutClass =
  "relative inline-flex !m-0 items-center justify-center rounded-full border border-[#111] bg-[#111] px-3.5 py-3 text-[11px] font-extrabold uppercase leading-[1.2] tracking-[0.1em] text-white no-underline transition hover:border-black hover:bg-black hover:text-white";

const MenuCart = ({
  cart,
  isOpen = false,
}: {
  cart?: HttpTypes.StoreCart | null;
  isOpen?: boolean;
}) => {
  const router = useRouter();
  const toCountryPath = useCountryPath();
  const currency = useSelector((state: any) => state.currency);
  const cartBtnSecondary = useGsapLiftHover({ primary: false });
  const cartBtnPrimary = useGsapLiftHover({ primary: true });
  const [pendingLineId, setPendingLineId] = useState<string | null>(null);

  const items = useMemo(
    () => sortCartItems(cart?.items ?? []),
    [cart?.items]
  );
  const currencyCode = cart?.currency_code;
  const cartTotalPrice = Number(cart?.total) || 0;

  const handleRemove = async (lineId: string) => {
    setPendingLineId(lineId);
    try {
      await deleteLineItem(getStoreCode(), lineId);
      router.refresh();
    } finally {
      setPendingLineId(null);
    }
  };

  return (
    <div
      className={clsx(cartDropdownClass, isOpen && "active")}
      data-cart-dropdown
    >
      <div className="w-full min-h-0 rounded-2xl border border-black/[0.06] bg-white px-4 pb-[18px] pt-4 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
        {items.length > 0 ? (
          <Fragment>
            <div>
              <ul className="m-0 max-h-[min(400px,52vh)] list-none overflow-y-auto overflow-x-hidden p-0 pr-2 pt-1">
                {items.map((item) => {
                  const productId = item.product_id || item.product?.id;
                  const unitTotal = Number(item.total) || 0;
                  const displayPrice = formatCartMoney(
                    unitTotal / Math.max(Number(item.quantity) || 1, 1),
                    currencyCode
                  );
                  const isPending = pendingLineId === item.id;

                  return (
                    <li
                      className="relative mb-3.5 flex flex-nowrap border-b border-black/[0.06] pb-3.5 last:mb-0 last:border-b-0 last:pb-0"
                      key={item.id}
                    >
                      <div className="mr-[15px] shrink-0 basis-[82px]">
                        <Link href={productId ? toCountryPath(`/product/${productId}`) : toCountryPath("/shop")}>
                          <img
                            alt=""
                            src={item.thumbnail || ""}
                            className="max-w-full"
                          />
                        </Link>
                      </div>
                      <div className="min-w-0 pr-5">
                        <h4 className="m-0 mr-5 text-[15px] leading-4">
                          <Link
                            className="leading-[1.2] font-semibold text-black/90 no-underline hover:text-[#5a5a5a]"
                            href={productId ? toCountryPath(`/product/${productId}`) : toCountryPath("/shop")}
                          >
                            {item.title || item.product_title}
                          </Link>
                        </h4>
                        <h6 className="my-1.5 mb-2 text-xs text-black/50">
                          Qty: {item.quantity}
                        </h6>
                        <span className="text-sm">
                          {currency?.currencySymbol}
                          {displayPrice.replace(/^[A-Z]{3}\s*/, "")}
                        </span>
                      </div>
                      <div className="absolute right-0 top-0">
                        <button
                          type="button"
                          className="border-0 bg-transparent p-0 text-[#5a5a5a] hover:text-[#333] disabled:opacity-40"
                          onClick={() => handleRemove(item.id)}
                          disabled={isPending}
                          aria-label="Remove item"
                        >
                          <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h4 className="mb-0 mt-4 border-t border-black/[0.06] pt-3.5 text-[13px] font-extrabold uppercase tracking-[0.06em] text-black/[0.75]">
                Total :{" "}
                <span className="float-right font-extrabold tracking-[0.02em] text-[#111]">
                  {formatCartMoney(cartTotalPrice, currencyCode)}
                </span>
              </h4>
            </div>
            <div className="mt-3.5 grid grid-cols-2 gap-2.5 text-center">
              <Link
                ref={cartBtnSecondary.ref}
                className={cartBtnClass}
                href={toCountryPath("/cart")}
                onMouseEnter={cartBtnSecondary.onMouseEnter}
                onMouseLeave={cartBtnSecondary.onMouseLeave}
                onFocus={cartBtnSecondary.onFocus}
                onBlur={cartBtnSecondary.onBlur}
              >
                view cart
              </Link>
              <Link
                ref={cartBtnPrimary.ref}
                className={cartBtnCheckoutClass}
                href={toCountryPath("/checkout?step=address")}
                onMouseEnter={cartBtnPrimary.onMouseEnter}
                onMouseLeave={cartBtnPrimary.onMouseLeave}
                onFocus={cartBtnPrimary.onFocus}
                onBlur={cartBtnPrimary.onBlur}
              >
                checkout
              </Link>
            </div>
          </Fragment>
        ) : (
          <div className="px-4 pb-8 pt-7 text-center">
            <p className="m-0 text-sm font-medium leading-normal text-black/50">
              No items added to cart
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCart;
