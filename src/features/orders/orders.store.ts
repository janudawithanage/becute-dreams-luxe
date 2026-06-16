import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

interface OrdersState {
  orders: Order[];
  createOrder: (order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt" | "statusHistory">) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByCustomer: (customerId: string) => Order[];
  getAllOrders: () => Order[];
  deleteOrder: (orderId: string) => void;
}

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (orderData) => {
        const orderId = `order-${Date.now()}`;
        const now = new Date().toISOString();
        
        const newOrder: Order = {
          ...orderData,
          id: orderId,
          orderNumber: generateOrderNumber(),
          createdAt: now,
          updatedAt: now,
          statusHistory: [
            {
              status: orderData.status,
              timestamp: now,
              note: "Order created",
            },
          ],
        };

        set((state) => ({
          orders: [...state.orders, newOrder],
        }));

        return orderId;
      },

      updateOrderStatus: (orderId, status, note) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  updatedAt: new Date().toISOString(),
                  statusHistory: [
                    ...order.statusHistory,
                    {
                      status,
                      timestamp: new Date().toISOString(),
                      note,
                    },
                  ],
                }
              : order
          ),
        }));
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },

      getOrdersByCustomer: (customerId) => {
        return get().orders.filter((order) => order.customerId === customerId);
      },

      getAllOrders: () => {
        return get().orders;
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        }));
      },
    }),
    {
      name: "orders-storage",
    }
  )
);
