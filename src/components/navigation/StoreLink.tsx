"use client";

// Storefront links must use StoreLink or useCountryPath() — never bare /shop paths.
import Link from "next/link";
import type { ComponentProps } from "react";
import { useCountryPath } from "@/hooks/use-country-path";

export function StoreLink({ href, ...props }: ComponentProps<typeof Link>) {
  const toCountryPath = useCountryPath();
  const path = typeof href === "string" ? toCountryPath(href) : href;

  return <Link href={path} {...props} />;
}
