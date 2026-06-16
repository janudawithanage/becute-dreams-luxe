import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrdersStore, type OrderStatus } from "@/features/orders";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getOrderById, updateOrderStatus } = useOrdersStore();
  const order = getOrderById(id || "");

  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [statusNote, setStatusNote] = useState("");

  if (!order) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Package className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <p className="mt-4 font-display text-2xl">Order not found</p>
          <Button onClick={() => navigate("/admin/orders")} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = () => {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    updateOrderStatus(order.id, newStatus, statusNote || undefined);
    toast.success("Order status updated successfully");
    setNewStatus("");
    setStatusNote("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-indigo-600" />;
      case "processing":
        return <Package className="h-5 w-5 text-purple-600" />;
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
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
      confirmed: "info",
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
              Placed on {format(new Date(order.createdAt), "MMMM dd, yyyy")}
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
                          src={item.productImage}
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
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-display text-2xl pt-3 border-t border-foreground/10">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
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
                  {order.statusHistory
                    .slice()
                    .reverse()
                    .map((history, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`rounded-full p-2 ${
                              history.status === "delivered"
                                ? "bg-green-100"
                                : history.status === "shipped"
                                  ? "bg-indigo-100"
                                  : history.status === "processing"
                                    ? "bg-purple-100"
                                    : history.status === "confirmed"
                                      ? "bg-blue-100"
                                      : history.status === "cancelled"
                                        ? "bg-red-100"
                                        : "bg-yellow-100"
                            }`}
                          >
                            {getStatusIcon(history.status)}
                          </div>
                          {idx < order.statusHistory.length - 1 && (
                            <div className="w-px h-full bg-foreground/10 my-1" />
                          )}
                        </div>
                        <div className={idx < order.statusHistory.length - 1 ? "pb-6" : ""}>
                          <p className="font-medium capitalize">{history.status}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(history.timestamp), "MMMM dd, yyyy hh:mm a")}
                          </p>
                          {history.note && (
                            <p className="text-sm text-muted-foreground italic mt-1">
                              {history.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
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
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                <div className="pt-2 mt-2 border-t border-foreground/10">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    Shipping Address
                  </p>
                  <p className="text-sm">
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>
                {order.notes && (
                  <div className="pt-2 mt-2 border-t border-foreground/10">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      Order Notes
                    </p>
                    <p className="text-sm italic text-muted-foreground">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-tight">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status" className="text-xs uppercase tracking-[0.2em]">
                    New Status
                  </Label>
                  <Select
                    value={newStatus}
                    onValueChange={(value) => setNewStatus(value as OrderStatus)}
                  >
                    <SelectTrigger id="status" className="h-12 rounded-full mt-2">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="note" className="text-xs uppercase tracking-[0.2em]">
                    Note (Optional)
                  </Label>
                  <Textarea
                    id="note"
                    placeholder="Add a note about this status change..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="mt-2 rounded-2xl min-h-[80px]"
                  />
                </div>

                <Button
                  onClick={handleStatusUpdate}
                  disabled={!newStatus}
                  className="w-full h-12 rounded-full bg-gradient-ink text-xs uppercase tracking-[0.2em] shadow-soft hover:shadow-luxe disabled:opacity-50"
                >
                  Update Order Status
                </Button>

                <div className="pt-4 border-t border-foreground/10 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-full border-foreground/20 text-xs uppercase tracking-[0.2em] hover:border-foreground"
                  >
                    Send Email to Customer
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-full border-foreground/20 text-xs uppercase tracking-[0.2em] hover:border-foreground"
                  >
                    Print Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
