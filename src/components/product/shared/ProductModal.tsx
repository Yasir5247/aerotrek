"use client";

import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { EffectFade, Thumbs } from "swiper";
import { useDispatch } from "react-redux";
import Rating from "./ProductRating";
import Swiper, { SwiperSlide } from "@/components/common/swiper";
import { useSdkAddToCart } from "@/hooks/use-sdk-add-to-cart";
import { withSelectedVariation } from "@/lib/helpers/cartVariation";
import { formatMappedProductPrice } from "@/lib/util/money";
import { addToWishlist } from "@/store/slices/wishlist-slice";
import { addToCompare } from "@/store/slices/compare-slice";
import useProductReviewSummary from "@/hooks/use-product-review-summary";

const swatchColorClass: Record<string, string> = {
  blue: "border border-[#4798f3] bg-[#4798f3]",
  maroon: "border border-[#736751] bg-[#736751]",
  gray: "border border-[#c0c0c0] bg-[#c0c0c0]",
  green: "border border-[#139c57] bg-[#139c57]",
  yellow: "border border-[#e28b37] bg-[#e28b37]",
  white: "border border-[#333] bg-white",
  black: "border border-[#333] bg-[#333]",
  brown: "border border-brown bg-brown",
};

const cartButtonClass =
  "inline-block border border-[#333] px-[50px] pb-[21px] pt-[19px] text-base uppercase leading-none text-[#010101] transition hover:border-[#5a5a5a] hover:bg-[#5a5a5a] hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

