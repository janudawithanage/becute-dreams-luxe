import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
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
} from "recharts";
import { adminService } from "@/features/admin";
import { Badge } from "@/shared/components/ui/badge";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useOrdersStore } from "@/features/orders";
import { useNavigate } from "react-router-dom";
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { orders, fetchAllOrders } = useOrdersStore();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardStats = await adminService.getDashboardStats();
        setStats(dashboardStats);
        await fetchAllOrders();
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchAllOrders]);

  // Generate chart data from orders
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
        date: format(month, 'MMM'),
        revenue: parseFloat(revenue.toFixed(2)),
        orders: monthOrders.length,
      };
    });
  };

  const chartData = generateChartData();
  const recentOrders = orders.slice(0, 5);

  const statsData = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      icon: Package,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      icon: Users,
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
                <CardContent>
                  <div className="font-display text-3xl">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

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
              {chartData.every(d => d.revenue === 0) ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>No revenue data yet. Orders will appear here once placed.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
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
              {chartData.every(d => d.orders === 0) ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>No orders yet. Data will appear here once orders are placed.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip
                      formatter={(value: number) => [value, 'Orders']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
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

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="glass border-foreground/10 shadow-soft">
          <CardHeader>
            <CardTitle className="font-display text-2xl tracking-tight">Recent Orders</CardTitle>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Latest transactions
            </p>
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
                      <Badge variant={getStatusBadge(order.status)} className="capitalize">
                        {order.status}
                      </Badge>
                      <p className="font-display text-lg">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
