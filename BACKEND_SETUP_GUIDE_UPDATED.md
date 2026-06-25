# 🚀 Backend Setup Guide - Steps 5-9 with Cloudinary Integration

**Project**: Becute Dreams Luxe E-commerce
**Last Updated**: June 19, 2026
**Starting Point**: You've completed Steps 1-4 (Supabase setup, Database schema, Client setup, Authentication)
**Estimated Time**: 4-5 hours

---

## 📋 What's Covered in This Guide

- ✅ Step 5: Products Integration with Cloudinary
- ✅ Step 6: Cart Integration  
- ✅ Step 7: Orders System
- ✅ Step 8: Admin Features with Image Upload
- ✅ Step 9: Testing & Deployment

---

## 🎯 Prerequisites

Before starting, ensure you have:
- ✅ Completed Steps 1-4 from the original guide
- ✅ Supabase project configured and running
- ✅ Database tables created (profiles, categories, products, cart_items, orders, order_items)
- ✅ Authentication working
- ✅ All required environment variables in `.env.local`

---

## Step 5: Products Integration with Cloudinary (1.5 hours)

### 5.1 Setup Cloudinary Account (15 min)

1. **Create Cloudinary Account**
   - Go to https://cloudinary.com
   - Click **"Sign Up for Free"**
   - Choose "Developer" plan (Free)
   - Verify your email

2. **Get Your Credentials**
   - Go to Dashboard → Settings → Product Environment Credentials
   - You'll see:
     - Cloud Name (e.g., `dxxxxx`)
     - API Key (e.g., `123456789012345`)
     - API Secret (keep this secret!)

3. **Configure Upload Preset** (Important for unsigned uploads from frontend)
   - Go to **Settings** → **Upload**
   - Scroll down to **Upload presets**
   - Click **"Add upload preset"**
   - Configure:
     - Preset name: `becute-products` (remember this!)
     - Signing Mode: **Unsigned**
     - Folder: `becute-dreams-luxe/products`
     - Allowed formats: `jpg, png, webp, avif`
   - Click **"Save"**

4. **Update Environment Variables**

Add to your `.env.local`:

```env
# Existing Supabase config...
VITE_SUPABASE_URL=https://eyufkjnsrcaexkbgchyk.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_hXnrbbSuX0_TGa9VrChzsg_p5mMnF_d

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=becute-products
```

⚠️ **Note**: We don't store API Secret in frontend! Unsigned upload preset handles security.

✅ **Checkpoint**: Cloudinary account is ready!

### 5.2 Install Cloudinary SDK (5 min)

```bash
npm install cloudinary-react
```

### 5.3 Create Cloudinary Upload Utility (15 min)

Create `src/lib/cloudinary.ts`:

```typescript
interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

interface UploadOptions {
  folder?: string;
  transformation?: string;
}

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

export async function uploadToCloudinary(
  file: File,
  options?: UploadOptions
): Promise<CloudinaryUploadResponse> {
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Check your .env.local file.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  
  if (options?.folder) {
    formData.append('folder', options.folder);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    return await response.json();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// Helper to generate optimized image URLs
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif';
  }
): string {
  // If it's already a full URL, return as is
  if (publicIdOrUrl.startsWith('http')) {
    return publicIdOrUrl;
  }

  const { width, height, quality = 'auto', format = 'auto' } = options || {};
  
  let transformation = `f_${format},q_${quality}`;
  if (width) transformation += `,w_${width}`;
  if (height) transformation += `,h_${height},c_fill`;

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformation}/${publicIdOrUrl}`;
}

// Helper to delete images (requires backend/admin API)
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  console.warn('Delete requires backend API with API secret. Implement server-side endpoint.');
  // This should be implemented via your backend/Supabase Edge Function
}
```

✅ **Checkpoint**: Cloudinary utilities are ready!

### 5.4 Create Products Service (25 min)

Create `src/features/products/products.service.ts`:

```typescript
import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  image_url: string;
  gallery: string[];
  in_stock: boolean;
  featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
}

