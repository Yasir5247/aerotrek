"use client";

import PropTypes from "prop-types";
import clsx from "clsx";
import { EffectFade } from "swiper";
import Swiper, { SwiperSlide } from "@/components/common/swiper";
import sliderData from "@/lib/content/hero-sliders/hero-slider-nine.json";
import HeroSliderNineSingle from "./HeroSliderNineSingle";
import { GLASS_PANEL_RADIUS_CLASS } from "@/lib/ui/glass-panel";
import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

const params = {
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
  modules: [EffectFade],
  loop: true,
  speed: 1000,
  navigation: true,
};

const HeroSliderNine = ({
  spaceLeftClass,
  spaceRightClass,
}: {
  spaceLeftClass?: any;
  spaceRightClass?: any;
}) => {
  const wrapRef = useRef<any>(null);
  const areaRef = useRef<any>(null);
  const hasIntroPlayed = useRef(false);

  useEffect(() => {
    const area = areaRef.current;
    if (!area || hasIntroPlayed.current) return;
    hasIntroPlayed.current = true;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) {
      gsap.set(area, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline();

    tl.to(area, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    });

    const img = area.querySelector("[data-hero-img]");
    if (img) {
      gsap.set(img, { scale: 1.1 });
      tl.to(
        img,
        {
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
        },
        0
      );
    }
  }, []);

  const animateActiveSlide = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const active = wrap.querySelector(".swiper-slide-active");
    if (!active) return;

    const content = active.querySelector("[data-hero-content]");
    if (!content) return;

    const items = content.querySelectorAll("[data-hero-item]");
    if (!items.length) return;

    const isFirstLoad = !wrapRef.current?.__contentAnimated;
    if (wrapRef.current) wrapRef.current.__contentAnimated = true;

    gsap.killTweensOf(items);
    gsap.set(items, { opacity: 0, y: 22 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: isFirstLoad ? 0.55 : 0,
      ease: "power3.out",
      stagger: 0.12,
    });
  }, []);

  return (
    <div
      className={clsx("mt-4 md:mt-5", spaceLeftClass, spaceRightClass)}
      ref={areaRef}
      style={{ opacity: 0 }}
    >
      <div
        className={clsx(
          "group/slider overflow-hidden",
          GLASS_PANEL_RADIUS_CLASS
        )}
      >
      <div className="group/slider relative [&_.swiper]:h-auto [&_.swiper-slide]:h-auto [&_.ht-swiper-button-nav]:absolute [&_.ht-swiper-button-nav]:top-1/2 [&_.ht-swiper-button-nav]:z-[2] [&_.ht-swiper-button-nav]:inline-flex [&_.ht-swiper-button-nav]:h-20 [&_.ht-swiper-button-nav]:w-20 [&_.ht-swiper-button-nav]:-translate-y-1/2 [&_.ht-swiper-button-nav]:items-center [&_.ht-swiper-button-nav]:justify-center [&_.ht-swiper-button-nav]:border-0 [&_.ht-swiper-button-nav]:bg-transparent [&_.ht-swiper-button-nav]:p-0 [&_.ht-swiper-button-nav]:text-[80px] [&_.ht-swiper-button-nav]:text-[#999] [&_.ht-swiper-button-nav]:opacity-0 [&_.ht-swiper-button-nav]:transition-all [&_.ht-swiper-button-nav]:duration-300 [&_.ht-swiper-button-nav]:hover:text-[#5a5a5a] [&_.swiper-button-prev]:left-20 [&_.swiper-button-next]:right-20 [&_.swiper-button-next]:left-auto max-xl:[&_.ht-swiper-button-nav]:text-[60px] max-xl:[&_.swiper-button-prev]:left-[15px] max-xl:[&_.swiper-button-next]:right-[15px] max-md:[&_.ht-swiper-button-nav]:text-[50px] group-hover/slider:[&_.ht-swiper-button-nav]:visible group-hover/slider:[&_.ht-swiper-button-nav]:opacity-100">
        {sliderData && (
          <Swiper
            ref={wrapRef}
            options={{
              ...params,
              onAfterInit: animateActiveSlide,
              onSlideChangeTransitionStart: animateActiveSlide,
            }}
          >
            {sliderData.map((single, key) => (
              <SwiperSlide key={key}>
                <HeroSliderNineSingle data={single} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      </div>
    </div>
  );
};

HeroSliderNine.propTypes = {
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
};

export default HeroSliderNine;
