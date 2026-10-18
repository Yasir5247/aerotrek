"use client";

import PropTypes from "prop-types";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import AccordionItem from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import {
  getListingVariantPrice,
  isVariantInStock,
} from "@/lib/helpers/product";
import { formatCartMoney, getMappedProductPricing } from "@/lib/util/money";
import { useCountryPath } from "@/hooks/use-country-path";
import Rating from "@/components/product/shared/ProductRating";
import useProductReviewSummary from "@/hooks/use-product-review-summary";
import { useSdkAddToCart } from "@/hooks/use-sdk-add-to-cart";
import { addToWishlist } from "@/store/slices/wishlist-slice";
import { addToCompare } from "@/store/slices/compare-slice";
import { withSelectedVariation, resolveCartVariationId } from "@/lib/helpers/cartVariation";
import { getVariantCartQuantity } from "@lib/util/cart";
import { DEFAULT_SHIPPING_SETTINGS } from "@/lib/helpers/shippingSettings";

const SWATCH_COLORS: Record<string, string> = {
  black: "#171717",
  white: "#ffffff",
  navy: "#1e3a5f",
  blue: "#2563eb",
  red: "#b91c1c",
  green: "#166534",
  brown: "#7c4a1e",
  beige: "#d6c3a5",
  grey: "#6b7280",
  gray: "#6b7280",
  gold: "#d4af37",
  multicolor: "linear-gradient(135deg, #1d4ed8, #16a34a 40%, #ea580c 70%, #b91c1c)",
};

function swatchBackground(color?: string) {
  const key = String(color || "").trim().toLowerCase().replace(/\s+/g, "");
  if (SWATCH_COLORS[key]) return SWATCH_COLORS[key];
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(key)) return key;
  return "#171717";
}

