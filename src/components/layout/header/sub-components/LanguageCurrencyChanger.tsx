"use client";

import PropTypes from "prop-types";
import { useTransition } from "react";
import { useTranslation } from "react-i18next";
import { useParams, usePathname } from "next/navigation";
import { HttpTypes } from "@aiminaabeejs/types";
import { updateRegion } from "@lib/data/cart";
import { pathWithoutCountry } from "@lib/navigation/country-path";

const dropdownClass =
  "invisible absolute left-0 top-full z-[2] min-w-[160px] border border-black/[0.06] bg-white py-2 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all group-hover:visible group-hover:opacity-100";

type CountryOption = {
  country: string;
  label: string;
  currencyCode?: string;
};

function buildCountryOptions(regions: HttpTypes.StoreRegion[]): CountryOption[] {
  return regions
    .flatMap((region) =>
      (region.countries || []).map((country) => ({
        country: (country.iso_2 || "").toLowerCase(),
        label: country.display_name || country.iso_2 || "",
        currencyCode: region.currency_code || undefined,
      }))
    )
    .filter((option) => option.country)
    .sort((a, b) => a.label.localeCompare(b.label));
}

const LanguageCurrencyChanger = ({
  regions = [],
}: {
  regions?: HttpTypes.StoreRegion[];
}) => {
  const { i18n } = useTranslation();
  const { countryCode } = useParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const options = buildCountryOptions(regions);
  const current =
    options.find((option) => option.country === countryCode) || options[0];

  const changeLanguageTrigger = (e: React.MouseEvent<HTMLButtonElement>) => {
    const languageCode = (e.currentTarget as HTMLButtonElement).value;
    i18n.changeLanguage(languageCode);
  };

  const handleCountryChange = (option: CountryOption) => {
    if (!option.country || option.country === countryCode) {
      return;
    }

    const currentPath = pathWithoutCountry(pathname, String(countryCode || ""));
    startTransition(() => {
      void updateRegion(option.country, currentPath);
    });
  };

  return (
    <div className="flex items-center max-md:justify-center">
      <div className="group relative mr-[54px] max-md:mr-[15px]">
        <span className="cursor-pointer text-sm">
          {i18n.resolvedLanguage === "en"
            ? "English"
            : i18n.resolvedLanguage === "fn"
              ? "French"
              : i18n.resolvedLanguage === "de"
                ? "Germany"
                : ""}{" "}
          <i className="fa fa-angle-down" />
        </span>
        <div className={dropdownClass}>
          <ul className="m-0 list-none p-0">
            <li>
              <button
                className="block w-full border-0 bg-transparent px-4 py-1.5 text-left text-sm hover:text-[#5a5a5a]"
                value="en"
                onClick={changeLanguageTrigger}
              >
                English
              </button>
            </li>
            <li>
              <button className="block w-full border-0 bg-transparent px-4 py-1.5 text-left text-sm">
                Soon.. ދިވެހި
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="group relative mr-[54px] max-md:mr-[15px]">
        <span className="cursor-pointer text-sm">
          {current?.label || String(countryCode || "").toUpperCase()}{" "}
          {current?.currencyCode ? `(${current.currencyCode.toUpperCase()})` : ""}{" "}
          <i className="fa fa-angle-down" />
        </span>
        <div className={dropdownClass}>
          <ul className="m-0 list-none p-0">
            {options.map((option) => (
              <li key={option.country}>
                <button
                  type="button"
                  className="block w-full border-0 bg-transparent px-4 py-1.5 text-left text-sm hover:text-[#5a5a5a] disabled:opacity-50"
                  disabled={isPending || option.country === countryCode}
                  onClick={() => handleCountryChange(option)}
                >
                  {option.label}
                  {option.currencyCode
                    ? ` (${option.currencyCode.toUpperCase()})`
                    : ""}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative">
        <p className="m-0 text-sm">Call Us +960 7890988</p>
      </div>
    </div>
  );
};

LanguageCurrencyChanger.propTypes = {
  regions: PropTypes.arrayOf(PropTypes.shape({})),
};

export default LanguageCurrencyChanger;
