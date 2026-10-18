"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BrowsingHistoryEntry,
  getBrowsingHistory,
} from "@lib/browsing-history";

export function useBrowsingHistory() {
  const [items, setItems] = useState<BrowsingHistoryEntry[]>([]);

  const refresh = useCallback(() => {
    setItems(getBrowsingHistory());
  }, []);

  useEffect(() => {
    refresh();

    const onUpdate = () => refresh();
    window.addEventListener("browsing-history:updated", onUpdate);
    window.addEventListener("storage", onUpdate);

    return () => {
      window.removeEventListener("browsing-history:updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  return { items, refresh };
}
