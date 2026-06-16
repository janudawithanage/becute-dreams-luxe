import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { useOrdersStore } from "@/features/orders";
import { motion } from "framer-motion";
import { Package, Clock, Truck, CheckCircle, XCircle, ArrowLeft, MapPin, Phone, Mail } from "lucide-react";
import { useEffect } from "react";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
  processing: { label: "Processing", icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
  shipped: { label: "Shipped", icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

export function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const { getOrderById } = useOrdersStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in");
    }
  }, [isAuthenticated, navigate]);

  if (!orderId) {
    return null;
  }

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="font-display text-4xl">Order not found.</p>
        <Link
          to="/my-orders"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  // Check if user owns this order or is admin
  const canView = user?.id === order.customerId || user?.role === "admin";

  if (!canView) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="font-display text-4xl">Access denied.</p>
        <Link
          to="/my-orders"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  const config = statusConfig[order.status];
  const StatusIcon = config.icon;

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-16 lg:px-12 lg:py-24">
      {/* Back Button */}
      <Link
        to="/my-orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-8"
      >
        <h1 className="font-display text-5xl tracking-tight lg:text-6xl">
          Order <em className="font-light">{order.orderNumber}</em>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </motion.div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`mt-8 rounded-3xl p-8 ${config.bg}`}
      >
        <div className="flex items-center gap-3">
          <StatusIcon className={`h-6 w-6 ${config.color}`} />
          <div>
            <p className={`text-xl font-display ${config.color}`}>{config.label}</p>
            <p className={`text-sm ${config.color}/70`}>
              Last updated {new Date(order.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Order Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 glass shadow-soft rounded-3xl p-8"
      >
        <h2 className="font-display text-2xl">Order Timeline</h2>
        <div className="mt-6 space-y-4">
          {order.statusHistory.slice().reverse().map((history, idx) => {
            const historyConfig = statusConfig[history.status];
            const HistoryIcon = historyConfig.icon;
            return (
              <div key={idx} className="flex items-start gap-4">
                <div className={`rounded-full p-2 ${historyConfig.bg}`}>
                  <HistoryIcon className={`h-4 w-4 ${historyConfig.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{historyConfig.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(history.timestamp).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {history.note && (
                    <p className="mt-1 text-sm text-muted-foreground italic">{history.note}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass shadow-soft rounded-3xl p-8"
        >
          <h2 className="font-display text-2xl">Order Items</h2>
          <div className="mt-6 space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-16 w-14 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="font-display leading-tight">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-2 border-t border-foreground/10 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between border-t border-foreground/10 pt-2">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-lg">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Shipping Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass shadow-soft rounded-3xl p-8"
        >
          <h2 className="font-display text-2xl">Shipping Information</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-muted p-2">
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Name</p>
                <p className="mt-1">{order.customerName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-muted p-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                <p className="mt-1">{order.customerEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-muted p-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
                <p className="mt-1">{order.customerPhone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-muted p-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Address</p>
                <p className="mt-1">
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
            {order.notes && (
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-muted p-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Notes</p>
                  <p className="mt-1 text-sm italic text-muted-foreground">{order.notes}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
