"use client";

import PropTypes from "prop-types";
import { Fragment } from "react";
import ProductMarketplaceCard from "./ProductMarketplaceCard";

const ProductGridListSingle = ({
  product,
  currency,
  spaceBottomClass,
  compact = false,
}: {
  product?: any;
  currency?: any;
  spaceBottomClass?: any;
  compact?: boolean;
}) => {
  return (
    <Fragment>
      <ProductMarketplaceCard
        spaceBottomClass={spaceBottomClass}
        product={product}
        currency={currency}
        compact={compact}
      />
    </Fragment>
  );
};

ProductGridListSingle.propTypes = {
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
  compact: PropTypes.bool,
};

export default ProductGridListSingle;
