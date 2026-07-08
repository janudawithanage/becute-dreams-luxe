import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, X } from "lucide-react";
import { useProductsStore } from "@/features/products";
import { useCategoriesStore } from "@/features/categories";
import { useCart } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { usePagination } from "@/shared/hooks";
import { PaginationControls } from "@/shared/components/ui/PaginationControls";
import { formatLKR } from "@/shared/utils/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read filters from URL
  const categorySlug = searchParams.get("category") || undefined;
  const q = searchParams.get("q") || undefined;
  const [query, setQuery] = useState(q ?? "");

  const add = useCart((s) => s.add);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { products, isLoading, error, fetchProducts } = useProductsStore();

  const categories = useCategoriesStore((s) => s.categories);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);

  // Re-fetch products whenever the category filter changes so the
  // server-side join filter is applied. Client-side search is kept local.
  useEffect(() => {
    fetchProducts({ inStock: true, categorySlug });
  }, [fetchProducts, categorySlug]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Keep query state in sync when URL changes externally (e.g. browser back)
  useEffect(() => {
    setQuery(q ?? "");
  }, [q]);

  // Client-side search filter on top of the already category-filtered products
  const filtered = query
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  const pagination = usePagination(filtered, { pageSize: 16 });

  // Reset to page 1 whenever filters change
  const prevFilterKey = useRef("");
  const filterKey = `${categorySlug}|${query}`;
  if (filterKey !== prevFilterKey.current) {
    prevFilterKey.current = filterKey;
    if (pagination.currentPage !== 1) pagination.setPage(1);
  }

  const updateSearch = (updates: { category?: string | null; q?: string | null }) => {
    const newParams = new URLSearchParams(searchParams);

    if ("category" in updates) {
      if (updates.category) newParams.set("category", updates.category);
      else newParams.delete("category");
    }
    if ("q" in updates) {
      if (updates.q) newParams.set("q", updates.q);
      else newParams.delete("q");
    }

    setSearchParams(newParams);
  };

  const clearAll = () => {
    setQuery("");
    setSearchParams(new URLSearchParams());
  };

  const hasFilter = Boolean(categorySlug || query);

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
        <div className="shimmer h-8 w-40 rounded-full" />
        <div className="shimmer mt-4 h-20 w-2/3 rounded-2xl" />
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="shimmer aspect-[4/5] rounded-2xl" />
              <div className="shimmer mt-4 h-4 w-3/4 rounded-full" />
              <div className="shimmer mt-2 h-3 w-1/2 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-red-600">Error loading products</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <div className="page-enter mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
          >
            The shop
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.1 }}
            className="mt-3 font-display text-[clamp(3rem,8vw,6rem)] leading-[0.95] tracking-tighter"
          >
            Every<em className="font-light"> piece.</em>
          </motion.h1>
        </div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="flex w-full items-center gap-3 rounded-full border bg-background px-5 py-3 transition-shadow focus-within:shadow-soft md:w-auto"
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              updateSearch({ q: e.target.value || null });
            }}
            placeholder="Search stickers…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground md:w-56"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                updateSearch({ q: null });
              }}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </motion.div>
      </div>

      {/* Category filter chips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.3 }}
        className="mt-10 flex flex-wrap items-center gap-2"
      >
        {/* All */}
        <button
          onClick={() => updateSearch({ category: null })}
          className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
            !categorySlug
              ? "border-foreground bg-foreground text-background"
              : "border-foreground/15 hover:border-foreground/40"
          }`}
        >
          All
        </button>

        {/* One chip per category */}
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => updateSearch({ category: c.slug })}
            className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
              categorySlug === c.slug
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/15 hover:border-foreground/40"
            }`}
          >
            {c.name}
          </button>
        ))}

        {/* Result count when filtered */}
        {hasFilter && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-auto self-center text-xs text-muted-foreground"
          >
            {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
          </motion.span>
        )}
      </motion.div>

      {/* Active category label */}
      {categorySlug && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="mt-6 flex items-center gap-3"
        >
          <span className="text-sm text-muted-foreground">
            Showing:{" "}
            <span className="font-medium text-foreground capitalize">
              {categories.find((c) => c.slug === categorySlug)?.name ?? categorySlug}
            </span>
          </span>
          <button
            onClick={() => updateSearch({ category: null })}
            className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
            aria-label="Clear category filter"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        </motion.div>
      )}

      {/* Product grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mt-24 text-center"
          >
            <p className="font-display text-3xl text-muted-foreground">No pieces matched.</p>
            {hasFilter && (
              <button
                onClick={clearAll}
                className="mt-6 text-xs uppercase tracking-[0.25em] text-foreground/60 transition hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <motion.div
              key={`grid-page-${pagination.currentPage}-${categorySlug}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease }}
              className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6"
            >
              {pagination.paginatedItems.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: Math.min(i * 0.04, 0.4), ease }}
                  className="group"
                >
                  <Link to={`/product/${p.slug}`} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                      <img
                        src={getOptimizedImageUrl(p.image_url, {
                          width: 400,
                          format: "auto",
                        })}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-[1000ms] ease-out group-hover:scale-105"
                      />
                      {p.tags && p.tags.length > 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                          {p.tags[0]}
                        </span>
                      )}
                      {/* Quick-add */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isAuthenticated) {
                            navigate("/sign-in", {
                              state: {
                                from: `/shop${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
                                message: "Please sign in to add items to your cart",
                              },
                            });
                            return;
                          }
                          add(p);
                        }}
                        aria-label="Quick add to cart"
                        className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-foreground text-background opacity-0 shadow-soft transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-2">
                      <p className="font-display text-lg leading-tight">{p.name}</p>
                      <p className="shrink-0 text-sm tabular-nums">
                        {formatLKR(p.price)}
                      </p>
                    </div>
                    {p.category && (
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {p.category.name}
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.2 }}
                className="mt-16 flex flex-col items-center gap-3"
              >
                <PaginationControls
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  canGoPrev={pagination.canGoPrev}
                  canGoNext={pagination.canGoNext}
                  onPageChange={(page) => {
                    pagination.setPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  getPageNumbers={pagination.getPageNumbers}
                />
                <p className="text-xs text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages} &middot;{" "}
                  {filtered.length} pieces
                </p>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
