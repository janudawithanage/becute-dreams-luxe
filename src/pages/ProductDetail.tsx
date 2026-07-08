import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ArrowUpRight, ChevronLeft, Check } from "lucide-react";
import { useProductsStore } from "@/features/products";
import { useCart } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import type { Product } from "@/features/products/products.service";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { formatLKR } from "@/shared/utils/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const getProductBySlug = useProductsStore((s) => s.getProductBySlug);
  const products = useProductsStore((s) => s.getProducts());
  const isLoading = useProductsStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug).then(setProduct);
    }
  }, [slug, getProductBySlug]);

  // Reset qty & added state when product changes
  useEffect(() => {
    setQty(1);
    setAdded(false);
  }, [product?.id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
        <div className="shimmer h-4 w-24 rounded-full" />
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="shimmer aspect-[4/5] rounded-[2rem] lg:col-span-7" />
          <div className="space-y-4 lg:col-span-5 lg:pt-8">
            <div className="shimmer h-4 w-32 rounded-full" />
            <div className="shimmer h-16 w-4/5 rounded-2xl" />
            <div className="shimmer h-8 w-28 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="text-center"
        >
          <p className="font-display text-4xl">Piece not found.</p>
          <Link
            to="/shop"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background"
          >
            Back to shop
          </Link>
        </motion.div>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/sign-in", {
        state: {
          from: `/product/${slug}`,
          message: "Please sign in to add items to your cart",
        },
      });
      return;
    }
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="page-enter mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground transition hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to shop
        </Link>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease }}
          className="lg:col-span-7"
        >
          <div className="overflow-hidden rounded-[2rem] bg-muted shadow-soft">
            <img
              src={getOptimizedImageUrl(product.image_url, { width: 900, format: "auto", quality: 90 })}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover transition duration-[1200ms] hover:scale-[1.02]"
            />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
          className="lg:col-span-5 lg:pt-8"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {product.category?.name || "Uncategorized"}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[1.02] tracking-tight lg:text-6xl">
            {product.name}
          </h1>
          <p className="mt-6 font-display text-3xl">
            {formatLKR(product.price)}
          </p>

          <p className="mt-8 text-base leading-relaxed text-foreground/70 text-pretty">
            {product.description}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Qty + CTA */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center gap-4 rounded-full border px-5 py-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease quantity"
                className="text-muted-foreground transition hover:text-foreground"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm tabular-nums">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                aria-label="Increase quantity"
                className="text-muted-foreground transition hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.97 }}
              className={`group inline-flex h-14 flex-1 items-center justify-center gap-3 rounded-full px-8 text-xs uppercase tracking-[0.25em] transition-all duration-500 ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-foreground text-background hover:scale-[1.02]"
              }`}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Added to basket
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="inline-flex items-center gap-3"
                  >
                    Add to basket
                    <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Details grid */}
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t pt-8 text-sm">
            {[
              ["Material", "Premium matte vinyl"],
              ["Finish", "Hand-trimmed, soft-touch"],
              ["Edition", "Small batch"],
              ["Shipping", "Worldwide, soft packed"],
            ].map(([dt, dd]) => (
              <div key={dt as string}>
                <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{dt}</dt>
                <dd className="mt-1">{dd}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="mt-32"
        >
          <h2 className="font-display text-4xl tracking-tight lg:text-5xl">
            You may also <em className="font-light">love.</em>
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {related.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease, delay: i * 0.07 }}
              >
                <Link to={`/product/${p.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={getOptimizedImageUrl(p.image_url, { width: 400, format: "auto" })}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-[1000ms] group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <p className="font-display text-lg leading-tight">{p.name}</p>
                    <p className="shrink-0 text-sm tabular-nums">
                      {formatLKR(p.price)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
