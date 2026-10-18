"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import MobileWidgets from "./sub-components/MobileWidgets";

const MobileMenu = ({ panelOpen = false }: { panelOpen?: boolean }) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<any>(null);
  const innerRef = useRef<any>(null);
  /** First paint while closed: set collapsed state without running the close tween (avoids 0→0 animation). */
  const firstIdle = useRef(true);
  const pathname = usePathname();
  const { t } = useTranslation();

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    window.addEventListener("mobileMenu:open", onOpen);
    window.addEventListener("mobileMenu:close", onClose);
    return () => {
      window.removeEventListener("mobileMenu:open", onOpen);
      window.removeEventListener("mobileMenu:close", onClose);
    };
  }, []);

  const notifyMenuClosed = useCallback(() => {
    window.dispatchEvent(new CustomEvent("mobileMenu:closed"));
  }, []);

  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;

    gsap.killTweensOf(panel);
    const items = inner.querySelectorAll("[data-menu-item]");
    if (items.length) gsap.killTweensOf(items);

    if (open) {
      firstIdle.current = false;
      document.body.style.overflow = "hidden";
      const h = inner.scrollHeight || inner.getBoundingClientRect().height;
      if (reduceMotion) {
        gsap.set(panel, { height: h, autoAlpha: 1 });
        gsap.set(items, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          panel,
          { height: 0, autoAlpha: 0 },
          { height: h, autoAlpha: 1, duration: 0.38, ease: "power3.out" }
        );
        if (items.length) {
          gsap.set(items, { opacity: 0, y: 18 });
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
            stagger: 0.04,
            delay: 0.1,
          });
        }
      }
    } else {
      document.body.style.overflow = "";
      const finish = () => {
        if (items.length) gsap.set(items, { opacity: 0, y: 18 });
        notifyMenuClosed();
      };
      if (reduceMotion) {
        gsap.set(panel, { height: 0, autoAlpha: 0 });
        finish();
      } else if (firstIdle.current) {
        firstIdle.current = false;
        gsap.set(panel, { height: 0, autoAlpha: 0 });
        finish();
      } else {
        const collapsePanel = () => {
          gsap.to(panel, {
            height: 0,
            autoAlpha: 0,
            duration: 0.22,
            ease: "power2.in",
            onComplete: finish,
          });
        };
        if (items.length) {
          gsap.to(items, {
            opacity: 0,
            y: 10,
            duration: 0.14,
            ease: "power2.in",
            stagger: 0.02,
            onComplete: collapsePanel,
          });
        } else {
          collapsePanel();
        }
      }
    }

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, reduceMotion, notifyMenuClosed]);

  const close = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, []);

  const navLinks = [
    { label: t("home"), to: "/" },
    { label: t("shop"), to: "/shop" },
    { label: t("contact_us"), to: "/contact" },
  ];

  return (
    <div
      className={clsx(
        "absolute left-0 right-0 top-full z-[100] w-full overflow-hidden rounded-b-[22px]",
        panelOpen
          ? "border border-t-0 border-white/[0.48] bg-white/[0.72] shadow-[0_40px_120px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[22px]"
          : "border-0 bg-transparent shadow-none backdrop-blur-none"
      )}
      ref={panelRef}
    >
      <div className="px-[18px] pb-[18px]" ref={innerRef}>
        <div
          className="border-t border-black/[0.06] px-1 pb-2.5 pt-0.5 text-xs uppercase tracking-[0.14em] text-black/[0.42]"
          data-menu-item
        >
          Menu
        </div>
        <nav className="grid gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className="block rounded-[10px] px-1 py-1 text-[clamp(36px,7vw,58px)] font-bold leading-[1.08] tracking-[-0.03em] text-black/[0.88] no-underline transition-[color,background] duration-[120ms] hover:bg-black/[0.03] hover:text-black"
              data-menu-item
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-3.5 border-t border-black/[0.06] pt-3.5" data-menu-item>
          <MobileWidgets />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