export const productsService = {
  // Fetch all products with optional filters
  async getAll(filters?: {
    category?: string;
    featured?: boolean;
    search?: string;
    inStock?: boolean;
  }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    if (filters?.inStock !== undefined) {
      query = query.eq('in_stock', filters.inStock);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return data as Product[];
  },

  // Fetch single product by slug
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }

    return data as Product;
  },

  // Fetch single product by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }

    return data as Product;
  },

  // Fetch all categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data as Category[];
  },
};
```

✅ **Checkpoint**: Products service is ready!

### 5.5 Update Products Store (30 min)

Replace `src/features/products/products.store.ts` with backend-connected version:

```typescript
import { create } from 'zustand';
import { productsService, type Product, type Category } from './products.service';

interface ProductsState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  
  // Actions
  fetchProducts: (filters?: {
    category?: string;
    featured?: boolean;
    search?: string;
    inStock?: boolean;
  }) => Promise<void>;
  fetchCategories: () => Promise<void>;
  getProductBySlug: (slug: string) => Promise<Product | null>;
  getProductById: (id: string) => Promise<Product | null>;
  
  // Computed getters (for backward compatibility)
  getProducts: () => Product[];
  getProductsByCategory: (categoryId: string) => Product[];
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,
  initialized: false,

  fetchProducts: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const products = await productsService.getAll(filters);
      set({ products, isLoading: false, initialized: true });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false 
      });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await productsService.getCategories();
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  getProductBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productsService.getBySlug(slug);
      set({ isLoading: false });
      return product;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        isLoading: false 
      });
      return null;
    }
  },

  getProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productsService.getById(id);
      set({ isLoading: false });
      return product;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        isLoading: false 
      });
      return null;
    }
  },

  // Backward compatibility methods
  getProducts: () => get().products,
  
  getProductsByCategory: (categoryId: string) => {
    return get().products.filter(p => p.category_id === categoryId);
  },
}));
```

✅ **Checkpoint**: Products store now connects to Supabase!

### 5.6 Update Shop Page to Use Real Data (10 min)

Now update any component that displays products. Example for a shop page:

```typescript
import { useEffect } from 'react';
import { useProductsStore } from '@/features/products/products.store';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

