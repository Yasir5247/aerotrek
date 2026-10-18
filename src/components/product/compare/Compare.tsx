"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shuffle, Trash2 } from "lucide-react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { formatMappedProductPrice } from "@/lib/util/money";
import Breadcrumb from "@/components/layout/breadcrumb/Breadcrumb";
import { ProductRating as Rating } from "@/components/product";
import useProductReviewSummary from "@/hooks/use-product-review-summary";
import { useSdkAddToCart } from "@/hooks/use-sdk-add-to-cart";
import { deleteFromCompare } from "@/store/slices/compare-slice";
import { useCountryPath } from "@/hooks/use-country-path";

const compareBtnClass =
  "inline-flex items-center justify-center rounded-xl border-0 bg-[#5a5a5a] px-3.5 py-[11px] text-xs font-extrabold tracking-[0.06em] text-white uppercase transition-colors hover:bg-[#363f4d] disabled:cursor-not-allowed";

const CompareRatingCell = ({ productId, fallbackRating }: { productId?: any; fallbackRating?: any }) => {
  const { count: reviewCount, avg: reviewAvg } = useProductReviewSummary(productId);
  const effectiveRating = reviewCount > 0 ? reviewAvg : Number(fallbackRating) || 0;

  return (
    <td className="px-[15px] py-[17px] text-center [&_i.yellow]:text-[#ffa900] [&_i]:mr-1.5 [&_i]:text-[#343538]">
      <Rating ratingValue={effectiveRating} />
    </td>
  );
};

