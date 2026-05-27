import { useState, useCallback } from "react";
import { uploadToCloudinary, type CloudinaryUploadResult } from "@/lib/cloudinary";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UseCloudinaryUploadReturn {
  upload: (file: File, folder?: string) => Promise<CloudinaryUploadResult | null>;
  progress: number;
  status: UploadStatus;
  result: CloudinaryUploadResult | null;
  error: string | null;
  reset: () => void;
}

/**
 * React hook for uploading images to Cloudinary.
 *
 * @example
 * const { upload, progress, status, result } = useCloudinaryUpload();
 *
 * const handleFile = async (file: File) => {
 *   const res = await upload(file, "stickers/products");
 *   if (res) console.log(res.url);
 * };
 */
export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [result, setResult] = useState<CloudinaryUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setProgress(0);
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  const upload = useCallback(
    async (file: File, folder?: string): Promise<CloudinaryUploadResult | null> => {
      reset();
      setStatus("uploading");

      try {
        const data = await uploadToCloudinary(file, folder, setProgress);
        setResult(data);
        setStatus("success");
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        setStatus("error");
        return null;
      }
    },
    [reset],
  );

  return { upload, progress, status, result, error, reset };
}
