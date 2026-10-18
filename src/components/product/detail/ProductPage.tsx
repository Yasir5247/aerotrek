"use client";

import React, { Fragment, useRef } from "react";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/layout/breadcrumb/Breadcrumb";
import { useCountryPath } from "@/hooks/use-country-path";
import RelatedProductSlider from "./RelatedProductSlider";
import ProductImageDescription from "./ProductImageDescription";
import BrowsingHistoryTracker from "@/components/store/browsing-history/BrowsingHistoryTracker";

const Product = ({
  product,
  cart,
  relatedProducts = [],
  countryCode,
}: {
  product?: any;
  cart?: any;
  relatedProducts?: any[];
  countryCode?: string;
}) => {
  const productRootRef = useRef<any>(null);
  const pathname = usePathname();
  const toCountryPath = useCountryPath();

  if (!product) return null;

  return (
    <Fragment>
      <BrowsingHistoryTracker product={product} />
      <div ref={productRootRef} className="bg-white">
        <Breadcrumb
          variant="bare"
          className="relative z-[2] !border-0 !bg-transparent !py-2 !shadow-none [backdrop-filter:none]"
          containerClass="w-full px-0"
          pages={[
            { label: "Home", path: toCountryPath("/") },
            { label: "Shop", path: toCountryPath("/shop") },
            { label: product.name, path: pathname },
          ]}
        />

        <ProductImageDescription listing product={product} cart={cart} />

        <div className="relative z-[1] pt-3 pb-[50px]">
          <RelatedProductSlider
            containerClass="w-full px-0"
            spaceBottomClass=""
            products={relatedProducts}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Product;
