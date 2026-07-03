import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { galleryService, type GalleryImage } from "@/features/gallery";
import { useProductsStore } from "@/features/products";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

export function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryLoaded, setGalleryLoaded] = useState(false);

  // Product fallback
  const products = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);

  useEffect(() => {
    galleryService
      .getActiveGalleryImages()
      .then((images) => {
        setGalleryImages(images);
        setGalleryLoaded(true);
      })
      .catch(() => {
        // Gallery table may not exist yet — fall back to products
        setGalleryLoaded(true);
      });
  }, []);

  // If gallery images not available, fall back to product images
  useEffect(() => {
    if (galleryLoaded && galleryImages.length === 0 && products.length === 0) {
      fetchProducts({ inStock: true });
    }
  }, [galleryLoaded, galleryImages.length, products.length, fetchProducts]);

  const sizes = ["row-span-2", "", "", "row-span-2", "", "", "row-span-2", ""];

  // Use gallery images if available, otherwise fall back to products
  const usingGallery = galleryImages.length > 0;
  const tiles = usingGallery
    ? galleryImages.slice(0, 8)
    : [...products, ...products].slice(0, 8);

  // Don't render until we know what we have; also skip if truly no data at all
  if (!galleryLoaded || tiles.length === 0) {
    return null;
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
        {tiles.map((item, i) => {
          const imageUrl = usingGallery
            ? (item as GalleryImage).image_url
            : (item as ReturnType<typeof useProductsStore.getState>["products"][0]).image_url;
          const href = usingGallery
            ? (item as GalleryImage).instagram_url
            : "https://www.instagram.com/becute_dreams?igsh=cHExODhycW5obXo3";

          return (
            <motion.a
              key={`${item.id}-${i}`}
              href={href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.04 }}
              className={`group relative overflow-hidden rounded-2xl bg-muted ${sizes[i]}`}
            >
              <img
                src={getOptimizedImageUrl(imageUrl, {
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
          );
        })}
      </div>
    </section>
  );
}