function ShopPage() {
  const { 
    products, 
    categories, 
    isLoading, 
    error, 
    fetchProducts, 
    fetchCategories 
  } = useProductsStore();

  useEffect(() => {
    fetchProducts({ inStock: true });
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  if (isLoading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <div>
      <h1>Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img 
              src={getOptimizedImageUrl(product.image_url, { 
                width: 400, 
                format: 'auto' 
              })} 
              alt={product.name}
            />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

✅ **Checkpoint**: Products are loading from Supabase database!

---

## Step 6: Cart Integration (1 hour)

### 6.1 Create Cart Service (20 min)

Create `src/features/cart/cart.service.ts`:

```typescript
import { supabase } from '@/lib/supabase';
import type { Product } from '@/features/products/products.service';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

export const cartService = {
  // Get user's cart items
  async getCartItems(userId: string) {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }

    return data as CartItem[];
  },

  // Add item to cart or update quantity if exists
  async addToCart(userId: string, productId: string, quantity: number = 1) {
    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existing.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Update item quantity
  async updateQuantity(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove item from cart
  async removeFromCart(userId: string, productId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
  },

  // Clear entire cart
  async clearCart(userId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },
};
```

✅ **Checkpoint**: Cart service is ready!

### 6.2 Update Cart Store (30 min)

Replace `src/features/cart/cart.store.ts`:

```typescript
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
          alert('Please sign in to add items to cart');
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
```

✅ **Checkpoint**: Cart is now synced with database!

### 6.3 Initialize Cart on Login (10 min)

Update `src/App.tsx` to load cart when user logs in:

```typescript
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth';
import { useCart } from '@/features/cart';

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  const loadCart = useCart((state) => state.loadCart);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user, loadCart]);

  // ... rest of your app
}

export default App;
```

✅ **Checkpoint**: Cart loads automatically on login!

---

## Step 7: Orders System (1.5 hours)

### 7.1 Create Orders Service (35 min)

Create `src/features/orders/orders.service.ts`:

```typescript
import { supabase } from '@/lib/supabase';

export interface CreateOrderData {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    productImageUrl: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  notes?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

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

export const ordersService = {
  async createOrder(userId: string, orderData: CreateOrderData) {
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          order_number: orderNumber,
          customer_email: orderData.customerEmail,
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone,
          shipping_address_line1: orderData.shippingAddress.line1,
          shipping_address_line2: orderData.shippingAddress.line2,
          shipping_city: orderData.shippingAddress.city,
          shipping_state: orderData.shippingAddress.state,
          shipping_postal_code: orderData.shippingAddress.postalCode,
          shipping_country: orderData.shippingAddress.country,
          subtotal: orderData.subtotal,
          shipping_cost: orderData.shippingCost,
          tax: orderData.tax,
          total: orderData.total,
          notes: orderData.notes,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        product_image_url: item.productImageUrl,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order as Order;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },

  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products(name, image_url)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }

    return data;
  },

  async getOrderById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }

    return data;
  },
};
```

✅ **Checkpoint**: Orders service is ready!

### 7.2 Create Orders Store (20 min)

Create `src/features/orders/orders.store.ts`:

```typescript
import { create } from 'zustand';
import { ordersService, type Order, type CreateOrderData } from './orders.service';
import { useCart } from '@/features/cart';
import { useAuthStore } from '@/features/auth';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  
  createOrder: (orderData: CreateOrderData) => Promise<Order | null>;
  fetchUserOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Promise<any>;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
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
}));
```

✅ **Checkpoint**: Orders store is ready!


### 7.3 Update Checkout Page (40 min)

Update your checkout page to create real orders. Example:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { useCart } from '@/features/cart';
import { useOrdersStore } from '@/features/orders';

function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { items, total } = useCart();
  const createOrder = useOrdersStore((state) => state.createOrder);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    
    setIsSubmitting(true);
    try {
      const orderData = {
        customerEmail: user.email,
        customerName: formData.get('fullName') as string,
        customerPhone: formData.get('phone') as string,
        shippingAddress: {
          line1: formData.get('address') as string,
          line2: formData.get('apartment') as string,
          city: formData.get('city') as string,
          state: formData.get('state') as string,
          postalCode: formData.get('zipCode') as string,
          country: 'US',
        },
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productImageUrl: item.product.image_url,
          price: item.product.price,
          quantity: item.quantity,
        })),
        subtotal: total(),
        shippingCost: 5.99,
        tax: total() * 0.08,
        total: total() + 5.99 + (total() * 0.08),
        notes: formData.get('notes') as string,
      };

      const order = await createOrder(orderData);
      
      if (order) {
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (error) {
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your checkout form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}
```

✅ **Checkpoint**: Orders are being saved to database!

---

## Step 8: Admin Features with Image Upload (1 hour)

### 8.1 Create Your First Admin User (10 min)

1. Sign up for an account in your app
2. Go to Supabase dashboard → **Table Editor** → **profiles**
3. Find your user row
4. Click on the `role` cell
5. Change from `customer` to `admin`
6. Click the checkmark to save
7. Log out and log back in

✅ **Checkpoint**: You now have admin access!


### 8.2 Create Admin Service (30 min)

Create `src/features/admin/admin.service.ts`:

```typescript
import { supabase } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const adminService = {
  // Dashboard Stats
  async getDashboardStats() {
    try {
      // Get total orders
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true });

      // Get total products
      const { count: productsCount } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true });

      // Get total revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total');

      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      // Get pending orders
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

      return {
        totalOrders: ordersCount || 0,
        totalProducts: productsCount || 0,
        totalRevenue,
        pendingOrders: pendingCount || 0,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },

  // Get all orders with pagination
  async getAllOrders(page = 1, pageSize = 20) {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(count)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        orders: data,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  },

  // Product Management with Image Upload
  async createProduct(productData: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    compare_at_price?: number;
    category_id?: string;
    image: File;
    gallery?: File[];
    in_stock?: boolean;
    featured?: boolean;
    tags?: string[];
  }) {
    try {
      // Upload main image to Cloudinary
      const imageUpload = await uploadToCloudinary(productData.image, {
        folder: 'becute-dreams-luxe/products',
      });

      // Upload gallery images if provided
      let galleryUrls: string[] = [];
      if (productData.gallery && productData.gallery.length > 0) {
        const galleryUploads = await Promise.all(
          productData.gallery.map(file =>
            uploadToCloudinary(file, {
              folder: 'becute-dreams-luxe/products/gallery',
            })
          )
        );
        galleryUrls = galleryUploads.map(upload => upload.secure_url);
      }

      // Create product in database
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          compare_at_price: productData.compare_at_price,
          category_id: productData.category_id,
          image_url: imageUpload.secure_url,
          gallery: galleryUrls,
          in_stock: productData.in_stock ?? true,
          featured: productData.featured ?? false,
          tags: productData.tags ?? [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  async updateProduct(
    id: string,
    updates: {
      name?: string;
      slug?: string;
      description?: string;
      price?: number;
      compare_at_price?: number;
      category_id?: string;
      image?: File;
      gallery?: File[];
      in_stock?: boolean;
      featured?: boolean;
      tags?: string[];
    }
  ) {
    try {
      let imageUrl: string | undefined;
      let galleryUrls: string[] | undefined;

      // Upload new main image if provided
      if (updates.image) {
        const imageUpload = await uploadToCloudinary(updates.image, {
          folder: 'becute-dreams-luxe/products',
        });
        imageUrl = imageUpload.secure_url;
      }

      // Upload new gallery images if provided
      if (updates.gallery && updates.gallery.length > 0) {
        const galleryUploads = await Promise.all(
          updates.gallery.map(file =>
            uploadToCloudinary(file, {
              folder: 'becute-dreams-luxe/products/gallery',
            })
          )
        );
        galleryUrls = galleryUploads.map(upload => upload.secure_url);
      }

      const { data, error } = await supabase
        .from('products')
        .update({
          ...(updates.name && { name: updates.name }),
          ...(updates.slug && { slug: updates.slug }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.price && { price: updates.price }),
          ...(updates.compare_at_price !== undefined && { compare_at_price: updates.compare_at_price }),
          ...(updates.category_id && { category_id: updates.category_id }),
          ...(imageUrl && { image_url: imageUrl }),
          ...(galleryUrls && { gallery: galleryUrls }),
          ...(updates.in_stock !== undefined && { in_stock: updates.in_stock }),
          ...(updates.featured !== undefined && { featured: updates.featured }),
          ...(updates.tags && { tags: updates.tags }),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },

  // Get all customers
  async getAllCustomers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      throw error;
    }
  },
};
```

✅ **Checkpoint**: Admin service with image upload is ready!


### 8.3 Create Admin Store (10 min)

Create `src/features/admin/admin.store.ts`:

```typescript
import { create } from 'zustand';
import { adminService } from './admin.service';

interface AdminState {
  stats: {
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number;
    pendingOrders: number;
  } | null;
  isLoading: boolean;
  
  fetchStats: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: null,
  isLoading: false,

  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const stats = await adminService.getDashboardStats();
      set({ stats, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  },
}));
```

✅ **Checkpoint**: Admin store is ready!

### 8.4 Protect Admin Routes (10 min)

Create or update `src/shared/components/ProtectedRoute.tsx`:

```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

Then use it in your routes:

```typescript
<Route 
  path="/admin/*" 
  element={
    <ProtectedRoute requireAdmin>
      <AdminLayout />
    </ProtectedRoute>
  } 
/>
```

✅ **Checkpoint**: Admin features with image upload are working!

---

## Step 9: Testing & Deployment (1 hour)

### 9.1 Complete Testing Checklist (30 min)

Test everything systematically:

#### Authentication ✅
- [ ] Sign up new user
- [ ] Verify user in Supabase dashboard
- [ ] Sign in with credentials
- [ ] Sign out
- [ ] Try signing in with wrong password
- [ ] Session persists after page refresh

#### Products ✅
- [ ] View all products on shop page
- [ ] Products load from database
- [ ] Filter products by category
- [ ] View single product details
- [ ] Featured products show correctly
- [ ] Images load from Cloudinary (check Network tab)

#### Shopping Cart ✅
- [ ] Add product to cart (must be logged in)
- [ ] Cart shows in header badge
- [ ] Update quantity in cart
- [ ] Remove item from cart
- [ ] Cart persists after refresh
- [ ] Cart loads after login


#### Orders ✅
- [ ] Complete checkout flow
- [ ] Order appears in database
- [ ] Order confirmation page shows
- [ ] Cart clears after order
- [ ] View order history
- [ ] Order details page works

#### Admin Features ✅
- [ ] Admin can access dashboard
- [ ] Dashboard shows correct stats
- [ ] View all orders
- [ ] Update order status
- [ ] Create new product with image upload
- [ ] Images upload to Cloudinary
- [ ] Edit existing product
- [ ] Update product images
- [ ] Delete product
- [ ] Regular users cannot access admin

### 9.2 Environment Variables for Production (5 min)

When deploying, you'll need these environment variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=becute-products
```

⚠️ **IMPORTANT**: Never commit `.env.local` to Git!

### 9.3 Deploy to Vercel (15 min)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Supabase and Cloudinary backend integration"
   git push
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_CLOUDINARY_CLOUD_NAME`
     - `VITE_CLOUDINARY_UPLOAD_PRESET`
   - Click "Deploy"

3. **Test Production**
   - Visit your deployed URL
   - Test sign up
   - Test placing an order
   - Test admin product creation with image upload

### 9.4 Deploy to Netlify (Alternative)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your app**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Add Environment Variables**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add all your environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_CLOUDINARY_CLOUD_NAME`
     - `VITE_CLOUDINARY_UPLOAD_PRESET`

✅ **Checkpoint**: Your app is live with Cloudinary image uploads!

---

## 🎉 Congratulations!

You've successfully built a full-stack e-commerce application with cloud image management!

### What You've Accomplished

✅ **Backend Infrastructure**
- PostgreSQL database with 6 tables
- Row Level Security configured
- RESTful API (auto-generated)
- Real-time capabilities ready

✅ **Authentication System**
- User registration
- Login/logout
- Session management
- Role-based access control

✅ **E-commerce Features**
- Product catalog with cloud images
- Shopping cart with persistence
- Order processing
- Order history
- Admin dashboard with image upload

✅ **Cloud Image Management**
- Cloudinary integration
- Image optimization
- Multiple image upload
- Gallery support

✅ **Production Ready**
- Deployed to hosting
- Environment variables configured
- Security policies in place
- Image CDN configured

### Key Skills Learned

- Database design
- SQL queries
- API integration
- Authentication flows
- State management
- Row Level Security
- Cloud image storage
- Image optimization
- Deployment

---


## 🔧 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:**
- Check `.env.local` file exists
- Verify variable names start with `VITE_`
- Restart dev server after changes

### Issue: "Missing Cloudinary configuration"

**Solution:**
- Verify `VITE_CLOUDINARY_CLOUD_NAME` is set correctly
- Check `VITE_CLOUDINARY_UPLOAD_PRESET` matches your Cloudinary preset
- Ensure upload preset is set to "Unsigned" mode
- Restart dev server after adding variables

### Issue: Products not loading

**Solution:**
```sql
-- Check products exist
SELECT * FROM products;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'products';
```

### Issue: Cart not saving

**Solution:**
- Verify user is logged in
- Check `cart_items` table policies
- Look for errors in browser console

### Issue: Can't create orders

**Solution:**
- Ensure user is authenticated
- Check all required fields are provided
- Verify orders table policies

### Issue: Admin routes not working

**Solution:**
- Check user `role` is set to `'admin'` in profiles table
- Clear browser cache and cookies
- Re-login after role change

### Issue: Image upload fails

**Solution:**
- Check Cloudinary credentials are correct
- Verify upload preset exists and is "Unsigned"
- Check file size (free tier has limits)
- Look for CORS errors in browser console
- Verify allowed file formats in preset settings

### Issue: Images not displaying

**Solution:**
- Check image URL in database
- Verify Cloudinary cloud name is correct
- Test image URL directly in browser
- Check browser console for 404 errors

### Issue: Authentication not persisting

**Solution:**
- Check browser allows localStorage
- Verify auth store is using persist middleware
- Check for errors in browser console

### Database Connection Issues

**Solution:**
```typescript
// Test connection
const { data, error } = await supabase.from('products').select('count');
console.log('Connection test:', { data, error });
```

---

## 📚 Next Steps & Enhancements

### Level 1: Polish Your App

1. **Add Loading States**
   - Skeleton screens
   - Loading spinners
   - Progress indicators for image uploads

2. **Error Handling**
   - Toast notifications
   - Error boundaries
   - Retry mechanisms
   - Upload progress bars

3. **Form Validation**
   - Client-side validation
   - Error messages
   - Input sanitization
   - File type validation

### Level 2: Add Features

1. **Product Search**
   - Full-text search
   - Filters and sorting
   - Search suggestions

2. **User Profile**
   - Edit profile
   - Avatar upload to Cloudinary
   - Change password
   - Order history

3. **Product Reviews**
   - Star ratings
   - Review comments with images
   - Review moderation

### Level 3: Advanced Features

1. **Payment Integration**
   - Stripe or PayPal
   - Secure checkout
   - Payment webhooks

2. **Email Notifications**
   - Order confirmations
   - Shipping updates
   - Welcome emails with product images

3. **Inventory Management**
   - Stock tracking
   - Low stock alerts
   - Automatic restocking

4. **Analytics**
   - Sales reports
   - Popular products
   - Customer insights

5. **Real-time Features**
   - Live order updates
   - Stock notifications
   - Admin notifications

### Level 4: Optimization

1. **Performance**
   - Image lazy loading
   - Code splitting
   - CDN optimization
   - Responsive images

2. **SEO**
   - Meta tags with og:image from Cloudinary
   - Sitemap
   - Structured data

3. **Security**
   - Rate limiting for uploads
   - CAPTCHA
   - Content Security Policy
   - Image moderation

### Level 5: Advanced Cloudinary Features

1. **Image Transformations**
   - Auto-cropping
   - Face detection
   - Watermarking
   - Format conversion

2. **Video Support**
   - Product videos
   - Video optimization
   - Thumbnail generation

3. **AI-Powered Features**
   - Auto-tagging
   - Background removal
   - Image quality enhancement

---

## 📖 Resources

### Supabase Documentation
- [Getting Started](https://supabase.com/docs)
- [Auth Guide](https://supabase.com/docs/guides/auth)
- [Database Guide](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Cloudinary Documentation
- [Getting Started](https://cloudinary.com/documentation)
- [Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [React SDK](https://cloudinary.com/documentation/react_integration)

### Learning Resources
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [SQL Basics](https://www.sqltutorial.org/)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community
- [Supabase Discord](https://discord.supabase.com/)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Cloudinary Community](https://community.cloudinary.com/)

---


## ✅ Final Checklist

### Development Complete
- [ ] All database tables created
- [ ] Sample data inserted
- [ ] Authentication working
- [ ] Products loading from database
- [ ] Cart syncing with database
- [ ] Orders being saved
- [ ] Admin features functional
- [ ] Cloudinary account configured
- [ ] Image upload working
- [ ] Image optimization implemented
- [ ] All features tested

### Production Ready
- [ ] Environment variables set (Supabase + Cloudinary)
- [ ] App deployed
- [ ] Production tested
- [ ] Admin user created
- [ ] SSL/HTTPS enabled
- [ ] Error tracking configured
- [ ] Image CDN working

### Documentation
- [ ] README updated
- [ ] Deployment guide written
- [ ] API endpoints documented
- [ ] Database schema documented
- [ ] Image upload flow documented

---

## 🎊 You Did It!

You've transformed a frontend-only app into a production-ready full-stack e-commerce platform with cloud image management!

### Time Breakdown

- **Cloudinary Setup**: 15 min ✅
- **Cloudinary SDK & Utils**: 20 min ✅
- **Products Integration**: 1.5 hours ✅
- **Cart Integration**: 1 hour ✅
- **Orders System**: 1.5 hours ✅
- **Admin with Image Upload**: 1 hour ✅
- **Testing & Deployment**: 1 hour ✅

**Total**: ~6-7 hours (after completing Steps 1-4)

### What's Different from Original Guide?

✅ **Added Cloudinary Integration**
- Cloud-based image storage
- Image optimization
- CDN delivery
- Multiple image uploads
- Gallery support

✅ **Enhanced Admin Features**
- Image upload in product creation
- Gallery image management
- Cloudinary-optimized delivery

✅ **Better Performance**
- Images served from CDN
- Automatic format optimization
- Responsive image delivery

### What's Next?

1. **Use your app** - Add more products with beautiful images
2. **Get feedback** - Share with friends, gather insights
3. **Add features** - Pick from the enhancement list
4. **Keep learning** - Explore advanced Cloudinary transformations

---

## 🚀 Quick Commands Reference

### Development
```bash
# Start dev server
npm run dev

# Check for errors
npm run build

# Test production build
npm run preview
```

### Deployment
```bash
# Commit changes
git add .
git commit -m "Your message"
git push

# Netlify deploy
netlify deploy --prod

# Vercel deploy (automatic on push)
```

### Database
```sql
-- Check all products
SELECT * FROM products ORDER BY created_at DESC;

-- Check orders
SELECT * FROM orders ORDER BY created_at DESC;

-- Check user role
SELECT email, role FROM profiles WHERE email = 'your@email.com';

-- Make user admin
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 💡 Pro Tips

### Cloudinary Optimization
```typescript
// Use auto format and quality
getOptimizedImageUrl(publicId, { format: 'auto', quality: 'auto' });

// Responsive images
getOptimizedImageUrl(publicId, { width: 400 }); // Mobile
getOptimizedImageUrl(publicId, { width: 800 }); // Desktop
getOptimizedImageUrl(publicId, { width: 1200 }); // Large screens
```

### Performance Best Practices
1. Always use optimized image URLs
2. Implement lazy loading for images
3. Use appropriate image sizes for context
4. Cache Cloudinary responses
5. Use WebP/AVIF formats when supported

### Security Best Practices
1. Keep API secrets server-side only
2. Use unsigned uploads with presets
3. Implement file size limits
4. Validate file types
5. Monitor upload usage

---

**Questions or issues?** 
- Check the Troubleshooting section
- Visit Supabase Discord
- Visit Cloudinary Community
- Review both documentation sites

**Happy building! 🚀**

---

*Last Updated: June 19, 2026*
*Guide Version: 2.0 (with Cloudinary Integration)*
*Prerequisite: Complete Steps 1-4 from BACKEND_SETUP_GUIDE.md*
