"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import AnotherLightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import { getDisplayImages } from "@lib/product/images";

const ProductListingGallery = ({
  product,
  selectedColor,
}: {
  product?: any;
  selectedColor?: string | null;
}) => {
  const images = useMemo(
    () => getDisplayImages(product, selectedColor),
    [product, selectedColor]
  );
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    setActive(0);
  }, [selectedColor, images.length]);

  const current = images[Math.min(active, Math.max(images.length - 1, 0))];
  const slides = images.map((src, i) => ({ src, key: i }));

  if (!images.length) {
    return (
      <div className="flex min-h-[320px] items-center justify-center bg-[#f7f7f7] text-[#6b6b6b]">
        No images
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-3 md:flex-row">
      <div
        className="flex w-full shrink-0 flex-row gap-2 overflow-x-auto md:w-[72px] md:max-h-[72vh] md:flex-col md:overflow-y-auto"
        role="list"
      >
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            role="listitem"
            className={clsx(
              "block h-[72px] w-[72px] shrink-0 overflow-hidden border bg-[#fafafa] p-0 transition-[border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
              index === active
                ? "border-[#171717] shadow-[0_0_0_1px_#171717]"
                : "border-[#e5e5e5] hover:border-[#171717] focus-visible:border-[#171717] focus-visible:outline-none"
            )}
            aria-label={`View image ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => setActive(index)}
          >
            <img src={src} alt="" className="block h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <button
        type="button"
        className="flex min-h-[360px] w-full min-w-0 flex-1 cursor-zoom-in items-center justify-center border-0 bg-[#f6f6f6] p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] md:min-h-[520px]"
        onClick={() => setLightboxIndex(active)}
        aria-label="Open product image"
      >
        <img
          src={current}
          alt={product?.name || ""}
          className="block h-auto max-h-[60vh] w-auto max-w-full object-contain md:max-h-[72vh]"
          loading={active === 0 ? "eager" : "lazy"}
          fetchPriority={active === 0 ? "high" : "auto"}
        />
      </button>

      {lightboxIndex >= 0 ? (
        <AnotherLightbox
          open
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={slides}
          plugins={[Thumbnails, Zoom, Fullscreen]}
        />
      ) : null}
    </div>
  );
};

export default ProductListingGallery;
