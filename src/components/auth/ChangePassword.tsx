"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/layout/breadcrumb/Breadcrumb";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useCountryPath } from "@/hooks/use-country-path";

const ChangePassword = () => {
  const pathname = usePathname();
  const toCountryPath = useCountryPath();

  return (
    <Fragment>
      <Breadcrumb
        pages={[
          { label: "Home", path: toCountryPath("/") },
          {
            label: "Login Register",
            path: toCountryPath("/login-register"),
          },
          {
            label: "Change Password",
            path: pathname,
          },
        ]}
      />
      <div className="bg-gradient-to-b from-[#f8f9fb] via-[#f3f4f7] to-white pt-[60px] pb-[60px] md:pt-[100px] md:pb-[100px]">
        <div className="mx-auto w-full max-w-2xl px-4">
          <Card className="p-6 md:p-8">
            <h4 className="mb-4 text-center text-xl font-bold tracking-[-0.02em] text-[#111]">
              Change Password
            </h4>
            <p className="mb-6 text-center text-[15px] leading-relaxed text-black/65">
              Password changes now use the Aiminaabee account recovery flow.
              Request a new recovery link to continue.
            </p>
            <div className="flex justify-center">
              <Button as={Link} href={toCountryPath("/forgot-password")} variant="pill">
                Request recovery link
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Fragment>
  );
};

export default ChangePassword;
