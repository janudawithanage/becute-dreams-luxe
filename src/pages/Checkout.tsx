import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import { useOrdersStore } from "@/features/orders";
import { toast } from "sonner";
import { MessageCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function Checkout() {
  const { items, total, clear } = useCart();
  const { user, isAuthenticated } = useAuthStore();
  const { createOrder } = useOrdersStore();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
      navigate("/sign-in", {
        state: { from: { pathname: "/checkout" }, message: "Please sign in to place your order" }
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
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Order received</p>
          <h1 className="mt-6 font-display text-6xl leading-tight tracking-tight">
            A soft thank you, <em className="font-light">{user?.name.split(" ")[0] || "friend"}.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base text-foreground/70">
            Your order <span className="font-medium text-foreground">{orderNumber}</span> is confirmed. 
            You can track your order status in your account.
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

    const orderItems = items.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      productImage: i.product.image,
      price: i.product.price,
      quantity: i.qty,
    }));

    const orderId = createOrder({
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone || "",
      shippingAddress: {
        street: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
        country: user.country || "",
      },
      items: orderItems,
      subtotal: total(),
      shippingCost: 0, // Free shipping for now
      total: total(),
      status: "pending",
      notes,
    });

    const order = useOrdersStore.getState().getOrderById(orderId);
    
    toast.success("Order placed successfully!");
    setOrderNumber(order?.orderNumber || "");
    setPlaced(true);
    clear();
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
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
                  {user?.address}<br />
                  {user?.city}, {user?.postalCode}<br />
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
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background transition hover:scale-[1.01]"
            >
              Place order
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
              {items.map((i) => (
                <div key={i.product.id} className="flex items-center gap-4">
                  <img
                    src={i.product.image}
                    alt={i.product.name}
                    className="h-16 w-14 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-base leading-tight">{i.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {i.qty}</p>
                  </div>
                  <p className="text-sm tabular-nums">${(i.product.price * i.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${total().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at confirmation</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Total
                </span>
                <span className="font-display text-3xl">${total().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
