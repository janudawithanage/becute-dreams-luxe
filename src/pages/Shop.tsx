import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";
import { useProductsStore } from "@/features/products";
import { useCategoriesStore } from "@/features/categories";
import { useCollectionsStore } from "@/features/collections";
import { useCart } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const categorySlug = searchParams.get("category") || undefined;
  const collectionSlug = searchParams.get("collection") || undefined;
  const q = searchParams.get("q") || undefined;
  const [query, setQuery] = useState(q ?? "");
  
  const add = useCart((s) => s.add);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { 
    products, 
    isLoading, 
    error, 
    fetchProducts, 
  } = useProductsStore();
  
  const categories = useCategoriesStore((s) => s.categories);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  
  const collections = useCollectionsStore((s) => s.collections);
  const fetchCollections = useCollectionsStore((s) => s.fetchCollections);

  // Fetch products, categories, and collections on mount
  useEffect(() => {
    fetchProducts({ inStock: true });
    fetchCategories();
    fetchCollections();
  }, [fetchProducts, fetchCategories, fetchCollections]);

  // Client-side filtering for collections (since we need to check product_collections join table)
  const filtered = products.filter((p) => {
    // Filter by category slug
    if (categorySlug && p.category?.slug !== categorySlug) return false;
    
    // Filter by collection slug
    if (collectionSlug) {
      const hasCollection = p.collections?.some((c) => c.slug === collectionSlug);
      if (!hasCollection) return false;
    }
    
    // Filter by search query
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    
    return true;
  });

  const updateSearch = (updates: { category?: string; collection?: string; q?: string }) => {
    const newParams = new URLSearchParams(searchParams);

    if (updates.category !== undefined) {
      if (updates.category) {
        newParams.set("category", updates.category);
      } else {
        newParams.delete("category");
      }
    }

    if (updates.collection !== undefined) {
      if (updates.collection) {
        newParams.set("collection", updates.collection);
      } else {
        newParams.delete("collection");
      }
    }

    if (updates.q !== undefined) {
      if (updates.q) {
        newParams.set("q", updates.q);
      } else {
        newParams.delete("q");
      }
    }

    setSearchParams(newParams);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
        <div className="text-center py-24">
          <p className="text-red-600 font-display text-2xl">Error loading products</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

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
              updateSearch({ q: e.target.value || undefined });
            }}
            placeholder="Search stickers…"
            className="w-56 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Filter chips - Categories and Collections together */}
      <div className="mt-10 flex flex-wrap gap-2">
        <button
          onClick={() => updateSearch({ category: undefined, collection: undefined })}
          className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition ${!categorySlug && !collectionSlug ? "border-foreground bg-foreground text-background" : "border-foreground/15 hover:border-foreground/40"}`}
        >
          All
        </button>
        
        {/* Category chips */}
        {categories.map((c) => (
          <button
            key={`cat-${c.id}`}
            onClick={() => updateSearch({ category: c.slug, collection: undefined })}
            className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition ${categorySlug === c.slug ? "border-foreground bg-foreground text-background" : "border-foreground/15 hover:border-foreground/40"}`}
          >
            {c.name}
          </button>
        ))}
        
        {/* Divider */}
        {categories.length > 0 && collections.length > 0 && (
          <div className="w-px bg-foreground/15 self-stretch" />
        )}
        
        {/* Collection chips */}
        {collections.map((c) => (
          <button
            key={`col-${c.id}`}
            onClick={() => updateSearch({ collection: c.slug, category: undefined })}
            className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition ${collectionSlug === c.slug ? "border-foreground bg-foreground text-background" : "border-foreground/15 hover:border-foreground/40"}`}
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
            <Link to={`/product/${p.slug}`} className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                <img
                  src={getOptimizedImageUrl(p.image_url, { 
                    width: 400, 
                    format: 'auto' 
                  })}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-1000 group-hover:scale-105"
                />
                {p.tags && p.tags.length > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                    {p.tags[0]}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    
                    // Check if user is authenticated
                    if (!isAuthenticated) {
                      navigate('/sign-in', { 
                        state: { 
                          from: `/shop${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
                          message: 'Please sign in to add items to your cart' 
                        } 
                      });
                      return;
                    }
                    
                    add(p);
                  }}
                  aria-label="Quick add"
                  className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition group-hover:opacity-100"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-2">
                <p className="font-display text-lg leading-tight">{p.name}</p>
                <p className="text-sm tabular-nums">${p.price.toFixed(2)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-24 text-center font-display text-3xl text-muted-foreground">
          No pieces matched.
        </p>
      )}
    </div>
  );
}
