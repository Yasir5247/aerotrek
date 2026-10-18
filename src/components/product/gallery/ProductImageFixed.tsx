import PropTypes from "prop-types";


const ProductImageFixed = ({ product }: { product?: any }) => {
  return (
    <div className="relative">
      {product.discount || product.new ? (
        <div className="absolute right-3 top-3">
          {product.discount ? (
            <span className="mb-2.5 block rounded-[3px] bg-[#FE5252] px-[11px] py-[3px] text-[13px] font-medium leading-none text-white">
              -{product.discount}%
            </span>
          ) : (
            ""
          )}
          {product.new ? (
            <span className="block rounded-[3px] bg-[#5a5a5a] px-[11px] py-[3px] text-[13px] font-medium leading-none text-white">
              New
            </span>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      <div>
        {product.image ? (
          <img
            src={product.image[0]}
            alt=""
            className="max-w-full"
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

ProductImageFixed.propTypes = {
  product: PropTypes.shape({})
};

export default ProductImageFixed;
