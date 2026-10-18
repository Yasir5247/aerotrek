"use client";

import PropTypes from "prop-types";
import clsx from "clsx";
import { useAuth } from "@/providers/AuthContext";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";

const SectionTitleWithText = ({ spaceTopClass, spaceBottomClass }: { spaceTopClass?: any; spaceBottomClass?: any }) => {

  const {session} = useAuth();
  const rootRef = useRef<any>(null);

  const userName = session?.user?.user_metadata?.full_name || "";
  const greetingName = useMemo(() => {
    if (!userName) return "";
    return userName.charAt(0).toUpperCase() + userName.slice(1);
  }, [userName]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll("[data-intro-item]");
      const pumpMedia = el.querySelector("[data-intro-pump-media]");

      gsap.set(items, { opacity: 0, y: 14, willChange: "transform, opacity" });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          toggleActions: "play none none reverse"
        }
      });

      if (pumpMedia) {
        gsap.fromTo(
          pumpMedia,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: pumpMedia,
              start: "top 92%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={clsx("overflow-visible py-[70px] pb-[72px]", spaceTopClass, spaceBottomClass)}>
      <div className="w-full">
        <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-7">
          <div>
            <div
              className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.16em] text-black/[0.62] before:h-px before:w-[34px] before:bg-black/25 before:content-['']"
              data-intro-item
            >
              {greetingName ? `Hello ${greetingName}` : "AeroTrek Maldives"}
            </div>
            <h2
              className="my-3 mb-2.5 text-[clamp(28px,3.5vw,40px)] font-bold leading-[1.12] tracking-[-0.02em]"
              data-intro-item
            >
              Travel bags that feel effortless.
            </h2>
            <p
              className="m-0 max-w-[62ch] text-[15px] leading-[1.8] text-black/[0.68]"
              data-intro-item
            >
              We’re the first Maldivian travel backpack brand—built around vacuum-compressible
              storage, clean design, and the little details that make moving through airports (and
              island hops) smoother.
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5" data-intro-item>
              <Badge>Vacuum-compressible</Badge>
              <Badge>With Free Pump</Badge>
              <Badge>Laptop-safe compartments</Badge>
              <Badge>Water-resistant build</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1" data-intro-item>
            <Container>
              <div className="text-[11px] font-black uppercase tracking-[0.12em] text-black/45">Space</div>
              <div className="text-[32px] font-black leading-none tracking-[-0.03em] text-[#111]">2×</div>
              <div className="text-sm font-semibold text-black/60">packing capacity feel</div>
            </Container>
            <Container>
              <div className="text-[11px] font-black uppercase tracking-[0.12em] text-black/45">Carry</div>
              <div className="text-[32px] font-black leading-none tracking-[-0.03em] text-[#111]">All‑day</div>
              <div className="text-sm font-semibold text-black/60">comfort-first straps</div>
            </Container>
            <Container>
              <div className="text-[11px] font-black uppercase tracking-[0.12em] text-black/45">Built</div>
              <div className="text-[32px] font-black leading-none tracking-[-0.03em] text-[#111]">Premium</div>
              <div className="text-sm font-semibold text-black/60">hardware & zips</div>
            </Container>
          </div>
        </div>

        <Container
          className="relative mt-10 !p-0 md:!p-0"
          data-intro-item
        >
          <div className="relative grid grid-cols-1 items-center gap-8 overflow-hidden p-6 md:grid-cols-[1fr_minmax(220px,360px)] md:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(90,90,90,0.12)_0%,transparent_70%)]"
            aria-hidden="true"
          />
          <div className="relative z-[1]">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-black/45">
              Included with every bag
            </p>
            <h3 className="mb-2 text-[clamp(1.75rem,3vw,2.25rem)] font-black tracking-[-0.02em] text-[#111]">
              With Free Pump
            </h3>
            <p className="m-0 max-w-[42ch] text-[15px] leading-[1.75] text-black/[0.62]">
              Compress more, pack lighter. Every AeroTrek vacuum-ready bag ships with a
              portable electric pump—ready for airport runs and island hops.
            </p>
          </div>
          <div className="relative z-[1] flex justify-center md:justify-end" data-intro-pump-media>
            <div className="relative flex items-center justify-center">
              <img
                className="max-h-[min(420px,56vw)] w-auto max-w-full object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
                src={"/assets/img/pump.png"}
                alt="Portable electric vacuum pump included free"
                loading="lazy"
                width="420"
                height="560"
              />
            </div>
          </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

SectionTitleWithText.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default SectionTitleWithText;
