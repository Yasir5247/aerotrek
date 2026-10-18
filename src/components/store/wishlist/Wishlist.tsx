"use client";

import { Fragment, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatMappedProductPrice } from "@/lib/util/money";
import { useSdkAddToCart } from "@/hooks/use-sdk-add-to-cart";
import Breadcrumb from "@/components/layout/breadcrumb/Breadcrumb";
import Button from "@/components/ui/Button";
import { deleteFromWishlist, deleteAllFromWishlist } from "@/store/slices/wishlist-slice";
import { useCountryPath } from "@/hooks/use-country-path";

const Wishlist = () => {
  const toCountryPath = useCountryPath();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { addProductToCart, isAdding } = useSdkAddToCart();

  const { wishlistItems } = useSelector((state: any) => state.wishlist);

  const wishlistCount = wishlistItems?.length || 0;

  const addableItems = useMemo(() => {
    if (!wishlistItems || wishlistItems.length < 1) return [];
    return wishlistItems.filter((item) => {
      const isSelectable = item.variation && item.variation.length >= 1;
      const isAffiliate = !!item.affiliateLink;
      const isInStock = item.stock && item.stock > 0;
      return !isSelectable && !isAffiliate && isInStock;
    });
  }, [wishlistItems]);

  const handleAddAllToCart = async () => {
    if (!addableItems || addableItems.length < 1) return;
    for (const item of addableItems) {
      await addProductToCart(item, 1);
    }
  };

  return (
    <Fragment>
      {/* breadcrumb */}
      <Breadcrumb
        variant="chrome"
        pages={[
          { label: "Home", path: "/" },
          { label: "Wishlist", path: pathname },
        ]}
      />
      <div
        className={`bg-white pt-[50px] pb-[30px] md:pt-[90px] md:pb-[100px] ${
          wishlistCount < 1 ? "bg-gradient-to-b from-[#f8f9fb] to-white" : ""
        }`}
      >
        <div className="w-full">
          {wishlistItems && wishlistItems.length >= 1 ? (
            <Fragment>
              <div className="mb-[18px]">
                <div className="flex flex-wrap items-end justify-between gap-3.5">
                  <div>
                    <h1 className="m-0 mb-1.5 text-[28px] font-extrabold tracking-[-0.02em] text-[#111] max-md:text-2xl">
                      Wishlist
                    </h1>
                    <p className="m-0 text-sm text-black/[0.58]">
                      {wishlistCount} item{wishlistCount === 1 ? "" : "s"} saved for later.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 max-md:w-full [&_button]:max-md:min-w-0 [&_button]:max-md:flex-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="bg-white/95"
                      onClick={handleAddAllToCart}
                      disabled={addableItems.length < 1 || isAdding}
                      title={
                        addableItems.length < 1
                          ? "No items available to add"
                          : "Add all available items to cart"
                      }
                    >
                      Add all to cart
                    </Button>
                    <Button
                      type="button"
                      variant="wishlistDanger"
                      onClick={() => dispatch(deleteAllFromWishlist())}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-1.5 grid grid-cols-12 gap-3.5">
                {wishlistItems.map((wishlistItem) => {
                  const { current, original } = formatMappedProductPrice(wishlistItem);

                  const isSelectable =
                    wishlistItem.variation && wishlistItem.variation.length >= 1;
                  const isAffiliate = !!wishlistItem.affiliateLink;
                  const isInStock = wishlistItem.stock && wishlistItem.stock > 0;

                  return (
                    <article
                      className="col-span-6 grid min-h-[150px] grid-cols-[150px_minmax(0,1fr)] overflow-hidden rounded-[18px] border border-black/[0.08] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.06)] md:max-lg:col-span-12 max-md:col-span-12 max-md:min-h-0 max-md:grid-cols-[96px_minmax(0,1fr)]"
                      key={wishlistItem.id}
                    >
                      <Link
                        className="relative block overflow-hidden border-r border-black/[0.06] bg-[#f5f5f5]"
                        href={`/product/${wishlistItem.id}`}
                      >
                        <img
                          className="aspect-square h-full w-full object-cover"
                          src={wishlistItem.image[0]}
                          alt={wishlistItem.name}
                        />
                      </Link>

                      <div className="flex min-w-0 flex-col gap-2.5 p-3.5 max-md:gap-2 max-md:p-3">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2.5">
                          <Link
                            className="line-clamp-2 overflow-hidden text-sm font-extrabold leading-[1.35] text-[#111] no-underline hover:text-[#5a5a5a]"
                            href={`/product/${wishlistItem.id}`}
                          >
                            {wishlistItem.name}
                          </Link>
                          <button
                            type="button"
                            className="h-10 w-10 cursor-pointer rounded-xl border border-black/[0.12] bg-white/95 text-black/70 transition hover:-translate-y-px hover:border-[rgba(192,57,43,0.4)] hover:bg-[rgba(192,57,43,0.06)] hover:text-[#c0392b] max-md:h-[38px] max-md:w-[38px] max-md:rounded-[10px]"
                            onClick={() => dispatch(deleteFromWishlist(wishlistItem.id))}
                            aria-label={`Remove ${wishlistItem.name} from wishlist`}
                            title="Remove"
                          >
                            <i className="fa fa-times" aria-hidden="true"></i>
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {original ? (
                            <Fragment>
                              <span className="font-semibold text-black/[0.42] line-through">
                                {original}
                              </span>
                              <span className="font-extrabold tracking-[0.01em] text-[#111]">
                                {current}
                              </span>
                            </Fragment>
                          ) : (
                            <span className="font-extrabold tracking-[0.01em] text-[#111]">
                              {current}
                            </span>
                          )}
                          {!isInStock ? (
                            <span className="inline-flex h-6 items-center justify-center rounded-full border border-black/10 bg-black/[0.02] px-2.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-black/70">
                              Out of stock
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-2.5 max-md:grid-cols-1 [&_a]:w-full [&_button]:w-full">
                          {isAffiliate ? (
                            <Button
                              as="a"
                              href={wishlistItem.affiliateLink}
                              rel="noopener noreferrer"
                              target="_blank"
                              variant="primary"
                              size="sm"
                              fullWidth
                            >
                              Buy now
                            </Button>
                          ) : isSelectable ? (
                            <Button as={Link} href={`/product/${wishlistItem.id}`} variant="primary" size="sm" fullWidth>
                              Select option
                            </Button>
                          ) : isInStock ? (
                            <Button
                              type="button"
                              onClick={() => addProductToCart(wishlistItem, 1)}
                              variant="primary"
                              size="sm"
                              fullWidth
                              disabled={isAdding}
                              title="Add to cart"
                            >
                              Add to cart
                            </Button>
                          ) : (
                            <Button type="button" variant="primary" size="sm" fullWidth disabled className="border-black/[0.78] bg-black/[0.78]">
                              Out of stock
                            </Button>
                          )}

                          <Button as={Link} href={`/product/${wishlistItem.id}`} variant="secondary" size="sm" fullWidth className="bg-white/95">
                            View details
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-[18px] flex justify-start max-md:[&_a]:w-full">
                <Button as={Link} href={toCountryPath("/shop")} variant="wishlistGhost">
                  Continue shopping
                </Button>
              </div>
            </Fragment>
          ) : (
            <div className="w-full">
              <div className="mt-2 rounded-[18px] border border-black/[0.08] bg-gradient-to-b from-white to-[#fafafa] px-[26px] py-11 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_56px_rgba(0,0,0,0.06)] max-md:rounded-[14px] max-md:px-4 max-md:py-[30px]">
                <div className="mx-auto mb-3.5 flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[rgba(90,90,90,0.08)] max-md:mb-2.5 max-md:h-[74px] max-md:w-[74px]">
                  <i className="pe-7s-like text-[52px] text-[rgba(90,90,90,0.75)] max-md:text-[40px]"></i>
                </div>
                <div>
                  <h4 className="m-0 mb-2 text-[26px] font-extrabold tracking-[-0.02em] text-[#111] max-md:mb-1.5 max-md:text-[22px]">
                    Your wishlist is empty
                  </h4>
                  <p className="m-0 mb-[18px] text-[15px] leading-[1.65] text-black/[0.55] max-md:mb-4 max-md:text-sm">
                    Save gear you love and come back anytime — we’ll keep it right here.
                  </p>
                  <Button as={Link} href={toCountryPath("/shop")} variant="primary" size="sm">
                    Browse products
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Wishlist;
