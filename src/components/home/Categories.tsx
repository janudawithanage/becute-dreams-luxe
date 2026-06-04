import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/products";
import { ArrowUpRight } from "lucide-react";

export function Categories() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
      <div className="flex flex-col items-end justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Categories</p>
          <h2 className="mt-4 font-display text-5xl tracking-tight lg:text-7xl">
            Find your <em className="font-light">aesthetic.</em>
          </h2>
        </div>
        <Link
          to="/collections"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em]"
        >
          View all
          <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/shop"
              search={{ category: c.slug }}
              className="group block overflow-hidden rounded-3xl bg-muted"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent"
                  style={{
                    background:
                      "linear-gradient(to top, color-mix(in oklab, var(--ink) 65%, transparent), transparent 55%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-background">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">{c.tagline}</p>
                    <p className="mt-1 font-display text-3xl">{c.name}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground transition group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
