"use client";

import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import clsx from "clsx";
import Swiper, { SwiperSlide } from "@/components/common/swiper";
import SectionTitle from "@/components/common/section-title/SectionTitle";
import ProductGridSingle from "@/components/product/cards/ProductGridSingle";
import { CONTENT_SHELL_CLASS } from "@/lib/ui/content-shell";
import Container from "@/components/ui/Container";

const settings = {
  loop: false,
  slidesPerView: 4,
  grabCursor: true,
  spaceBetween: 30,
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  },
};

const RelatedProductSlider = ({
  spaceBottomClass,
  products = [],
  className,
  containerClass = CONTENT_SHELL_CLASS,
}: {
  spaceBottomClass?: string;
  products?: any[];
  className?: string;
  containerClass?: string;
}) => {
  const currency = useSelector((state: any) => state.currency);

  if (!products?.length) {
    return null;
  }

  return (
    <div className={clsx(spaceBottomClass, className)}>
      <div className={containerClass}>
        <Container>
          <SectionTitle
            titleText="Related Products"
            positionClass="text-center"
            spaceClass="mb-5 [&_h2]:text-[clamp(1.5rem,2.5vw,2rem)] [&_h2]:font-extrabold [&_h2]:tracking-[-0.02em] [&_h2]:text-[#111]"
          />
          <Swiper options={settings}>
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductGridSingle product={product} currency={currency} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </div>
    </div>
  );
};

RelatedProductSlider.propTypes = {
  className: PropTypes.string,
  containerClass: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.shape({})),
  spaceBottomClass: PropTypes.string,
};

export default RelatedProductSlider;
