import PropTypes from "prop-types";
import clsx from "clsx";

import {
  getIndividualCategories,
  getIndividualTags,
  getIndividualColors,
  getProductsIndividualSizes,
  setActiveSort,
} from "@/lib/helpers/product";

const filterHeadingClass =
  "relative mb-6 pb-1.5 text-base font-medium capitalize text-black before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-7 before:bg-[linear-gradient(90deg,#5a5a5a,rgba(90,90,90,0.35))] before:content-['']";

const filterButtonClass =
  "border-0 bg-transparent capitalize transition-colors hover:text-[#5a5a5a] [&.active]:text-[#5a5a5a]";

const ShopTopFilter = ({
  products,
  getSortParams,
  open = false,
}: {
  products?: any;
  getSortParams?: any;
  open?: boolean;
}) => {
  const uniqueCategories = getIndividualCategories(products);
  const uniqueColors = getIndividualColors(products);
  const uniqueSizes = getProductsIndividualSizes(products);
  const uniqueTags = getIndividualTags(products);

  return (
    <div
      id="product-filter-wrapper"
      className={clsx(
        "overflow-hidden transition-[max-height] duration-[400ms] ease-out",
        open
          ? "max-h-[1200px] border-t border-black/[0.06]"
          : "max-h-0 border-t border-transparent"
      )}
      aria-hidden={!open}
    >
      <div className="px-3.5 pb-[18px] pt-4 max-[991px]:px-3 max-[991px]:pb-4 max-[991px]:pt-3.5 max-[767px]:px-2.5 max-[767px]:pb-3.5 max-[767px]:pt-3">
        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 md:grid-cols-4 md:gap-x-4">
          <div className="mb-0">
            <h5 className={filterHeadingClass}>Categories</h5>
            {uniqueCategories ? (
              <ul className="m-0 list-none p-0">
                {uniqueCategories.map((category, key) => (
                  <li key={key} className="mb-0.5 last:mb-0">
                    <button
                      type="button"
                      className={filterButtonClass}
                      onClick={(e) => {
                        getSortParams("category", category);
                        setActiveSort(e);
                      }}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              "No categories found"
            )}
          </div>

          <div className="mb-0">
            <h5 className={filterHeadingClass}>Color</h5>
            {uniqueColors ? (
              <ul className="m-0 list-none p-0">
                {uniqueColors.map((color, key) => (
                  <li key={key} className="mb-0.5 last:mb-0">
                    <button
                      type="button"
                      className={filterButtonClass}
                      onClick={(e) => {
                        getSortParams("color", color);
                        setActiveSort(e);
                      }}
                    >
                      {color}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              "No colors found"
            )}
          </div>

          <div className="mb-0">
            <h5 className={filterHeadingClass}>Size</h5>
            {uniqueSizes ? (
              <ul className="m-0 list-none p-0">
                {uniqueSizes.map((size, key) => (
                  <li key={key} className="mb-0.5 last:mb-0">
                    <button
                      type="button"
                      className={clsx(filterButtonClass, "uppercase")}
                      onClick={(e) => {
                        getSortParams("size", size);
                        setActiveSort(e);
                      }}
                    >
                      {size}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              "No sizes found"
            )}
          </div>

          <div className="mb-0">
            <h5 className={filterHeadingClass}>Tag</h5>
            {uniqueTags ? (
              <ul className="m-0 list-none p-0">
                {uniqueTags.map((tag, key) => (
                  <li key={key} className="mb-2.5 mr-2.5 inline-block">
                    <button
                      type="button"
                      className="border border-[#e6e6e6] bg-transparent lowercase transition-colors hover:border-[#5a5a5a] hover:text-[#5a5a5a] [&.active]:border-[#5a5a5a] [&.active]:text-[#5a5a5a]"
                      onClick={(e) => {
                        getSortParams("tag", tag);
                        setActiveSort(e);
                      }}
                    >
                      {tag}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              "No tags found"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ShopTopFilter.propTypes = {
  getSortParams: PropTypes.func,
  products: PropTypes.array,
  open: PropTypes.bool,
};

export default ShopTopFilter;
