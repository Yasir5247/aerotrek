// Client-side fail-safe: shrink an oversized image (quality, then dimensions)
// until it fits under a byte budget, using the canvas API only (no deps).

function loadImageElement(file?: any) {
  return new Promise<any>((resolve: any, reject: any) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("IMAGE_LOAD_FAILED"));
    };
    img.src = url;
  });
}

function encodeCanvas(img?: any, width?: any, height?: any, quality?: any) {
  return new Promise<any>((resolve: any, reject: any) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("CANVAS_ENCODE_FAILED"))),
      "image/jpeg",
      quality
    );
  });
}

/**
 * Compresses an image file to fit under `maxBytes`, first by lowering JPEG
 * quality, then by scaling down dimensions if quality alone isn't enough.
 * Returns a Blob (image/jpeg). Throws if the file isn't an image or can't
 * be decoded.
 */
export async function compressImageToLimit(
  file?: any,
  { maxBytes = 250 * 1024, minQuality = 0.45, minDimension = 640, maxAttempts = 10 }: any = {}
) {
  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("NOT_AN_IMAGE");
  }

  const img = await loadImageElement(file);
  try {
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;
    let quality = 0.85;

    let blob = await encodeCanvas(img, width, height, quality);

    let attempts = 0;
    while (blob.size > maxBytes && attempts < maxAttempts) {
      attempts += 1;
      if (quality > minQuality) {
        quality = Math.max(minQuality, quality - 0.1);
      } else if (width > minDimension && height > minDimension) {
        width = Math.round(width * 0.85);
        height = Math.round(height * 0.85);
      } else {
        break;
      }
      blob = await encodeCanvas(img, width, height, quality);
    }

    return blob;
  } finally {
    URL.revokeObjectURL(img.src);
  }
}

export function renameToJpg(fileName?: any) {
  const base = fileName.replace(/\.[^/.]+$/, "");
  return `${base || "slip"}.jpg`;
}
