"use client";

import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import {
  ProductImageGallery,
  ProductImageGallerySideThumb,
  ProductImageFixed,
  ProductListingGallery,
} from "@/components/product/gallery";
import ProductDescriptionInfo from "./ProductDescriptionInfo";
import Container from "@/components/ui/Container";

const ProductImageDescription = ({
  spaceTopClass,
  spaceBottomClass,
  galleryType,
  product,
  cart,
  modern,
  immersive,
  listing,
}: {
  spaceTopClass?: any;
  spaceBottomClass?: any;
  galleryType?: any;
  product?: any;
  cart?: any;
  modern?: any;
  immersive?: any;
  listing?: any;
}) => {
  const currency = useSelector((state: any) => state.currency);
  const { wishlistItems } = useSelector((state: any) => state.wishlist);
  const { compareItems } = useSelector((state: any) => state.compare);
  const wishlistItem = wishlistItems.find((item) => item.id === product.id);
  const compareItem = compareItems.find((item) => item.id === product.id);

  const descriptionInfo = (
    <ProductDescriptionInfo
      product={product}
      cart={cart}
      currency={currency}
      wishlistItem={wishlistItem}
      compareItem={compareItem}
      immersive={immersive}
      listing={listing}
    />
  );

  if (listing) {
    return (
      <ListingProductLayout
        product={product}
        cart={cart}
        currency={currency}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
        spaceTopClass={spaceTopClass}
        spaceBottomClass={spaceBottomClass}
      />
    );
  }

  return (
    <div
      className={clsx(
        immersive && "py-2 pb-12",
        spaceTopClass,
        spaceBottomClass
      )}
    >
      <div className="w-full">
        <div
          className={clsx(
            "grid grid-cols-1 md:grid-cols-2",
            immersive && "items-start gap-4 xl:grid-cols-12 xl:gap-5"
          )}
        >
          <div
            className={clsx(
              "min-w-0",
              immersive && "xl:col-span-7"
            )}
          >
            <div
              className={immersive ? "sticky top-24" : undefined}
              {...(immersive ? { "data-pd-gallery": true } : {})}
            >
              {galleryType === "leftThumb" ? (
                <ProductImageGallerySideThumb
                  product={product}
                  thumbPosition="left"
                />
              ) : galleryType === "rightThumb" ? (
                <ProductImageGallerySideThumb product={product} />
              ) : galleryType === "fixedImage" ? (
                <ProductImageFixed product={product} />
              ) : (
                <ProductImageGallery product={product} immersive={immersive} />
              )}
            </div>
          </div>
          <div
            className={clsx(
              "min-w-0",
              immersive && "xl:col-span-5"
            )}
          >
            <div className={immersive ? "flex flex-col gap-6" : undefined}>
              {descriptionInfo}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ListingProductLayout({
  product,
  cart,
  currency,
  wishlistItem,
  compareItem,
  spaceTopClass,
  spaceBottomClass,
}: {
  product: any;
  cart: any;
  currency: any;
  wishlistItem: any;
  compareItem: any;
  spaceTopClass?: string;
  spaceBottomClass?: string;
}) {
  const [selectedColor, setSelectedColor] = useState(
    product?.variation?.[0]?.color || ""
  );

  return (
    <div className={clsx("py-2 pb-12", spaceTopClass, spaceBottomClass)}>
      <div className="w-full">
        <Container className="!p-0">
          <div className="grid grid-cols-1 items-start gap-6 p-4 md:p-[22px] lg:grid-cols-12 lg:gap-8">
            <div className="min-w-0 lg:col-span-7">
              <ProductListingGallery
                product={product}
                selectedColor={selectedColor}
              />
            </div>
            <div className="min-w-0 lg:col-span-5">
              <ProductDescriptionInfo
                product={product}
                cart={cart}
                currency={currency}
                wishlistItem={wishlistItem}
                compareItem={compareItem}
                listing
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

ProductImageDescription.propTypes = {
  galleryType: PropTypes.string,
  immersive: PropTypes.bool,
  listing: PropTypes.bool,
  modern: PropTypes.bool,
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default ProductImageDescription;
