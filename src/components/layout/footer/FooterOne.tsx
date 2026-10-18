"use client";

import clsx from "clsx";
import Link from "next/link";
import PropTypes from "prop-types";
import Container from "@/components/ui/Container";
import SubscribeEmail from "./sub-components/SubscribeEmail";
import { useCountryPath } from "@/hooks/use-country-path";

const logoSrc = "/assets/img/logo/aerotreklogob.png";

const FooterOne = ({
  backgroundColorClass,
  spaceTopClass,
  spaceBottomClass,
  spaceLeftClass,
  spaceRightClass,
  containerClass,
  extraFooterClass,
  sideMenu,
}: {
  backgroundColorClass?: any;
  spaceTopClass?: any;
  spaceBottomClass?: any;
  spaceLeftClass?: any;
  spaceRightClass?: any;
  containerClass?: any;
  extraFooterClass?: any;
  sideMenu?: any;
}) => {
  const toCountryPath = useCountryPath();

  return (
    <footer
      className={clsx(
        "relative isolate bg-transparent",
        "pt-5 md:pt-6 lg:pt-[30px]",
        "pb-7 md:pb-9 lg:pb-[70px]",
        backgroundColorClass,
        spaceTopClass,
        spaceBottomClass,
        extraFooterClass,
        spaceLeftClass,
        spaceRightClass
      )}
    >
      <div className={clsx(containerClass || "w-full", "lg:px-1")}>
        <Container className="lg:p-[30px] lg:pb-[26px]">
          <div
            className={clsx(
              "flex w-full flex-col gap-0",
              "md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-5",
              "md:[grid-template-areas:'brand_brand''social_newsletter']",
              "lg:grid-cols-[minmax(240px,1.3fr)_minmax(180px,0.8fr)_minmax(280px,1.2fr)]",
              "lg:gap-x-[26px] lg:gap-y-7",
              "lg:[grid-template-areas:none]",
              sideMenu && "lg:grid-cols-2"
            )}
          >
            <div
              className={clsx(
                "mb-1 flex flex-col items-center border-b border-stone-900/10 pb-[18px] text-center",
                "md:mb-0 md:grid md:grid-cols-[auto_1fr] md:items-center md:gap-x-4 md:gap-y-2.5",
                "md:border-b md:border-stone-900/[0.08] md:pb-1 md:text-left",
                "md:[grid-area:brand] md:[grid-template-areas:'logo_actions''text_text']",
                "lg:mb-0 lg:block lg:max-w-[280px] lg:border-0 lg:pb-0 lg:[grid-area:unset]"
              )}
            >
              <Link
                className="inline-flex md:[grid-area:logo]"
                href={toCountryPath("/")}
              >
                <img
                  className="ml-[15px] block h-auto w-[clamp(112px,38vw,132px)] text-stone-900 md:w-[118px] lg:w-[clamp(130px,22vw,160px)]"
                  src={logoSrc}
                  alt="AeroTrek"
                />
              </Link>
              <p className="mx-auto mt-3 max-w-[34ch] text-[13.5px] leading-[1.55] text-stone-900/70 md:mx-0 md:mt-0 md:max-w-[52ch] md:text-sm md:leading-relaxed md:[grid-area:text] lg:mt-4 lg:max-w-[36ch] lg:leading-[1.75]">
                Built for smart, seamless journeys. Explore AeroTrek bags made
                to move with your everyday adventures.
              </p>
              <div className="mt-3.5 flex flex-wrap justify-center gap-2.5 md:mt-0 md:justify-end md:[grid-area:actions] lg:mt-[18px] lg:justify-start">
                <Link
                  href={toCountryPath("/contact")}
                  className="inline-flex min-h-10 items-center justify-center rounded-[10px] border border-stone-900/16 px-[18px] py-2 text-xs font-bold uppercase tracking-[0.06em] text-stone-900 transition-colors duration-[240ms] hover:border-[#5a5a5a]/55 hover:bg-[#5a5a5a]/5 hover:text-[#5a5a5a] md:min-h-[34px] md:rounded-full md:px-3.5 md:py-[7px] md:text-[11px] md:tracking-[0.09em]"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            <div
              className={clsx(
                "flex flex-col items-center",
                "md:items-start md:[grid-area:social]",
                "lg:[grid-area:unset]"
              )}
            >
              <h3 className="mb-3 mt-0 text-xs font-extrabold uppercase tracking-[0.16em] text-stone-900 md:mb-3.5 md:mt-1">
                Follow Us
              </h3>
              <ul className="m-0 flex list-none justify-center gap-2.5 p-0 md:flex-wrap md:gap-2 lg:block lg:gap-0">
                {[
                  {
                    href: "https://www.facebook.com/profile.php?id=61565429427775",
                    label: "Facebook",
                    path: "M13.6 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4c-.3 0-1.4-.1-2.6-.1-2.5 0-4.2 1.5-4.2 4.4V10H8v3h2.1v8h3.5Z",
                  },
                  {
                    href: "https://www.tiktok.com/@aerotrek",
                    label: "TikTok",
                    path: "M16.9 5.2c.8 1 1.9 1.7 3.1 1.9v2.7c-1.2-.1-2.4-.5-3.5-1.2v6.1c0 3.1-2.5 5.6-5.6 5.6S5.3 17.8 5.3 14.7s2.5-5.6 5.6-5.6c.3 0 .7 0 1 .1v2.8c-.3-.1-.6-.2-1-.2-1.5 0-2.8 1.3-2.8 2.8s1.3 2.8 2.8 2.8 2.7-1.2 2.8-2.7V3.6h2.8c0 .6.2 1.1.4 1.6Z",
                  },
                  {
                    href: "https://www.instagram.com/aerotrekmv/",
                    label: "Instagram",
                    path: "M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 0 0-2.1 1.1 1.1 0 0 0 0 2.1Zm3.2 1.1c-.1-1-.3-1.8-.8-2.6a5.2 5.2 0 0 0-2-2A7.4 7.4 0 0 0 15.8 3C14.8 3 14.5 3 12 3s-2.8 0-3.8.1c-1 .1-1.8.3-2.6.8a5.2 5.2 0 0 0-2 2A7.4 7.4 0 0 0 3 8.2C3 9.2 3 9.5 3 12s0 2.8.1 3.8c.1 1 .3 1.8.8 2.6a5.2 5.2 0 0 0 2 2 7.4 7.4 0 0 0 2.6.8c1 .1 1.3.1 3.8.1s2.8 0 3.8-.1c1-.1 1.8-.3 2.6-.8a5.2 5.2 0 0 0 2-2 7.4 7.4 0 0 0 .8-2.6c.1-1 .1-1.3.1-3.8s0-2.8-.1-3.8Zm-2 8.9c-.1.7-.2 1.1-.4 1.4-.3.5-.6.8-1.1 1.1-.3.2-.8.3-1.4.4-.7.1-1 .1-3.3.1s-2.6 0-3.3-.1c-.7-.1-1.1-.2-1.4-.4a3.4 3.4 0 0 1-1.1-1.1c-.2-.3-.3-.8-.4-1.4-.1-.7-.1-1-.1-3.3s0-2.6.1-3.3c.1-.7.2-1.1.4-1.4.3-.5.6-.8 1.1-1.1.3-.2.8-.3 1.4-.4.7-.1 1-.1 3.3-.1s2.6 0 3.3.1c.7.1 1.1.2 1.4.4.5.3.8.6 1.1 1.1.2.3.3.8.4 1.4.1.7.1 1 .1 3.3s0 2.6-.1 3.3Z",
                  },
                ].map((item) => (
                  <li key={item.label} className="m-0 leading-none lg:mb-2.5">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="inline-flex min-h-7 items-center gap-2 rounded-full px-2.5 py-0.5 text-xs text-stone-900/70 no-underline transition duration-200 hover:-translate-y-px hover:text-[#5a5a5a] focus-visible:text-[#5a5a5a]"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center text-current" aria-hidden="true">
                        <svg className="block h-full w-full fill-current" viewBox="0 0 24 24" role="img">
                          <path d={item.path} />
                        </svg>
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={clsx(
                "bg-transparent px-0 pb-1 pt-[18px] text-center",
                "md:p-0 md:text-left md:[grid-area:newsletter]",
                "lg:[grid-area:unset]"
              )}
            >
              <h3 className="mb-2 mt-0 text-xs font-extrabold uppercase tracking-[0.16em] text-stone-900 md:mb-3.5 md:mt-1">
                Subscribe
              </h3>
              <h4 className="mb-1.5 mt-0 text-[1.05rem] font-bold leading-[1.35] tracking-[-0.01em] text-stone-900 lg:mb-2.5 lg:text-[clamp(1.02rem,1.5vw,1.15rem)]">
                Travel smarter with insider updates
              </h4>
              <p className="mx-auto mb-3.5 max-w-[34ch] text-[13.5px] leading-[1.55] text-stone-900/70 md:mx-0 lg:mb-3.5 lg:leading-[1.68]">
                Get email updates about our latest shop and special offers.
              </p>
              <SubscribeEmail mailchimpUrl="//devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef" />
            </div>
          </div>

          <div className="mt-3 flex flex-col items-center gap-2.5 border-t border-stone-900/12 px-1 pt-3.5 text-center md:mt-3.5 md:flex-row md:items-center md:justify-between md:gap-3 md:px-2 md:pt-[17px] md:text-left">
            <p className="m-0 text-xs text-stone-900/70 md:text-[13px] md:text-stone-900/68">
              &copy; {new Date().getFullYear()} AeroTrek. All Rights Reserved.
            </p>
            <p className="m-0 text-xs tracking-[0.02em] text-stone-900/55 md:text-[13px]">
              Website created by EonE
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
};

FooterOne.propTypes = {
  backgroundColorClass: PropTypes.string,
  containerClass: PropTypes.string,
  extraFooterClass: PropTypes.string,
  sideMenu: PropTypes.bool,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
};

export default FooterOne;
