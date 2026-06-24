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
