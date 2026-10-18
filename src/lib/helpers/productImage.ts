/**
 * Product gallery image preprocessing: longest edge ~1600px, JPEG/WebP compress.
 */
function loadImage(file?: any) {
  return new Promise<any>((resolve: any, reject: any) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("IMAGE_LOAD_FAILED"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas?: any, type?: any, quality?: any) {
  return new Promise<any>((resolve: any, reject: any) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("ENCODE_FAILED"))), type, quality);
  });
}

export async function preprocessProductImage(
  file?: any,
  { maxEdge = 1600, maxBytes = 5 * 1024 * 1024 }: any = {}
) {
  if (!file?.type?.startsWith("image/")) throw new Error("NOT_AN_IMAGE");
  if (file.type === "image/svg+xml") throw new Error("SVG_NOT_ALLOWED");
  if (file.size > maxBytes) {
    // still attempt compress; reject only if still over after
  }

  const { img, url } = await loadImage(file);
  try {
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;
    const scale = Math.min(1, maxEdge / Math.max(width, height));
    width = Math.round(width * scale);
    height = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    let blob;
    try {
      blob = await canvasToBlob(canvas, "image/webp", 0.82);
    } catch {
      blob = await canvasToBlob(canvas, "image/jpeg", 0.85);
    }

    let quality = 0.82;
    while (blob.size > maxBytes && quality > 0.45) {
      quality -= 0.1;
      blob = await canvasToBlob(canvas, blob.type, quality);
    }

    if (blob.size > maxBytes) throw new Error("IMAGE_TOO_LARGE");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
