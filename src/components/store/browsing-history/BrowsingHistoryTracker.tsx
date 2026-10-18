"use client";

import { useEffect } from "react";
import { addToBrowsingHistory } from "@lib/browsing-history";

export default function BrowsingHistoryTracker({ product }: { product?: any }) {
  useEffect(() => {
    if (!product?.id) return;
    addToBrowsingHistory(product);
  }, [product]);

  return null;
}
