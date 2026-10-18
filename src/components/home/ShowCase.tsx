"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useCatalog } from "@/providers/catalog-provider";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProductRating as Rating } from "@/components/product";
import useProductReviewSummary from "@/hooks/use-product-review-summary";
import { CONTENT_SHELL_CLASS } from "@/lib/ui/content-shell";
import { formatMappedProductPrice } from "@/lib/util/money";
import { useCountryPath } from "@/hooks/use-country-path";
import Container from "@/components/ui/Container";

gsap.registerPlugin(ScrollTrigger);

function getPrimaryImage(product) {
  const img = product?.image;
  if (Array.isArray(img)) return img[0];
  if (typeof img === "string") return img;
  return null;
}

function ShowcaseCardRating({ productId, fallbackRating }: { productId?: any; fallbackRating?: any }) {
  const { count: reviewCount, avg: reviewAvg } = useProductReviewSummary(productId);
  const effectiveRating =
    reviewCount > 0 ? reviewAvg : Number(fallbackRating) || 0;

  if (!(effectiveRating > 0)) {
    return (
      <span className="inline-flex min-h-6 items-center gap-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-black/[0.42]">
        New
      </span>
    );
  }

  return (
    <span
      className="inline-flex min-h-6 items-center gap-0.5 leading-none"
      aria-label={`Rated ${Number(effectiveRating).toFixed(1)} out of 5`}
    >
      <Rating ratingValue={effectiveRating} />
    </span>
  );
}

