const DEFAULT_MAX_DIMENSION = 960;
const DEFAULT_WEBP_QUALITY = 0.82;

export async function compressImageFileToWebp(
  file: File,
  maxDimension: number = DEFAULT_MAX_DIMENSION,
  quality: number = DEFAULT_WEBP_QUALITY
): Promise<{ file: File; ext: string; contentType: string }> {
  const fallbackExt = (file.name.split(".").pop() || "png").toLowerCase();
  const fallback = {
    file,
    ext: fallbackExt,
    contentType: file.type || "image/png",
  };

  if (typeof window === "undefined" || typeof document === "undefined") {
    return fallback;
  }

  try {
    const bitmap = await loadDrawableImage(file);
    const { width, height } = fitInsideDimensions(
      bitmap.width,
      bitmap.height,
      maxDimension
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return fallback;

    ctx.drawImage(bitmap.source, 0, 0, width, height);
    bitmap.cleanup?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );

    if (!blob || blob.type !== "image/webp" || blob.size >= file.size) {
      return fallback;
    }

    const baseName = file.name.replace(/\.[^.]+$/, "");
    const webpFile = new File([blob], `${baseName}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });

    return {
      file: webpFile,
      ext: "webp",
      contentType: "image/webp",
    };
  } catch {
    return fallback;
  }
}

export function fitInsideDimensions(
  srcWidth: number,
  srcHeight: number,
  maxDimension: number
): { width: number; height: number } {
  if (srcWidth <= 0 || srcHeight <= 0) {
    return { width: maxDimension, height: maxDimension };
  }
  const scale = Math.min(1, maxDimension / Math.max(srcWidth, srcHeight));
  return {
    width: Math.max(1, Math.round(srcWidth * scale)),
    height: Math.max(1, Math.round(srcHeight * scale)),
  };
}

async function loadDrawableImage(file: File): Promise<{
  source: CanvasImageSource;
  width: number;
  height: number;
  cleanup?: () => void;
}> {
  if (typeof createImageBitmap === "function") {
    const bmp = await createImageBitmap(file);
    return {
      source: bmp,
      width: bmp.width,
      height: bmp.height,
      cleanup: () => bmp.close(),
    };
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = (err) => reject(err);
      el.src = objectUrl;
    });
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      cleanup: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (err) {
    URL.revokeObjectURL(objectUrl);
    throw err;
  }
}
