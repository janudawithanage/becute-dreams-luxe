import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ArrowUpRight } from "lucide-react";
import { useProductsStore } from "@/features/products";
import { useCart } from "@/features/cart";

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const getProductBySlug = useProductsStore((s) => s.getProductBySlug);
  const products = useProductsStore((s) => s.getProducts());
  const product = slug ? getProductBySlug(slug) : null;
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="font-display text-3xl">Piece not found.</p>
          <Link
            to="/shop"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
      <Link
        to="/shop"
        className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
      >
        ← Back to shop
      </Link>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <div className="overflow-hidden rounded-[2rem] bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </motion.div>

        <div className="lg:col-span-5 lg:pt-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {product.category}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[1.02] tracking-tight lg:text-6xl">
            {product.name}
          </h1>
          <p className="mt-6 font-display text-3xl">${product.price.toFixed(2)}</p>

          <p className="mt-8 text-base leading-relaxed text-foreground/70 text-pretty">
            {product.description}
          </p>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center gap-4 rounded-full border px-5 py-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm tabular-nums">{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="Increase">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => add(product, qty)}
              className="group inline-flex h-14 flex-1 items-center justify-center gap-3 rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background transition hover:scale-[1.02]"
            >
              Add to basket
              <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
            </button>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-6 border-t pt-8 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Material</dt>
              <dd className="mt-1">Premium matte vinyl</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Finish</dt>
              <dd className="mt-1">Hand-trimmed, soft-touch</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Edition</dt>
              <dd className="mt-1">Small batch</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Shipping</dt>
              <dd className="mt-1">Worldwide, soft packed</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-32">
          <h2 className="font-display text-4xl tracking-tight lg:text-5xl">
            You may also <em className="font-light">love.</em>
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {related.map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="font-display text-lg">{p.name}</p>
                  <p className="text-sm">${p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
