"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/layout/breadcrumb/Breadcrumb";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { useCountryPath } from "@/hooks/use-country-path";

const NotFound = () => {
  const pathname = usePathname();
  const toCountryPath = useCountryPath();

  return (
    <Fragment>
      <Breadcrumb
        variant="chrome"
        pages={[
          { label: "Home", path: toCountryPath("/") },
          { label: "Not Found", path: pathname },
        ]}
      />
      <div className="bg-gradient-to-b from-[#f8f9fb] to-white pt-[60px] pb-[30px] md:pb-[100px]">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex justify-center">
            <div className="w-full text-center xl:max-w-[66.666%] lg:max-w-[75%]">
              <Container className="mt-2 p-[clamp(26px,5vw,44px)] max-md:rounded-[14px] max-md:p-[26px_16px]">
                <div className="inline-flex h-14 min-w-[124px] items-center justify-center rounded-full border border-[rgba(90,90,90,0.25)] bg-[rgba(90,90,90,0.08)] text-[28px] font-black tracking-[0.08em] text-[#5a5a5a] max-md:h-[46px] max-md:min-w-[100px] max-md:text-[22px]">
                  404
                </div>
                <h1 className="mb-2.5 mt-[18px] text-[clamp(2rem,4.2vw,3rem)] font-black leading-[1.08] tracking-[-0.02em] text-[#111] max-md:my-[14px_8px] max-md:mb-2 max-md:mt-3.5">
                  Page Not Found
                </h1>
                <p className="mx-auto max-w-[38rem] text-base leading-[1.7] text-black/55 max-md:text-sm max-md:leading-[1.6]">
                  The page you requested could not be found. It may have been moved, deleted,
                  or the URL might be incorrect.
                </p>
                <div className="mt-[22px] flex flex-wrap items-center justify-center gap-2.5 max-md:mt-[18px] max-md:gap-2">
                  <Button as={Link} href={toCountryPath("/")} variant="primary" size="md">
                    Back to Home
                  </Button>
                  <Button as={Link} href={toCountryPath("/shop")} variant="secondary" size="md">
                    Continue Shopping
                  </Button>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NotFound;
