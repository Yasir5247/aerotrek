"use client";

import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import clsx from "clsx";
import Container from "@/components/ui/Container";
import ShopTopFilter from "./ShopTopFilter";

const ShopTopActionFilter = ({
  getLayout: _getLayout,
  getFilterSortParams,
  productCount,
  sortedProductCount,
  products,
  getSortParams,
}: {
  getLayout?: any;
  getFilterSortParams?: any;
  productCount?: any;
  sortedProductCount?: any;
  products?: any;
  getSortParams?: any;
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const productWord = productCount === 1 ? "product" : "products";

  return (
    <Fragment>
      <Container className="mb-5 !p-0">
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-2.5 px-3 py-2 max-[767px]:gap-x-2.5 max-[767px]:gap-y-2 max-[767px]:px-2.5">
          <div className="inline-flex min-w-0 flex-1 flex-row items-center gap-2">
            <label
              className="m-0 shrink-0 text-[11px] font-extrabold uppercase tracking-[0.12em] text-black/[0.38]"
              htmlFor="shop-sort-select"
            >
              Sort
            </label>
            <div className="relative min-w-0 max-w-[220px] flex-1 basis-[160px] after:pointer-events-none after:absolute after:right-2.5 after:top-1/2 after:-mt-0.5 after:border-x-4 after:border-t-[5px] after:border-x-transparent after:border-t-black/40 after:content-['']">
              <select
                id="shop-sort-select"
                className="block h-[34px] w-full min-w-[140px] cursor-pointer appearance-none rounded-lg border border-black/10 bg-white py-0 pl-2.5 pr-7 text-[13px] font-semibold leading-[1.2] text-[#111] shadow-none transition-[border-color] duration-200 hover:border-black/16 focus:border-black/[0.22] focus:outline-none focus:shadow-[0_0_0_2px_rgba(0,0,0,0.05)]"
                onChange={(e) =>
                  getFilterSortParams("filterSort", e.target.value)
                }
                aria-label="Sort products"
              >
                <option value="default">Featured</option>
                <option value="priceHighToLow">Price · High to low</option>
                <option value="priceLowToHigh">Price · Low to high</option>
              </select>
            </div>
          </div>

          <p className="m-0 shrink-0 whitespace-nowrap text-xs leading-[1.2] text-black/45 max-[767px]:order-3 max-[767px]:w-full max-[767px]:text-center">
            <span className="font-extrabold tabular-nums text-[#111]">
              {sortedProductCount}
            </span>
            <span className="mx-px font-medium text-black/35">/</span>
            <span className="font-extrabold tabular-nums text-[#111]">
              {productCount}
            </span>
            <span className="text-xs text-black/[0.38]"> {productWord}</span>
          </p>

          <div className="ml-auto shrink-0">
            <button
              type="button"
              className={clsx(
                "inline-flex min-h-[34px] cursor-pointer items-center justify-center gap-[7px] rounded-lg border-0 bg-[#111] px-3.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white shadow-none transition-[background,opacity] duration-200 hover:bg-[#2a2a2a] hover:text-white active:opacity-90",
                filtersOpen && "bg-[#0d0d0d]"
              )}
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="product-filter-wrapper"
            >
              <i
                className="fa fa-sliders text-[13px] opacity-90"
                aria-hidden
              />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <ShopTopFilter
          products={products}
          getSortParams={getSortParams}
          open={filtersOpen}
        />
      </Container>
    </Fragment>
  );
};

ShopTopActionFilter.propTypes = {
  getFilterSortParams: PropTypes.func,
  getLayout: PropTypes.func,
  getSortParams: PropTypes.func,
  productCount: PropTypes.number,
  products: PropTypes.array,
  sortedProductCount: PropTypes.number,
};

export default ShopTopActionFilter;
