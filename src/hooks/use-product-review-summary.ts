import { useEffect, useState } from "react";
import {
  fetchProductReviewSummary,
  subscribeProductReviewSummaryInvalidation,
} from "@/lib/reviews";

const summaryCache = new Map();
const inflight = new Map();

export default function useProductReviewSummary(productId?: any) {
  const [state, setState] = useState(() => {
    if (!productId) return { loading: false, count: 0, avg: 0 };
    const cached = summaryCache.get(productId);
    return cached ? { loading: false, ...cached } : { loading: true, count: 0, avg: 0 };
  });

  useEffect(() => {
    let cancelled = false;
    if (!productId) {
      setState({ loading: false, count: 0, avg: 0 });
      return () => {};
    }

    const load = () => {
      const cached = summaryCache.get(productId);
      if (cached) {
        setState({ loading: false, ...cached });
        return;
      }

      setState((s) => ({ ...s, loading: true }));

      const run = inflight.get(productId) || fetchProductReviewSummary(productId);
      inflight.set(productId, run);

      run
        .then((summary) => {
          inflight.delete(productId);
          summaryCache.set(productId, summary);
          if (!cancelled) setState({ loading: false, ...summary });
        })
        .catch(() => {
          inflight.delete(productId);
          if (!cancelled) setState({ loading: false, count: 0, avg: 0 });
        });
    };

    load();

    const unsubscribe = subscribeProductReviewSummaryInvalidation((id) => {
      if (id && id !== productId) return;
      summaryCache.delete(productId);
      inflight.delete(productId);
      if (!cancelled) load();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [productId]);

  return state;
}
