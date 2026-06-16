import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { useOrdersStore } from "@/features/orders";
import { motion } from "framer-motion";
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag } from "lucide-react";
import { useEffect } from "react";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
  processing: { label: "Processing", icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
  shipped: { label: "Shipped", icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

export function MyOrders() {
  const { user, isAuthenticated } = useAuthStore();
  const { getOrdersByCustomer } = useOrdersStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in", {
        state: { from: { pathname: "/my-orders" }, message: "Please sign in to view your orders" },
      });
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const orders = getOrdersByCustomer(user.id);

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <p className="mt-6 font-display text-4xl">No orders yet.</p>
        <p className="mt-4 text-muted-foreground">
          Start shopping and your orders will appear here
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background"
        >
          Discover stickers
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Order History</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight lg:text-7xl">
          Your <em className="font-light">orders.</em>
        </h1>
      </motion.div>

      <div className="mt-12 space-y-6">
        {orders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((order, index) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass shadow-soft hover:shadow-luxe transition-all duration-500 rounded-3xl p-6 lg:p-8"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground/10 pb-6">
                  <div>
                    <h3 className="font-display text-2xl">{order.orderNumber}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${config.bg}`}>
                    <StatusIcon className={`h-4 w-4 ${config.color}`} />
                    <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-6 space-y-4">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-16 w-14 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-display text-base leading-tight">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm tabular-nums">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-foreground/10 pt-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Total
                    </p>
                    <p className="mt-1 font-display text-2xl">${order.total.toFixed(2)}</p>
                  </div>
                  <Link
                    to={`/order/${order.id}`}
                    className="inline-flex h-10 items-center rounded-full border border-foreground/20 px-6 text-xs uppercase tracking-[0.2em] transition hover:bg-foreground/5"
                  >
                    View Details
                  </Link>
                </div>

                {/* Status History */}
                {order.statusHistory.length > 1 && (
                  <div className="mt-6 border-t border-foreground/10 pt-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                      Order Timeline
                    </p>
                    <div className="space-y-3">
                      {order.statusHistory
                        .slice()
                        .reverse()
                        .map((history, idx) => {
                          const historyConfig = statusConfig[history.status];
                          const HistoryIcon = historyConfig.icon;
                          return (
                            <div key={idx} className="flex items-start gap-3">
                              <div className={`rounded-full p-1.5 ${historyConfig.bg}`}>
                                <HistoryIcon className={`h-3 w-3 ${historyConfig.color}`} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{historyConfig.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(history.timestamp).toLocaleString()}
                                  {history.note && ` • ${history.note}`}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
