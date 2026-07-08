import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import { useOrdersStore } from "@/features/orders";
import { useSettingsStore } from "@/features/settings";
import type { CreateOrderData } from "@/features/orders";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Check, Truck, Zap, ArrowUpRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { formatLKR } from "@/shared/utils/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function Checkout() {
  const { items, total } = useCart();
  const { user, isAuthenticated } = useAuthStore();
  const { createOrder, isLoading } = useOrdersStore();
  const { settings, loadSettings, calculateShipping } = useSettingsStore();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
      navigate("/sign-in", {
        state: { from: { pathname: "/checkout" }, message: "Please sign in to place your order" },
      });
    }
  }, [isAuthenticated, navigate, items.length]);

  if (items.length === 0 && !placed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-md text-center"
        >
          <p className="font-display text-5xl">Your basket is empty.</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Add a little softness before checking out.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background transition hover:scale-[1.02]"
          >
            Discover stickers
          </Link>
        </motion.div>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.2 }}
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-foreground text-background"
          >
            <Check className="h-8 w-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Order received
            </p>
            <h1 className="mt-6 font-display text-5xl leading-tight tracking-tight lg:text-6xl">
              A soft thank you,{" "}
              <em className="font-light">{user?.name.split(" ")[0] || "friend"}.</em>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base text-foreground/70">
              Your order{" "}
              <span className="font-medium text-foreground">{orderNumber}</span> is confirmed. Track
              it anytime in your account.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/my-orders"
                className="group inline-flex items-center gap-2.5 rounded-full bg-foreground pl-6 pr-3 py-3 text-xs uppercase tracking-[0.25em] text-background"
              >
                View my orders
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                to="/shop"
                className="inline-flex h-12 items-center rounded-full border border-foreground/20 px-6 text-xs uppercase tracking-[0.25em] transition hover:bg-foreground/5"
              >
                Keep shopping
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/sign-in");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setIsSubmitting(true);
    try {
      const subtotal = total();
      const shippingCost = calculateShipping(subtotal, shippingMethod);
      const orderTotal = subtotal + shippingCost;

      const orderData: CreateOrderData = {
        customerEmail: user.email,
        customerName: user.name,
        customerPhone: user.phone,
        shippingAddress: {
          line1: user.address || "",
          line2: undefined,
          city: user.city || "",
          state: "",
          postalCode: user.postalCode || "",
          country: user.country || "",
        },
        items: items.map((item) => ({
          productId: item.product_id,
          productName: item.product.name,
          productImageUrl: item.product.image_url,
          price: item.product.price,
          quantity: item.quantity,
        })),
        subtotal,
        shippingCost,
        tax: 0,
        total: orderTotal,
        notes: notes || undefined,
      };

      const order = await createOrder(orderData);
      if (order) {
        toast.success("Order placed successfully!");
        setOrderNumber(order.order_number);
        setPlaced(true);
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("An error occurred while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shippingCost = calculateShipping(total(), shippingMethod);
  const orderTotal = total() + shippingCost;

  return (
    <div className="page-enter mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
      >
        Checkout
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 0.1 }}
        className="mt-3 font-display text-5xl tracking-tight lg:text-7xl"
      >
        A few <em className="font-light">soft details.</em>
      </motion.h1>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-7">
          {/* Shipping info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="rounded-3xl border bg-background p-8 shadow-soft"
          >
            <h2 className="font-display text-2xl">Shipping to</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["Name", user?.name],
                ["Email", user?.email],
                ["Phone", user?.phone],
              ].filter(([, v]) => v).map(([label, val]) => (
                <div key={label as string}>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                  <p className="mt-1 text-base">{val}</p>
                </div>
              ))}
              {user?.address && (
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Address</p>
                  <p className="mt-1 text-base">
                    {user.address}
                    {user.city && <>, {user.city}{user.postalCode && `, ${user.postalCode}`}</>}
                    {user.country && <>, {user.country}</>}
                  </p>
                </div>
              )}
            </div>
            <Link
              to="/account"
              className="mt-5 text-xs text-muted-foreground transition hover:text-foreground"
            >
              Update address in account settings →
            </Link>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            onSubmit={submit}
            className="space-y-6"
          >
            {/* Shipping method */}
            <div className="rounded-3xl border bg-background p-8 shadow-soft">
              <h3 className="font-display text-2xl">Shipping method</h3>
              <RadioGroup
                value={shippingMethod}
                onValueChange={(v) => setShippingMethod(v as "standard" | "express")}
                className="mt-6 space-y-3"
              >
                {[
                  {
                    value: "standard",
                    icon: Truck,
                    label: "Standard shipping",
                    sub: "5–7 business days",
                  },
                  {
                    value: "express",
                    icon: Zap,
                    label: "Express shipping",
                    sub: "2–3 business days",
                  },
                ].map(({ value, icon: Icon, label, sub }) => {
                  const cost = calculateShipping(total(), value as "standard" | "express");
                  return (
                    <label
                      key={value}
                      htmlFor={value}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${
                        shippingMethod === value
                          ? "border-foreground bg-foreground/5"
                          : "border-foreground/10 hover:border-foreground/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={value} id={value} />
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{label}</p>
                            <p className="text-xs text-muted-foreground">{sub}</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {cost === 0 ? "Free" : formatLKR(cost)}
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>

              {total() >= settings.shipping.freeShippingThreshold && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 text-sm text-green-600"
                >
                  <Check className="h-4 w-4" />
                  You qualify for free shipping!
                </motion.p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Order notes{" "}
                <span className="normal-case tracking-normal text-muted-foreground/60">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any special instructions…"
                className="mt-2 w-full rounded-2xl border bg-background p-5 text-base outline-none transition focus:border-foreground resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting || isLoading ? "Placing order…" : "Place order"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Payment is arranged after confirmation. No card needed today.
            </p>
          </motion.form>
        </div>

        {/* Order summary */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.35 }}
          className="lg:col-span-5"
        >
          <div className="sticky top-28 rounded-3xl border bg-background p-8 shadow-soft">
            <h2 className="font-display text-2xl">Order summary</h2>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center gap-4">
                  <div className="h-16 w-14 overflow-hidden rounded-xl bg-muted shrink-0">
                    <img
                      src={getOptimizedImageUrl(item.product.image_url, { width: 120, format: "auto" })}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base leading-tight truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm tabular-nums shrink-0">
                    {formatLKR(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/70">Subtotal</span>
                <span>{formatLKR(total())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/70">
                  Shipping ({shippingMethod === "express" ? "Express" : "Standard"})
                </span>
                <span>
                  {shippingCost === 0 ? "Free" : formatLKR(shippingCost)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t pt-4">
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Total
                </span>
                <span className="font-display text-3xl">
                  {formatLKR(orderTotal)}
                </span>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
