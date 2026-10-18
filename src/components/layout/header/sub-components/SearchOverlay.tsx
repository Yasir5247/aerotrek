"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";
import { useCatalog } from "@/providers/catalog-provider";
import gsap from "gsap";
import useDebounce from "@/hooks/use-debounce";
import { formatMappedProductPrice } from "@/lib/util/money";
import { useCountryPath } from "@/hooks/use-country-path";

const MAX_RESULTS = 8;

const SearchOverlay = ({ panelOpen = false }: { panelOpen?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const panelRef = useRef<any>(null);
  const innerRef = useRef<any>(null);
  const firstIdle = useRef(true);
  const pathname = usePathname();
  const { products } = useCatalog();
  const toCountryPath = useCountryPath();
  const debouncedQuery = useDebounce(query, 250);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q || !products?.length) return [];
    return products
      .filter((p) => {
        if (p.name?.toLowerCase().includes(q)) return true;
        if (p.category?.some((c) => c.toLowerCase().includes(q))) return true;
        if (p.tag?.some((t) => t.toLowerCase().includes(q))) return true;
        if (p.sku?.toLowerCase().includes(q)) return true;
        return false;
      })
      .slice(0, MAX_RESULTS);
  }, [debouncedQuery, products]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    const onQuery = (e) => setQuery(e.detail ?? "");
    window.addEventListener("search:open", onOpen);
    window.addEventListener("search:close", onClose);
    window.addEventListener("search:query", onQuery);
    return () => {
      window.removeEventListener("search:open", onOpen);
      window.removeEventListener("search:close", onClose);
      window.removeEventListener("search:query", onQuery);
    };
  }, []);

  const notifySearchClosed = useCallback(() => {
    window.dispatchEvent(new CustomEvent("search:closed"));
  }, []);

  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;

    gsap.killTweensOf(panel);
    const items = inner.querySelectorAll("[data-search-item]");
    if (items.length) gsap.killTweensOf(items);

    if (open) {
      firstIdle.current = false;

      const measure = () => inner.scrollHeight || inner.getBoundingClientRect().height;
      if (reduceMotion) {
        gsap.set(panel, { height: measure(), autoAlpha: 1 });
        gsap.set(items, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          panel,
          { height: 0, autoAlpha: 0 },
          { height: measure(), autoAlpha: 1, duration: 0.38, ease: "power3.out" }
        );
        if (items.length) {
          gsap.set(items, { opacity: 0, y: 14 });
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.36,
            ease: "power3.out",
            stagger: 0.035,
            delay: 0.08,
          });
        }
      }
    } else {
      const finish = () => {
        if (items.length) gsap.set(items, { opacity: 0, y: 14 });
        setQuery("");
        notifySearchClosed();
      };
      if (reduceMotion || firstIdle.current) {
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
            y: 8,
            duration: 0.12,
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
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, reduceMotion, notifySearchClosed]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!open || !panel || !inner) return;
    const h = inner.scrollHeight || inner.getBoundingClientRect().height;
    gsap.to(panel, { height: h, duration: 0.28, ease: "power3.out" });
  }, [results, open, debouncedQuery]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <div
      className={clsx(
        "absolute left-0 right-0 top-full z-[100] max-h-[min(520px,60vh)] w-full overflow-hidden overflow-y-auto rounded-b-[22px] border-0",
        panelOpen
          ? "bg-white/[0.72] shadow-[0_40px_120px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[22px]"
          : "bg-transparent shadow-none backdrop-blur-none"
      )}
      ref={panelRef}
    >
      <div
        className="rounded-b-[22px] bg-transparent px-[18px] pb-[18px] text-black/[0.88]"
        ref={innerRef}
      >
        {open && (
          <>
            {debouncedQuery.trim() && results.length > 0 && (
              <>
                <div
                  className="border-t border-black/[0.06] px-1.5 pb-3.5 pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-black/[0.38]"
                  data-search-item
                >
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </div>
                <div className="grid gap-1">
                  {results.map((product) => {
                    const { current, original } = formatMappedProductPrice(product);

                    return (
                      <Link
                        key={product.id}
                        href={toCountryPath(`/product/${product.id}`)}
                        className="group flex items-center gap-4 rounded-2xl px-3.5 py-2.5 no-underline transition-[background,transform] duration-[140ms] hover:translate-x-0.5 hover:bg-black/[0.04]"
                        data-search-item
                        onClick={close}
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[14px] border border-black/[0.04] bg-black/[0.03]">
                          <img
                            className="h-full w-full object-cover"
                            src={product.image[0]}
                            alt={product.name}
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="line-clamp-2 text-sm font-bold leading-[1.35] text-black/90">
                            {product.name}
                          </span>
                          {product.category?.[0] && (
                            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-black/40">
                              {product.category[0]}
                            </span>
                          )}
                          <div className="mt-px flex items-baseline gap-2">
                            <span className="text-sm font-extrabold tracking-[0.01em] text-[#111]">
                              {current}
                            </span>
                            {original ? (
                              <span className="text-xs font-semibold text-black/[0.35] line-through">
                                {original}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <ChevronRight
                          className="h-6 w-6 shrink-0 text-black/25 opacity-0 -translate-x-1.5 transition-[opacity,transform] duration-[140ms] group-hover:translate-x-0 group-hover:opacity-100"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            {debouncedQuery.trim() && results.length === 0 && (
              <div
                className="border-t border-black/[0.06] px-4 pb-[18px] pt-8 text-center text-sm font-medium leading-normal text-black/45"
                data-search-item
              >
                No products found for &ldquo;{debouncedQuery.trim()}&rdquo;
              </div>
            )}

            {!debouncedQuery.trim() && (
              <div
                className="border-t border-black/[0.06] px-4 pb-[18px] pt-8 text-center text-sm font-medium leading-normal text-black/45"
                data-search-item
              >
                Start typing to search products...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export { SearchOverlay };
export default SearchOverlay;
