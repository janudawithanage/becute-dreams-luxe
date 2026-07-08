import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService, type CartItem } from './cart.service';
import { useAuthStore } from '@/features/auth';
import type { Product } from '@/features/products/products.service';

interface CartState {
  items: CartItem[];
  open: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadCart: () => Promise<void>;
  add: (product: Product, quantity?: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  setQty: (productId: string, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
  setOpen: (open: boolean) => void;
  
  // Computed
  count: () => number;
  total: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      isLoading: false,
      error: null,

      loadCart: async () => {
        const user = useAuthStore.getState().user;
        if (!user) {
          set({ items: [] });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const items = await cartService.getCartItems(user.id);
          set({ items, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load cart',
            isLoading: false 
          });
        }
      },

      add: async (product: Product, quantity = 1) => {
        const user = useAuthStore.getState().user;
        
        if (!user) {
          // Callers (Shop, ProductDetail, etc.) already handle the unauthenticated
          // case by redirecting to sign-in before calling add(). This is a last-resort
          // guard — silently return rather than using a blocking alert().
          return;
        }

        set({ isLoading: true, error: null });
        try {
          await cartService.addToCart(user.id, product.id, quantity);
          await get().loadCart();
          set({ open: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add to cart',
            isLoading: false 
          });
        }
      },

      remove: async (productId: string) => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        set({ isLoading: true, error: null });
        try {
          await cartService.removeFromCart(user.id, productId);
          set((state) => ({
            items: state.items.filter(item => item.product_id !== productId),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove item',
            isLoading: false 
          });
        }
      },

      setQty: async (productId: string, quantity: number) => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        set({ isLoading: true, error: null });
        try {
          await cartService.updateQuantity(user.id, productId, quantity);
          
          if (quantity <= 0) {
            set((state) => ({
              items: state.items.filter(item => item.product_id !== productId),
              isLoading: false,
            }));
          } else {
            set((state) => ({
              items: state.items.map(item =>
                item.product_id === productId
                  ? { ...item, quantity }
                  : item
              ),
              isLoading: false,
            }));
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update quantity',
            isLoading: false 
          });
        }
      },

      clear: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        set({ isLoading: true, error: null });
        try {
          await cartService.clearCart(user.id);
          set({ items: [], isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to clear cart',
            isLoading: false 
          });
        }
      },

      setOpen: (open: boolean) => set({ open }),

      count: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      total: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        );
      },
    }),
    { 
      name: 'becute-cart',
      partialize: (state) => ({ open: state.open }),
    }
  )
);
