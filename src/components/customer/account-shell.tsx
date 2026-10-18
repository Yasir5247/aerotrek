"use client";

import { useCountryCode } from "@/hooks/use-country-path";
import { pathWithoutCountry } from "@lib/navigation/country-path";
import { usePathname } from "next/navigation";
import ProfileNav from "./profile/profile-nav";

export default function AccountShell({ children }: { customer?: any; children?: any }) {
  const pathname = usePathname();
  const countryCode = useCountryCode();
  const storePath = pathWithoutCountry(pathname || "/", countryCode);

  return (
    <div className="w-full py-4 md:py-6">
        {storePath === "/my-account" ? (
          children
        ) : (
          <div className="grid items-start gap-[18px] lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
            <ProfileNav />
            <div className="min-w-0">{children}</div>
          </div>
        )}
    </div>
  );
}
