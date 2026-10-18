"use client";

import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { EffectFade, Thumbs } from 'swiper';
import AnotherLightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Swiper, { SwiperSlide } from "@/components/common/swiper";

const ProductImageGallery = ({ product, immersive }: { product?: any; immersive?: any }) => {
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
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: true
  };

  return (
    <Fragment>
      <div
        className={
        immersive ? "relative overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.07)]" : "relative"
        }
      >
        {((!immersive && product.discount) || product.new) ? (
          <div className="absolute right-3 top-3">
            {!immersive && product.discount ? (
              <span className="mb-2.5 block rounded-[3px] bg-[#FE5252] px-[11px] py-[3px] text-[13px] font-medium leading-none text-white last:mb-0">
                -{product.discount}%
              </span>
            ) : null}
            {product.new ? (
              <span className="block rounded-[3px] bg-[#5a5a5a] px-[11px] py-[3px] text-[13px] font-medium leading-none text-white">
                New
              </span>
            ) : null}
          </div>
        ) : null}
        {product?.image?.length ? (
          <Swiper options={gallerySwiperParams}>
            {product.image.map((single, key) => (
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
                    className="max-w-full"
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
      <div
        className={
          immersive
            ? "relative mt-[15px] [&_.swiper]:h-full [&_.swiper-slide]:cursor-pointer [&_.swiper-slide]:overflow-hidden [&_.swiper-slide]:rounded-xl [&_.swiper-slide]:border [&_.swiper-slide]:border-black/[0.06]"
            : "relative mt-[15px]"
        }
      >
        {product?.image?.length ? (
          <Swiper options={thumbnailSwiperParams}>
            {product.image.map((single, key) => (
              <SwiperSlide key={key}>
                <div className="w-full">
                  <img
                    src={single}
                    className="max-w-full"
                    alt=""
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
      </div>
    </Fragment>
  );
};

ProductImageGallery.propTypes = {
  immersive: PropTypes.bool,
  product: PropTypes.shape({}),
};

export default ProductImageGallery;
