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
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { OrderWithItems, OrderItem } from "@/features/orders/orders.service";

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

  if (!orderId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="font-display text-4xl">Loading...</p>
      </div>
    );
  }

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
  const canView = user?.id === order?.user_id || user?.role === "admin";

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

  const config = statusConfig[order.status as keyof typeof statusConfig];
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
          Order <em className="font-light">{order.order_number}</em>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Placed on{" "}
          {new Date(order.created_at).toLocaleDateString("en-US", {
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
              Last updated {new Date(order.updated_at).toLocaleString()}
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
          <div className="flex items-start gap-4">
            <div className={`rounded-full p-2 ${config.bg}`}>
              <StatusIcon className={`h-4 w-4 ${config.color}`} />
            </div>
            <div className="flex-1">
              <p className="font-medium">{config.label}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.updated_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
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
            {order.order_items?.map((item: OrderItem) => (
              <div key={item.product_id} className="flex items-center gap-4">
                <img
                  src={item.product_image_url || ''}
                  alt={item.product_name}
                  className="h-16 w-14 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="font-display leading-tight">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Rs. {item.price.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">Rs. {(item.price * item.quantity).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-2 border-t border-foreground/10 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>Rs. {order.subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.shipping_cost === 0 ? "Free" : `Rs. ${order.shipping_cost.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
            </div>
            <div className="flex justify-between border-t border-foreground/10 pt-2">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-lg">Rs. {order.total.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                <p className="mt-1">{order.customer_name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-muted p-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                <p className="mt-1">{order.customer_email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-muted p-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
                <p className="mt-1">{order.customer_phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-muted p-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Address</p>
                <p className="mt-1">
                  {order.shipping_address_line1}
                  {order.shipping_address_line2 && (
                    <>
                      <br />
                      {order.shipping_address_line2}
                    </>
                  )}
                  <br />
                  {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                  <br />
                  {order.shipping_country}
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
