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

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
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

    return data as OrderWithItems[];
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

    return data as OrderWithItems;
  },

  async updateOrderStatus(orderId: string, status: Order['status']) {
    // Get order items before updating status
    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('id', orderId)
      .single();

    if (fetchError) {
      console.error('Failed to fetch order:', fetchError);
      throw fetchError;
    }

    const previousStatus = orderData.status;

    // Update order status
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }

    // If status changed to "processing", decrement stock for all items
    if (status === 'processing' && previousStatus !== 'processing') {
      const orderWithItems = orderData as OrderWithItems;
      
      // Import productsService at the top of the file
      const { productsService } = await import('@/features/products/products.service');
      
      // Decrement stock for each order item
      for (const item of orderWithItems.order_items) {
        if (item.product_id) {
          try {
            await productsService.decrementStock(item.product_id, item.quantity);
          } catch (error) {
            console.error(`Failed to decrement stock for product ${item.product_id}:`, error);
            // Continue with other items even if one fails
          }
        }
      }
    }

    return data as Order;
  },

  async getAllOrders(filters?: {
    status?: Order['status'];
    search?: string;
  }) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`order_number.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }

    return data as OrderWithItems[];
  },
};