function ShowCase() {
  const sectionRef = useRef<any>(null);
  const cardsRef = useRef<any[]>([]);

  const { products } = useCatalog();
  const toCountryPath = useCountryPath();

  const featured = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    const newOnes = list.filter((p) => p?.new === true || p?.is_new === true);
    const pick = (newOnes.length ? newOnes : list).slice(0, 6);
    return pick.map((p) => ({
      ...p,
      __img: getPrimaryImage(p),
    }));
  }, [products]);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionEl);
      const eyebrow = q("[data-sc-eyebrow]");
      const title = q("[data-sc-title]");
      const subtitle = q("[data-sc-subtitle]");
      const ctas = q("[data-sc-ctas]");
      const cards = cardsRef.current.filter(Boolean);
      const copyBits = [eyebrow, title, subtitle, ctas].flat();

      const reduceMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      )?.matches;

      if (reduceMotion) {
        gsap.set([...copyBits, ...cards], { opacity: 1, y: 0, scale: 1, clearProps: "willChange" });
        return;
      }

      gsap.set(copyBits, {
        opacity: 0,
        y: 42,
        willChange: "transform, opacity",
      });
      gsap.set(cards, {
        opacity: 0,
        y: 64,
        scale: 0.94,
        willChange: "transform, opacity",
      });

      const playIntro = (start) => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionEl,
            start,
            toggleActions: "play none none none",
            once: true,
          },
        });

        tl.to(eyebrow, { y: 0, opacity: 1, duration: 0.7 })
          .to(title, { y: 0, opacity: 1, duration: 0.9 }, "-=0.42")
          .to(subtitle, { y: 0, opacity: 1, duration: 0.75 }, "-=0.5")
          .to(ctas, { y: 0, opacity: 1, duration: 0.7 }, "-=0.45");

        if (cards.length) {
          tl.to(
            cards,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.85,
              stagger: 0.12,
              ease: "power3.out",
              clearProps: "transform, willChange",
            },
            "-=0.35"
          );
        }

        tl.set(copyBits, { clearProps: "transform, willChange" });
        return tl;
      };

      mm.add("(min-width: 992px)", () => playIntro("top 78%"));
      mm.add("(max-width: 991.98px)", () => playIntro("top 82%"));

      if (cards.length) {
        cards.forEach((card) => {
          const img = card.querySelector("[data-sc-img]");
          if (!img) return;
          gsap.set(img, { scale: 1.14, transformOrigin: "50% 50%" });
          gsap.fromTo(
            img,
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          );
        });
      }

      ScrollTrigger.refresh();
    }, sectionEl);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [featured.length]);

  return (
    <section className="relative py-[45px] pb-10" ref={sectionRef}>
      <div className={CONTENT_SHELL_CLASS}>
        <div className="relative grid grid-cols-1 gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-11">
          <div className="static self-start lg:sticky lg:top-24">
            <div
              className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.16em] text-black/[0.62] before:h-px before:w-[34px] before:bg-black/25 before:content-['']"
              data-sc-eyebrow
            >
              Featured
            </div>
            <h2
              className="my-2.5 mb-2.5 text-[40px] leading-[1.1] tracking-[-0.02em] xl:text-[46px]"
              data-sc-title
            >
              Built for travel. Styled for every day.
            </h2>
            <p className="m-0 max-w-[54ch] text-base leading-[1.7] text-black/[0.68]" data-sc-subtitle>
              Explore our newest drops — compact silhouettes, premium materials, and details that make
              packing feel effortless.
            </p>

            <div className="mt-[18px] flex flex-wrap gap-3" data-sc-ctas>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#111] px-[18px] text-sm font-semibold text-white no-underline shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,background,color] duration-[160ms] hover:bg-black hover:shadow-[0_16px_36px_rgba(0,0,0,0.2)] active:translate-y-px"
                href={toCountryPath("/shop")}
              >
                Shop New Arrivals
              </Link>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-full border border-black/[0.08] bg-black/[0.03] px-[18px] text-sm font-semibold text-[#111] no-underline transition-[transform,background] duration-[160ms] hover:bg-black/[0.05] active:translate-y-px"
                href={toCountryPath("/shop")}
              >
                View All Products
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" data-sc-grid>
            {featured.map((p, idx) => {
              const href = toCountryPath(`/product/${p.id}`);
              const { current: price, original: was } = formatMappedProductPrice(p);

              return (
                <Link
                  key={p.id ?? idx}
                  href={href}
                  className="block translate-z-0 text-inherit no-underline transition-[transform] duration-[220ms] hover:-translate-y-1"
                  ref={(el) => {
                    cardsRef.current[idx] = el;
                  }}
                >
                <Container className="overflow-hidden !p-0">
                  <div className="relative bg-[linear-gradient(180deg,rgba(0,0,0,0.02),transparent_70%)]">
                    {p?.new === true || p?.is_new === true ? (
                      <div className="absolute left-3 top-3 z-[2] rounded-full bg-[rgba(17,17,17,0.92)] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-white">
                        New
                      </div>
                    ) : null}
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden">
                      {p.__img ? (
                        <img
                          data-sc-img
                          className="block h-full w-fit translate-z-0 object-cover"
                          src={p.__img}
                          alt={p?.name ?? "Product"}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="block h-full w-fit translate-z-0 bg-[radial-gradient(60%_60%_at_30%_20%,rgba(0,0,0,0.08),transparent_60%),radial-gradient(70%_70%_at_70%_60%,rgba(0,0,0,0.06),transparent_60%),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.01))]"
                          data-sc-img
                        />
                      )}
                    </div>
                  </div>

                  <div className="px-3.5 pb-3 pt-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-[15px] font-bold leading-[1.35]">
                        {p?.name ?? "Untitled product"}
                      </div>
                      <div className="flex flex-col items-end gap-0.5 whitespace-nowrap">
                        <span className="text-sm font-extrabold">{price}</span>
                        {was ? (
                          <span className="text-xs text-black/45 line-through">{was}</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2.5 text-xs text-black/[0.62]">
                      <ShowcaseCardRating productId={p.id} fallbackRating={p.rating} />
                      <span className="inline-flex items-center gap-2 font-bold text-black/80 after:inline-block after:translate-x-0 after:transition-transform after:duration-[160ms] after:content-['→'] group-hover:after:translate-x-[3px]">
                        View
                      </span>
                    </div>
                  </div>
                </Container>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowCase;
