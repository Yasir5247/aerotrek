"use client";

import PropTypes from "prop-types";

import Link from "next/link";
import { useMemo, useRef } from "react";
import gsap from "gsap";

const HeroSliderNineSingle = ({ data }: { data?: any; sliderClass?: any }) => {
  const ctaRef = useRef<any>(null);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const handleCtaEnter = () => {
    const el = ctaRef.current;
    if (!el || reduceMotion) return;
    gsap.killTweensOf(el);
    gsap.to(el, {
      y: -2,
      scale: 1.02,
      duration: 0.22,
      ease: "power3.out",
      boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
    });
  };

  const handleCtaLeave = () => {
    const el = ctaRef.current;
    if (!el || reduceMotion) return;
    gsap.killTweensOf(el);
    gsap.to(el, {
      y: 0,
      scale: 1,
      duration: 0.26,
      ease: "power3.out",
      boxShadow: "0 10px 34px rgba(0,0,0,0.18)",
    });
  };

  return (
    <div
      className="relative flex min-h-[min(500px,76svh)] items-end overflow-visible bg-[#0b0e12] sm:min-h-[min(560px,80svh)] lg:min-h-[clamp(580px,88svh,960px)]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <img
          data-hero-img
          className="block h-full w-full object-cover object-[center_25%] lg:object-[center_30%]"
          alt=""
          src={data.image}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Dark overlay for text readability */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,0,0,0.32)_0%,rgba(0,0,0,0.06)_40%,rgba(0,0,0,0.2)_100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.15)_55%,rgba(0,0,0,0.05)_100%),linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.05)_40%,rgba(0,0,0,0.15)_100%)]"
        aria-hidden="true"
      />

      {/* Bottom fade into page */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-b from-transparent via-white/30 to-white md:h-[230px]"
        aria-hidden="true"
      />

      <div className="relative z-[2] w-full px-4 pb-8 sm:px-6 md:pb-10 lg:px-8">
        <div className="max-w-xl">
          <div className="flex justify-start" data-hero-content>
            <div className="relative w-[min(340px,100%)] overflow-hidden rounded-[14px] border border-white/18 bg-black/30 px-3.5 py-3.5 pb-3 shadow-[0_12px_40px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[9px] backdrop-saturate-[0.7] md:min-w-[331px] md:w-fit md:rounded-[18px] md:border-white/24 md:px-5 md:py-[18px] md:pb-4 md:shadow-[0_22px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.1)] md:backdrop-blur-[6px] md:backdrop-saturate-100 lg:bg-black/30">
              <div
                className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(700px_300px_at_15%_0%,rgba(255,255,255,0.09),rgba(255,255,255,0.03)_40%,transparent_65%),radial-gradient(600px_260px_at_95%_55%,rgba(255,255,255,0.05),rgba(255,255,255,0.015)_35%,transparent_70%)] md:block"
                aria-hidden="true"
              />
              <h3
                data-hero-item
                className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 md:mb-1.5 md:text-[11px] md:tracking-[0.18em]"
              >
                {data.title}
              </h3>
              <h1
                data-hero-item
                className="mb-2.5 text-[clamp(26px,7vw,34px)] font-bold leading-[1.06] tracking-[-0.02em] text-white md:mb-3.5 md:text-[clamp(34px,4.5vw,52px)] md:leading-[1.02]"
                dangerouslySetInnerHTML={{ __html: data.subtitle }}
              />
              <div className="mt-1.5 md:mt-2.5" data-hero-item>
                <Link
                  ref={ctaRef}
                  href={data.url}
                  onMouseEnter={handleCtaEnter}
                  onMouseLeave={handleCtaLeave}
                  onFocus={handleCtaEnter}
                  onBlur={handleCtaLeave}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/28 bg-white/10 px-4 py-2.5 pb-[11px] text-[11px] font-extrabold uppercase tracking-[0.1em] text-white shadow-[0_6px_20px_rgba(0,0,0,0.14)] transition-[border-color,background,color] duration-[160ms] hover:border-white/42 hover:bg-white/14 hover:text-white focus-visible:border-white/42 focus-visible:bg-white/14 focus-visible:text-white focus-visible:outline-none md:px-5 md:py-3 md:pb-[13px] md:text-xs md:tracking-[0.12em] md:shadow-[0_10px_34px_rgba(0,0,0,0.18)]"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HeroSliderNineSingle.propTypes = {
  data: PropTypes.shape({}),
};

export default HeroSliderNineSingle;
