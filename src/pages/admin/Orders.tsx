import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Search, Eye, Download, Package, X } from "lucide-react";
import { useOrdersStore } from "@/features/orders";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { usePagination } from "@/shared/hooks";
import { PaginationControls } from "@/shared/components/ui/PaginationControls";
import { formatLKR } from "@/shared/utils/format";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export function Orders() {
  const navigate = useNavigate();
  const { orders, fetchAllOrders, isLoading } = useOrdersStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const orderDate = new Date(order.created_at);
        const now = new Date();
        if (dateFilter === "today") {
          matchesDate = orderDate.toDateString() === now.toDateString();
        } else if (dateFilter === "week") {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          matchesDate = orderDate >= weekAgo;
        } else if (dateFilter === "month") {
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          matchesDate = orderDate >= monthAgo;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const hasActiveFilters = statusFilter !== "all" || dateFilter !== "all";

  const clearFilters = () => {
    setStatusFilter("all");
    setDateFilter("all");
    setSearchQuery("");
  };

  const pagination = usePagination(filteredOrders, { pageSize: 10 });

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

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            ✦ Transactions
          </p>
          <h2 className="mt-2 font-display text-4xl tracking-tight">Orders</h2>
        </div>
        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="font-display text-2xl">Loading orders...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            ✦ Transactions
          </p>
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 rounded-full border-foreground/10 bg-background/50"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 w-full rounded-full border-foreground/10 bg-background/50 sm:w-[160px] text-xs uppercase tracking-wider">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="h-12 w-full rounded-full border-foreground/10 bg-background/50 sm:w-[160px] text-xs uppercase tracking-wider">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              {(hasActiveFilters || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-12 rounded-full px-4 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear
                </Button>
              )}
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
                {pagination.paginatedItems.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-foreground/5 hover:bg-foreground/[0.02] transition"
                  >
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(order.created_at), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(order.status)} className="capitalize">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-display text-lg">
                      {formatLKR(order.total)}
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center gap-2 border-t border-foreground/5 pt-6">
                <PaginationControls
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  canGoPrev={pagination.canGoPrev}
                  canGoNext={pagination.canGoNext}
                  onPageChange={pagination.setPage}
                  getPageNumbers={pagination.getPageNumbers}
                />
                <p className="text-xs text-muted-foreground">
                  {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} &middot; Page {pagination.currentPage} of {pagination.totalPages}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
