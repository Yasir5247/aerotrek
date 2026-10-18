"use client";

import PropTypes from "prop-types";
import clsx from "clsx";
import Link from "next/link";
import { useCountryPath } from "@/hooks/use-country-path";

const logoSrc = "/assets/img/logo/aerotreklogob.png";

const Logo = ({ logoClass }: { logoClass?: any }) => {
  const toCountryPath = useCountryPath();

  return (
    <div className={clsx("mt-0 flex items-center", logoClass)}>
      <Link href={toCountryPath("/")} aria-label="AeroTrek home">
        <img className="block h-[38px] w-auto text-[#1c1917]" src={logoSrc} alt="" aria-hidden="true" />
      </Link>
    </div>
  );
};

Logo.propTypes = {
  logoClass: PropTypes.string,
};

export default Logo;
