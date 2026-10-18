"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Bell,
  ChevronRight,
  Clock,
  LogOut,
  MapPin,
  Receipt,
  ShoppingCart,
  User,
  type LucideIcon,
} from "lucide-react";
import { useBrowsingHistory } from "@/hooks/use-browsing-history";
import { formatMappedProductPrice } from "@/lib/util/money";
import { useSdkAddToCart } from "@/hooks/use-sdk-add-to-cart";
import { useAuth } from "@/providers/AuthContext";
import { useCountryPath } from "@/hooks/use-country-path";

const dropdownClass =
  "invisible absolute right-0 top-[calc(100%+10px)] z-[10050] w-[min(720px,calc(100vw-32px))] origin-[right_top] opacity-0 transition-all duration-300 [transform:translateY(-6px)] [&.active]:visible [&.active]:opacity-100 [&.active]:[transform:translateY(0)]";

function getDisplayName(session: any) {
  const customer = session?.user?.customer;
  const metaName = session?.user?.user_metadata?.full_name;
  const fromCustomer = [customer?.first_name, customer?.last_name]
    .filter(Boolean)
    .join(" ");
  return fromCustomer || metaName || session?.user?.email?.split("@")[0] || "Guest";
}

function getFirstName(session: any) {
  const customer = session?.user?.customer;
  if (customer?.first_name) return customer.first_name;
  const full = getDisplayName(session);
  return full.split(/\s+/)[0] || full;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return (parts[0]?.[0] || "?").toUpperCase();
}

function ProfileAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg"
      ? "h-12 w-12 text-base"
      : size === "sm"
        ? "h-8 w-8 text-[11px]"
        : "h-10 w-10 text-sm";

  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-[#e8edf5] font-bold text-[#4a5568]",
        sizeClass
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}

function BrowsingHistoryPanel({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const toCountryPath = useCountryPath();
  const { items } = useBrowsingHistory();
  const { addProductToCart, isAdding } = useSdkAddToCart({
    openDrawerOnSuccess: true,
  });
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAdd = async (item: (typeof items)[number]) => {
    if (!item.snapshot) return;
    setAddingId(item.id);
    try {
      await addProductToCart(item.snapshot, 1);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="flex min-h-[360px] w-[min(280px,38%)] shrink-0 flex-col border-r border-zinc-200">
      <Link
        href={toCountryPath("/shop")}
        onClick={onNavigate}
        className="flex items-center gap-1 px-4 py-3.5 text-sm font-semibold text-zinc-900 no-underline transition hover:text-zinc-600"
      >
        Browsing history
        <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </Link>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {items.length === 0 ? (
          <p className="m-0 px-2 py-6 text-center text-sm text-zinc-500">
            Products you view will appear here.
          </p>
        ) : (
          <ul className="m-0 list-none p-0">
            {items.map((item) => {
              const { current } = formatMappedProductPrice(item.snapshot || item);
              const lowStock =
                item.stock != null && item.stock > 0 && item.stock <= 8;

              return (
                <li
                  key={`${item.id}-${item.viewedAt}`}
                  className="flex items-start gap-2.5 rounded-lg px-2 py-2.5 transition hover:bg-zinc-50"
                >
                  <Link
                    href={toCountryPath(`/product/${item.id}`)}
                    onClick={onNavigate}
                    className="block h-14 w-14 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover object-center"
                      />
                    ) : null}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={toCountryPath(`/product/${item.id}`)}
                      onClick={onNavigate}
                      className="block truncate text-sm font-medium text-zinc-900 no-underline hover:text-zinc-600"
                    >
                      {item.name}
                    </Link>
                    {lowStock ? (
                      <p className="m-0 mt-0.5 text-xs font-medium text-orange-600">
                        Almost sold out
                      </p>
                    ) : null}
                    {item.brand ? (
                      <p className="m-0 mt-0.5 truncate text-xs text-zinc-500">
                        Brand: {item.brand}
                      </p>
                    ) : null}
                    <p className="m-0 mt-1 text-sm font-bold text-zinc-900">
                      {current}
                    </p>
                  </div>

                  {item.snapshot ? (
                    <button
                      type="button"
                      aria-label={`Add ${item.name} to cart`}
                      disabled={isAdding && addingId === item.id}
                      onClick={() => void handleAdd(item)}
                      className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50"
                    >
                      <ShoppingCart
                        className="h-4 w-4"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

type MenuItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  onClick?: () => void;
};

function AccountLinksPanel({
  session,
  onNavigate,
  onSignOut,
}: {
  session: any;
  onNavigate: () => void;
  onSignOut: () => void;
}) {
  const toCountryPath = useCountryPath();
  const displayName = getDisplayName(session);

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: "orders",
        label: "Your orders",
        href: toCountryPath("/my-orders"),
        icon: Receipt,
      },
      {
        id: "profile",
        label: "Your profile",
        href: toCountryPath("/my-account?tab=profile"),
        icon: User,
      },
      {
        id: "addresses",
        label: "Your address",
        href: toCountryPath("/my-account/addresses"),
        icon: MapPin,
      },
      {
        id: "history",
        label: "Browsing history",
        href: toCountryPath("/my-account?tab=history"),
        icon: Clock,
      },
      {
        id: "notifications",
        label: "Notifications",
        href: toCountryPath("/my-account?tab=notifications"),
        icon: Bell,
      },
    ],
    [toCountryPath]
  );

  const footerItems: MenuItem[] = [
    {
      id: "logout",
      label: "Logout",
      href: "#",
      icon: LogOut,
      onClick: onSignOut,
    },
  ];

  return (
    <div className="min-w-0 flex-1 py-1">
      <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-4">
        <ProfileAvatar name={displayName} size="lg" />
        <p className="m-0 truncate text-lg font-bold text-zinc-900">{displayName}</p>
      </div>

      <ul className="m-0 list-none p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-800 no-underline transition hover:bg-zinc-50"
              >
                <Icon
                  className="h-[18px] w-[18px] shrink-0 text-zinc-600"
                  strokeWidth={1.75}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mx-3 border-t border-zinc-200" />

      <ul className="m-0 list-none p-2">
        {footerItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  void item.onClick?.();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-800 transition hover:bg-zinc-50"
              >
                <Icon
                  className="h-[18px] w-[18px] shrink-0 text-zinc-600"
                  strokeWidth={1.75}
                />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function ProfileMenu({ session }: { session: any }) {
  const { signOutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const displayName = getDisplayName(session);
  const firstName = getFirstName(session);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!isOpen || !wrapRef.current) return;
      if (wrapRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown, true);
    document.addEventListener("touchstart", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown, true);
      document.removeEventListener("touchstart", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const handleSignOut = async () => {
    close();
    await signOutUser();
  };

  return (
    <div ref={wrapRef} className="relative" data-profile-wrap>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="inline-flex max-w-[220px] items-center gap-2.5 rounded-xl border border-transparent bg-transparent px-1 py-1 text-left transition hover:bg-white/50"
      >
        <ProfileAvatar name={displayName} size="md" />
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-xs text-zinc-600">
            Hello, {firstName}
          </span>
          <span className="block truncate text-sm font-bold text-zinc-900">
            Orders &amp; Account
          </span>
        </span>
      </button>

      <div className={clsx(dropdownClass, isOpen && "active")} role="menu">
        <div className="pointer-events-none absolute -top-2 right-8 h-4 w-4 rotate-45 border-l border-t border-zinc-200 bg-white" />

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
          <div className="flex min-h-[380px]">
            <BrowsingHistoryPanel onNavigate={close} />
            <AccountLinksPanel
              session={session}
              onNavigate={close}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