const Compare = () => {
  const toCountryPath = useCountryPath();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { addProductToCart, isAdding } = useSdkAddToCart();

  const { compareItems } = useSelector((state: any) => state.compare);
  const hasItems = compareItems && compareItems.length >= 1;

  return (
    <Fragment>
      <Breadcrumb
        variant="chrome"
        pages={[
          { label: "Home", path: "/" },
          { label: "Compare", path: pathname },
        ]}
      />
      <div
        className="bg-gradient-to-b from-[#f8f9fb] to-white pt-[45px] pb-[30px] md:pb-[100px]"
      >
        <div className="w-full">
          {hasItems ? (
            <div className="w-full">
              <div className="mb-[18px]">
                <h3 className="mb-1.5 text-[28px] font-extrabold tracking-[-0.02em] text-[#111] max-md:text-[22px]">
                  Compare products
                </h3>
                <p className="m-0 text-black/55 max-md:text-[13px]">
                  Review key details side by side before making your choice.
                </p>
              </div>
              <div className="overflow-hidden rounded-[18px] border border-black/[0.08] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_56px_rgba(0,0,0,0.05)] max-md:rounded-[14px]">
                <div className="overflow-x-auto">
                  <table className="mb-0 w-full border-collapse border border-neutral-200">
                    <tbody>
                      <tr>
                        <th className="min-w-[150px] border-0 bg-[#f6f7fa] px-5 py-[53px] text-left text-xs font-extrabold tracking-[0.08em] text-black/60 uppercase md:min-w-[200px] md:px-[30px] lg:min-w-[292px]">
                          Product Info
                        </th>
                        {compareItems.map((compareItem, key) => {
                          return (
                            <td
                              className="min-w-[220px] border-[#e7e7e7] px-2.5 py-[27px] pb-[35px] text-center max-md:min-w-[220px]"
                              key={key}
                            >
                              <div>
                                <button
                                  type="button"
                                  className="border-0 bg-transparent p-0 text-[#333] hover:text-red-600"
                                  onClick={() => dispatch(deleteFromCompare(compareItem.id))}
                                  aria-label="Remove from compare"
                                >
                                  <Trash2 className="mx-auto" size={25} strokeWidth={1.75} />
                                </button>
                              </div>
                              <Link
                                href={`/product/${compareItem.id}`}
                                className="my-3.5 mb-1.5 block w-full clear-both"
                              >
                                <img
                                  className="mx-auto h-auto w-full"
                                  src={compareItem.image[0]}
                                  alt=""
                                />
                              </Link>
                              <div className="block overflow-hidden">
                                <Link
                                  href={`/product/${compareItem.id}`}
                                  className="mt-1.5 block w-full text-[15px] font-bold text-[#111] capitalize hover:text-[#5a5a5a]"
                                >
                                  {compareItem.name}
                                </Link>
                              </div>
                              <div className="mt-3.5">
                                {compareItem.affiliateLink ? (
                                  <a
                                    className={compareBtnClass}
                                    href={compareItem.affiliateLink}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                  >
                                    Buy now
                                  </a>
                                ) : compareItem.variation && compareItem.variation.length >= 1 ? (
                                  <Link className={compareBtnClass} href={`/product/${compareItem.id}`}>
                                    Select Option
                                  </Link>
                                ) : compareItem.stock && compareItem.stock > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => addProductToCart(compareItem, 1)}
                                    className={compareBtnClass}
                                    disabled={isAdding}
                                    title="Add to cart"
                                  >
                                    Add to cart
                                  </button>
                                ) : (
                                  <button type="button" disabled className={`${compareBtnClass} bg-[#363f4d]`}>
                                    Out of Stock
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <th className="min-w-[150px] border-0 bg-[#f6f7fa] px-5 py-2.5 text-left text-xs font-extrabold tracking-[0.08em] text-black/60 uppercase md:min-w-[200px] md:px-[30px] lg:min-w-[292px]">
                          Price
                        </th>
                        {compareItems.map((compareItem, key) => {
                          const { current, original } =
                            formatMappedProductPrice(compareItem);
                          return (
                            <td
                              className="px-[15px] py-[17px] text-center text-sm text-[#343538]"
                              key={key}
                            >
                              {original ? (
                                <Fragment>
                                  <span className="mr-2.5 text-[#8e8e8e] line-through">
                                    {original}
                                  </span>
                                  <span>{current}</span>
                                </Fragment>
                              ) : (
                                <span>{current}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      <tr>
                        <th className="min-w-[150px] border-0 bg-[#f6f7fa] px-5 py-2.5 text-left text-xs font-extrabold tracking-[0.08em] text-black/60 uppercase md:min-w-[200px] md:px-[30px] lg:min-w-[292px]">
                          Description
                        </th>
                        {compareItems.map((compareItem, key) => (
                          <td className="px-[15px] py-[17px] text-center" key={key}>
                            <p className="m-0 text-[13px] leading-[1.88]">
                              {compareItem.shortDescription ? compareItem.shortDescription : "N/A"}
                            </p>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th className="min-w-[150px] border-0 bg-[#f6f7fa] px-5 py-2.5 text-left text-xs font-extrabold tracking-[0.08em] text-black/60 uppercase md:min-w-[200px] md:px-[30px] lg:min-w-[292px]">
                          Size
                        </th>
                        {compareItems.map((compareItem, key) => {
                          const sizeName =
                            compareItem?.variation?.[0]?.size?.[0]?.name || "N/A";
                          return (
                            <td className="px-[15px] py-[17px] text-center" key={key}>
                              <p className="m-0 text-[13px] leading-[1.88]">{sizeName}</p>
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <th className="min-w-[150px] border-0 bg-[#f6f7fa] px-5 py-[55px] pt-2.5 text-left text-xs font-extrabold tracking-[0.08em] text-black/60 uppercase md:min-w-[200px] md:px-[30px] lg:min-w-[292px]">
                          Rating
                        </th>
                        {compareItems.map((compareItem, key) => (
                          <CompareRatingCell
                            key={key}
                            productId={compareItem.id}
                            fallbackRating={compareItem.rating}
                          />
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="mx-auto mt-2 rounded-[18px] border border-black/[0.08] bg-gradient-to-b from-white to-[#fafafa] px-[26px] py-11 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_56px_rgba(0,0,0,0.06)] max-md:rounded-[14px] max-md:px-4 max-md:py-[30px]">
                <div className="mx-auto mb-3.5 flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[rgba(90,90,90,0.08)] max-md:mb-2.5 max-md:h-[74px] max-md:w-[74px]">
                  <Shuffle className="text-[rgba(90,90,90,0.75)] max-md:h-10 max-md:w-10" size={52} strokeWidth={1.5} />
                </div>
                <div className="text-xl max-md:text-[22px]">
                  <h4 className="mb-2 text-[26px] font-extrabold tracking-[-0.02em] text-[#111] max-md:mb-1.5 max-md:text-[22px]">
                    Nothing to compare yet
                  </h4>
                  <p className="mb-[18px] text-[15px] leading-[1.65] text-black/55 max-md:mb-4 max-md:text-sm">
                    Add 2–3 products to compare specs and pricing side by side.
                  </p>
                  <Link
                    className="inline-flex h-[46px] min-w-[190px] items-center justify-center rounded-xl bg-[#111] px-5 text-xs font-extrabold tracking-[0.08em] text-white uppercase transition duration-200 hover:-translate-y-px hover:bg-[#5a5a5a] max-md:h-11 max-md:w-full max-md:min-w-0 max-md:text-[11px]"
                    href={toCountryPath("/shop")}
                  >
                    Browse products
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Compare;
