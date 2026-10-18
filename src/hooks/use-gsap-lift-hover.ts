import { useCallback, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

const REST_SHADOW = "0 2px 10px rgba(0, 0, 0, 0.06)";
const HOVER_SHADOW = "0 16px 38px rgba(0, 0, 0, 0.2)";
const HOVER_SHADOW_PRIMARY = "0 20px 50px rgba(0, 0, 0, 0.5)";

/**
 * Subtle lift + scale + shadow on pointer/focus for link-style CTAs.
 * Respects prefers-reduced-motion.
 */
const useGsapLiftHover = (options: any = {}) => {
  const {
    liftY = -4,
    scale = 1.04,
    primary = false,
    durationIn = 0.28,
    durationOut = 0.34,
  } = options;

  const ref = useRef<any>(null);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const shadowIn = primary ? HOVER_SHADOW_PRIMARY : HOVER_SHADOW;

  const setRef = useCallback(
    (el) => {
      const prev = ref.current;
      if (prev && prev !== el) {
        gsap.killTweensOf(prev);
      }
      ref.current = el;
      if (el && !reduceMotion) {
        gsap.set(el, {
          transformOrigin: "50% 50%",
          boxShadow: REST_SHADOW,
          force3D: true,
        });
      }
    },
    [reduceMotion]
  );

  useEffect(() => {
    return () => {
      const el = ref.current;
      if (el) gsap.killTweensOf(el);
    };
  }, []);

  const onEnter = useCallback(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    gsap.killTweensOf(el);
    gsap.to(el, {
      y: liftY,
      scale,
      boxShadow: shadowIn,
      zIndex: 1,
      duration: durationIn,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [reduceMotion, liftY, scale, shadowIn, durationIn]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    gsap.killTweensOf(el);
    gsap.to(el, {
      y: 0,
      scale: 1,
      boxShadow: REST_SHADOW,
      zIndex: 0,
      duration: durationOut,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  }, [reduceMotion, durationOut]);

  return {
    ref: setRef,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    onFocus: onEnter,
    onBlur: onLeave,
  };
};

export default useGsapLiftHover;
