import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { mockOrders } from "@/features/admin";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const order = mockOrders.find((o) => o.id === id) || mockOrders[0];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "processing":
        return <Package className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (
    status: string,
  ): "success" | "warning" | "info" | "default" | "destructive" => {
    const variants: Record<string, "success" | "warning" | "info" | "default" | "destructive"> = {
      delivered: "success",
      processing: "warning",
      shipped: "info",
      pending: "default",
      cancelled: "destructive",
    };
    return variants[status] || "default";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full hover:bg-foreground/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
            >
              ✦ Transaction
            </motion.p>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-1 font-display text-4xl tracking-tight"
            >
              {order.orderNumber}
            </motion.h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed on {format(new Date(order.date), "MMMM dd, yyyy")}
            </p>
          </div>
        </div>
        <Badge
          variant={getStatusBadge(order.status)}
          className="text-base px-5 py-2.5 flex items-center gap-2 capitalize"
        >
          {getStatusIcon(order.status)}
          <span>{order.status}</span>
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl tracking-tight">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 pb-4 border-b border-foreground/5 last:border-0 last:pb-0"
                    >
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-foreground/5">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-display text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-foreground/10 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$5.99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${(order.total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-display text-2xl pt-3 border-t border-foreground/10">
                    <span>Total</span>
                    <span>${(order.total + 5.99 + order.total * 0.1).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Timeline */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl tracking-tight">
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-green-100 p-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="w-px h-full bg-foreground/10 my-1" />
                    </div>
                    <div className="pb-6">
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.date), "MMMM dd, yyyy hh:mm a")}
                      </p>
                    </div>
                  </div>

                  {order.status !== "pending" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-blue-100 p-2">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                        {(order.status === "shipped" || order.status === "delivered") && (
                          <div className="w-px h-full bg-foreground/10 my-1" />
                        )}
                      </div>
                      <div
                        className={
                          order.status === "shipped" || order.status === "delivered" ? "pb-6" : ""
                        }
                      >
                        <p className="font-medium">Processing</p>
                        <p className="text-sm text-muted-foreground">
                          Your order is being prepared
                        </p>
                      </div>
                    </div>
                  )}

                  {(order.status === "shipped" || order.status === "delivered") && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-purple-100 p-2">
                          <Truck className="h-4 w-4 text-purple-600" />
                        </div>
                        {order.status === "delivered" && (
                          <div className="w-px h-full bg-foreground/10 my-1" />
                        )}
                      </div>
                      <div className={order.status === "delivered" ? "pb-6" : ""}>
                        <p className="font-medium">Shipped</p>
                        <p className="text-sm text-muted-foreground">Order is on the way</p>
                      </div>
                    </div>
                  )}

                  {order.status === "delivered" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-green-100 p-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Delivered</p>
                        <p className="text-sm text-muted-foreground">Order has been delivered</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* Customer Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-tight">Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{order.customer}</p>
                <p className="text-sm text-muted-foreground">{order.email}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-tight">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.status === "pending" && (
                  <Button className="w-full h-12 rounded-full bg-gradient-ink text-xs uppercase tracking-[0.2em] shadow-soft hover:shadow-luxe">
                    Mark as Processing
                  </Button>
                )}
                {order.status === "processing" && (
                  <Button className="w-full h-12 rounded-full bg-gradient-ink text-xs uppercase tracking-[0.2em] shadow-soft hover:shadow-luxe">
                    Mark as Shipped
                  </Button>
                )}
                {order.status === "shipped" && (
                  <Button className="w-full h-12 rounded-full bg-gradient-ink text-xs uppercase tracking-[0.2em] shadow-soft hover:shadow-luxe">
                    Mark as Delivered
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-full border-foreground/20 text-xs uppercase tracking-[0.2em] hover:border-foreground"
                >
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-full border-foreground/20 text-xs uppercase tracking-[0.2em] hover:border-foreground"
                >
                  Print Invoice
                </Button>
                {order.status !== "cancelled" && order.status !== "delivered" && (
                  <Button
                    variant="destructive"
                    className="w-full h-12 rounded-full text-xs uppercase tracking-[0.2em]"
                  >
                    Cancel Order
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
