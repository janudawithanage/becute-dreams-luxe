export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
}

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  tag?: string;
  stock: number;
  sku: string;
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}
