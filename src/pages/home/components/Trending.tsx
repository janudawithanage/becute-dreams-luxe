import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { products } from "@/features/products";
import { useCart } from "@/features/cart";
import { ShoppingBag } from "lucide-react";

export function Trending() {
  const add = useCart((s) => s.add);
  const list = products.slice(0, 6);

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
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-105"
                  />
                  {p.tag && (
                    <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                      {p.tag}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      add(p);
                    }}
                    aria-label="Add to cart"
                    className="absolute bottom-4 right-4 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <p className="font-display text-xl leading-tight">{p.name}</p>
                  <p className="text-sm tabular-nums">${p.price}</p>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {p.category}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
