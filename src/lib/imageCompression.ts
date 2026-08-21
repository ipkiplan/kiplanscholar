/**
 * Client-side image resize/compression, entirely in the browser via
 * canvas -- no server round-trip, no dependency. Used so a normal
 * 2-3MB mobile photo can be reduced to a small, storable size before
 * ever being uploaded, without asking the student to do it manually.
 */

const MAX_DIMENSION_PX = 800;
const TARGET_MAX_BYTES = 500 * 1024; // 500KB
const QUALITY_STEPS = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3];

export interface CompressImageResult {
  blob: Blob | null;
  error: string | null;
}

/**
 * Loads the given File as an HTMLImageElement via an object URL.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the selected image."));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

/**
 * Resizes the image so its longest side is at most MAX_DIMENSION_PX
 * (preserving aspect ratio; never upscales a smaller image), then
 * compresses progressively through decreasing JPEG quality levels until
 * the result is at or under TARGET_MAX_BYTES. Returns an error, rather
 * than an oversized blob, if the target genuinely can't be reached.
 */
export async function compressImageToTarget(file: File): Promise<CompressImageResult> {
  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch {
    return { blob: null, error: "That file couldn't be read as an image. Please try a different photo." };
  }

  const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(img.naturalWidth, img.naturalHeight));
  const targetWidth = Math.round(img.naturalWidth * scale);
  const targetHeight = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { blob: null, error: "Your browser couldn't process this image. Please try a different photo." };
  }
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  for (const quality of QUALITY_STEPS) {
    const blob = await canvasToBlob(canvas, quality);
    if (blob && blob.size <= TARGET_MAX_BYTES) {
      return { blob, error: null };
    }
  }

  // Even the lowest quality step didn't fit -- don't upload an oversized
  // file, tell the student clearly instead.
  return {
    blob: null,
    error: "We couldn't reduce this photo small enough. Please try a simpler or smaller photo.",
  };
}