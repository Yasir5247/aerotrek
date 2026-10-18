"use client";

import { Fragment } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Link from "next/link";
import { formatMappedProductPrice } from "@/lib/util/money";
import { useCountryPath } from "@/hooks/use-country-path";
import ProductQuickAddButton from "./ProductQuickAddButton";

const ProductMarketplaceCard = ({
  product,
  spaceBottomClass,
  className,
  compact = false,
}: {
  product: any;
  currency?: any;
  spaceBottomClass?: string;
  className?: string;
  compact?: boolean;
}) => {
  const toCountryPath = useCountryPath();
  const { current, original } = formatMappedProductPrice(product);
  const productHref = toCountryPath(`/product/${product.id}`);

  return (
    <article
      className={clsx(
        "group flex h-full w-full flex-col overflow-hidden border border-black/10 bg-white transition-[border-color,box-shadow] duration-200 hover:border-black/14 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
        compact ? "rounded-lg" : "rounded-[10px]",
        spaceBottomClass,
        className
      )}
    >
      <div className="relative aspect-square border-b border-black/[0.06] bg-[#f3f3f3]">
        <Link href={productHref} className="block h-full w-full">
          <img
            className="block h-full w-full object-contain object-center"
            src={product.image[0]}
            alt={product.name}
          />
        </Link>
        {product.discount || product.new ? (
          <div className={clsx("absolute flex flex-wrap gap-1", compact ? "left-1.5 top-1.5" : "left-2.5 top-2.5")}>
            {product.discount ? (
              <span
                className={clsx(
                  "inline-flex items-center rounded-base bg-grey-90 font-bold uppercase leading-none tracking-[0.04em] text-white",
                  compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[11px]"
                )}
              >
                -{product.discount}%
              </span>
            ) : null}
            {product.new ? (
              <span
                className={clsx(
                  "inline-flex items-center rounded-base bg-grey-50 font-bold uppercase leading-none tracking-[0.04em] text-white",
                  compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[11px]"
                )}
              >
                New
              </span>
            ) : null}
          </div>
        ) : null}
        <ProductQuickAddButton product={product} compact={compact} />
      </div>

      <div
        className={clsx(
          "flex flex-1 flex-col",
          compact ? "gap-1.5 px-2.5 pb-2.5 pt-2" : "gap-2.5 px-4 pb-4 pt-3.5"
        )}
      >
        <Link
          href={productHref}
          className={clsx(
            "flex w-full items-center justify-center rounded-rounded bg-grey-90 text-center font-semibold uppercase leading-none tracking-[0.08em] text-white no-underline transition-colors duration-150 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white",
            compact
              ? "min-h-[32px] px-2.5 py-1.5 text-[10px]"
              : "min-h-[44px] px-4 py-3 text-[13px]"
          )}
        >
          See more
        </Link>
        <h3 className={clsx("m-0 font-medium leading-[1.35]", compact ? "text-xs" : "text-[15px] leading-[1.4]")}>
          <Link
            href={productHref}
            className="line-clamp-2 text-grey-50 no-underline transition-colors duration-150 hover:text-grey-70"
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex flex-wrap items-baseline gap-1.5">
          {original ? (
            <Fragment>
              <span
                className={clsx(
                  "font-semibold leading-tight text-grey-70",
                  compact ? "text-xs" : "text-[15px]"
                )}
              >
                {current}
              </span>
              <span
                className={clsx(
                  "font-medium leading-tight text-black/40 line-through",
                  compact ? "text-[10px]" : "text-[13px]"
                )}
              >
                {original}
              </span>
            </Fragment>
          ) : (
            <span
              className={clsx(
                "font-semibold leading-tight text-grey-70",
                compact ? "text-xs" : "text-[15px]"
              )}
            >
              {current}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

ProductMarketplaceCard.propTypes = {
  compact: PropTypes.bool,
  className: PropTypes.string,
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
};

export default ProductMarketplaceCard;
