import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { adminService } from "@/features/admin";
import { Badge } from "@/shared/components/ui/badge";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useOrdersStore } from "@/features/orders";
import { useNavigate } from "react-router-dom";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
} from "date-fns";
import { formatLKR } from "@/shared/utils/format";

interface TopProduct {
  rank: number;
  product_id: string | null;
  product_name: string;
  product_image_url: string | null;
  total_quantity: number;
  total_revenue: number;
  current_stock: number | null;
}

interface LowStockProduct {
  id: string;
  name: string;
  image_url: string;
  stock_quantity: number;
  in_stock: boolean;
}

interface OrderStatusBreakdown {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "hsl(45 93% 58%)",
  processing: "hsl(210 100% 56%)",
  shipped: "hsl(270 70% 60%)",
  delivered: "hsl(142 71% 45%)",
  cancelled: "hsl(0 72% 51%)",
};

function StatChange({ value }: { value: number }) {
  if (value === 0) return null;
  const positive = value > 0;
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-500" : "text-rose-500"}`}
    >
      {positive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {Math.abs(value).toFixed(1)}% vs last month
    </span>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<OrderStatusBreakdown>({
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { orders, fetchAllOrders } = useOrdersStore();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [dashboardStats, top, lowStock, statusBrk] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getTopSellingProducts(8),
          adminService.getLowStockProducts(5),
          adminService.getOrderStatusBreakdown(),
          fetchAllOrders(),
        ]);
        setStats(dashboardStats);
        setTopProducts(top);
        setLowStockProducts(lowStock);
        setStatusBreakdown(statusBrk);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchAllOrders]);

  // Generate 6-month chart data from orders in the store
  const generateChartData = () => {
    const now = new Date();
    const last6Months = eachMonthOfInterval({
      start: subMonths(now, 5),
      end: now,
    });

    return last6Months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= monthStart && orderDate <= monthEnd;
      });

      const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0);

      return {
        date: format(month, "MMM"),
        revenue: parseFloat(revenue.toFixed(2)),
        orders: monthOrders.length,
      };
    });
  };

  const chartData = generateChartData();
  const recentOrders = orders.slice(0, 5);

  // Pie chart data for order status
  const statusPieData = Object.entries(statusBreakdown)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ name: status, value: count }));

  const statsData = [
    {
      title: "Total Revenue",
      value: formatLKR(stats.totalRevenue),
      icon: DollarSign,
      change: stats.revenueChange,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      change: stats.ordersChange,
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      change: 0,
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      change: 0,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "info" | "default"> = {
      delivered: "success",
      processing: "warning",
      shipped: "info",
      pending: "default",
      cancelled: "default",
    };
    return variants[status] || "default";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="font-display text-2xl">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
        >
          ✦ Overview
        </motion.p>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-2 font-display text-4xl tracking-tight"
        >
          Welcome back
        </motion.h2>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
            >
              <Card className="glass border-foreground/10 shadow-soft hover:shadow-luxe transition-all duration-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="font-display text-3xl">{stat.value}</div>
                  <StatChange value={stat.change} />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Pending orders banner */}
      {stats.pendingOrders > 0 && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm"
        >
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            You have{" "}
            <button
              onClick={() => navigate("/admin/orders?status=pending")}
              className="font-semibold underline underline-offset-2 hover:text-amber-400"
            >
              {stats.pendingOrders} pending order{stats.pendingOrders !== 1 ? "s" : ""}
            </button>{" "}
            waiting for action.
          </span>
        </motion.div>
      )}

      {/* Revenue + Orders charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="glass border-foreground/10 shadow-soft">
            <CardHeader>
              <CardTitle className="font-display text-2xl tracking-tight">
                Revenue Overview
              </CardTitle>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Last 6 months
              </p>
            </CardHeader>
            <CardContent>
              {chartData.every((d) => d.revenue === 0) ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>No revenue data yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip
                      formatter={(value: number) => [formatLKR(value), "Revenue"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="glass border-foreground/10 shadow-soft">
            <CardHeader>
              <CardTitle className="font-display text-2xl tracking-tight">
                Orders Overview
              </CardTitle>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Last 6 months
              </p>
            </CardHeader>
            <CardContent>
              {chartData.every((d) => d.orders === 0) ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>No orders yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip
                      formatter={(value: number) => [value, "Orders"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="orders"
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Moving Items + Order Status Breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Moving Items — 2/3 width */}
        <motion.div
          className="lg:col-span-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="glass border-foreground/10 shadow-soft h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-2xl tracking-tight flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Top Moving Items
                </CardTitle>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                  Best sellers by units sold
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/products")}
                className="text-xs text-muted-foreground hover:text-foreground transition underline underline-offset-2"
              >
                View all
              </button>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No sales data yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((product) => {
                    const maxQty = topProducts[0]?.total_quantity || 1;
                    const pct = Math.round((product.total_quantity / maxQty) * 100);
                    const isLow =
                      product.current_stock !== null && product.current_stock <= 5;

                    return (
                      <div
                        key={product.product_id ?? product.product_name}
                        className="flex items-center gap-4 group"
                      >
                        {/* Rank */}
                        <span
                          className={`w-6 text-center text-xs font-bold shrink-0 ${
                            product.rank === 1
                              ? "text-amber-500"
                              : product.rank === 2
                                ? "text-slate-400"
                                : product.rank === 3
                                  ? "text-amber-700"
                                  : "text-muted-foreground"
                          }`}
                        >
                          #{product.rank}
                        </span>

                        {/* Image */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-foreground/5 shrink-0">
                          {product.product_image_url ? (
                            <img
                              src={product.product_image_url}
                              alt={product.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Name + bar */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-medium truncate">
                              {product.product_name}
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                              {isLow && (
                                <span className="text-xs text-amber-500 font-medium flex items-center gap-0.5">
                                  <AlertTriangle className="h-3 w-3" />
                                  Low stock
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {product.total_quantity} sold
                              </span>
                              <span className="text-xs font-semibold">
                                {formatLKR(product.total_revenue)}
                              </span>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {product.current_stock !== null && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {product.current_stock} in stock
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Status Breakdown — 1/3 width */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="glass border-foreground/10 shadow-soft h-full">
            <CardHeader>
              <CardTitle className="font-display text-2xl tracking-tight">
                Order Status
              </CardTitle>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                All time breakdown
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {statusPieData.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No orders yet.</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {statusPieData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={STATUS_COLORS[entry.name] ?? "hsl(var(--muted))"}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number, name: string) => [value, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-2">
                    {Object.entries(statusBreakdown).map(([status, count]) => (
                      <div
                        key={status}
                        onClick={() =>
                          navigate(`/admin/orders?status=${status}`)
                        }
                        className="flex items-center justify-between text-sm cursor-pointer hover:bg-foreground/5 rounded-lg px-2 py-1 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                STATUS_COLORS[status] ?? "hsl(var(--muted))",
                            }}
                          />
                          <span className="capitalize text-muted-foreground">
                            {status}
                          </span>
                        </div>
                        <span className="font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Low Stock Alert + Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            <Card className="glass border-amber-500/20 shadow-soft h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display text-xl tracking-tight flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Low Stock
                  </CardTitle>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    ≤ 5 units remaining
                  </p>
                </div>
                <button
                  onClick={() => navigate("/admin/products")}
                  className="text-xs text-muted-foreground hover:text-foreground transition underline underline-offset-2"
                >
                  Manage
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() =>
                        navigate(`/admin/products/${product.id}/edit`)
                      }
                      className="flex items-center gap-3 cursor-pointer hover:bg-foreground/5 -mx-2 px-2 py-1.5 rounded-lg transition"
                    >
                      <div className="w-8 h-8 rounded-md overflow-hidden bg-foreground/5 shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-3 w-3 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                      </div>
                      <span
                        className={`text-xs font-bold shrink-0 ${
                          product.stock_quantity === 0
                            ? "text-rose-500"
                            : "text-amber-500"
                        }`}
                      >
                        {product.stock_quantity === 0
                          ? "Out of stock"
                          : `${product.stock_quantity} left`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Orders */}
        <motion.div
          className={lowStockProducts.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Card className="glass border-foreground/10 shadow-soft h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-2xl tracking-tight">
                  Recent Orders
                </CardTitle>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                  Latest transactions
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/orders")}
                className="text-xs text-muted-foreground hover:text-foreground transition underline underline-offset-2"
              >
                View all
              </button>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="flex items-center justify-between border-b border-foreground/5 pb-4 last:border-0 last:pb-0 hover:bg-foreground/[0.02] -mx-2 px-2 py-2 rounded-lg transition cursor-pointer"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customer_name} • {order.customer_email}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={getStatusBadge(order.status)}
                          className="capitalize"
                        >
                          {order.status}
                        </Badge>
                        <p className="font-display text-lg">
                          {formatLKR(order.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
