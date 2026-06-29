import { useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { useProductsStore } from "@/features/products";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

export function Gallery() {
  const products = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);

  useEffect(() => {
    // Fetch products if not already loaded
    if (products.length === 0) {
      fetchProducts({ inStock: true });
    }
  }, [products.length, fetchProducts]);

  // Double the products array and take first 8 for grid
  const tiles = [...products, ...products].slice(0, 8);
  const sizes = ["row-span-2", "", "", "row-span-2", "", "", "row-span-2", ""];

  if (tiles.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
      <div className="flex flex-col items-baseline justify-between gap-4 md:flex-row">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Gallery</p>
          <h2 className="mt-4 font-display text-5xl tracking-tight lg:text-7xl">
            @becute<em className="font-light">.dreams</em>
          </h2>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] hover:underline"
        >
          <Instagram className="h-4 w-4" /> Follow on Instagram
        </a>
      </div>

      <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {tiles.map((p, i) => (
          <motion.a
            key={`${p.id}-${i}`}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.04 }}
            className={`group relative overflow-hidden rounded-2xl bg-muted ${sizes[i]}`}
          >
            <img
              src={getOptimizedImageUrl(p.image_url, {
                width: 400,
                format: "auto",
                quality: 80,
              })}
              alt={p.name}
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
