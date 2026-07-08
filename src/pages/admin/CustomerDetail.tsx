import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Package,
  User,
} from "lucide-react";
import { adminService, type CustomerDetail as CustomerDetailType } from "@/features/admin/admin.service";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { formatLKR } from "@/shared/utils/format";

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCustomerDetail(id);
    }
  }, [id]);

  const loadCustomerDetail = async (customerId: string) => {
    try {
      const data = await adminService.getCustomerDetail(customerId);
      setCustomer(data);
    } catch (error) {
      console.error('Failed to load customer details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      delivered: "bg-green-500/10 text-green-600 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
    };
    return colors[status] || "bg-gray-500/10 text-gray-600 border-gray-500/20";
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={() => navigate("/admin/customers")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Button>
        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading customer details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" onClick={() => navigate("/admin/customers")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Button>
        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 font-display text-2xl">Customer not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/customers")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Button>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
          >
            ✦ Customer Profile
          </motion.p>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-2 font-display text-4xl tracking-tight"
          >
            {customer.full_name}
          </motion.h2>
        </div>
      </div>

      {/* Customer Info Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass border-foreground/10 shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-display">{customer.total_orders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="glass border-foreground/10 shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-2xl font-display">
                        {formatLKR(customer.total_spent)}
                      </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="glass border-foreground/10 shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                  <p className="text-2xl font-display">
                    {customer.total_orders > 0 
                      ? formatLKR(customer.total_spent / customer.total_orders)
                      : formatLKR(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="glass border-foreground/10 shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-lg font-display">
                    {format(new Date(customer.created_at), "MMM yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Contact Information */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="glass border-foreground/10 shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-display">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
                {customer.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                {(customer.address || customer.city || customer.country) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <div className="font-medium space-y-1">
                        {customer.address && <p>{customer.address}</p>}
                        {customer.city && (
                          <p>
                            {customer.city}
                            {customer.postal_code && ` ${customer.postal_code}`}
                          </p>
                        )}
                        {customer.country && <p>{customer.country}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Order History */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="glass border-foreground/10 shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-display">Order History</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-foreground/5">
                    <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Order ID
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Date
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Items
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Total
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.orders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="border-foreground/5 hover:bg-foreground/[0.02] transition"
                    >
                      <TableCell className="font-mono text-sm">
                        #{order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(order.created_at), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                      </TableCell>
                      <TableCell className="font-display text-lg">
                        {formatLKR(Number(order.total))}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
