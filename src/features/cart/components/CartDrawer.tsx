import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useCart } from "@/features/cart";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { formatLKR } from "@/shared/utils/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function CartDrawer() {
  const { open, setOpen, items, setQty, remove, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] backdrop-blur-sm"
            style={{ background: "color-mix(in oklab, var(--ink) 30%, transparent)" }}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease }}
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-background shadow-luxe"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Your selection
                </p>
                <h3 className="font-display text-2xl leading-none mt-0.5">Soft basket</h3>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-muted"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Empty state */}
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.1 }}
                className="flex flex-1 flex-col items-center justify-center px-6 text-center"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <p className="font-display text-3xl">Your basket is dreaming.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add a little softness to begin.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setOpen(false)}
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background transition hover:scale-[1.02]"
                >
                  Discover stickers
                </Link>
              </motion.div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.product_id}
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="flex gap-4"
                      >
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={() => setOpen(false)}
                          className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
                        >
                          <img
                            src={getOptimizedImageUrl(item.product.image_url, {
                              width: 120,
                              format: "auto",
                            })}
                            alt={item.product.name}
                            className="h-full w-full object-cover transition hover:scale-105 duration-700"
                          />
                        </Link>
                        <div className="flex flex-1 flex-col min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-display text-lg leading-tight">{item.product.name}</p>
                            <p className="shrink-0 text-sm tabular-nums">
                              {formatLKR(item.product.price * item.quantity)}
                            </p>
                          </div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">
                            {formatLKR(item.product.price)} each
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center gap-3 rounded-full border px-3 py-1.5">
                              <button
                                onClick={() => setQty(item.product_id, item.quantity - 1)}
                                aria-label="Decrease"
                                className="text-muted-foreground transition hover:text-foreground"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-4 text-center text-xs tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => setQty(item.product_id, item.quantity + 1)}
                                aria-label="Increase"
                                className="text-muted-foreground transition hover:text-foreground"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => remove(item.product_id)}
                              aria-label="Remove item"
                              className="text-muted-foreground transition hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="space-y-4 border-t px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="font-display text-3xl">
                      {formatLKR(total())}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Shipping & taxes calculated at checkout.
                  </p>
                  <motion.button
                    onClick={handleCheckout}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-foreground pl-8 pr-4 text-xs uppercase tracking-[0.25em] text-background transition"
                  >
                    Proceed to checkout
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </motion.button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
