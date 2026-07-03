import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { useOrdersStore } from "@/features/orders";
import { motion } from "framer-motion";
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  processing: { label: "Processing", icon: Package, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  shipped: { label: "Shipped", icon: Truck, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
};

export function MyOrders() {
  const { user, isAuthenticated } = useAuthStore();
  const { orders, fetchUserOrders, isLoading } = useOrdersStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in", {
        state: { from: { pathname: "/my-orders" }, message: "Please sign in to view your orders" },
      });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user, fetchUserOrders]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
        <div className="shimmer h-4 w-32 rounded-full" />
        <div className="shimmer mt-4 h-16 w-2/3 rounded-2xl" />
        <div className="mt-12 space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="shimmer h-48 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-md text-center"
        >
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="font-display text-4xl">No orders yet.</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Start shopping and your orders will appear here.
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

  return (
    <div className="page-enter mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Order history</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight lg:text-7xl">
          Your <em className="font-light">orders.</em>
        </h1>
      </motion.div>

      <div className="mt-12 space-y-4">
        {orders
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .map((order, index) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: Math.min(index * 0.08, 0.5) }}
                className="group rounded-3xl border bg-background p-6 transition-shadow duration-500 hover:shadow-luxe lg:p-8"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground/8 pb-6">
                  <div>
                    <h3 className="font-display text-2xl">{order.order_number}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${config.bg} ${config.border}`}
                  >
                    <StatusIcon className={`h-4 w-4 ${config.color}`} />
                    <span className={`font-medium ${config.color}`}>{config.label}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-6 space-y-3">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="h-14 w-12 overflow-hidden rounded-xl bg-muted shrink-0">
                        <img
                          src={item.product_image_url || ""}
                          alt={item.product_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-base leading-tight truncate">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                      </div>
                      <p className="text-sm tabular-nums shrink-0">
                        Rs. {item.subtotal.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-foreground/8 pt-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</p>
                    <p className="mt-0.5 font-display text-2xl">
                      Rs. {order.total.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Link
                    to={`/order/${order.id}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition hover:border-foreground hover:bg-foreground/5"
                  >
                    View details
                    <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:rotate-45" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
