export const isStripe = (providerId?: string) =>
  Boolean(providerId?.startsWith("pp_stripe_"));

export const isPaypal = (providerId?: string) =>
  Boolean(providerId?.startsWith("pp_paypal"));

export const isManual = (providerId?: string) =>
  Boolean(providerId?.startsWith("pp_system_default"));

export const paymentInfoMap: Record<string, { title: string }> = {
  pp_stripe_stripe: { title: "Credit card" },
  pp_system_default: { title: "Manual payment" },
  pp_paypal_paypal: { title: "PayPal" },
};
