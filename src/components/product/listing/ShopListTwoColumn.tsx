"use client";

import Breadcrumb from "@/components/layout/breadcrumb/Breadcrumb";
import { ShopProducts, ShopTopbarFilter } from "@/components/product";
import { getSortedProducts } from "@/lib/helpers/product";
import { useCatalog } from "@/providers/catalog-provider";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import Paginator from "react-hooks-paginator";

type ShopListTwoColumnProps = {
  products?: any[];
};

export default function ShopListTwoColumn({
  products: productsProp,
}: ShopListTwoColumnProps): ReactNode {
  const [layout, setLayout] = useState("list two-column");
  const [sortType, setSortType] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [filterSortType, setFilterSortType] = useState("");
  const [filterSortValue, setFilterSortValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [sortedProducts, setSortedProducts] = useState<any[]>([]);
  const { products: catalogProducts } = useCatalog();
  const products = productsProp?.length ? productsProp : catalogProducts;

  const pageLimit = 16;
  const pathname = usePathname();

  const getLayout = (nextLayout) => {
    setLayout(nextLayout);
  };

  const getSortParams = (nextSortType, nextSortValue) => {
    setSortType(nextSortType);
    setSortValue(nextSortValue);
  };

  const getFilterSortParams = (nextSortType, nextSortValue) => {
    setFilterSortType(nextSortType);
    setFilterSortValue(nextSortValue);
  };

  useEffect(() => {
    let nextSorted = getSortedProducts(products, sortType, sortValue);
    nextSorted = getSortedProducts(nextSorted, filterSortType, filterSortValue);
    setSortedProducts(nextSorted);
    setCurrentData(nextSorted.slice(offset, offset + pageLimit));
  }, [offset, products, sortType, sortValue, filterSortType, filterSortValue]);

  return (
    <Fragment>
      <Breadcrumb
        variant="bare"
        className="border-b border-black/[0.06] py-4 max-[767px]:py-3"
        pages={[
          { label: "Home", path: "/" },
          { label: "Shop", path: pathname },
        ]}
      />

      <div className="bg-transparent">
        <div className="pb-[100px] pt-[30px] max-[767px]:pb-[45px]">
          <div className="w-full">
            <ShopTopbarFilter
              getLayout={getLayout}
              getFilterSortParams={getFilterSortParams}
              productCount={products.length}
              sortedProductCount={currentData.length}
              products={products}
              getSortParams={getSortParams}
            />

            <ShopProducts layout={layout} products={currentData}>
              <div className="mt-4 text-center [&_ul_li]:mx-1 [&_ul_li]:inline-block [&_ul_li_a]:inline-flex [&_ul_li_a]:h-10 [&_ul_li_a]:min-w-10 [&_ul_li_a]:items-center [&_ul_li_a]:justify-center [&_ul_li_a]:rounded-full [&_ul_li_a]:border [&_ul_li_a]:border-black/10 [&_ul_li_a]:bg-white [&_ul_li_a]:px-3 [&_ul_li_a]:text-sm [&_ul_li_a]:font-bold [&_ul_li_a]:text-[#111] [&_ul_li_a]:shadow-[0_4px_14px_rgba(0,0,0,0.06)] [&_ul_li_a]:transition [&_ul_li_a:hover]:border-[#5a5a5a] [&_ul_li_a:hover]:text-[#5a5a5a] [&_ul_li_a.active]:border-[#5a5a5a] [&_ul_li_a.active]:bg-[#5a5a5a] [&_ul_li_a.active]:text-white [&_ul_li_button]:inline-flex [&_ul_li_button]:h-10 [&_ul_li_button]:min-w-10 [&_ul_li_button]:items-center [&_ul_li_button]:justify-center [&_ul_li_button]:rounded-full [&_ul_li_button]:border [&_ul_li_button]:border-black/10 [&_ul_li_button]:bg-white [&_ul_li_button]:px-3 [&_ul_li_button]:text-sm [&_ul_li_button]:font-bold [&_ul_li_button]:text-[#111] [&_ul_li_button]:shadow-[0_4px_14px_rgba(0,0,0,0.06)] [&_ul_li_a.prev]:!border [&_ul_li_a.prev]:!border-black/[0.08] [&_ul_li_a.prev]:!bg-white [&_ul_li_a.next]:!border [&_ul_li_a.next]:!border-black/[0.08] [&_ul_li_a.next]:!bg-white">
                <Paginator
                  totalRecords={sortedProducts.length}
                  pageLimit={pageLimit}
                  pageNeighbours={2}
                  setOffset={setOffset}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pageContainerClass="mb-0 mt-0"
                  pagePrevText="«"
                  pageNextText="»"
                />
              </div>
            </ShopProducts>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
