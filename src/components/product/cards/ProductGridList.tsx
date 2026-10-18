"use client";

import PropTypes from "prop-types";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import ProductGridListSingle from "./ProductGridListSingle";

const ProductGridList = ({
  products,
  spaceBottomClass,
  compact = false,
}: {
  products?: any;
  spaceBottomClass?: any;
  compact?: boolean;
}) => {
  const currency = useSelector((state: any) => state.currency);

  return (
    <Fragment>
      {products?.map((product) => (
        <div className="flex min-w-0 flex-col" key={product.id}>
          <ProductGridListSingle
            spaceBottomClass={spaceBottomClass}
            product={product}
            currency={currency}
            compact={compact}
          />
        </div>
      ))}
    </Fragment>
  );
};

ProductGridList.propTypes = {
  products: PropTypes.array,
  spaceBottomClass: PropTypes.string,
  compact: PropTypes.bool,
};

export default ProductGridList;
