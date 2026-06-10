import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown } from "lucide-react";
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
import { mockDashboardStats, mockSalesData, mockOrders } from "@/features/admin";
import { Badge } from "@/shared/components/ui/badge";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Total Revenue",
    value: `$${mockDashboardStats.totalRevenue.toLocaleString()}`,
    change: mockDashboardStats.revenueChange,
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: mockDashboardStats.totalOrders.toString(),
    change: mockDashboardStats.ordersChange,
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: mockDashboardStats.totalProducts.toString(),
    change: mockDashboardStats.productsChange,
    icon: Package,
  },
  {
    title: "Customers",
    value: mockDashboardStats.totalCustomers.toString(),
    change: mockDashboardStats.customersChange,
    icon: Users,
  },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, "success" | "warning" | "info" | "default"> = {
    delivered: "success",
    processing: "warning",
    shipped: "info",
    pending: "default",
  };
  return variants[status] || "default";
};

export function Dashboard() {
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
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;

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
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <TrendIcon
                      className={`h-3 w-3 ${isPositive ? "text-green-600" : "text-red-600"}`}
                    />
                    <span className={isPositive ? "text-green-600" : "text-red-600"}>
                      {Math.abs(stat.change)}%
                    </span>
                    <span>from last month</span>
                  </div>
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
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.16 0.01 280)"
                    strokeWidth={2}
                    dot={{ fill: "oklch(0.16 0.01 280)", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="oklch(0.16 0.01 280)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-foreground/5 pb-4 last:border-0 last:pb-0 hover:bg-foreground/[0.02] -mx-2 px-2 py-2 rounded-lg transition"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer} • {order.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={getStatusBadge(order.status)} className="capitalize">
                      {order.status}
                    </Badge>
                    <p className="font-display text-lg">${order.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
