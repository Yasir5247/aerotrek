import PropTypes from "prop-types";
import clsx from "clsx";
import Link from "next/link";

const chromeItem =
  "text-[11px] font-extrabold uppercase tracking-[0.12em] text-black/45 max-[767px]:text-[10px] max-[767px]:tracking-[0.1em]";

const BreadcrumbWrap = ({
  pages,
  className,
  containerClass,
  variant = "default",
}: {
  pages?: { label: string; path: string }[];
  className?: string;
  containerClass?: string;
  variant?: "default" | "chrome" | "modern" | "bare";
}) => {
  const isBare = variant === "bare";
  const isModern = variant === "modern" && !isBare;
  const isChrome = variant === "chrome";
  const isDefault = variant === "default";
  const useChromeItems = isChrome || isModern || isBare;

  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx(
        "relative z-[1]",
        isModern &&
          "mx-5 border-b border-black/[0.06] bg-white/[0.72] py-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-[10px]",
        isChrome &&
          "border-b border-black/[0.06] border-t border-black/[0.03] bg-[linear-gradient(180deg,#f8f9fb_0%,#f3f4f7_100%)] py-4 max-[767px]:py-3",
        isDefault && "bg-[#f6f7f8] py-9",
        className
      )}
    >
      <div className={clsx(containerClass || "w-full")}>
        <ol
          className={clsx(
            "m-0 flex list-none flex-wrap items-center gap-2 p-0 max-[767px]:gap-1.5",
            isDefault ? "justify-center" : "justify-start"
          )}
        >
          {pages?.map(({ path, label }, i) => {
            const isLast = i === pages.length - 1;
            return (
              <li
                key={`${label}-${i}`}
                className={clsx(
                  "inline-flex items-center",
                  useChromeItems
                    ? chromeItem
                    : "text-[15px] font-medium uppercase text-[#5b5858]"
                )}
              >
                {i > 0 && (
                  <span
                    className={clsx(
                      "mr-2 max-[767px]:mr-1.5",
                      useChromeItems ? "text-black/30" : "text-black"
                    )}
                    aria-hidden
                  >
                    /
                  </span>
                )}
                {isLast ? (
                  <span
                    className={useChromeItems ? "text-[#111]" : "text-black"}
                    aria-current="page"
                  >
                    {label}
                  </span>
                ) : (
                  <Link
                    href={path || "/"}
                    className={
                      useChromeItems
                        ? "text-black/[0.58] transition-colors duration-200 hover:text-[#5a5a5a]"
                        : "text-inherit transition-colors duration-200 hover:text-[#5a5a5a]"
                    }
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

BreadcrumbWrap.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
  containerClass: PropTypes.string,
  variant: PropTypes.oneOf(["default", "chrome", "modern", "bare"]),
};

export default BreadcrumbWrap;
