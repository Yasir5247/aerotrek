import PropTypes from "prop-types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { isStorePath } from "@lib/navigation/country-path";
import { useCountryPath, useCountryCode } from "@/hooks/use-country-path";

const navLinkClass =
  "relative inline-flex h-14 items-center px-0 text-xs font-bold uppercase tracking-[0.14em] text-black/[0.86] transition-colors duration-[160ms] after:absolute after:bottom-2.5 after:left-0 after:right-0 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-[#5a5a5a] after:opacity-90 after:transition-transform after:duration-[180ms] after:content-[''] hover:text-[#5a5a5a] hover:after:scale-x-100";

const NavMenu = ({ menuWhiteClass }: { menuWhiteClass?: any }) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const countryCode = useCountryCode();
  const toCountryPath = useCountryPath();

  const linkClass = (active: boolean) =>
    clsx(navLinkClass, menuWhiteClass, active && "text-[#5a5a5a] after:scale-x-100");

  return (
    <div>
      <nav>
        <ul className="m-0 flex list-none items-center justify-start gap-[26px] p-0">
          <li className="p-0">
            <Link
              href={toCountryPath("/")}
              className={linkClass(isStorePath(pathname, "/", countryCode))}
            >
              {t("home")}
            </Link>
          </li>
          <li className="p-0">
            <Link
              href={toCountryPath("/shop")}
              className={linkClass(isStorePath(pathname, "/shop", countryCode))}
            >
              {t("shop")}
            </Link>
          </li>
          <li className="p-0">
            <Link
              href={toCountryPath("/contact")}
              className={linkClass(isStorePath(pathname, "/contact", countryCode))}
            >
              {t("contact_us")}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
};

export default NavMenu;
