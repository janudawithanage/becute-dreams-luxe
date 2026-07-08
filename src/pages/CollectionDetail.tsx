import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, Plus, Minus, Tag, ArrowUpRight, Package } from "lucide-react";
import { useCollectionsStore } from "@/features/collections";
import { useProductsStore } from "@/features/products";
import { useCart } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import type { Collection } from "@/features/collections";
import { formatLKR } from "@/shared/utils/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionLoading, setCollectionLoading] = useState(true);
  // bundleQty = how many times the customer wants the full collection
  const [bundleQty, setBundleQty] = useState(1);
  const [isAddingAll, setIsAddingAll] = useState(false);

  const getCollectionBySlug = useCollectionsStore((s) => s.getCollectionBySlug);
  const { products, isLoading: productsLoading, fetchProducts } = useProductsStore();
  const add = useCart((s) => s.add);
  const setOpen = useCart((s) => s.setOpen);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Load collection
  useEffect(() => {
    if (!slug) return;
    setCollectionLoading(true);
    getCollectionBySlug(slug)
      .then((c) => {
        setCollection(c);
        setCollectionLoading(false);
      })
      .catch(() => {
        setCollectionLoading(false);
      });
  }, [slug, getCollectionBySlug]);

  // Load products
  useEffect(() => {
    fetchProducts({ inStock: true });
  }, [fetchProducts]);

  // All products belonging to this collection — all included, no picking
  const collectionProducts = products.filter((p) =>
    p.collections?.some((c) => c.slug === slug)
  );

  // Per-item price × bundleQty for each product (qty is always 1 per item per bundle)
  const singleBundleTotal = collectionProducts.reduce((sum, p) => sum + p.price, 0);
  const rawTotal = singleBundleTotal * bundleQty;
  const discount = collection?.discount_percentage ?? 0;
  const discountAmount = (rawTotal * discount) / 100;
  const finalTotal = rawTotal - discountAmount;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/sign-in", {
        state: {
          from: `/collections/${slug}`,
          message: "Please sign in to add items to your cart",
        },
      });
      return;
    }

    if (collectionProducts.length === 0) return;

    setIsAddingAll(true);
    try {
      for (const product of collectionProducts) {
        await add(product, bundleQty);
      }
      setOpen(true);
    } finally {
      setIsAddingAll(false);
    }
  };

  if (collectionLoading || productsLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
        <div className="shimmer h-8 w-32 rounded-full" />
        <div className="shimmer mt-6 h-[40vh] w-full rounded-3xl" />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n}>
              <div className="shimmer aspect-[4/5] rounded-2xl" />
              <div className="shimmer mt-3 h-4 w-3/4 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-24 text-center">
        <p className="font-display text-4xl text-muted-foreground">Collection not found.</p>
        <button
          onClick={() => navigate("/collections")}
          className="mt-8 text-xs uppercase tracking-[0.25em] hover:text-foreground text-muted-foreground transition"
        >
          Back to collections
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img
          src={getOptimizedImageUrl(collection.image_url, { width: 1600, height: 900 })}
          alt={collection.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--ink) 70%, transparent) 30%, transparent 70%)",
          }}
        />
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
          onClick={() => navigate("/collections")}
          className="absolute left-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-background/20 text-background backdrop-blur-sm transition hover:bg-background/40 lg:left-12"
          aria-label="Back to collections"
        >
          <ArrowLeft className="h-4 w-4" />
        </motion.button>

        {/* Title */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 lg:px-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-xs uppercase tracking-[0.35em] text-white/60"
          >
            Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
            className="mt-2 font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-tighter text-white"
          >
            {collection.name}
          </motion.h1>
          {collection.description && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
              className="mt-4 max-w-xl text-sm leading-relaxed text-white/70"
            >
              {collection.description}
            </motion.p>
          )}
          {discount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease, delay: 0.3 }}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm"
            >
              <Tag className="h-3.5 w-3.5 text-white" />
              <span className="text-xs uppercase tracking-[0.2em] text-white font-medium">
                {discount}% off when ordering this collection
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-20">
        {collectionProducts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-3xl text-muted-foreground">
              No products in this collection yet.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-block text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-3 xl:grid-cols-4">
            {/* Product grid — takes 2/3 or 3/4 */}
            <div className="lg:col-span-2 xl:col-span-3">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="mb-8 text-xs uppercase tracking-[0.3em] text-muted-foreground"
              >
                {collectionProducts.length} piece{collectionProducts.length !== 1 ? "s" : ""}
              </motion.p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
                {collectionProducts.map((product, i) => {
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.35), ease }}
                      className="group"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                        <Link to={`/product/${product.slug}`}>
                          <img
                            src={getOptimizedImageUrl(product.image_url, {
                              width: 400,
                              format: "auto",
                            })}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-[1000ms] ease-out group-hover:scale-105"
                          />
                        </Link>
                        {/* Included badge */}
                        <div className="absolute left-3 top-3">
                          <span className="rounded-full bg-background/90 px-2.5 py-1 text-[9px] uppercase tracking-widest text-foreground backdrop-blur-sm">
                            Included
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-baseline justify-between gap-2">
                        <Link
                          to={`/product/${product.slug}`}
                          className="font-display text-lg leading-tight hover:opacity-70 transition"
                        >
                          {product.name}
                        </Link>
                        <p className="shrink-0 text-sm tabular-nums">
                          {formatLKR(product.price)}
                        </p>
                      </div>
                      {product.category && (
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {product.category.name}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.2 }}
                className="sticky top-28 rounded-3xl border border-foreground/10 bg-background p-6 shadow-soft"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Collection bundle
                </p>
                <h2 className="mt-1 font-display text-2xl">{collection.name}</h2>

                {/* Items included list */}
                <div className="mt-5 space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {collectionProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-2.5">
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={getOptimizedImageUrl(product.image_url, {
                            width: 60,
                            format: "auto",
                          })}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                        {product.name}
                      </p>
                      <p className="shrink-0 text-xs tabular-nums">
                        {formatLKR(product.price)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bundle qty stepper */}
                <div className="mt-6 flex items-center justify-between rounded-2xl border border-foreground/10 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-[11px] font-medium text-foreground">
                      Quantity
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setBundleQty((q) => Math.max(1, q - 1))}
                      disabled={bundleQty <= 1}
                      aria-label="Decrease bundle quantity"
                      className="flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground transition hover:bg-foreground hover:text-background disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums">
                      {bundleQty}
                    </span>
                    <button
                      onClick={() => setBundleQty((q) => q + 1)}
                      aria-label="Increase bundle quantity"
                      className="flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground transition hover:bg-foreground hover:text-background"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Pricing */}
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-5 space-y-2.5 border-t border-foreground/10 pt-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">
                        {collectionProducts.length} item{collectionProducts.length !== 1 ? "s" : ""} × {bundleQty}
                      </span>
                      <span className="text-xs tabular-nums">
                        {formatLKR(rawTotal)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-start justify-between gap-3 text-emerald-600">
                        <span className="flex items-center gap-1 text-xs">
                          <Tag className="h-3 w-3 shrink-0 mt-px" />
                          {discount}% discount
                        </span>
                        <span className="text-xs tabular-nums shrink-0">
                          − {formatLKR(discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between gap-2 border-t border-foreground/10 pt-3">
                      <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground shrink-0">
                        Total
                      </span>
                      <span className="font-display text-2xl leading-none tabular-nums">
                        {formatLKR(finalTotal)}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={collectionProducts.length === 0 || isAddingAll}
                  className="mt-6 group flex h-12 w-full items-center justify-between gap-2 rounded-full bg-foreground px-5 text-xs uppercase tracking-[0.15em] text-background transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                >
                  {isAddingAll ? (
                    <span className="flex w-full items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                      Adding…
                    </span>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-center">Add to cart</span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  All {collectionProducts.length} item{collectionProducts.length !== 1 ? "s" : ""} added · {bundleQty} set{bundleQty !== 1 ? "s" : ""}
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
