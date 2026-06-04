import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

export function CartDrawer() {
  const { open, setOpen, items, setQty, remove, total } = useCart();
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setOpen(false);
    if (session) {
      navigate({ to: "/checkout" });
    } else {
      navigate({ to: "/login", search: { redirect: "/checkout" } });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm"
            style={{ background: "color-mix(in oklab, var(--ink) 35%, transparent)" }}
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-background shadow-luxe"
          >
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Your selection
                </p>
                <h3 className="font-display text-2xl">Soft basket</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <p className="font-display text-3xl">Your basket is dreaming.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add a little softness to begin.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setOpen(false)}
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background transition hover:opacity-90"
                >
                  Discover stickers
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                  {items.map((i) => (
                    <div key={i.product.id} className="flex gap-4">
                      <div className="h-24 w-20 overflow-hidden rounded-md bg-muted">
                        <img
                          src={i.product.image}
                          alt={i.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <p className="font-display text-lg leading-tight">{i.product.name}</p>
                          <p className="text-sm">${(i.product.price * i.qty).toFixed(2)}</p>
                        </div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          ${i.product.price} each
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center gap-3 rounded-full border px-3 py-1.5">
                            <button
                              onClick={() => setQty(i.product.id, i.qty - 1)}
                              aria-label="Decrease"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-4 text-center text-xs">{i.qty}</span>
                            <button
                              onClick={() => setQty(i.product.id, i.qty + 1)}
                              aria-label="Increase"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => remove(i.product.id)}
                            aria-label="Remove"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 border-t px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="font-display text-3xl">${total().toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Shipping & taxes calculated at checkout.
                  </p>
                  <button
                    onClick={handleCheckout}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-xs uppercase tracking-[0.25em] text-background transition hover:opacity-90"
                  >
                    {session ? "Proceed to checkout" : "Sign in to checkout"}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
