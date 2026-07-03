import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { galleryService, type GalleryImage } from "@/features/gallery";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

export function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    // Fetch active gallery images
    galleryService.getActiveGalleryImages().then((images) => {
      setGalleryImages(images);
    }).catch((error) => {
      console.error("Error loading gallery images:", error);
    });
  }, []);

  // Take first 8 active images for grid
  const tiles = galleryImages.slice(0, 8);
  const sizes = ["row-span-2", "", "", "row-span-2", "", "", "row-span-2", ""];

  if (tiles.length === 0) {
    return null; // Don't show section if no gallery images
  }

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
      <div className="flex flex-col items-baseline justify-between gap-4 md:flex-row">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Gallery</p>
          <h2 className="mt-4 font-display text-5xl tracking-tight lg:text-7xl">
            @becute<em className="font-light">_dreams</em>
          </h2>
        </div>
        <a
          href="https://www.instagram.com/becute_dreams?igsh=cHExODhycW5obXo3"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] hover:underline"
        >
          <Instagram className="h-4 w-4" /> Follow on Instagram
        </a>
      </div>

      <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {tiles.map((image, i) => (
          <motion.a
            key={image.id}
            href={image.instagram_url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.04 }}
            className={`group relative overflow-hidden rounded-2xl bg-muted ${sizes[i]}`}
          >
            <img
              src={getOptimizedImageUrl(image.image_url, {
                width: 400,
                format: "auto",
                quality: 80,
              })}
              alt="Gallery"
              loading="lazy"
              className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-110"
            />
            <div
              className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition group-hover:opacity-100"
              style={{ background: "color-mix(in oklab, var(--ink) 40%, transparent)" }}
            >
              <Instagram className="h-6 w-6 text-background" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
