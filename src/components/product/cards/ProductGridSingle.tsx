"use client";

import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import ProductMarketplaceCard from "./ProductMarketplaceCard";

const ProductGridSingle = ({
  product,
  currency: currencyProp,
  spaceBottomClass,
  className,
}: {
  product?: any;
  currency?: any;
  spaceBottomClass?: any;
  className?: any;
}) => {
  const currencyFromStore = useSelector((state: any) => state.currency);
  const currency = currencyProp ?? currencyFromStore;

  return (
    <ProductMarketplaceCard
      product={product}
      currency={currency}
      spaceBottomClass={spaceBottomClass}
      className={className}
    />
  );
};

ProductGridSingle.propTypes = {
  className: PropTypes.string,
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
};

export default ProductGridSingle;
