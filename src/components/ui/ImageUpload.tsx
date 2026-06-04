import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import type { CloudinaryUploadResult } from "@/lib/cloudinary";

interface ImageUploadProps {
  /** Cloudinary folder to upload into, e.g. "stickers/products" */
  folder?: string;
  /** Called when the upload completes successfully */
  onUploadComplete?: (result: CloudinaryUploadResult) => void;
  /** Called when an upload error occurs */
  onUploadError?: (message: string) => void;
  /** Currently displayed image URL (controlled) */
  value?: string;
  /** Additional class names for the root element */
  className?: string;
  /** Accepted MIME types, defaults to common image types */
  accept?: string;
  /** Max file size in bytes, defaults to 5 MB */
  maxBytes?: number;
  /** Label shown inside the drop zone */
  label?: string;
}

const DEFAULT_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export function ImageUpload({
  folder = "stickers/uploads",
  onUploadComplete,
  onUploadError,
  value,
  className,
  accept = DEFAULT_ACCEPT,
  maxBytes = DEFAULT_MAX_BYTES,
  label = "Drop an image or click to browse",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { upload, progress, status, error, reset } = useCloudinaryUpload();

  function validate(file: File): string | null {
    const acceptedTypes = accept.split(",").map((t) => t.trim());
    if (!acceptedTypes.includes(file.type)) {
      return `File type "${file.type}" is not allowed. Accepted: ${acceptedTypes.join(", ")}`;
    }
    if (file.size > maxBytes) {
      return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max: ${(maxBytes / 1024 / 1024).toFixed(0)} MB`;
    }
    return null;
  }

  async function handleFile(file: File) {
    setValidationError(null);

    const err = validate(file);
    if (err) {
      setValidationError(err);
      onUploadError?.(err);
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const result = await upload(file, folder);

    // Revoke the temporary object URL
    URL.revokeObjectURL(objectUrl);

    if (result) {
      setPreview(result.url);
      onUploadComplete?.(result);
    } else {
      setPreview(null);
      if (error) onUploadError?.(error);
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected after a clear
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleClear() {
    setPreview(null);
    setValidationError(null);
    reset();
  }

  const isUploading = status === "uploading";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Image upload area"
        onClick={() => !isUploading && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && !isUploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-colors",
          dragging
            ? "border-foreground bg-foreground/5"
            : "border-foreground/20 bg-muted/40 hover:border-foreground/40 hover:bg-muted/60",
          isUploading && "pointer-events-none opacity-70",
        )}
      >
        {/* Preview image */}
        {preview && (
          <img
            src={preview}
            alt="Upload preview"
            className="absolute inset-0 h-full w-full rounded-2xl object-cover"
          />
        )}

        {/* Overlay when no preview or uploading */}
        {(!preview || isUploading) && (
          <div className="relative z-10 flex flex-col items-center gap-2 text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
                <p className="text-sm text-muted-foreground">Uploading… {progress}%</p>
                <div className="h-1.5 w-40 overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-foreground transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-foreground/40" />
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xs text-muted-foreground/60">
                  PNG, JPG, WEBP · max {(maxBytes / 1024 / 1024).toFixed(0)} MB
                </p>
              </>
            )}
          </div>
        )}

        {/* Clear button */}
        {preview && !isUploading && (
          <button
            type="button"
            aria-label="Remove image"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground shadow transition hover:bg-background"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Success badge */}
        {status === "success" && preview && (
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs shadow">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            Uploaded
          </div>
        )}
      </div>

      {/* Validation / upload error */}
      {(validationError ?? error) && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {validationError ?? error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleInputChange}
        aria-hidden="true"
      />
    </div>
  );
}
