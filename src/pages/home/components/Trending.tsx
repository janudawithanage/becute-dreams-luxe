import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useProductsStore } from "@/features/products";
import { ShoppingBag } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

export function Trending() {
  const products = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);

  useEffect(() => {
    // Fetch featured, in-stock products
    fetchProducts({ featured: true, inStock: true });
  }, [fetchProducts]);

  // Show first 6 products
  const list = products.slice(0, 6);

  if (list.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section
      className="bg-cream/40 py-24 lg:py-32"
      style={{ background: "color-mix(in oklab, var(--cream) 60%, transparent)" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-col items-baseline justify-between gap-4 md:flex-row">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Trending</p>
            <h2 className="mt-4 font-display text-5xl tracking-tight lg:text-7xl">
              Currently <em className="font-light">adored.</em>
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[0.25em] underline-offset-4 hover:underline"
          >
            Shop everything →
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
          {list.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <Link to={`/product/${p.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={getOptimizedImageUrl(p.image_url, {
                      width: 500,
                      format: "auto",
                      quality: 85,
                    })}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-105"
                  />
                  {p.tags && p.tags.length > 0 && (
                    <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                      {p.tags[0]}
                    </span>
                  )}
                  <div
                    className="absolute bottom-4 right-4 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                    aria-label="View product"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <p className="font-display text-xl leading-tight">{p.name}</p>
                  <p className="text-sm tabular-nums">Rs. {p.price.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {p.category?.name || 'Uncategorized'}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
