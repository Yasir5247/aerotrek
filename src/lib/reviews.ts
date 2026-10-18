/** Clear in-memory review summary cache (used by useProductReviewSummary). */
const summaryListeners = new Set<any>();

export function invalidateProductReviewSummary(productId?: any) {
  summaryListeners.forEach((fn) => {
    try {
      fn(productId);
    } catch {
      // ignore listener errors
    }
  });
}

export function subscribeProductReviewSummaryInvalidation(listener?: any) {
  summaryListeners.add(listener);
  return () => summaryListeners.delete(listener);
}

export async function fetchProductReviews(productId?: any, { limit = 20 }: any = {}) {
  return [];
}

export async function fetchProductReviewSummary(productId?: any) {
  return { count: 0, avg: 0 };
}

export async function canReviewProduct(productId?: any) {
  return false;
}

export async function createProductReview({ productId, rating, title, body, userId }: { productId?: any; rating?: any; title?: any; body?: any; userId?: any }) {
  throw new Error("Product reviews are not available on the Aiminaabee storefront API yet.");
}

export async function updateProductReview({ reviewId, rating, title, body }: { reviewId?: any; rating?: any; title?: any; body?: any }) {
  throw new Error("Product reviews are not available on the Aiminaabee storefront API yet.");
}

export async function deleteProductReview(reviewId?: any) {
  throw new Error("Product reviews are not available on the Aiminaabee storefront API yet.");
}
