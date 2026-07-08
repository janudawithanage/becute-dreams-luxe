import { create } from 'zustand';
import { ordersService, type Order, type CreateOrderData, type OrderWithItems } from './orders.service';
import { useCart } from '@/features/cart';
import { useAuthStore } from '@/features/auth';

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image_url: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

interface OrdersState {
  orders: OrderWithItems[];
  isLoading: boolean;
  error: string | null;
  
  createOrder: (orderData: CreateOrderData) => Promise<Order | null>;
  fetchUserOrders: () => Promise<void>;
  fetchAllOrders: (filters?: { status?: Order['status']; search?: string }) => Promise<void>;
  getOrderById: (orderId: string) => Promise<OrderWithItems | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  createOrder: async (orderData: CreateOrderData) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ error: 'User not authenticated' });
      return null;
    }

    set({ isLoading: true, error: null });
    try {
      const order = await ordersService.createOrder(user.id, orderData);
      
      // Clear cart after successful order
      await useCart.getState().clear();
      
      set({ isLoading: false });
      return order;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create order',
        isLoading: false 
      });
      return null;
    }
  },

  fetchUserOrders: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const orders = await ordersService.getUserOrders(user.id);
      set({ orders, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false 
      });
    }
  },

  fetchAllOrders: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await ordersService.getAllOrders(filters);
      set({ orders, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false 
      });
    }
  },

  getOrderById: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersService.getOrderById(orderId);
      set({ isLoading: false });
      return order;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch order',
        isLoading: false 
      });
      return null;
    }
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    set({ isLoading: true, error: null });
    try {
      await ordersService.updateOrderStatus(orderId, status);
      
      // Update local order in the list
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId
            ? { ...order, status, updated_at: new Date().toISOString() }
            : order
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update order status',
        isLoading: false 
      });
      throw error;
    }
  },
}));
