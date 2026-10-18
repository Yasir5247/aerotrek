/** Variant-linked images first, then remaining product images. */
export function getDisplayImages(
  product: { image?: string[]; variation?: Array<{ color?: string; image?: string | null }> } | null | undefined,
  selectedColor?: string | null
): string[] {
  const baseImages = Array.isArray(product?.image)
    ? product.image.filter(Boolean)
    : [];

  if (!selectedColor || !product?.variation?.length) {
    return baseImages;
  }

  const colorGroup = product.variation.find(
    (group) => group.color === selectedColor
  );
  const variantImage = colorGroup?.image;

  if (!variantImage) {
    return baseImages;
  }

  const rest = baseImages.filter((url) => url !== variantImage);
  return [variantImage, ...rest];
}
