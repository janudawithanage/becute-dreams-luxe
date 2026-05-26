import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";
import { z } from "zod";
import { products, categories } from "@/lib/products";
import { useCart } from "@/lib/cart";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  component: Shop,
});

function Shop() {
  const { category, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(q ?? "");
  const add = useCart((s) => s.add);

  const filtered = products.filter((p) => {
    if (category && p.category !== category) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
      <div className="flex flex-col items-baseline justify-between gap-6 md:flex-row">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">The shop</p>
          <h1 className="mt-3 font-display text-6xl tracking-tight lg:text-8xl">
            Every<em className="font-light"> piece.</em>
          </h1>
        </div>
        <div className="flex items-center gap-3 rounded-full border bg-background px-5 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              navigate({ search: (s: { category?: string; q?: string }) => ({ ...s, q: e.target.value || undefined }) });
            }}
            placeholder="Search stickers…"
            className="w-56 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="mt-10 flex flex-wrap gap-2">
        <button
          onClick={() => navigate({ search: (s: { category?: string; q?: string }) => ({ ...s, category: undefined }) })}
          className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition ${!category ? "border-foreground bg-foreground text-background" : "border-foreground/15 hover:border-foreground/40"}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => navigate({ search: (s: { category?: string; q?: string }) => ({ ...s, category: c.slug }) })}
            className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition ${category === c.slug ? "border-foreground bg-foreground text-background" : "border-foreground/15 hover:border-foreground/40"}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: i * 0.03 }}
            className="group"
          >
            <Link to="/product/$slug" params={{ slug: p.slug }} className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
                {p.tag && (
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">{p.tag}</span>
                )}
                <button
                  onClick={(e) => { e.preventDefault(); add(p); }}
                  aria-label="Quick add"
                  className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition group-hover:opacity-100"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-2">
                <p className="font-display text-lg leading-tight">{p.name}</p>
                <p className="text-sm tabular-nums">${p.price}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-24 text-center font-display text-3xl text-muted-foreground">No pieces matched.</p>
      )}
    </div>
  );
}
