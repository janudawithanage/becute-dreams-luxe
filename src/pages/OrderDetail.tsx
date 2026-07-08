import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { useOrdersStore } from "@/features/orders";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { OrderWithItems, OrderItem } from "@/features/orders/orders.service";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { formatLKR } from "@/shared/utils/format";

const ease = [0.22, 1, 0.36, 1] as const;

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  processing: { label: "Processing", icon: Package, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  shipped: { label: "Shipped", icon: Truck, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
};

export function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const { getOrderById } = useOrdersStore();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in");
      return;
    }
    if (orderId) {
      setIsLoading(true);
      getOrderById(orderId).then((orderData) => {
        setOrder(orderData);
        setIsLoading(false);
      });
    }
  }, [isAuthenticated, navigate, orderId, getOrderById]);

  if (!orderId) return null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1000px] px-6 py-16 lg:px-12 lg:py-24 space-y-4">
        <div className="shimmer h-4 w-24 rounded-full" />
        <div className="shimmer h-16 w-3/4 rounded-2xl" />
        <div className="shimmer h-32 rounded-3xl" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="shimmer h-72 rounded-3xl" />
          <div className="shimmer h-72 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="text-center"
        >
          <p className="font-display text-4xl">Order not found.</p>
          <Link
            to="/my-orders"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background"
          >
            Back to orders
          </Link>
        </motion.div>
      </div>
    );
  }

  const canView = user?.id === order?.user_id || user?.role === "admin";
  if (!canView) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="text-center"
        >
          <p className="font-display text-4xl">Access denied.</p>
          <Link
            to="/my-orders"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-8 text-xs uppercase tracking-[0.25em] text-background"
          >
            Back to orders
          </Link>
        </motion.div>
      </div>
    );
  }

  const config = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  return (
    <div className="page-enter mx-auto max-w-[1000px] px-6 py-16 lg:px-12 lg:py-24">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground transition hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to orders
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.05 }}
        className="mt-8"
      >
        <h1 className="font-display text-5xl tracking-tight lg:text-6xl">
          Order <em className="font-light">{order.order_number}</em>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Placed on{" "}
          {new Date(order.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* Status banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.12 }}
        className={`mt-8 flex items-center gap-3 rounded-2xl border px-6 py-4 ${config.bg} ${config.border}`}
      >
        <StatusIcon className={`h-5 w-5 ${config.color}`} />
        <div>
          <p className={`font-display text-xl leading-none ${config.color}`}>{config.label}</p>
          <p className={`mt-0.5 text-xs ${config.color} opacity-70`}>
            Updated {new Date(order.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Items + totals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          className="rounded-3xl border bg-background p-8 shadow-soft"
        >
          <h2 className="font-display text-2xl">Order items</h2>
          <div className="mt-6 space-y-4">
            {order.order_items?.map((item: OrderItem) => (
              <div key={item.product_id} className="flex items-center gap-4">
                <div className="h-16 w-14 overflow-hidden rounded-xl bg-muted shrink-0">
                  <img
                    src={item.product_image_url || ""}
                    alt={item.product_name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display leading-tight truncate">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatLKR(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm tabular-nums shrink-0">
                  {formatLKR(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2.5 border-t pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatLKR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {order.shipping_cost === 0 ? "Free" : formatLKR(order.shipping_cost)}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-t pt-3">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</span>
              <span className="font-display text-2xl">
                {formatLKR(order.total)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Shipping info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.28 }}
          className="rounded-3xl border bg-background p-8 shadow-soft"
        >
          <h2 className="font-display text-2xl">Shipping information</h2>
          <div className="mt-6 space-y-5">
            {[
              { icon: Package, label: "Name", value: order.customer_name },
              { icon: Mail, label: "Email", value: order.customer_email },
              { icon: Phone, label: "Phone", value: order.customer_phone },
            ].filter((r) => r.value).map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                  <p className="mt-0.5 text-sm">{value}</p>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Address</p>
                <p className="mt-0.5 text-sm leading-relaxed">
                  {order.shipping_address_line1}
                  {order.shipping_address_line2 && <><br />{order.shipping_address_line2}</>}
                  <br />
                  {order.shipping_city}{order.shipping_state && `, ${order.shipping_state}`} {order.shipping_postal_code}
                  <br />
                  {order.shipping_country}
                </p>
              </div>
            </div>

            {order.notes && (
              <div className="rounded-xl border bg-muted/50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Notes</p>
                <p className="mt-1 text-sm italic text-foreground/70">{order.notes}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Review section — only for delivered orders */}
      {order.status === "delivered" && user && (
        <ReviewForm orderId={order.id} user={user} />
      )}
    </div>
  );
}
