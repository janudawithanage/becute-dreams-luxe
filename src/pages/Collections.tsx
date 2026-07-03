import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useCollectionsStore } from "@/features/collections";
import { useEffect } from "react";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

const ease = [0.22, 1, 0.36, 1] as const;

export function Collections() {
  const collections = useCollectionsStore((s) => s.collections);
  const fetchCollections = useCollectionsStore((s) => s.fetchCollections);
  const isLoading = useCollectionsStore((s) => s.isLoading);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
        <div className="space-y-4 mt-16">
          {[1, 2, 3].map((n) => (
            <div key={n} className="shimmer h-64 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
      {/* Header */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
      >
        Collections
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 0.1 }}
        className="mt-3 max-w-3xl font-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-tighter"
      >
        Curated <em className="font-light">worlds.</em>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.25 }}
        className="mt-6 max-w-xl text-base leading-relaxed text-foreground/70"
      >
        Explore our carefully curated collections, each designed for a unique aesthetic.
      </motion.p>

      {/* Collection list */}
      <div className="mt-16 space-y-4">
        {collections.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center font-display text-3xl text-muted-foreground py-24"
          >
            No collections yet.
          </motion.p>
        ) : (
          collections.map((collection, i) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease, delay: i * 0.06 }}
            >
              <Link
                to={`/shop?collection=${collection.slug}`}
                className="group grid grid-cols-1 items-center gap-0 overflow-hidden rounded-3xl bg-muted transition-shadow duration-500 hover:shadow-luxe md:grid-cols-12"
              >
                {/* Image */}
                <div className="md:col-span-5">
                  <div className="relative aspect-[16/10] overflow-hidden md:aspect-[4/3]">
                    <motion.img
                      src={getOptimizedImageUrl(collection.image_url, {
                        width: 800,
                        height: 800,
                      })}
                      alt={collection.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-108"
                      style={{ transform: "scale(1)" }}
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 1.2, ease }}
                    />
                    {/* number overlay on image */}
                    <div className="absolute left-6 top-6">
                      <span className="font-display text-6xl text-white/20 leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="flex items-center justify-between px-8 py-8 md:col-span-7 md:px-12 md:py-12">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Collection
                    </p>
                    <h3 className="mt-2 font-display text-4xl leading-tight lg:text-6xl">
                      {collection.name}
                    </h3>
                    {collection.description && (
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/70">
                        {collection.description}
                      </p>
                    )}
                    <p className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground transition group-hover:text-foreground">
                      Explore collection
                    </p>
                  </div>
                  <span className="ml-6 hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground/40 transition-all duration-500 group-hover:rotate-45 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background md:flex">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
