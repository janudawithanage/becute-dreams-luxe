import { DashboardStats, Order, Customer, AdminProduct, SalesData } from "./admin.types";

export const mockDashboardStats: DashboardStats = {
  totalRevenue: 45231.89,
  totalOrders: 234,
  totalProducts: 48,
  totalCustomers: 156,
  revenueChange: 20.1,
  ordersChange: 12.5,
  productsChange: 8.3,
  customersChange: 15.2,
};

export const mockSalesData: SalesData[] = [
  { date: "2024-01", revenue: 12400, orders: 45 },
  { date: "2024-02", revenue: 15800, orders: 52 },
  { date: "2024-03", revenue: 18200, orders: 61 },
  { date: "2024-04", revenue: 16500, orders: 55 },
  { date: "2024-05", revenue: 21300, orders: 68 },
  { date: "2024-06", revenue: 25100, orders: 78 },
];

export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customer: "John Doe",
    email: "john@example.com",
    date: "2024-06-10",
    status: "delivered",
    total: 89.99,
    items: [
      {
        productId: "1",
        productName: "Cute Cat Phone Case",
        quantity: 1,
        price: 89.99,
        image: "/src/assets/cat-phone.jpg",
      },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2024-06-09",
    status: "processing",
    total: 159.98,
    items: [
      {
        productId: "2",
        productName: "Aesthetic Cat Laptop Skin",
        quantity: 2,
        price: 79.99,
        image: "/src/assets/cat-laptop.jpg",
      },
    ],
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    date: "2024-06-08",
    status: "shipped",
    total: 129.99,
    items: [
      {
        productId: "3",
        productName: "Custom Cat Portrait",
        quantity: 1,
        price: 129.99,
        image: "/src/assets/cat-custom.jpg",
      },
    ],
  },
];

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    joinDate: "2024-01-15",
    totalOrders: 12,
    totalSpent: 1245.67,
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 234 567 8901",
    joinDate: "2024-02-20",
    totalOrders: 8,
    totalSpent: 892.34,
    status: "active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    joinDate: "2024-03-10",
    totalOrders: 5,
    totalSpent: 567.89,
    status: "active",
  },
];

export const mockAdminProducts: AdminProduct[] = [
  {
    id: "1",
    slug: "cute-cat-phone-case",
    name: "Cute Cat Phone Case",
    price: 89.99,
    category: "phone-cases",
    image: "/src/assets/cat-phone.jpg",
    description: "Adorable cat-themed phone case",
    tag: "Trending",
    stock: 45,
    sku: "CAT-PHONE-001",
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-06-10",
  },
  {
    id: "2",
    slug: "aesthetic-cat-laptop-skin",
    name: "Aesthetic Cat Laptop Skin",
    price: 79.99,
    category: "laptop-accessories",
    image: "/src/assets/cat-laptop.jpg",
    description: "Beautiful aesthetic cat laptop skin",
    tag: "New",
    stock: 32,
    sku: "CAT-LAPTOP-001",
    status: "active",
    createdAt: "2024-02-01",
    updatedAt: "2024-06-09",
  },
];
