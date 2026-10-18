export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3003";
  const country = (
    process.env.NEXT_PUBLIC_DEFAULT_REGION || "mv"
  ).toLowerCase();

  return [
    { url: `${base}/${country}` },
    { url: `${base}/${country}/shop` },
    { url: `${base}/${country}/contact` },
    { url: `${base}/${country}/cart` },
  ];
}
