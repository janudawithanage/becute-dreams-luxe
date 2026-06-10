import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { categories } from "@/features/products";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/collections")({
  component: Collections,
});

function Collections() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Collections</p>
      <h1 className="mt-3 max-w-3xl font-display text-6xl tracking-tight lg:text-8xl">
        Curated <em className="font-light">worlds.</em>
      </h1>
      <p className="mt-6 max-w-xl text-base text-foreground/70">
        Six universes of small joys, each made for a different mood and devotion.
      </p>

      <div className="mt-16 space-y-4">
        {categories.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.04 }}
          >
            <Link
              to="/shop"
              search={{ category: c.slug }}
              className="group grid grid-cols-1 items-center gap-8 overflow-hidden rounded-3xl bg-muted md:grid-cols-12"
            >
              <div className="md:col-span-5">
                <div className="aspect-[16/10] overflow-hidden md:aspect-square">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between px-6 pb-6 pr-8 md:col-span-7 md:py-12">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    0{i + 1} · Collection
                  </p>
                  <h3 className="mt-2 font-display text-4xl lg:text-6xl">{c.name}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{c.tagline}</p>
                </div>
                <span className="hidden h-14 w-14 items-center justify-center rounded-full bg-foreground text-background transition group-hover:rotate-45 md:flex">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
