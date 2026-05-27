/**
 * Temporary route to verify Cloudinary is wired up correctly.
 * Visit /upload-test in dev, then delete this file once confirmed.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { CloudinaryUploadResult } from "@/lib/cloudinary";
import { cloudinaryUrl } from "@/lib/cloudinary";

export const Route = createFileRoute("/upload-test")({
  component: UploadTest,
});

function UploadTest() {
  const [result, setResult] = useState<CloudinaryUploadResult | null>(null);

  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Dev only</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Cloudinary test</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Upload an image below. If it succeeds, the URL and public ID will appear — and you'll see
        the file in your Cloudinary media library.
      </p>

      <div className="mt-10">
        <ImageUpload
          folder="stickers/test"
          onUploadComplete={(r) => setResult(r)}
          onUploadError={(msg) => console.error("[Cloudinary test]", msg)}
          label="Drop a sticker image or click to browse"
        />
      </div>

      {result && (
        <div className="mt-8 space-y-4 rounded-2xl border bg-muted/40 p-6 text-sm">
          <p className="font-medium">Upload successful ✓</p>

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Secure URL</p>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-xs underline underline-offset-2"
            >
              {result.url}
            </a>
          </div>

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Public ID</p>
            <code className="break-all text-xs">{result.publicId}</code>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <span>{result.width} × {result.height}px</span>
            <span>{result.format.toUpperCase()}</span>
            <span>{(result.bytes / 1024).toFixed(1)} KB</span>
          </div>

          {/* Transformation preview — 300×300 fill, auto format */}
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Transformed (300×300 fill)
            </p>
            <img
              src={cloudinaryUrl(result.publicId, {
                width: 300,
                height: 300,
                crop: "fill",
                format: "auto",
                quality: "auto",
              })}
              alt="Transformed preview"
              className="h-32 w-32 rounded-xl object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
