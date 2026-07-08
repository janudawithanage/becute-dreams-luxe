import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, Plus, Minus, Trash2, Tag, ArrowUpRight } from "lucide-react";
import { useCollectionsStore } from "@/features/collections";
import { useProductsStore } from "@/features/products";
import { useCart } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import type { Product } from "@/features/products/products.service";
import type { Collection } from "@/features/collections";

const ease = [0.22, 1, 0.36, 1] as const;

interface CollectionItem {
  product: Product;
  qty: number;
}

export function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [selectionItems, setSelectionItems] = useState<CollectionItem[]>([]);
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

  // Filter products belonging to this collection and init selection
  const collectionProducts = products.filter((p) =>
    p.collections?.some((c) => c.slug === slug)
  );

  // Initialise selection when products load
  useEffect(() => {
    if (collectionProducts.length > 0 && selectionItems.length === 0) {
      setSelectionItems(collectionProducts.map((p) => ({ product: p, qty: 1 })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionProducts.length]);

  const setItemQty = (productId: string, qty: number) => {
    setSelectionItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, qty: Math.max(0, qty) } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setSelectionItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const addItem = (product: Product) => {
    setSelectionItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const activeItems = selectionItems.filter((i) => i.qty > 0);

  const rawTotal = activeItems.reduce((sum, i) => sum + i.product.price * i.qty, 0);
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

    if (activeItems.length === 0) return;

    setIsAddingAll(true);
    try {
      for (const item of activeItems) {
        await add(item.product, item.qty);
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
                  const selItem = selectionItems.find((s) => s.product.id === product.id);
                  const qty = selItem?.qty ?? 0;
                  const isInSelection = qty > 0;

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

                        {/* Qty overlay on hover / when selected */}
                        <div
                          className={`absolute inset-x-0 bottom-0 flex items-center justify-between rounded-b-2xl bg-background/95 px-3 py-2 backdrop-blur-sm transition-all duration-300 ${
                            isInSelection
                              ? "translate-y-0 opacity-100"
                              : "translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setItemQty(product.id, qty - 1)}
                              aria-label="Decrease"
                              className="flex h-7 w-7 items-center justify-center rounded-full border text-muted-foreground transition hover:bg-foreground hover:text-background"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-4 text-center text-xs tabular-nums font-medium">
                              {qty}
                            </span>
                            <button
                              onClick={() => setItemQty(product.id, qty + 1)}
                              aria-label="Increase"
                              className="flex h-7 w-7 items-center justify-center rounded-full border text-muted-foreground transition hover:bg-foreground hover:text-background"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          {isInSelection ? (
                            <button
                              onClick={() => removeItem(product.id)}
                              aria-label="Remove from selection"
                              className="text-muted-foreground transition hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => addItem(product)}
                              aria-label="Add to selection"
                              className="text-muted-foreground transition hover:text-foreground"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          )}
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
                          Rs.{" "}
                          {product.price.toLocaleString("en-LK", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
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
                  Your selection
                </p>
                <h2 className="mt-1 font-display text-2xl">Collection order</h2>

                {/* Selected items */}
                <div className="mt-6 space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {activeItems.length === 0 ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-muted-foreground py-4 text-center"
                      >
                        No items selected. Hover a product to set its quantity.
                      </motion.p>
                    ) : (
                      activeItems.map((item) => (
                        <motion.div
                          key={item.product.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease }}
                          className="flex items-center gap-3 overflow-hidden"
                        >
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <img
                              src={getOptimizedImageUrl(item.product.image_url, {
                                width: 80,
                                format: "auto",
                              })}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.qty} × Rs.{" "}
                              {item.product.price.toLocaleString("en-LK", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setItemQty(item.product.id, item.qty - 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full border text-muted-foreground hover:bg-foreground hover:text-background transition"
                              aria-label="Decrease"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="w-3 text-center text-xs tabular-nums">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => setItemQty(item.product.id, item.qty + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full border text-muted-foreground hover:bg-foreground hover:text-background transition"
                              aria-label="Increase"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Pricing */}
                {activeItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 space-y-2 border-t border-foreground/10 pt-4"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>
                        Rs.{" "}
                        {rawTotal.toLocaleString("en-LK", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-sm text-emerald-600">
                        <span className="flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5" />
                          Collection discount ({discount}%)
                        </span>
                        <span>
                          − Rs.{" "}
                          {discountAmount.toLocaleString("en-LK", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between border-t border-foreground/10 pt-3">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Total
                      </span>
                      <span className="font-display text-3xl">
                        Rs.{" "}
                        {finalTotal.toLocaleString("en-LK", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    {discount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Discount applied at checkout. Cart items are added at full price; present your collection order confirmation for the discount.
                      </p>
                    )}
                  </motion.div>
                )}

                {/* CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={activeItems.length === 0 || isAddingAll}
                  className="mt-6 group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-foreground pl-6 pr-4 text-xs uppercase tracking-[0.2em] text-background transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                >
                  {isAddingAll ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                      Adding…
                    </span>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      Add to cart
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45 ml-auto">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Adjust quantities above before adding to cart
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
