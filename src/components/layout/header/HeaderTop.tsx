"use client";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { HttpTypes } from "@aiminaabeejs/types";
import clsx from "clsx";
import LanguageCurrencyChanger from "./sub-components/LanguageCurrencyChanger";
import {
  DEFAULT_SHIPPING_SETTINGS,
  fetchShippingSettings,
} from "@/lib/helpers/shippingSettings";

const HeaderTop = ({
  borderStyle,
  regions = [],
}: {
  borderStyle?: string;
  regions?: HttpTypes.StoreRegion[];
}) => {
  const [shipping, setShipping] = useState<any>(DEFAULT_SHIPPING_SETTINGS);

  useEffect(() => {
    let active = true;
    fetchShippingSettings()
      .then((settings) => {
        if (active) setShipping(settings);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const currencySymbol =
    regions
      .flatMap((region) => region.countries || [])
      .find((country) => country.iso_2)?.display_name || "$";

  return (
    <div
      className={clsx(
        "flex items-center justify-between max-md:mb-0 max-md:mt-2 max-md:block max-md:pb-[15px] sm:max-md:flex sm:max-md:mt-0",
        borderStyle === "fluid-border" && "border-b border-[#d5d4d4]"
      )}
    >
      <LanguageCurrencyChanger regions={regions} />
      <div>
        {shipping.freeShippingEnabled ? (
          <p className="m-0 tracking-[0.8px] text-[#555252] max-md:text-center sm:max-md:text-right">
            Free delivery on order over{" "}
            <span className="text-[#ff1c1c]">
              {currencySymbol}
              {Number(shipping.freeShippingThreshold).toFixed(2)}
            </span>
          </p>
        ) : (
          <p className="m-0 tracking-[0.8px] text-[#555252] max-md:text-center sm:max-md:text-right">
            Flat delivery{" "}
            <span className="text-[#ff1c1c]">
              {currencySymbol}
              {Number(shipping.shippingRate).toFixed(2)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

HeaderTop.propTypes = {
  borderStyle: PropTypes.string,
  regions: PropTypes.arrayOf(PropTypes.shape({})),
};

export default HeaderTop;
