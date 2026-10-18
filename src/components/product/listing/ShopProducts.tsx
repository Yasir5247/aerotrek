import PropTypes from "prop-types";
import clsx from "clsx";
import { ProductGridList } from "@/components/product/cards";
import Container from "@/components/ui/Container";

const ShopProducts = ({
  products,
  layout,
  children,
}: {
  products?: any;
  layout?: any;
  children?: React.ReactNode;
}) => {
  return (
    <Container className="!p-0">
      <div className="p-3 max-[767px]:p-2.5">
        <div
          className={clsx(
            "grid grid-cols-2 gap-x-3 gap-y-0 sm:grid-cols-3 lg:grid-cols-4",
            layout
          )}
        >
          <ProductGridList
            products={products}
            spaceBottomClass="mb-4"
            compact
          />
        </div>
        {children}
      </div>
    </Container>
  );
};

ShopProducts.propTypes = {
  children: PropTypes.node,
  layout: PropTypes.string,
  products: PropTypes.array,
};

export default ShopProducts;