const ProductDescriptionInfo = ({
  product,
  cart,
  currency,
  wishlistItem,
  compareItem,
  immersive,
  listing,
  selectedColor,
  onColorChange,
}: {
  product?: any;
  cart?: any;
  currency?: any;
  wishlistItem?: any;
  compareItem?: any;
  immersive?: any;
  listing?: any;
  selectedColor?: string;
  onColorChange?: (color: string) => void;
}) => {
  const dispatch = useDispatch();
  const toCountryPath = useCountryPath();
  const { addProductToCart, isAdding } = useSdkAddToCart();
  const firstVariation = product?.variation?.[0];
  const firstSize = firstVariation?.size?.[0];

  const [selectedProductColor, setSelectedProductColor] = useState(
    firstVariation?.color || ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    firstSize?.name || ""
  );
  const [productStock, setProductStock] = useState(
    product?.variation ? (firstSize?.stock ?? 0) : product.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (!selectedColor || selectedColor === selectedProductColor) return;
    const group = product?.variation?.find((entry) => entry.color === selectedColor);
    const firstSize = group?.size?.[0];
    setSelectedProductColor(selectedColor);
    setSelectedProductSize(firstSize?.name || "");
    setProductStock(firstSize?.stock ?? 0);
    setQuantityCount(1);
  }, [selectedColor, selectedProductColor, product]);

  useEffect(() => {
    const nextFirstVariation = product?.variation?.[0];
    const nextFirstSize = nextFirstVariation?.size?.[0];

    if (product?.variation) {
      setSelectedProductColor(nextFirstVariation?.color || "");
      setSelectedProductSize(nextFirstSize?.name || "");
      setProductStock(nextFirstSize?.stock ?? 0);
    } else {
      setSelectedProductColor("");
      setSelectedProductSize("");
      setProductStock(product?.stock ?? 0);
    }

    setQuantityCount(1);
  }, [product?.id]);

  const selectedSizeEntry = product?.variation
    ?.find((group) => group.color === selectedProductColor)
    ?.size?.find((entry) => entry.name === selectedProductSize);

  const selectedVariantId = resolveCartVariationId(
    withSelectedVariation(product, selectedProductColor, selectedProductSize)
  );
  const productCartQty = getVariantCartQuantity(cart, selectedVariantId);

  const selectedPrice = useMemo(() => {
    if (selectedVariantId && product?.variantPrices?.[selectedVariantId] != null) {
      const amount = Number(product.variantPrices[selectedVariantId]);
      if (Number.isFinite(amount)) return amount;
    }
    return getListingVariantPrice(
      product,
      selectedSizeEntry,
      selectedProductColor,
      selectedProductSize
    );
  }, [
    product,
    selectedVariantId,
    selectedSizeEntry,
    selectedProductColor,
    selectedProductSize,
  ]);
  const safeSelectedPrice = Number.isFinite(selectedPrice) ? selectedPrice : 0;
  const pricing = getMappedProductPricing({
    price: safeSelectedPrice,
    original_price: product?.original_price,
    discount: product?.discount,
    currency_code: product?.currency_code,
  });
  const formatDisplayPrice = (amount: number) =>
    formatCartMoney(
      Number.isFinite(amount) ? amount : 0,
      pricing.currencyCode || currency?.currencyName
    );
  const formattedProductPrice = formatDisplayPrice(
    pricing.isOnSale ? pricing.originalAmount : pricing.amount
  );
  const formattedDiscountedPrice = pricing.isOnSale
    ? formatDisplayPrice(pricing.amount)
    : null;

  const variantInStock = product?.variation
    ? isVariantInStock(selectedSizeEntry)
    : Number(productStock) > 0;
  const needsOptions =
    product?.variation?.length &&
    (!selectedProductColor || !selectedProductSize);
  const maxQty = Math.max(0, Number(productStock) - productCartQty);

  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const addSelectedToCart = async () => {
    await addProductToCart(
      withSelectedVariation(
        product,
        selectedProductColor || product.selectedProductColor || null,
        selectedProductSize || product.selectedProductSize || null
      ),
      quantityCount
    );
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion((current) => (current === id ? null : id));
  };

  const handleColorChange = (color: string, firstSize?: any) => {
    setSelectedProductColor(color);
    setSelectedProductSize(firstSize?.name || "");
    setProductStock(firstSize?.stock ?? 0);
    setQuantityCount(1);
    onColorChange?.(color);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      setShareCopied(false);
    }
  };

  const atcLabel = needsOptions
    ? "Select options"
    : !variantInStock
      ? "Out of stock"
      : isAdding
        ? "Adding..."
        : "Add to cart";

  const detailsHtml = product.fullDescription || product.shortDescription || "";
  const detailsLooksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(detailsHtml);
  const shippingThreshold = (
    Number(DEFAULT_SHIPPING_SETTINGS.freeShippingThreshold) * currency.currencyRate
  ).toFixed(2);
  const shippingRate = (
    Number(DEFAULT_SHIPPING_SETTINGS.shippingRate) * currency.currencyRate
  ).toFixed(2);

  const listingBlock = (
    <div className="max-w-none lg:max-w-[460px]">
      <h1 className="mb-2.5 mt-0 text-[clamp(1.35rem,2vw,1.75rem)] font-bold leading-[1.2] tracking-[-0.03em] text-[#171717]">
        {product.name}
      </h1>
      <div className="mb-7 flex items-baseline gap-2.5 text-[1.125rem] font-semibold text-[#171717]">
        {formattedDiscountedPrice ? (
          <Fragment>
            <span>{formattedDiscountedPrice}</span>
            <span className="text-[0.95rem] font-medium text-[#8a8a8a] line-through">
              {formattedProductPrice}
            </span>
          </Fragment>
        ) : (
          <span>{formattedProductPrice}</span>
        )}
      </div>

      {product.variation ? (
        <div className="mb-7 flex flex-col gap-5">
          <div>
            <div className="mb-2.5 text-[0.9375rem] text-[#171717]">
              Color: <strong className="font-bold">{selectedProductColor || "Default"}</strong>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variation.map((single, key) => (
                <label
                  key={`${single.color}-${key}`}
                  className="relative m-0 cursor-pointer focus-within:[&>span]:border-[#171717] focus-within:[&>span]:shadow-[0_0_0_1px_#171717]"
                >
                  <input
                    type="radio"
                    name="product-color"
                    value={single.color}
                    className="pointer-events-none absolute opacity-0"
                    checked={single.color === selectedProductColor}
                    onChange={() => {
                      handleColorChange(single.color, single.size?.[0]);
                    }}
                  />
                  <span
                    className={clsx(
                      "block h-7 w-7 border bg-cover transition-[box-shadow,border-color] duration-200 ease-out motion-reduce:transition-none",
                      single.color === selectedProductColor
                        ? "border-[#171717] shadow-[0_0_0_1px_#171717]"
                        : "border-[#d4d4d4]"
                    )}
                    style={{ background: swatchBackground(single.color) }}
                    title={single.color}
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2.5 text-[0.9375rem] text-[#171717]">
              Size: <strong className="font-bold">{selectedProductSize || "One Size"}</strong>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variation.map((single) =>
                single.color === selectedProductColor
                  ? single.size.map((singleSize, key) => (
                      <label
                        key={`${singleSize.name}-${key}`}
                        className="relative m-0 cursor-pointer focus-within:[&>span]:border-[#171717] focus-within:[&>span]:bg-[#fafafa]"
                      >
                        <input
                          type="radio"
                          name="product-size"
                          value={singleSize.name}
                          className="pointer-events-none absolute opacity-0"
                          checked={singleSize.name === selectedProductSize}
                          onChange={() => {
                            setSelectedProductSize(singleSize.name);
                            setProductStock(singleSize.stock);
                            setQuantityCount(1);
                          }}
                        />
                        <span
                          className={clsx(
                            "inline-flex min-h-[34px] items-center rounded border px-3 py-1.5 text-[0.8125rem] font-medium text-[#171717] transition-[border-color,background] duration-200 ease-out motion-reduce:transition-none",
                            singleSize.name === selectedProductSize
                              ? "border-[#171717] bg-[#fafafa]"
                              : "border-[#d9d9d9] bg-white"
                          )}
                        >
                          {singleSize.name}
                        </span>
                      </label>
                    ))
                  : null
              )}
            </div>
          </div>
        </div>
      ) : null}

      {product.variation ? (
        <div className="mb-5 flex items-center gap-3">
          <span className="text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-[#171717]">
            Qty
          </span>
          <div className="inline-flex items-center border border-[#d9d9d9]">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center border-0 bg-white text-[#171717] disabled:opacity-40"
              disabled={quantityCount <= 1}
              onClick={() => setQuantityCount((qty) => Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="min-w-10 px-2 text-center text-sm font-semibold">
              {quantityCount}
            </span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center border-0 bg-white text-[#171717] disabled:opacity-40"
              disabled={!maxQty || quantityCount >= maxQty}
              onClick={() =>
                setQuantityCount((qty) => Math.min(maxQty || qty + 1, qty + 1))
              }
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      ) : null}

      {product.affiliateLink ? (
        <Button
          as="a"
          href={product.affiliateLink}
          rel="noopener noreferrer"
          target="_blank"
          variant="pdp"
          size="lg"
          fullWidth
          className="mb-2.5"
        >
          Buy Now
        </Button>
      ) : (
        <Button
          type="button"
          variant="pdp"
          size="lg"
          fullWidth
          className="mb-2.5"
          disabled={
            isAdding ||
            needsOptions ||
            !variantInStock ||
            !maxQty ||
            quantityCount > maxQty
          }
          onClick={addSelectedToCart}
        >
          {atcLabel}
        </Button>
      )}

      <Button
        type="button"
        variant="pdpMuted"
        size="lg"
        fullWidth
        className="mb-2.5"
        onClick={handleShare}
      >
        {shareCopied ? "Link copied!" : "Share"}
      </Button>

      <Button
        type="button"
        variant="pdpMuted"
        size="lg"
        fullWidth
        className="mb-7"
        disabled={wishlistItem !== undefined}
        onClick={() => dispatch(addToWishlist(product))}
      >
        {wishlistItem !== undefined ? "In Wishlist" : "Add to Wishlist"}
      </Button>

      <div className="mb-5 border-t border-[#e8e8e8]">
        <AccordionItem
          id="details"
          title="Product details"
          openId={openAccordion}
          onToggle={toggleAccordion}
        >
          {detailsLooksLikeHtml ? (
            <div dangerouslySetInnerHTML={{ __html: detailsHtml }} />
          ) : (
            <p className="mb-[15px] text-sm leading-6 text-[#333] last:mb-0">
              {detailsHtml || "No additional details for this product."}
            </p>
          )}
        </AccordionItem>
        <AccordionItem
          id="shipping"
          title="Shipping & returns"
          openId={openAccordion}
          onToggle={toggleAccordion}
        >
          {DEFAULT_SHIPPING_SETTINGS.freeShippingEnabled ? (
            <p className="mb-[15px] text-sm leading-6 text-[#333] last:mb-0">
              Free delivery on orders over {currency.currencySymbol}
              {shippingThreshold}. Standard shipping is {currency.currencySymbol}
              {shippingRate}.
            </p>
          ) : (
            <p className="mb-[15px] text-sm leading-6 text-[#333] last:mb-0">
              Standard shipping is {currency.currencySymbol}
              {shippingRate}.
            </p>
          )}
          <p className="mb-[15px] text-sm leading-6 text-[#333] last:mb-0">
            Unused items can be returned within 14 days of delivery.
          </p>
        </AccordionItem>
      </div>

      <Link
        className="flex min-h-16 items-center gap-3 border border-[#e8e8e8] px-3 py-2.5 text-[#171717] no-underline transition-[border-color,background] duration-200 ease-out hover:border-[#171717] hover:text-[#171717] focus-visible:border-[#171717] focus-visible:outline-none motion-reduce:transition-none"
        href={toCountryPath("/shop")}
      >
        <span
          className="inline-flex h-10 w-10 items-center justify-center bg-[#171717] text-xs font-bold tracking-[0.04em] text-[#d4af37]"
          aria-hidden="true"
        >
          AT
        </span>
        <span className="flex-1 text-[0.9375rem] font-semibold">AeroTrek</span>
        <ChevronRight className="text-[#171717]" size={18} strokeWidth={1.75} />
      </Link>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[#6b6b6b]">
        <span>
          {product.sku ? `SKU: ${product.sku}` : product.category?.[0] || "AeroTrek"}
        </span>
        <Link
          className="inline-flex min-h-8 items-center bg-[#f3f3f3] px-2.5 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[#171717] no-underline transition-colors duration-200 ease-out hover:bg-[#e8e8e8] hover:text-[#171717] focus-visible:outline-none motion-reduce:transition-none"
          href={toCountryPath("/contact")}
        >
          Ask a question
        </Link>
      </div>
    </div>
  );

  const nameWords = product.name.trim().split(/\s+/);
  const { count: reviewCount, avg: reviewAvg } = useProductReviewSummary(product?.id);
  const effectiveRating =
    reviewCount > 0 ? Math.round(reviewAvg) : Number(product?.rating) || 0;

  const cartBtnClass =
    "inline-block border-0 bg-[#343538] px-[38px] py-[23px] text-sm font-bold text-white uppercase max-md:px-3 md:max-lg:px-[22px] disabled:cursor-not-allowed hover:bg-[#5a5a5a]";

  const mainBlock = (
    <Fragment>
      <div className="my-[15px] mb-[26px] flex items-center">
        {formattedDiscountedPrice ? (
          <Fragment>
            <span className="text-2xl text-[#fe5252]">{formattedDiscountedPrice}</span>{" "}
            <span className="ml-5 text-lg text-[#333] line-through">
              {formattedProductPrice}
            </span>
          </Fragment>
        ) : (
          <span className="text-2xl text-[#fe5252]">{formattedProductPrice} </span>
        )}
      </div>
      {effectiveRating > 0 ? (
        <div className="mb-[17px] flex items-center">
          <div className="relative mr-10">
            <Rating ratingValue={effectiveRating} />
          </div>
        </div>
      ) : null}
      <div className="my-5 mb-[34px] border-b border-[#e5e5e5] pb-[37px]">
        <p className="m-0 text-[15px] leading-7 text-[#333]">{product.shortDescription}</p>
      </div>

      {product.variation ? (
        <div className="flex max-md:block sm:max-md:flex">
          <div className="mr-5 max-md:mb-5 sm:max-md:mb-0">
            <span className="mb-[15px] block text-[15px] font-medium">Color</span>
            <div className="flex flex-wrap gap-[15px]">
              {product.variation.map((single, key) => (
                <label
                  key={key}
                  className="relative m-0 cursor-pointer focus-within:[&>span]:shadow-[0_0_0_2px_#333]"
                >
                  <input
                    type="radio"
                    value={single.color}
                    name="product-color"
                    className="pointer-events-none absolute opacity-0"
                    checked={single.color === selectedProductColor}
                    onChange={() => {
                      setSelectedProductColor(single.color);
                      setSelectedProductSize(single.size[0].name);
                      setProductStock(single.size[0].stock);
                      setQuantityCount(1);
                    }}
                  />
                  <span
                    className={clsx(
                      "block h-3.5 w-3.5 rounded-full border transition-shadow duration-300",
                      single.color === selectedProductColor
                        ? "shadow-[0_0_0_2px_#333]"
                        : "border-[#d4d4d4]"
                    )}
                    style={{ background: swatchBackground(single.color) }}
                    title={single.color}
                  />
                </label>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-2.5 block text-[15px] font-medium">Size</span>
            <div className="flex flex-wrap gap-1">
              {product.variation.map((single) =>
                single.color === selectedProductColor
                  ? single.size.map((singleSize, key) => (
                      <label
                        className="relative inline-block cursor-pointer bg-[#f1f2f6] text-xs uppercase text-black hover:bg-[#5a5a5a] hover:text-white"
                        key={key}
                      >
                        <input
                          type="radio"
                          value={singleSize.name}
                          className="absolute top-0 left-0 h-full cursor-pointer opacity-0"
                          checked={singleSize.name === selectedProductSize}
                          onChange={() => {
                            setSelectedProductSize(singleSize.name);
                            setProductStock(singleSize.stock);
                            setQuantityCount(1);
                          }}
                        />
                        <span
                          className={clsx(
                            "block px-2 py-2 text-xs font-normal",
                            singleSize.name === selectedProductSize && "bg-[#5a5a5a] text-white"
                          )}
                        >
                          {singleSize.name}
                        </span>
                      </label>
                    ))
                  : null
              )}
            </div>
          </div>
        </div>
      ) : null}
      {product.affiliateLink ? (
        <div className="mt-10 mb-[34px] flex items-center">
          <div className="ml-0">
            <a
              className={cartBtnClass}
              href={product.affiliateLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Buy Now
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-10 mb-[34px] flex items-center">
          <div className="relative inline-block h-[60px] w-20 overflow-hidden border border-[#e8e8e8]">
            <button
              type="button"
              onClick={() => setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)}
              className="absolute top-0 left-0 h-[60px] w-6 cursor-pointer border-0 bg-transparent text-sm font-medium text-[#8f8f8f]"
            >
              -
            </button>
            <input
              className="float-left h-[60px] w-20 border-0 bg-transparent text-center text-sm text-[#8f8f8f]"
              type="text"
              value={quantityCount}
              readOnly
            />
            <button
              type="button"
              onClick={() =>
                setQuantityCount(
                  quantityCount < productStock - productCartQty
                    ? quantityCount + 1
                    : quantityCount
                )
              }
              className="absolute top-0 right-0 h-[60px] w-6 cursor-pointer border-0 bg-transparent text-sm font-medium text-[#8f8f8f]"
            >
              +
            </button>
          </div>
          <div className="mx-2.5 ml-2.5 max-md:mx-2.5 md:max-lg:ml-2.5 md:max-lg:mr-[17px]">
            {productStock && productStock > 0 ? (
              <button
                type="button"
                className={cartBtnClass}
                onClick={addSelectedToCart}
                disabled={isAdding || productCartQty >= productStock}
              >
                Add To Cart
              </button>
            ) : (
              <button type="button" className={cartBtnClass} disabled>
                Out of Stock
              </button>
            )}
          </div>
          <div>
            <button
              type="button"
              className={clsx(
                "border-0 bg-transparent text-lg text-black hover:text-[#5a5a5a]",
                wishlistItem !== undefined && "text-[#5a5a5a]"
              )}
              disabled={wishlistItem !== undefined}
              title={wishlistItem !== undefined ? "Added to wishlist" : "Add to wishlist"}
              onClick={() => dispatch(addToWishlist(product))}
            >
              <i className="pe-7s-like" />
            </button>
          </div>
          <div>
            <button
              type="button"
              className={clsx(
                "ml-2.5 border-0 bg-transparent text-lg text-black hover:text-[#5a5a5a] max-md:ml-2.5",
                compareItem !== undefined && "text-[#5a5a5a]"
              )}
              disabled={compareItem !== undefined}
              title={compareItem !== undefined ? "Added to compare" : "Add to compare"}
              onClick={() => dispatch(addToCompare(product))}
            >
              <i className="pe-7s-shuffle" />
            </button>
          </div>
        </div>
      )}
      {product.category ? (
        <div className="mb-2.5 flex">
          <span className="mr-1.5 text-[15px] text-[#676767]">Categories :</span>
          <ul className="m-0 flex list-none flex-wrap p-0">
            {product.category.map((single, key) => (
              <li key={key} className="mr-2.5 inline">
                <Link className="text-[15px] text-[#676767] hover:text-[#5a5a5a] max-md:text-sm" href={toCountryPath("/shop")}>
                  {single}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {product.tag ? (
        <div className="mb-2.5 flex">
          <span className="mr-1.5 text-[15px] text-[#676767]">Tags :</span>
          <ul className="m-0 flex list-none flex-wrap p-0">
            {product.tag.map((single, key) => (
              <li key={key} className="mr-2.5 inline">
                <Link className="text-[15px] text-[#676767] hover:text-[#5a5a5a] max-md:text-sm" href={toCountryPath("/shop")}>
                  {single}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6">
        <ul className="m-0 flex list-none p-0">
          {[
            { href: "//facebook.com", icon: "fa-facebook" },
            { href: "//dribbble.com", icon: "fa-dribbble" },
            { href: "//pinterest.com", icon: "fa-pinterest-p" },
            { href: "//twitter.com", icon: "fa-twitter" },
            { href: "//linkedin.com", icon: "fa-linkedin" },
          ].map((item) => (
            <li key={item.icon} className="mr-10 last:mr-0">
              <a className="text-base text-[#343538] hover:text-[#5a5a5a]" href={item.href}>
                <i className={`fa ${item.icon}`} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );

  if (listing) {
    return listingBlock;
  }

  return (
    <div
      className={clsx(
        !immersive && "ml-[70px] max-lg:ml-0 max-md:mt-[30px]",
        immersive && "max-w-none"
      )}
    >
      {immersive ? (
        <Fragment>
          <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-black leading-[1.05] tracking-[-0.04em] text-[#111]">
            {nameWords.map((word, i) => (
              <span key={`${word}-${i}`} className="mr-[0.28em] inline-block" data-pd-word>
                {word}
              </span>
            ))}
          </h1>
          <div data-pd-panel-inner>
            <div className="mb-4 mt-3" data-pd-line>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#fafafa] px-3 py-1.5">
                <span className="text-[11px] font-extrabold tracking-[0.1em] text-[#111] uppercase">
                  Bag
                </span>
                {product.discount ? (
                  <span className="text-[11px] font-bold text-[#fe5252]">-{product.discount}%</span>
                ) : null}
              </span>
            </div>
            {mainBlock}
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <h2 className="m-0 text-2xl leading-none text-[#010101]">{product.name}</h2>
          {mainBlock}
        </Fragment>
      )}
    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  compareItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  immersive: PropTypes.bool,
  listing: PropTypes.bool,
  product: PropTypes.shape({}),
  wishlistItem: PropTypes.shape({}),
};

export default ProductDescriptionInfo;
