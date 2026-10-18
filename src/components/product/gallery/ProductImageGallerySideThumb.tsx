"use client";

import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { EffectFade, Thumbs } from 'swiper';
import AnotherLightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Swiper, { SwiperSlide } from "@/components/common/swiper";

const ProductImageGalleryLeftThumb = ({ product, thumbPosition }: { product?: any; thumbPosition?: any }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [index, setIndex] = useState(-1);
  const slides = product?.image.map((img, i) => ({
      src: img,
      key: i,
  }));

  // swiper slider settings
  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    thumbs: { swiper: thumbsSwiper },
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    loop: true,
    slideToClickedSlide: true,
    direction: "vertical",
    breakpoints: {
      320: {
        slidesPerView: 4,
        direction: "horizontal"
      },
      640: {
        slidesPerView: 4,
        direction: "horizontal"
      },
      768: {
        slidesPerView: 4,
        direction: "horizontal"
      },
      992: {
        slidesPerView: 4,
        direction: "horizontal"
      },
      1200: {
        slidesPerView: 4,
        direction: "vertical"
      }
    }
  };

  return (
    <Fragment>
      <div className="grid grid-cols-1 gap-2.5 xl:grid-cols-12">
        <div
          className={clsx(
            "xl:col-span-10",
            thumbPosition === "left" && "order-1 xl:order-2"
          )}
        >
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
            {product?.image?.length ? (
              <Swiper options={gallerySwiperParams}>
                {product?.image.map((single, key) => (
                  <SwiperSlide key={key}>
                    <button
                      className="absolute right-3 top-3 z-[2] border-0 bg-white/90 p-2 text-black shadow-sm"
                      onClick={() => setIndex(key)}
                    >
                      <i className="pe-7s-expand1"></i>
                    </button>
                    <div className="w-full">
                      <img
                        src={single}
                        className="h-auto w-full"
                        alt=""
                      />
                    </div>
                  </SwiperSlide>
                ))}
                <AnotherLightbox
                    open={index >= 0}
                    index={index}
                    close={() => setIndex(-1)}
                    slides={slides}
                    plugins={[Thumbnails, Zoom, Fullscreen]}
                />
              </Swiper>
            ) : null}
          </div>
        </div>
        <div
          className={clsx(
            "xl:col-span-2",
            thumbPosition === "left" && "order-2 xl:order-1"
          )}
        >
          <div className="relative [&_.swiper]:h-full">
            {product?.image?.length ? (
              <Swiper options={thumbnailSwiperParams}>
                {product.image.map((single, key) => (
                  <SwiperSlide key={key}>
                    <div className="w-full">
                      <img
                        src={single}
                        className="h-auto w-full"
                        alt=""
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : null }
            
          </div>
        </div>
      </div>
    </Fragment>
  );
};

ProductImageGalleryLeftThumb.propTypes = {
  product: PropTypes.shape({}),
  thumbPosition: PropTypes.string
};

export default ProductImageGalleryLeftThumb;
