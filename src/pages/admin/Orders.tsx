import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Search, Eye, Download, Package } from "lucide-react";
import { useOrdersStore } from "@/features/orders";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function Orders() {
  const navigate = useNavigate();
  const { getAllOrders } = useOrdersStore();
  const [searchQuery, setSearchQuery] = useState("");

  const allOrders = getAllOrders();

  const filteredOrders = allOrders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (
    status: string,
  ): "success" | "warning" | "info" | "default" | "destructive" => {
    const variants: Record<string, "success" | "warning" | "info" | "default" | "destructive"> = {
      delivered: "success",
      processing: "warning",
      shipped: "info",
      pending: "default",
      confirmed: "info",
      cancelled: "destructive",
    };
    return variants[status] || "default";
  };

  if (allOrders.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">✦ Transactions</p>
          <h2 className="mt-2 font-display text-4xl tracking-tight">Orders</h2>
        </div>
        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 font-display text-2xl">No orders yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Orders will appear here once customers start placing them
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
          >
            ✦ Transactions
          </motion.p>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-2 font-display text-4xl tracking-tight"
          >
            Orders
          </motion.h2>
          <p className="mt-2 text-sm text-muted-foreground">Manage and track customer orders</p>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button
            variant="outline"
            className="inline-flex h-12 items-center gap-2 rounded-full border-foreground/20 px-6 text-xs uppercase tracking-[0.2em] hover:border-foreground"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="glass border-foreground/10 shadow-soft">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-full border-foreground/10 bg-background/50"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-foreground/5">
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Order Number
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Customer
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Total
                  </TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-foreground/5 hover:bg-foreground/[0.02] transition"
                  >
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(order.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(order.status)} className="capitalize">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-display text-lg">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="h-9 w-9 rounded-lg hover:bg-foreground/5"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
