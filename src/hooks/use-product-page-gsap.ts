import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Premium PDP motion: hero timeline, scroll reveals, ambient drift, gallery parallax.
 * Respects prefers-reduced-motion. Re-runs when productId changes (SPA navigation).
 */
const useProductPageGsap = (rootRef?: any, productId?: any) => {
  useLayoutEffect(() => {
    const root = rootRef?.current;
    if (!root) return undefined;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const disposers: any[] = [];

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(
          [
            "[data-pd-gallery]",
            "[data-pd-panel-inner]",
            "[data-pd-line]",
            "[data-pd-word]",
            "[data-pd-section]",
          ],
          { clearProps: "all" }
        );
        return;
      }

      gsap.set("[data-pd-gallery]", { willChange: "transform, clip-path" });
      gsap.set("[data-pd-panel-inner]", { willChange: "transform, opacity" });

      const clearHeroInline = () => {
        gsap.set(
          ["[data-pd-word]", "[data-pd-gallery]", "[data-pd-panel-inner]"],
          { clearProps: "opacity,transform,scale,clipPath,willChange" }
        );
      };

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.08,
        onComplete: clearHeroInline,
      });

      tl.fromTo(
        "[data-pd-word]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.04,
          ease: "power4.out",
        }
      )
        .from(
          "[data-pd-gallery]",
          {
            clipPath: "inset(8% 10% 8% 10%)",
            scale: 0.97,
            opacity: 0,
            duration: 1.05,
            ease: "power2.inOut",
          },
          "-=0.35"
        )
        .from(
          "[data-pd-panel-inner]",
          {
            y: 44,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
          },
          "-=0.65"
        );

      const ambient = root.querySelectorAll("[data-pd-ambient]");
      if (ambient.length) {
        ambient.forEach((el, i) => {
          gsap.to(el, {
            xPercent: i % 2 === 0 ? 12 : -10,
            yPercent: i % 2 === 0 ? -8 : 10,
            duration: 18 + i * 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      }

      const gallery = root.querySelector("[data-pd-gallery]");
      const mainImg = gallery?.querySelector(
        ".product-large-image-wrapper .single-image img"
      );
      if (gallery && mainImg) {
        let raf;
        const onMove = (e?: any) => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const r = gallery.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(mainImg, {
              x: x * 14,
              y: y * 14,
              duration: 0.55,
              ease: "power2.out",
            });
          });
        };
        const onLeave = () => {
          gsap.to(mainImg, { x: 0, y: 0, duration: 0.65, ease: "power2.out" });
        };
        gallery.addEventListener("mousemove", onMove);
        gallery.addEventListener("mouseleave", onLeave);
        disposers.push(() => {
          gallery.removeEventListener("mousemove", onMove);
          gallery.removeEventListener("mouseleave", onLeave);
          cancelAnimationFrame(raf);
        });
      }

      const tabSection = root.querySelector('[data-pd-section="tabs"]');
      if (tabSection) {
        const wrap = tabSection.querySelector(".description-review-wrapper");
        if (wrap) {
          gsap.from(wrap, {
            scrollTrigger: {
              trigger: tabSection,
              start: "top 86%",
              toggleActions: "play none none none",
            },
            y: 48,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
          });
        }
      }

      const rel = root.querySelector('[data-pd-section="related"]');
      if (rel) {
        const title = rel.querySelector(".section-title h2");
        const slides = rel.querySelectorAll(".swiper-slide");
        if (title) {
          gsap.from(title, {
            scrollTrigger: {
              trigger: rel,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            y: 32,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          });
        }
        if (slides.length) {
          gsap.from(slides, {
            scrollTrigger: {
              trigger: rel,
              start: "top 82%",
              toggleActions: "play none none none",
            },
            y: 40,
            opacity: 0,
            duration: 0.65,
            stagger: 0.07,
            ease: "power3.out",
          });
        }
      }
    }, root);

    const onRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", onRefresh);

    return () => {
      window.removeEventListener("load", onRefresh);
      disposers.forEach((fn) => fn());
      ctx.revert();
    };
  }, [rootRef, productId]);
};

export default useProductPageGsap;
