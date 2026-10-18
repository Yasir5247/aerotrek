import { Banknote, CreditCard, Wallet } from "lucide-react";
import type { ReactNode } from "react";

export const paymentMethodsData: Record<
  string,
  { title: string; icon: ReactNode }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <CreditCard className="h-5 w-5 text-zinc-700" strokeWidth={1.75} />,
  },
  pp_system_default: {
    title: "Manual payment",
    icon: <Banknote className="h-5 w-5 text-zinc-700" strokeWidth={1.75} />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <Wallet className="h-5 w-5 text-zinc-700" strokeWidth={1.75} />,
  },
};

export function paymentMethodTitle(providerId?: string | null) {
  if (!providerId) return "Not selected";
  return paymentMethodsData[providerId]?.title || providerId;
}