function ProductModal({
  product,
  show,
  onHide,
  wishlistItem,
  compareItem,
}: {
  product?: any;
  currency?: any;
  discountedPrice?: any;
  finalProductPrice?: any;
  finalDiscountedPrice?: any;
  show?: any;
  onHide?: any;
  wishlistItem?: any;
  compareItem?: any;
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { addProductToCart, isAdding } = useSdkAddToCart();
  const { count: reviewCount, avg: reviewAvg } = useProductReviewSummary(product?.id);
  const effectiveRating =
    reviewCount > 0 ? Math.round(reviewAvg) : Number(product?.rating) || 0;
  const { current, original } = formatMappedProductPrice(product);

  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);
  const productCartQty = 0;

  const handleAddToCart = () => {
    const selected = withSelectedVariation(
      product,
      selectedProductColor || product.selectedProductColor || null,
      selectedProductSize || product.selectedProductSize || null
    );
    addProductToCart({ ...selected, quantity: quantityCount }, quantityCount);
  };

  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    thumbs: { swiper: thumbsSwiper },
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: true,
  };

  const onCloseModal = () => {
    setThumbsSwiper(null);
    onHide();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!show) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseModal();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!mounted || !show) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1050] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Product quick view"
    >
      <button
        type="button"
        className="absolute inset-0 border-0 bg-black/50 backdrop-blur-[4px]"
        aria-label="Close product quick view"
        onClick={onCloseModal}
      />

      <div className="relative z-[1] max-h-[min(92vh,920px)] w-full max-w-[min(1100px,96vw)] overflow-hidden rounded-[22px] border border-black/[0.06] bg-gradient-to-b from-[#f8f9fb] via-white to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_28px_90px_rgba(15,18,22,0.14)]">
        <div className="flex items-center justify-end border-b border-black/[0.06] bg-white/88 px-4 py-3 backdrop-blur-[10px]">
          <button
            type="button"
            onClick={onCloseModal}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-black/55 transition hover:bg-black/[0.04] hover:text-black"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="max-h-[calc(min(92vh,920px)-56px)] overflow-y-auto px-3.5 py-[18px] pb-[22px] md:px-7 md:py-[26px] md:pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            <div className="w-full md:w-[42%]">
              <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.07)]">
                <Swiper options={gallerySwiperParams}>
                  {product.image &&
                    product.image.map((img, i) => {
                      return (
                        <SwiperSlide key={i}>
                          <div className="w-full">
                            <img src={img} className="max-w-full" alt="Product" />
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
              <div className="relative mt-[15px]">
                <Swiper options={thumbnailSwiperParams}>
                  {product.image &&
                    product.image.map((img, i) => {
                      return (
                        <SwiperSlide key={i}>
                          <div className="w-full overflow-hidden rounded-[10px]">
                            <img src={img} className="max-w-full" alt="" />
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            </div>
            <div className="w-full md:w-[58%]">
              <div className="max-md:mt-[30px]">
                <h2 className="m-0 text-2xl leading-none text-[#010101]">{product.name}</h2>
                <div className="my-[15px] mb-[26px] flex items-center">
                  {original ? (
                    <Fragment>
                      <span className="text-2xl text-[#fe5252]">{current}</span>{" "}
                      <span className="ml-5 text-lg text-[#333] line-through">{original}</span>
                    </Fragment>
                  ) : (
                    <span className="text-2xl text-[#fe5252]">{current} </span>
                  )}
                </div>
                {effectiveRating > 0 ? (
                  <div className="mb-[17px] flex items-center">
                    <div className="relative mr-10">
                      <Rating ratingValue={effectiveRating} />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="mb-4">
                  <p className="mb-[15px] text-sm leading-6 text-[#333] last:mb-0">{product.shortDescription}</p>
                </div>

                {product.variation ? (
                  <div>
                    <div className="mb-4">
                      <span className="mb-2.5 block text-[15px] font-medium">Color</span>
                      <div className="flex flex-wrap gap-2">
                        {product.variation.map((single, key) => {
                          return (
                            <label
                              className={`relative inline-block h-[30px] w-[30px] cursor-pointer rounded-full ${swatchColorClass[single.color] || "border border-black/20 bg-black/10"}`}
                              key={key}
                            >
                              <input
                                type="radio"
                                className="sr-only"
                                value={single.color}
                                name="product-color"
                                checked={single.color === selectedProductColor}
                                onChange={() => {
                                  setSelectedProductColor(single.color);
                                  setSelectedProductSize(single.size[0].name);
                                  setProductStock(single.size[0].stock);
                                  setQuantityCount(1);
                                }}
                              />
                              <span className="relative inline-block h-3.5 w-3.5 after:absolute after:-left-1 after:-top-[7px] after:h-5 after:w-5 after:rounded-full after:border-2 after:border-[#333] after:opacity-0 after:transition after:content-[''] peer-checked:after:opacity-100 hover:after:opacity-100" />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <span className="mb-2.5 block text-[15px] font-medium">Size</span>
                      <div className="flex flex-wrap gap-0.5">
                        {product.variation &&
                          product.variation.map((single) => {
                            return single.color === selectedProductColor
                              ? single.size.map((singleSize, key) => {
                                  return (
                                    <label
                                      className="mr-0.5 inline-block cursor-pointer rounded border border-transparent bg-[#f1f2f6] px-[9px] pb-[7px] pt-1.5 text-xs uppercase leading-none text-black transition hover:bg-[#5a5a5a] hover:text-white has-[:checked]:bg-[#5a5a5a] has-[:checked]:text-white"
                                      key={key}
                                    >
                                      <input
                                        type="radio"
                                        className="sr-only"
                                        value={singleSize.name}
                                        checked={singleSize.name === selectedProductSize}
                                        onChange={() => {
                                          setSelectedProductSize(singleSize.name);
                                          setProductStock(singleSize.stock);
                                          setQuantityCount(1);
                                        }}
                                      />
                                      <span>{singleSize.name}</span>
                                    </label>
                                  );
                                })
                              : "";
                          })}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {product.affiliateLink ? (
                  <div className="mt-10 flex items-center">
                    <div className="mx-2.5 ml-2.5 mr-6 max-md:mx-2.5 md:max-lg:mr-[17px]">
                      <a className={cartButtonClass} href={product.affiliateLink} rel="noopener noreferrer" target="_blank">
                        Buy Now
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="mb-[34px] mt-10 flex items-center max-md:mb-8">
                    <div className="relative inline-block h-[60px] w-20 overflow-hidden border border-[#e8e8e8]">
                      <button
                        onClick={() =>
                          setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
                        }
                        className="absolute left-0 top-0 h-[60px] w-6 cursor-pointer border-0 bg-transparent text-sm font-medium leading-5 text-[#8f8f8f] transition hover:text-black"
                      >
                        -
                      </button>
                      <input
                        className="float-left h-[60px] w-20 border-0 bg-transparent p-0 text-center text-sm text-[#8f8f8f]"
                        type="text"
                        value={quantityCount}
                        readOnly
                      />
                      <button
                        onClick={() =>
                          setQuantityCount(
                            quantityCount < productStock - productCartQty
                              ? quantityCount + 1
                              : quantityCount
                          )
                        }
                        className="absolute right-0 top-0 h-[60px] w-6 cursor-pointer border-0 bg-transparent text-sm font-medium leading-5 text-[#8f8f8f] transition hover:text-black"
                      >
                        +
                      </button>
                    </div>
                    <div className="mx-2.5 ml-2.5 mr-6 max-md:mx-2.5 md:max-lg:mr-[17px]">
                      {productStock && productStock > 0 ? (
                        <button
                          className={cartButtonClass}
                          onClick={handleAddToCart}
                          disabled={isAdding || productCartQty >= productStock}
                        >
                          Add To Cart
                        </button>
                      ) : (
                        <button className={cartButtonClass} disabled>
                          Out of Stock
                        </button>
                      )}
                    </div>
                    <div>
                      <button
                        className={`border-0 bg-transparent p-0 text-[23px] text-black transition hover:text-[#5a5a5a] disabled:opacity-60 ${wishlistItem !== undefined ? "text-[#5a5a5a]" : ""}`}
                        disabled={wishlistItem !== undefined}
                        title={
                          wishlistItem !== undefined
                            ? "Added to wishlist"
                            : "Add to wishlist"
                        }
                        onClick={() => dispatch(addToWishlist(product))}
                      >
                        <i className="pe-7s-like" />
                      </button>
                    </div>
                    <div className="ml-2.5">
                      <button
                        className={`border-0 bg-transparent p-0 text-[23px] text-black transition hover:text-[#5a5a5a] disabled:opacity-60 ${compareItem !== undefined ? "text-[#5a5a5a]" : ""}`}
                        disabled={compareItem !== undefined}
                        title={
                          compareItem !== undefined ? "Added to compare" : "Add to compare"
                        }
                        onClick={() => dispatch(addToCompare(product))}
                      >
                        <i className="pe-7s-shuffle" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

ProductModal.propTypes = {
  currency: PropTypes.shape({}),
  discountedprice: PropTypes.number,
  finaldiscountedprice: PropTypes.number,
  finalproductprice: PropTypes.number,
  onHide: PropTypes.func,
  product: PropTypes.shape({}),
  show: PropTypes.bool,
  wishlistItem: PropTypes.shape({}),
  compareItem: PropTypes.shape({}),
};

export default ProductModal;
