import { useEffect, useRef, useMemo, useCallback } from "react";
import gsap from "gsap";

/**
 * Continuous fluid animation for the auth side panel.
 * Each orb follows its own looping orbit path at different speeds,
 * creating a living gradient-mesh effect. Text staggers in on mount.
 * Respects prefers-reduced-motion.
 */
const useAuthSideGsap = () => {
  const containerRef = useRef<any>(null);
  const tweens = useRef<any[]>([]);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const setRef = useCallback((el) => {
    containerRef.current = el;
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const orbs = root.querySelectorAll(".authOrb");
    const textEls = root.querySelectorAll(
      ".authSide__badge, .authSide__title, .authSide__subtitle, .authPoint"
    );

    if (reduceMotion) {
      gsap.set(textEls, { opacity: 1, y: 0 });
      gsap.set(orbs, { opacity: 1 });
      return;
    }

    // Orbit configs: each orb gets a unique elliptical path + speed + rotation
    const orbConfigs = [
      { xRange: 80, yRange: 50, duration: 8, rotStart: 0 },
      { xRange: 60, yRange: 70, duration: 11, rotStart: 120 },
      { xRange: 50, yRange: 40, duration: 14, rotStart: 240 },
      { xRange: 70, yRange: 55, duration: 10, rotStart: 60 },
      { xRange: 45, yRange: 65, duration: 13, rotStart: 180 },
    ];

    // Continuous orb orbits using sine/cosine via GSAP modifiers
    orbs.forEach((orb, i) => {
      const cfg = orbConfigs[i % orbConfigs.length];
      const proxy = { t: 0 };

      gsap.set(orb, { opacity: 0, scale: 0.6 });

      // Fade in
      const fadeIn = gsap.to(orb, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        delay: i * 0.15,
        ease: "power2.out",
      });
      tweens.current.push(fadeIn);

      // Continuous orbit
      const orbit = gsap.to(proxy, {
        t: Math.PI * 2,
        duration: cfg.duration,
        repeat: -1,
        ease: "none",
        delay: i * 0.15,
        onUpdate() {
          const angle = proxy.t + (cfg.rotStart * Math.PI) / 180;
          gsap.set(orb, {
            x: Math.sin(angle) * cfg.xRange,
            y: Math.cos(angle * 0.7) * cfg.yRange,
          });
        },
      });
      tweens.current.push(orbit);
    });

    // Stagger text entrance
    gsap.set(textEls, { opacity: 0, y: 16 });
    const textTl = gsap.to(textEls, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.2,
    });
    tweens.current.push(textTl);

    return () => {
      tweens.current.forEach((tw) => tw.kill());
      tweens.current = [];
    };
  }, [reduceMotion]);

  return { ref: setRef };
};

export default useAuthSideGsap;
