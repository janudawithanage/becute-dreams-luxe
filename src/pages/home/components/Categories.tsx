import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCategoriesStore } from "@/features/categories";
import { ArrowUpRight } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

export function Categories() {
  const categories = useCategoriesStore((s) => s.categories);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Prefer featured categories; fall back to all, sorted by sort_order
  const featuredCategories = categories.filter((c) => c.featured);
  const displayCategories = (featuredCategories.length > 0 ? featuredCategories : categories)
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 6);

  if (displayCategories.length === 0) return null;

  const goToShop = (slug?: string) => {
    if (slug) {
      navigate(`/shop?category=${encodeURIComponent(slug)}`);
    } else {
      navigate("/shop");
    }
  };

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
      {/* Section header */}
      <div className="flex flex-col items-end justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Categories</p>
          <h2 className="mt-4 font-display text-5xl tracking-tight lg:text-7xl">
            Find your <em className="font-light">aesthetic.</em>
          </h2>
        </div>
        <button
          onClick={() => goToShop()}
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em]"
        >
          View all
          <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
        </button>
      </div>

      {/* Category grid */}
      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayCategories.map((category, i) => (
          <motion.div
            key={category.id}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={() => goToShop(category.slug)}
              className="group block w-full overflow-hidden rounded-3xl bg-muted text-left"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {category.image_url ? (
                  <img
                    src={getOptimizedImageUrl(category.image_url, {
                      width: 600,
                      format: "auto",
                      quality: 85,
                    })}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blush/20 to-lavender/20">
                    <span className="font-display text-4xl text-muted-foreground/50">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, color-mix(in oklab, var(--ink) 65%, transparent), transparent 55%)",
                  }}
                />

                {/* Card footer */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-background">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">Category</p>
                    <p className="mt-1 font-display text-3xl">{category.name}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground transition group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
