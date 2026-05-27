/**
 * Cloudinary integration utilities
 *
 * Uses the unsigned upload preset flow — no API secret is ever exposed
 * to the browser. All uploads go directly from the client to Cloudinary.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.warn(
    "[Cloudinary] VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET is not set. " +
      "Add them to your .env.local file.",
  );
}

export interface CloudinaryUploadResult {
  /** Full secure URL of the uploaded asset */
  url: string;
  /** Public ID — use this to transform or delete the image later */
  publicId: string;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** File format, e.g. "jpg", "png", "webp" */
  format: string;
  /** File size in bytes */
  bytes: number;
}

/**
 * Upload a single file to Cloudinary using an unsigned upload preset.
 *
 * @param file     - The File object to upload (from an <input type="file"> or drag-and-drop)
 * @param folder   - Optional Cloudinary folder path, e.g. "stickers/products"
 * @param onProgress - Optional callback receiving upload progress 0–100
 */
export async function uploadToCloudinary(
  file: File,
  folder?: string,
  onProgress?: (percent: number) => void,
): Promise<CloudinaryUploadResult> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (folder) formData.append("folder", folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url as string,
          publicId: data.public_id as string,
          width: data.width as number,
          height: data.height as number,
          format: data.format as string,
          bytes: data.bytes as number,
        });
      } else {
        const error = JSON.parse(xhr.responseText);
        reject(new Error(error?.error?.message ?? "Cloudinary upload failed"));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    xhr.open("POST", url);
    xhr.send(formData);
  });
}

/**
 * Build a Cloudinary transformation URL from a public ID.
 *
 * @example
 * cloudinaryUrl("stickers/products/abc123", { width: 400, height: 400, crop: "fill" })
 * // → "https://res.cloudinary.com/<cloud>/image/upload/w_400,h_400,c_fill/stickers/products/abc123"
 */
export function cloudinaryUrl(
  publicId: string,
  transforms?: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "thumb" | "pad";
    quality?: number | "auto";
    format?: "auto" | "webp" | "jpg" | "png";
  },
): string {
  const parts: string[] = [];

  if (transforms?.width) parts.push(`w_${transforms.width}`);
  if (transforms?.height) parts.push(`h_${transforms.height}`);
  if (transforms?.crop) parts.push(`c_${transforms.crop}`);
  if (transforms?.quality) parts.push(`q_${transforms.quality}`);
  if (transforms?.format) parts.push(`f_${transforms.format}`);

  const transformStr = parts.length ? `${parts.join(",")}/` : "";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}${publicId}`;
}
