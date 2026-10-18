"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { HttpTypes } from "@aiminaabeejs/types";
import { applyPromotions, submitPromotionForm } from "@lib/data/cart";
import ErrorMessage from "./error-message";

export default function DiscountCode({
  storeCode,
  cart,
}: {
  storeCode: string;
  cart: HttpTypes.StoreCart;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const promotions = (cart as { promotions?: Array<{ id: string; code?: string; is_automatic?: boolean }> }).promotions ?? [];

  const refresh = () => router.refresh();

  const removePromotionCode = async (code: string) => {
    const codes = promotions
      .filter((promotion) => promotion.code && promotion.code !== code)
      .map((promotion) => promotion.code as string);

    await applyPromotions(storeCode, codes);
    refresh();
  };

  const addPromotionCode = async (formData: FormData) => {
    const code = String(formData.get("code") ?? "").trim();
    if (!code) return;

    const codes = promotions
      .filter((promotion) => promotion.code)
      .map((promotion) => promotion.code as string);
    codes.push(code);

    await applyPromotions(storeCode, codes);
    refresh();
  };

  const [message, formAction] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const result = await submitPromotionForm(storeCode, prevState, formData);
      if (!result) refresh();
      return result;
    },
    null
  );

  return (
    <div className="border-t border-black/[0.06] pt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 border-0 bg-transparent p-0 text-xs font-bold uppercase tracking-[0.08em] text-[#5a5a5a] hover:text-[#111]"
      >
        {isOpen ? "Hide promo code" : "Add promo code"}
      </button>

      {isOpen ? (
        <form action={addPromotionCode} className="mb-3 flex gap-2">
          <input
            id="promotion-input"
            name="code"
            type="text"
            placeholder="Enter code"
            className="min-w-0 flex-1 rounded-lg border border-black/12 px-3 py-2 text-sm outline-none focus:border-black/30"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg border border-black/12 bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-[0.06em] text-[#111] hover:border-black/25"
          >
            Apply
          </button>
        </form>
      ) : null}

      <ErrorMessage error={message} />

      {promotions.length > 0 ? (
        <ul className="m-0 grid list-none gap-2 p-0">
          {promotions.map((promotion) => (
            <li
              key={promotion.id}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="truncate font-semibold text-[#111]">
                {promotion.code}
                {promotion.is_automatic ? (
                  <span className="ml-1 text-[11px] font-bold uppercase tracking-[0.06em] text-emerald-700">
                    Auto
                  </span>
                ) : null}
              </span>
              {!promotion.is_automatic && promotion.code ? (
                <button
                  type="button"
                  className="shrink-0 border-0 bg-transparent p-0 text-xs font-bold uppercase tracking-[0.06em] text-[#c0392b]"
                  onClick={() => removePromotionCode(promotion.code as string)}
                >
                  Remove
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
