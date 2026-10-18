"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import { countryPath } from "@lib/navigation/country-path";

export function useCountryCode() {
  const params = useParams();
  const countryCode = String(params?.countryCode || "").toLowerCase();
  return countryCode || null;
}

export function useCountryPath() {
  const countryCode = useCountryCode();

  return useCallback(
    (path = "/") => countryPath(countryCode, path),
    [countryCode]
  );
}
