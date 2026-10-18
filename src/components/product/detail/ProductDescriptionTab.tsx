"use client";

import PropTypes from "prop-types";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import cogoToast from "cogo-toast";
import { useAuth } from "@/providers/AuthContext";
import {
  canReviewProduct,
  createProductReview,
  deleteProductReview,
  fetchProductReviews,
  fetchProductReviewSummary,
  updateProductReview,
} from "@/lib/reviews";
import { CONTENT_SHELL_CLASS } from "@/lib/ui/content-shell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useCountryPath } from "@/hooks/use-country-path";

function formatReviewDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function Stars({ value, className }: { value?: any; className?: any }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span
      className={clsx("inline-flex gap-0.5 text-[#ffa900]", className)}
      aria-label={`${v.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={clsx("fa text-sm", v >= i + 1 ? "fa-star" : "fa-star-o")} />
      ))}
    </span>
  );
}

function fallbackNameFromUserId(userId) {
  if (!userId) return "Customer";
  const s = String(userId);
  return `Customer ${s.slice(0, 6)}`;
}

const ProductDescriptionTab = ({
  spaceBottomClass,
  productId,
  productFullDesc,
  className,
  containerClass = CONTENT_SHELL_CLASS,
}: {
  spaceBottomClass?: any;
  productId?: any;
  productFullDesc?: any;
  className?: any;
  containerClass?: any;
}) => {
  const auth = useAuth();
  const toCountryPath = useCountryPath();
  const userId = auth?.session?.user?.id;

  const [activeKey, setActiveKey] = useState("productDescription");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [summary, setSummary] = useState({ count: 0, avg: 0 });

  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligible, setEligible] = useState(false);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingReviewId, setEditingReviewId] = useState<any>(null);
  const [editRating, setEditRating] = useState(5);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editingSaving, setEditingSaving] = useState(false);

  const [reviewPendingDelete, setReviewPendingDelete] = useState<any>(null);
  const [deletingReview, setDeletingReview] = useState(false);

  const reviewsLabel = useMemo(() => {
    const c = Number(summary?.count) || 0;
    return `Reviews(${c})`;
  }, [summary?.count]);

  async function refreshReviews() {
    if (!productId) return;
    setLoading(true);
    try {
      const [nextReviews, nextSummary] = await Promise.all([
        fetchProductReviews(productId, { limit: 20 }),
        fetchProductReviewSummary(productId),
      ]);
      setReviews(nextReviews);
      setSummary(nextSummary);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function refreshEligibility() {
    if (!productId || !userId) {
      setEligible(false);
      return;
    }
    setEligibilityLoading(true);
    try {
      const ok = await canReviewProduct(productId);
      setEligible(ok);
    } catch (e: any) {
      console.error(e);
      setEligible(false);
    } finally {
      setEligibilityLoading(false);
    }
  }

  useEffect(() => {
    refreshReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    refreshEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, userId]);

  useEffect(() => {
    if (activeKey === "productReviews") {
      refreshReviews();
      refreshEligibility();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!userId) {
      cogoToast.error("Please log in to leave a review.", { position: "top-center" });
      return;
    }
    if (!eligible) {
      cogoToast.error("Only verified buyers can review after delivery.", { position: "top-center" });
      return;
    }
    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      cogoToast.error("Please select a rating from 1 to 5.", { position: "top-center" });
      return;
    }
    if (!body.trim()) {
      cogoToast.error("Please write a review.", { position: "top-center" });
      return;
    }

    setSubmitting(true);
    try {
      await createProductReview({
        productId,
        userId,
        rating: r,
        title: title.trim(),
        body: body.trim(),
      });
      setTitle("");
      setBody("");
      setRating(5);
      cogoToast.success("Thanks! Your review was posted.", { position: "top-center" });
      await refreshReviews();
    } catch (err: any) {
      console.error(err);
      cogoToast.error(err?.message || "Failed to submit review.", { position: "top-center" });
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(r) {
    setEditingReviewId(r.id);
    setEditRating(Number(r.rating) || 5);
    setEditHoverRating(0);
    setEditTitle(r.title || "");
    setEditBody(r.body || "");
  }

  function cancelEdit() {
    setEditingReviewId(null);
    setEditHoverRating(0);
    setEditingSaving(false);
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editingReviewId) return;
    const r = Number(editRating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      cogoToast.error("Please select a rating from 1 to 5.", { position: "top-center" });
      return;
    }
    if (!editBody.trim()) {
      cogoToast.error("Please write a review.", { position: "top-center" });
      return;
    }

    setEditingSaving(true);
    try {
      await updateProductReview({
        reviewId: editingReviewId,
        rating: r,
        title: editTitle.trim(),
        body: editBody.trim(),
      });
      cogoToast.success("Review updated.", { position: "top-center" });
      cancelEdit();
      await refreshReviews();
    } catch (err: any) {
      console.error(err);
      cogoToast.error(err?.message || "Failed to update review.", { position: "top-center" });
    } finally {
      setEditingSaving(false);
    }
  }

  function requestDeleteReview(r) {
    if (!r?.id) return;
    setReviewPendingDelete(r);
  }

  function cancelDeleteReview() {
    if (deletingReview) return;
    setReviewPendingDelete(null);
  }

  async function confirmDeleteReview() {
    const r = reviewPendingDelete;
    if (!r?.id) return;
    setDeletingReview(true);
    try {
      await deleteProductReview(r.id);
      cogoToast.success("Review deleted.", { position: "top-center" });
      setReviewPendingDelete(null);
      if (editingReviewId === r.id) cancelEdit();
      await refreshReviews();
    } catch (err: any) {
      console.error(err);
      cogoToast.error(err?.message || "Failed to delete review.", {
        position: "top-center",
      });
    } finally {
      setDeletingReview(false);
    }
  }

  function RatingInput({
    value,
    hoverValue,
    onChange,
    onHoverChange,
    ariaLabel,
  }: {
    value: number;
    hoverValue: number;
    onChange: (v: number) => void;
    onHoverChange: (v: number) => void;
    ariaLabel: string;
  }) {
    return (
      <div className="flex gap-1" role="radiogroup" aria-label={ariaLabel}>
        {Array.from({ length: 5 }).map((_, i) => {
          const v = i + 1;
          const effective = hoverValue || value;
          const on = v <= effective;
          return (
            <button
              key={v}
              type="button"
              className={clsx(
                "border-0 bg-transparent p-0 text-xl transition-colors",
                on ? "text-[#ffa900]" : "text-neutral-300"
              )}
              onClick={() => onChange(v)}
              onMouseEnter={() => onHoverChange(v)}
              onMouseLeave={() => onHoverChange(0)}
              onFocus={() => onHoverChange(v)}
              onBlur={() => onHoverChange(0)}
              aria-label={`${v} star${v === 1 ? "" : "s"}`}
            >
              <i className={clsx("fa", on ? "fa-star" : "fa-star-o")} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={clsx(spaceBottomClass, className)}>
      <div className={containerClass}>
        <div>
          <div className="flex flex-wrap gap-2 border-b border-black/10 pb-3">
            <button
              type="button"
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                activeKey === "productDescription"
                  ? "bg-grey-90 text-white"
                  : "bg-grey-10 text-grey-70 hover:bg-grey-20"
              )}
              onClick={() => setActiveKey("productDescription")}
            >
              Description
            </button>
            <button
              type="button"
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                activeKey === "productReviews"
                  ? "bg-grey-90 text-white"
                  : "bg-grey-10 text-grey-70 hover:bg-grey-20"
              )}
              onClick={() => setActiveKey("productReviews")}
            >
              {reviewsLabel}
            </button>
          </div>
          <div className="pt-6">
            {activeKey === "productDescription" ? (
              <div className="text-[15px] leading-7 text-[#333]">{productFullDesc}</div>
            ) : (
              <div className="space-y-6">
                <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-black tracking-[-0.03em] text-[#111]">
                      {(Number(summary?.avg) || 0).toFixed(1)}
                    </div>
                    <div>
                      <Stars value={summary?.avg} />
                      <div className="mt-1 text-sm text-black/55">
                        {Number(summary?.count) || 0} review
                        {(Number(summary?.count) || 0) === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                  <div>
                    {loading ? <span className="text-sm text-black/45">Loading…</span> : null}
                  </div>
                </Card>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
                  <div className="space-y-4">
                    {reviews?.length ? (
                      reviews.map((r) => (
                        <Card as="article" key={r.id} className="p-5">
                          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                                <div className="font-bold text-[#111]">
                                  {r.display_name || fallbackNameFromUserId(r.user_id)}
                                </div>
                                <span className="rounded-full bg-[rgba(90,90,90,0.08)] px-2 py-0.5 text-[10px] font-extrabold tracking-[0.08em] text-[#5a5a5a] uppercase">
                                  Verified buyer
                                </span>
                                <span className="text-black/30" aria-hidden="true">
                                  •
                                </span>
                                <span className="text-black/45">{formatReviewDate(r.created_at)}</span>
                                {userId && r.user_id === userId ? (
                                  <>
                                    <span className="text-black/30" aria-hidden="true">
                                      •
                                    </span>
                                    <span className="inline-flex gap-3">
                                      <button
                                        type="button"
                                        className="border-0 bg-transparent p-0 text-xs font-bold tracking-[0.04em] text-[#111] uppercase underline-offset-2 hover:underline"
                                        onClick={() => startEdit(r)}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        className="border-0 bg-transparent p-0 text-xs font-bold tracking-[0.04em] text-red-600 uppercase underline-offset-2 hover:underline"
                                        onClick={() => requestDeleteReview(r)}
                                      >
                                        Delete
                                      </button>
                                    </span>
                                  </>
                                ) : null}
                              </div>
                            </div>
                            <Stars value={r.rating} />
                          </div>
                          {editingReviewId === r.id ? (
                            <form className="space-y-4" onSubmit={saveEdit}>
                              <div>
                                <label className="mb-2 block text-xs font-bold tracking-[0.08em] text-[#111] uppercase">
                                  Edit rating
                                </label>
                                <RatingInput
                                  value={editRating}
                                  hoverValue={editHoverRating}
                                  onChange={setEditRating}
                                  onHoverChange={setEditHoverRating}
                                  ariaLabel="Edit rating"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-xs font-bold tracking-[0.08em] text-[#111] uppercase">
                                  Title (optional)
                                </label>
                                <Input
                                  variant="review"
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  placeholder="Short summary"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-xs font-bold tracking-[0.08em] text-[#111] uppercase">
                                  Your review
                                </label>
                                <Textarea
                                  variant="review"
                                  className="min-h-[120px]"
                                  value={editBody}
                                  onChange={(e) => setEditBody(e.target.value)}
                                  rows={5}
                                />
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={cancelEdit}
                                  disabled={editingSaving}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  variant="primary"
                                  size="sm"
                                  disabled={editingSaving}
                                >
                                  {editingSaving ? "Saving…" : "Save changes"}
                                </Button>
                              </div>
                            </form>
                          ) : (
                            <>
                              {r.title ? (
                                <div className="mb-2 text-base font-bold text-[#111]">{r.title}</div>
                              ) : null}
                              <div className="text-sm leading-[1.7] text-[#404040]">{r.body}</div>
                            </>
                          )}
                        </Card>
                      ))
                    ) : (
                      <Card variant="dashed" className="px-5 py-8 text-center text-sm text-black/55">
                        No reviews yet. Be the first to review this product.
                      </Card>
                    )}
                  </div>

                  <div>
                    <Card className="p-5 lg:sticky lg:top-24">
                      <h3 className="mb-4 text-lg font-bold text-[#111]">Write a review</h3>

                      {!userId ? (
                        <div className="rounded-xl border border-black/[0.08] bg-[#fafafa] p-4">
                          <div className="mb-1 text-sm font-bold text-[#111]">Log in required</div>
                          <div className="mb-4 text-sm leading-[1.6] text-black/55">
                            Please log in to leave a verified review.
                          </div>
                          <Button as={Link} href={toCountryPath("/login-register")} variant="secondary" size="sm">
                            Log in
                          </Button>
                        </div>
                      ) : eligibilityLoading ? (
                        <div className="text-sm text-black/45">Checking eligibility…</div>
                      ) : !eligible ? (
                        <div className="rounded-xl border border-black/[0.08] bg-[#fafafa] p-4">
                          <div className="mb-1 text-sm font-bold text-[#111]">Verified buyers only</div>
                          <div className="text-sm leading-[1.6] text-black/55">
                            You can leave a review once your order has been delivered.
                          </div>
                        </div>
                      ) : (
                        <form className="space-y-4" onSubmit={handleSubmitReview}>
                          <div>
                            <label className="mb-2 block text-xs font-bold tracking-[0.08em] text-[#111] uppercase">
                              Your rating
                            </label>
                            <RatingInput
                              value={rating}
                              hoverValue={hoverRating}
                              onChange={setRating}
                              onHoverChange={setHoverRating}
                              ariaLabel="Rating"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-bold tracking-[0.08em] text-[#111] uppercase">
                              Title (optional)
                            </label>
                            <Input
                              variant="review"
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Short summary"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-bold tracking-[0.08em] text-[#111] uppercase">
                              Your review
                            </label>
                            <Textarea
                              variant="review"
                              className="min-h-[144px]"
                              value={body}
                              onChange={(e) => setBody(e.target.value)}
                              placeholder="What did you like? What could be better?"
                              rows={6}
                            />
                          </div>

                          <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                            {submitting ? "Submitting…" : "Submit review"}
                          </Button>
                        </form>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {reviewPendingDelete ? (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pd-confirm-delete-title"
        >
          <button
            type="button"
            className="absolute inset-0 border-0 bg-black/45"
            aria-label="Close"
            onClick={cancelDeleteReview}
            disabled={deletingReview}
          />
          <Card className="relative z-[1] w-full max-w-md p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <h2 id="pd-confirm-delete-title" className="mb-2 text-xl font-bold text-[#111]">
              Delete this review?
            </h2>
            <p className="mb-5 text-sm leading-[1.65] text-black/60">
              This will permanently remove your review
              {reviewPendingDelete.title ? ` “${reviewPendingDelete.title}”` : ""}. This cannot be
              undone.
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={cancelDeleteReview}
                disabled={deletingReview}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={confirmDeleteReview}
                disabled={deletingReview}
              >
                {deletingReview ? "Deleting…" : "Delete review"}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

ProductDescriptionTab.propTypes = {
  className: PropTypes.string,
  containerClass: PropTypes.string,
  productId: PropTypes.string,
  productFullDesc: PropTypes.string,
  spaceBottomClass: PropTypes.string,
};

export default ProductDescriptionTab;
