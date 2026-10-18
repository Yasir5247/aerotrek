"use client";

import PropTypes from "prop-types";
import Link from "next/link";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { ArrowLeftRight, Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { HttpTypes } from "@aiminaabeejs/types";
import { getCartItemCount } from "@lib/util/cart";
import MenuCart from "./sub-components/MenuCart";
import ProfileMenu from "./sub-components/ProfileMenu";
import { useAuth } from "@/providers/AuthContext";
import { useCartDrawer } from "@/providers/cart-drawer-provider";
import { useCountryPath } from "@/hooks/use-country-path";

const actionIconClass = "block h-[22px] w-[22px] stroke-current text-inherit";
const actionButtonClass =
  "relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.06] bg-white/[0.38] text-[23px] text-black transition hover:-translate-y-px hover:border-black/10 hover:bg-white/[0.58] hover:text-[#5a5a5a]";
const countBadgeClass =
  "absolute -right-1.5 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#111] text-[11px] font-bold leading-5 text-white";

const AccountIcon = () => (
  <User className={actionIconClass} size={22} strokeWidth={1.75} aria-hidden="true" />
);

const CartIcon = () => (
  <ShoppingBag className={actionIconClass} size={22} strokeWidth={1.75} aria-hidden="true" />
);

const CompareIcon = () => (
  <ArrowLeftRight className={actionIconClass} size={22} strokeWidth={1.75} aria-hidden="true" />
);

const WishlistIcon = () => (
  <Heart className={actionIconClass} size={22} strokeWidth={1.75} aria-hidden="true" />
);

const SearchIcon = () => (
  <Search className={actionIconClass} size={22} strokeWidth={1.75} aria-hidden="true" />
);

const IconGroup = ({
  cart,
  iconWhiteClass,
  compactMobile,
  mobileOnly,
}: {
  cart?: HttpTypes.StoreCart | null;
  iconWhiteClass?: any;
  compactMobile?: any;
  mobileOnly?: any;
}) => {
  const { session } = useAuth();
  const { isOpen, toggleCart, closeCart } = useCartDrawer();
  const toCountryPath = useCountryPath();
  const accountHref = toCountryPath(
    session?.user ? "/my-account" : "/login-register"
  );
  const rootRef = useRef<any>(null);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!rootRef.current) return;
      if (!isOpen) return;
      if (e.target.closest("[data-cart-wrap]")) return;
      closeCart();
    };

    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      closeCart();
    };

    document.addEventListener("mousedown", onPointerDown, true);
    document.addEventListener("touchstart", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown, true);
      document.removeEventListener("touchstart", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeCart, isOpen]);

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent("search:open"));
  };

  const triggerMobileMenu = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("mobileMenu:open"));
      const offcanvasMobileMenu = document.querySelector("#offcanvas-mobile-menu");
      if (offcanvasMobileMenu) offcanvasMobileMenu.classList.add("active");
    }
  };

  const { compareItems } = useSelector((state: any) => state.compare);
  const { wishlistItems } = useSelector((state: any) => state.wishlist);
  const cartCount = getCartItemCount(cart);

  const wrapClass = clsx(
    "mt-0 flex items-center justify-end md:max-lg:mt-0 max-md:mt-0.5",
    iconWhiteClass
  );
  const itemClass = "relative ml-5 first:ml-0 lg:max-xl:ml-2.5 md:max-lg:ml-[15px] max-md:ml-5";

  const accountButton = session?.user ? (
    <div className={clsx(itemClass, "hidden lg:block")}>
      <ProfileMenu session={session} />
    </div>
  ) : (
    <div className={itemClass}>
      <Link className={actionButtonClass} href={accountHref} aria-label="Account">
        <AccountIcon />
      </Link>
    </div>
  );

  const mobileAccountButton = (
    <div className={itemClass}>
      <Link className={actionButtonClass} href={accountHref} aria-label="Account">
        <AccountIcon />
      </Link>
    </div>
  );

  const cartBadge =
    cartCount > 0 ? <span className={countBadgeClass}>{cartCount}</span> : null;

  if (mobileOnly) {
    return (
      <div ref={rootRef} className={wrapClass}>
        {mobileAccountButton}
        <div className={itemClass} data-cart-wrap>
          <Link className={actionButtonClass} href={toCountryPath("/cart")} aria-label="Cart">
            <CartIcon />
            {cartBadge}
          </Link>
        </div>
      </div>
    );
  }

  if (compactMobile) {
    return (
      <div ref={rootRef} className={wrapClass}>
        <div className={clsx(itemClass, "block lg:hidden")}>
          <button
            className={actionButtonClass}
            onClick={() => triggerMobileMenu()}
            aria-label="Open menu"
          >
            <Menu className={actionIconClass} size={22} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex">
          <div className={itemClass}>
            <button className={actionButtonClass} onClick={openSearch} aria-label="Search">
              <SearchIcon />
            </button>
          </div>
          {accountButton}
          <div className={itemClass}>
            <Link className={actionButtonClass} href={toCountryPath("/compare")} aria-label="Compare">
              <CompareIcon />
              <span className={countBadgeClass}>
                {compareItems && compareItems.length ? compareItems.length : 0}
              </span>
            </Link>
          </div>
          <div className={itemClass}>
            <Link className={actionButtonClass} href={toCountryPath("/wishlist")} aria-label="Wishlist">
              <WishlistIcon />
              <span className={countBadgeClass}>
                {wishlistItems && wishlistItems.length ? wishlistItems.length : 0}
              </span>
            </Link>
          </div>
          <div className={itemClass} data-cart-wrap>
            <button
              className={actionButtonClass}
              onClick={() => toggleCart()}
              aria-label="Cart"
              aria-expanded={isOpen}
            >
              <CartIcon />
              {cartBadge}
            </button>
            <MenuCart cart={cart} isOpen={isOpen} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={wrapClass}>
      <div className={clsx(itemClass, "hidden lg:block")}>
        <button className={actionButtonClass} onClick={openSearch} aria-label="Search">
          <SearchIcon />
        </button>
      </div>
      {accountButton}
      <div className={itemClass}>
        <Link className={actionButtonClass} href={toCountryPath("/compare")} aria-label="Compare">
          <CompareIcon />
          <span className={countBadgeClass}>
            {compareItems && compareItems.length ? compareItems.length : 0}
          </span>
        </Link>
      </div>
      <div className={itemClass}>
        <Link className={actionButtonClass} href={toCountryPath("/wishlist")} aria-label="Wishlist">
          <WishlistIcon />
          <span className={countBadgeClass}>
            {wishlistItems && wishlistItems.length ? wishlistItems.length : 0}
          </span>
        </Link>
      </div>
      <div className={clsx(itemClass, "hidden lg:block")} data-cart-wrap>
        <button
          className={actionButtonClass}
          onClick={() => toggleCart()}
          aria-label="Cart"
          aria-expanded={isOpen}
        >
          <CartIcon />
          {cartBadge}
        </button>
        <MenuCart cart={cart} isOpen={isOpen} />
      </div>
      <div className={clsx(itemClass, "block lg:hidden")} data-cart-wrap>
        <Link className={actionButtonClass} href={toCountryPath("/cart")} aria-label="Cart">
          <CartIcon />
          {cartBadge}
        </Link>
      </div>
      <div className={clsx(itemClass, "block lg:hidden")}>
        <button
          className={actionButtonClass}
          onClick={() => triggerMobileMenu()}
          aria-label="Open menu"
        >
          <Menu className={actionIconClass} size={22} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  iconWhiteClass: PropTypes.string,
  compactMobile: PropTypes.bool,
  mobileOnly: PropTypes.bool,
};

export default IconGroup;
