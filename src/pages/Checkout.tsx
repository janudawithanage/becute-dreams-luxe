import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import { useOrdersStore } from "@/features/orders";
import { useSettingsStore } from "@/features/settings";
import type { CreateOrderData } from "@/features/orders";
import { toast } from "sonner";
import { MessageCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";

export function Checkout() {
  const { items, total, clear } = useCart();
  const { user, isAuthenticated } = useAuthStore();
  const { createOrder, isLoading } = useOrdersStore();
  const { settings, loadSettings, calculateShipping } = useSettingsStore();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
      navigate("/sign-in", {
        state: { from: { pathname: "/checkout" }, message: "Please sign in to place your order" },
      });
    }
  }, [isAuthenticated, navigate, items.length]);

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="font-display text-4xl">Your basket is empty.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background"
        >
          Discover stickers
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Order received
          </p>
          <h1 className="mt-6 font-display text-6xl leading-tight tracking-tight">
            A soft thank you,{" "}
            <em className="font-light">{user?.name.split(" ")[0] || "friend"}.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base text-foreground/70">
            Your order <span className="font-medium text-foreground">{orderNumber}</span> is
            confirmed. You can track your order status in your account.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            In production, a confirmation email would be sent to {user?.email}.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/my-orders"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-xs uppercase tracking-[0.25em] text-background"
            >
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="inline-flex h-12 items-center rounded-full border border-foreground/20 px-7 text-xs uppercase tracking-[0.25em]"
            >
              Keep shopping
            </Link>
          </div>
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
      // Calculate totals with shipping
      const subtotal = total();
      const shippingCost = calculateShipping(subtotal, shippingMethod);
      const tax = 0; // Tax calculation would go here
      const orderTotal = subtotal + shippingCost + tax;

      // Prepare order data matching backend schema
      const orderData: CreateOrderData = {
        customerEmail: user.email,
        customerName: user.name,
        customerPhone: user.phone,
        shippingAddress: {
          line1: user.address || "",
          line2: undefined,
          city: user.city || "",
          state: "", // Add state if available in user profile
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
        tax,
        total: orderTotal,
        notes: notes || undefined,
      };

      // Create order (this also clears the cart)
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

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Checkout</p>
      <h1 className="mt-3 font-display text-5xl tracking-tight lg:text-7xl">
        A few <em className="font-light">soft details.</em>
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-6 lg:col-span-7">
          {/* Customer Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-muted p-8"
          >
            <h2 className="font-display text-2xl">Shipping Information</h2>
            <div className="mt-6 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Name</p>
                <p className="mt-1 text-base">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                <p className="mt-1 text-base">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
                <p className="mt-1 text-base">{user?.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Address</p>
                <p className="mt-1 text-base">
                  {user?.address}
                  <br />
                  {user?.city}, {user?.postalCode}
                  <br />
                  {user?.country}
                </p>
              </div>
            </div>
            <Link
              to="/sign-in"
              className="mt-4 text-xs text-muted-foreground hover:text-foreground transition"
            >
              Not you? Sign in with a different account →
            </Link>
          </motion.div>

          {/* Order Notes */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={submit}
            className="space-y-6"
          >
            {/* Shipping Method Selection */}
            <div className="rounded-3xl bg-muted p-8">
              <h3 className="font-display text-2xl mb-4">Shipping Method</h3>
              <RadioGroup
                value={shippingMethod}
                onValueChange={(value) => setShippingMethod(value as "standard" | "express")}
                className="space-y-4"
              >
                <div className="flex items-center justify-between p-4 rounded-xl border border-foreground/10 hover:border-foreground/20 transition cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="cursor-pointer">
                      <div className="font-medium">Standard Shipping</div>
                      <div className="text-xs text-muted-foreground">5-7 business days</div>
                    </Label>
                  </div>
                  <span className="font-medium">
                    {calculateShipping(total(), "standard") === 0
                      ? "Free"
                      : `Rs. ${calculateShipping(total(), "standard").toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-foreground/10 hover:border-foreground/20 transition cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="cursor-pointer">
                      <div className="font-medium">Express Shipping</div>
                      <div className="text-xs text-muted-foreground">2-3 business days</div>
                    </Label>
                  </div>
                  <span className="font-medium">
                    {calculateShipping(total(), "express") === 0
                      ? "Free"
                      : `Rs. ${calculateShipping(total(), "express").toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>
              </RadioGroup>
              {total() >= settings.shipping.freeShippingThreshold && (
                <p className="mt-4 text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  You qualify for free shipping!
                </p>
              )}
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Order Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Any special instructions for your order..."
                className="mt-2 w-full rounded-2xl border bg-background p-5 text-base outline-none focus:border-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting || isLoading ? "Placing order..." : "Place order"}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Payment is arranged after confirmation. No card needed today.
            </p>
          </motion.form>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-3xl bg-muted p-8">
            <h2 className="font-display text-2xl">Order summary</h2>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center gap-4">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="h-16 w-14 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-base leading-tight">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm tabular-nums">Rs. {(item.product.price * item.quantity).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>Rs. {total().toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>
                  Shipping ({shippingMethod === "express" ? "Express" : "Standard"})
                </span>
                <span>
                  {calculateShipping(total(), shippingMethod) === 0
                    ? "Free"
                    : `Rs. ${calculateShipping(total(), shippingMethod).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Total
                </span>
                <span className="font-display text-3xl">
                  Rs. {(total() + calculateShipping(total(), shippingMethod)).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
