export async function subscribeToNewsletter(email?: any, { source = "footer" }: any = {}) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }

  return { status: "subscribed" };
}
