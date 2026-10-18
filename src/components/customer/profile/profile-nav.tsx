"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut, MapPin, Package, User } from "lucide-react";
import clsx from "clsx";
import { pathWithoutCountry } from "@lib/navigation/country-path";
import { useAuth } from "@/providers/AuthContext";
import { useCountryCode, useCountryPath } from "@/hooks/use-country-path";
import Container from "@/components/ui/Container";

const ACCOUNT_TABS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "profile", label: "Profile", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

const navLinkClass =
  "flex w-full items-center gap-2.5 rounded-[14px] border-0 bg-transparent px-3 py-[11px] text-left text-sm font-extrabold leading-tight text-black/70 no-underline transition-[background,color] duration-[180ms] hover:bg-black/[0.04] hover:text-[#111]";

const navLinkActiveClass = "bg-[rgba(90,90,90,0.12)] text-[#5a5a5a]";

export default function ProfileNav({
  activeTab = "overview",
  onSelect,
}: {
  activeTab?: string;
  onSelect?: (id: string) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const countryCode = useCountryCode();
  const toCountryPath = useCountryPath();
  const { signOutUser } = useAuth();
  const storePath = pathWithoutCountry(pathname || "/", countryCode);
  const onOrders =
    storePath === "/my-orders" || storePath.startsWith("/my-orders/");

  const handleLogout = async () => {
    await signOutUser();
  };

  const selectAccountTab = (id: string) => {
    if (onSelect) {
      onSelect(id);
      return;
    }
    router.push(
      id === "overview"
        ? toCountryPath("/my-account")
        : toCountryPath(`/my-account?tab=${id}`)
    );
  };

  return (
    <nav aria-label="Account">
      <Container className="!p-0">
        <ul className="m-0 flex list-none flex-col gap-1.5 p-2.5">
          {ACCOUNT_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = !onOrders && activeTab === tab.id;
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  className={clsx(navLinkClass, "cursor-pointer", active && navLinkActiveClass)}
                  onClick={() => selectAccountTab(tab.id)}
                >
                  <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              </li>
            );
          })}
          <li>
            <Link
              href={toCountryPath("/my-orders")}
              className={clsx(navLinkClass, onOrders && navLinkActiveClass)}
            >
              <Package size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>Orders</span>
            </Link>
          </li>
          <li>
            <button
              type="button"
              className={clsx(
                navLinkClass,
                "cursor-pointer text-[#b42318] hover:bg-[rgba(180,35,24,0.08)] hover:text-[#b42318]"
              )}
              onClick={handleLogout}
            >
              <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>Log out</span>
            </button>
          </li>
        </ul>
      </Container>
    </nav>
  );
}
