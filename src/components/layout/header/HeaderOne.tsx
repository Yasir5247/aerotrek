"use client";

import PropTypes from "prop-types";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { Search } from "lucide-react";
import { CONTENT_SHELL_CLASS } from "@/lib/ui/content-shell";
import Logo from "./Logo";
import NavMenu from "./NavMenu";
import IconGroup from "./IconGroup";
import MobileMenu from "./MobileMenu";
import HeaderTop from "./HeaderTop";
import SearchOverlay from "./sub-components/SearchOverlay";
import IconButton from "@/components/ui/IconButton";

const HeaderOne = ({
  top,
  cart,
  regions,
  borderStyle,
  headerPaddingClass,
  headerPositionClass,
  headerBgClass,
}: {
  top?: any;
  cart?: import("@aiminaabeejs/types").HttpTypes.StoreCart | null;
  regions?: import("@aiminaabeejs/types").HttpTypes.StoreRegion[];
  borderStyle?: any;
  headerPaddingClass?: any;
  headerPositionClass?: any;
  headerBgClass?: any;
}) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const glassRef = useRef<any>(null);
  const headerRef = useRef<any>(null);
  const searchInputRef = useRef<any>(null);
  const backdropRef = useRef<any>(null);
  const hasAnimated = useRef(false);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const isOverlay = headerPositionClass === "header-overlay";
  const panelOpen = menuOpen || searchOpen;

  useEffect(() => {
    if (isOverlay) {
      return;
    }
    const header = document.querySelector("[data-sticky-bar]");
    if (header) setHeaderTop((header as HTMLElement).offsetTop);
    const onScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOverlay]);

  useLayoutEffect(() => {
    const el = glassRef.current;
    if (!el || hasAnimated.current) return;
    hasAnimated.current = true;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      gsap.set(el, { y: 0, opacity: 1, scale: 1 });
      return;
    }

    gsap.set(el, { y: -30, opacity: 0, scale: 0.97 });
    gsap.to(el, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.7,
      delay: 0.15,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const onOpen = () => {
      if (searchOpen) window.dispatchEvent(new CustomEvent("search:close"));
      setMenuOpen(true);
    };
    const onClosed = () => setMenuOpen(false);
    window.addEventListener("mobileMenu:open", onOpen);
    window.addEventListener("mobileMenu:closed", onClosed);
    return () => {
      window.removeEventListener("mobileMenu:open", onOpen);
      window.removeEventListener("mobileMenu:closed", onClosed);
    };
  }, [searchOpen]);

  useEffect(() => {
    const onSearchOpen = () => {
      if (menuOpen) window.dispatchEvent(new CustomEvent("mobileMenu:close"));
      setSearchOpen(true);
    };
    const onSearchClosed = () => setSearchOpen(false);
    window.addEventListener("search:open", onSearchOpen);
    window.addEventListener("search:closed", onSearchClosed);
    return () => {
      window.removeEventListener("search:open", onSearchOpen);
      window.removeEventListener("search:closed", onSearchClosed);
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    if (!searchOpen) return;
    const el = searchInputRef.current;
    if (el) requestAnimationFrame(() => el.focus());
  }, [searchOpen]);

  const overlayVisible = searchOpen || menuOpen;

  useLayoutEffect(() => {
    const bd = backdropRef.current;
    if (!bd) return;
    gsap.killTweensOf(bd);
    if (overlayVisible) {
      gsap.to(bd, {
        autoAlpha: 1,
        duration: reduceMotion ? 0 : 0.32,
        ease: "power2.out",
      });
    } else {
      gsap.to(bd, {
        autoAlpha: 0,
        duration: reduceMotion ? 0 : 0.24,
        ease: "power2.in",
      });
    }
  }, [overlayVisible, reduceMotion]);

  const toggleMenu = useCallback(() => {
    if (searchOpen) window.dispatchEvent(new CustomEvent("search:close"));
    if (menuOpen) {
      window.dispatchEvent(new CustomEvent("mobileMenu:close"));
    } else {
      window.dispatchEvent(new CustomEvent("mobileMenu:open"));
    }
  }, [menuOpen, searchOpen]);

  const closeSearch = useCallback(() => {
    window.dispatchEvent(new CustomEvent("search:close"));
  }, []);

  return (
    <header
      ref={headerRef}
      className={clsx(
        "relative",
        headerBgClass,
        headerPositionClass,
        isOverlay &&
          clsx(
          CONTENT_SHELL_CLASS,
          "sticky top-0 z-header bg-white/90 backdrop-blur-[14px]"
        )
      )}
    >
      <div
        className={clsx(
          headerPaddingClass,
          top === "visible" ? "hidden lg:block" : "hidden",
          borderStyle === "fluid-border" ? "border-none" : "border-b border-[#d5d4d4]"
        )}
      >
        <div className="w-full">
          <HeaderTop borderStyle={borderStyle} regions={regions} />
        </div>
      </div>

      <div
        className={clsx(
          headerPaddingClass,
          "md:max-lg:py-5 md:max-lg:pb-[15px] max-md:py-5 max-md:pb-[15px]",
          !isOverlay &&
            scroll > headerTop &&
            "fixed left-1/2 top-0 z-[999] w-[var(--site-content-width,80vw)] max-w-[var(--site-content-width,80vw)] -translate-x-1/2 border-b border-black/[0.06] bg-white/[0.86] shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-[12px] transition-all duration-300"
        )}
        data-sticky-bar
      >
        <div className="w-full">
          <div
            ref={glassRef}
            className={clsx(
              "relative z-[99] m-0 w-full overflow-visible border-0 p-0 text-black transition-[border-radius] duration-[320ms] ease-in-out",
              panelOpen
                ? "rounded-t-[22px] border-b-0 bg-white/85 shadow-[0_40px_120px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[22px]"
                : "rounded-[22px] bg-white/35 shadow-[0_18px_55px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-[5px] max-lg:backdrop-blur-none"
            )}
          >
            <div className="grid grid-cols-[1fr_auto] items-center gap-[18px] bg-transparent px-4 py-2.5 text-black/[0.88] max-lg:px-3.5">
              {searchOpen ? (
                <>
                  <div className="flex min-w-0 flex-1 items-center gap-[22px]">
                    <div className="flex items-center">
                      <Logo />
                    </div>
                    <div className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-black/[0.08] bg-white/[0.88] px-4 transition-[border-color,background] duration-[160ms] focus-within:border-black/[0.18] focus-within:bg-white/[0.98]">
                      <Search
                        className="h-5 w-5 shrink-0 text-black/45"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      <input
                        ref={searchInputRef}
                        className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold tracking-[0.01em] text-[#111] outline-none placeholder:font-medium placeholder:text-black/[0.38]"
                        type="text"
                        placeholder="Search products..."
                        autoComplete="off"
                        onChange={(e) => {
                          window.dispatchEvent(
                            new CustomEvent("search:query", { detail: e.target.value })
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <IconButton label="Close search" onClick={closeSearch}>
                      <span
                        className="text-[28px] font-light leading-none text-black/[0.85]"
                        aria-hidden="true"
                      >
                        ×
                      </span>
                    </IconButton>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex min-w-0 items-center gap-[22px]">
                    <div className="flex items-center">
                      <Logo />
                    </div>
                    <div className="hidden min-w-0 justify-start lg:flex">
                      <NavMenu />
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="hidden items-center lg:flex">
                      <IconGroup cart={cart} compactMobile={false} />
                    </div>
                    <div className="flex items-center lg:hidden">
                      <IconGroup cart={cart} mobileOnly />
                    </div>
                    <IconButton
                      label={menuOpen ? "Close menu" : "Open menu"}
                      onClick={toggleMenu}
                      aria-expanded={menuOpen}
                    >
                      {menuOpen ? (
                        <span
                          className="text-[28px] font-light leading-none text-black/[0.85]"
                          aria-hidden="true"
                        >
                          ×
                        </span>
                      ) : (
                        <span
                          className="flex w-5 flex-col items-center justify-center gap-[5px]"
                          aria-hidden="true"
                        >
                          <span className="block h-0.5 w-full rounded-full bg-black/[0.85]" />
                          <span className="block h-0.5 w-full rounded-full bg-black/[0.85]" />
                          <span className="block h-0.5 w-full rounded-full bg-black/[0.85]" />
                        </span>
                      )}
                    </IconButton>
                  </div>
                </>
              )}
            </div>
            <MobileMenu panelOpen={panelOpen} />
            <SearchOverlay panelOpen={panelOpen} />
          </div>
        </div>
      </div>
      <div
        ref={backdropRef}
        className="pointer-events-auto fixed inset-0 z-[98] bg-black/25 backdrop-blur-md supports-[not((backdrop-filter:blur(1px))_or_(-webkit-backdrop-filter:blur(1px)))]:bg-black/45"
        style={{ visibility: "hidden", opacity: 0 }}
        onClick={() => {
          if (searchOpen) window.dispatchEvent(new CustomEvent("search:close"));
          if (menuOpen) window.dispatchEvent(new CustomEvent("mobileMenu:close"));
        }}
      />
    </header>
  );
};

HeaderOne.propTypes = {
  borderStyle: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  top: PropTypes.string,
};

export default HeaderOne;
