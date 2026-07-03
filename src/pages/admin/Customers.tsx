import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Search, Mail, Phone, MapPin, Users, X } from "lucide-react";
import { adminService, type CustomerStats } from "@/features/admin/admin.service";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { usePagination } from "@/shared/hooks";
import { PaginationControls } from "@/shared/components/ui/PaginationControls";

export function Customers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [joinDateFilter, setJoinDateFilter] = useState("all");
  const [ordersFilter, setOrdersFilter] = useState("all");
  const [customers, setCustomers] = useState<CustomerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await adminService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesJoinDate = true;
    if (joinDateFilter !== "all") {
      const joinDate = new Date(customer.created_at);
      const now = new Date();
      if (joinDateFilter === "week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        matchesJoinDate = joinDate >= weekAgo;
      } else if (joinDateFilter === "month") {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        matchesJoinDate = joinDate >= monthAgo;
      } else if (joinDateFilter === "year") {
        const yearAgo = new Date(now);
        yearAgo.setFullYear(now.getFullYear() - 1);
        matchesJoinDate = joinDate >= yearAgo;
      }
    }

    let matchesOrders = true;
    if (ordersFilter === "none") matchesOrders = customer.total_orders === 0;
    else if (ordersFilter === "has_orders") matchesOrders = customer.total_orders > 0;
    else if (ordersFilter === "5plus") matchesOrders = customer.total_orders >= 5;

    return matchesSearch && matchesJoinDate && matchesOrders;
  });

  const hasActiveFilters = joinDateFilter !== "all" || ordersFilter !== "all";

  const clearFilters = () => {
    setJoinDateFilter("all");
    setOrdersFilter("all");
    setSearchQuery("");
  };

  const pagination = usePagination(filteredCustomers, { pageSize: 10 });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">✦ Community</p>
          <h2 className="mt-2 font-display text-4xl tracking-tight">Customers</h2>
        </div>
        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading customers...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">✦ Community</p>
          <h2 className="mt-2 font-display text-4xl tracking-tight">Customers</h2>
        </div>
        <Card className="glass border-foreground/10 shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 font-display text-2xl">No customers yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Customers will appear here once they register
            </p>
          </CardContent>
        </Card>
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
          ✦ Community
        </motion.p>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-2 font-display text-4xl tracking-tight"
        >
          Customers
        </motion.h2>
        <p className="mt-2 text-sm text-muted-foreground">View and manage customer accounts</p>
      </div>

      {/* Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="glass border-foreground/10 shadow-soft">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 rounded-full border-foreground/10 bg-background/50"
                />
              </div>
              <Select value={joinDateFilter} onValueChange={setJoinDateFilter}>
                <SelectTrigger className="h-12 w-full rounded-full border-foreground/10 bg-background/50 sm:w-[160px] text-xs uppercase tracking-wider">
                  <SelectValue placeholder="Joined" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ordersFilter} onValueChange={setOrdersFilter}>
                <SelectTrigger className="h-12 w-full rounded-full border-foreground/10 bg-background/50 sm:w-[160px] text-xs uppercase tracking-wider">
                  <SelectValue placeholder="Orders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="none">No Orders</SelectItem>
                  <SelectItem value="has_orders">Has Orders</SelectItem>
                  <SelectItem value="5plus">5+ Orders</SelectItem>
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
                    Customer
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Contact
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Join Date
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Location
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Orders
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Total Spent
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.paginatedItems.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="border-foreground/5 hover:bg-foreground/[0.02] transition cursor-pointer"
                    onClick={() => navigate(`/admin/customers/${customer.id}`)}
                  >
                    <TableCell className="font-medium">{customer.full_name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(customer.created_at), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {customer.city ? (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {customer.city}{customer.country ? `, ${customer.country}` : ''}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{customer.total_orders}</TableCell>
                    <TableCell className="font-display text-lg">
                      Rs. {customer.total_spent.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} &middot; Page {pagination.currentPage} of {pagination.totalPages}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
