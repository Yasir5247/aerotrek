"use client";

import PropTypes from "prop-types";
import HeaderOne from "./header/HeaderOne";
import FooterOne from "./footer/FooterOne";
import ScrollToTop from "@/components/common/scroll-to-top";
import { CONTENT_SHELL_CLASS } from "@/lib/ui/content-shell";

const LayoutOne = ({
  children,
  cart,
  regions,
  headerTop,
  headerPaddingClass,
  headerPositionClass,
}: {
  children?: any;
  cart?: import("@aiminaabeejs/types").HttpTypes.StoreCart | null;
  regions?: import("@aiminaabeejs/types").HttpTypes.StoreRegion[];
  headerTop?: any;
  headerPaddingClass?: any;
  headerPositionClass?: any;
}) => {
  return (
    <div className="w-full min-w-0">
      <HeaderOne
        cart={cart}
        regions={regions}
        top={headerTop}
        headerPaddingClass={headerPaddingClass}
        headerPositionClass={headerPositionClass}
      />
      <main className={CONTENT_SHELL_CLASS}>{children}</main>
      <div className={CONTENT_SHELL_CLASS}>
        <FooterOne />
      </div>
      <ScrollToTop />
    </div>
  );
};

LayoutOne.propTypes = {
  children: PropTypes.node,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  headerTop: PropTypes.string,
};

export default LayoutOne;
