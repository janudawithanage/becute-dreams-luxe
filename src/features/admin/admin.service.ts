import { supabase } from '@/lib/supabase';

export interface CustomerStats {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  role: 'customer' | 'admin';
  created_at: string;
  total_orders: number;
  total_spent: number;
}

export interface CustomerOrder {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items_count: number;
}

export interface CustomerDetail extends CustomerStats {
  orders: CustomerOrder[];
}

export const adminService = {
  // Dashboard Stats
  async getDashboardStats() {
    try {
      // Run all count/aggregation queries in parallel
      const [
        { count: ordersCount },
        { count: productsCount },
        { count: customersCount },
        { count: pendingCount },
        { data: revenueRows },
        // Previous month stats for change calculation
        { data: lastMonthRevRows },
        { count: lastMonthOrdersCount },
      ] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('total, created_at'),
        // last calendar month
        supabase
          .from('orders')
          .select('total')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString())
          .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString())
          .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      ]);

      const totalRevenue = revenueRows?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

      // Current month revenue
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const currentMonthRevenue = (revenueRows || [])
        .filter((o) => o.created_at >= currentMonthStart)
        .reduce((sum, o) => sum + Number(o.total), 0);

      const lastMonthRevenue = (lastMonthRevRows || []).reduce((sum, o) => sum + Number(o.total), 0);
      const revenueChange = lastMonthRevenue > 0
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

      const ordersChange = (lastMonthOrdersCount || 0) > 0
        ? (((ordersCount || 0) - (lastMonthOrdersCount || 0)) / (lastMonthOrdersCount || 0)) * 100
        : 0;

      return {
        totalOrders: ordersCount || 0,
        totalProducts: productsCount || 0,
        totalRevenue,
        pendingOrders: pendingCount || 0,
        totalCustomers: customersCount || 0,
        revenueChange: parseFloat(revenueChange.toFixed(1)),
        ordersChange: parseFloat(ordersChange.toFixed(1)),
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },

  // Top selling products by quantity sold (from order_items)
  async getTopSellingProducts(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          product_id,
          product_name,
          product_image_url,
          quantity,
          subtotal
        `);

      if (error) throw error;

      // Aggregate by product_id in JS
      const productMap = new Map<string, {
        product_id: string | null;
        product_name: string;
        product_image_url: string | null;
        total_quantity: number;
        total_revenue: number;
      }>();

      for (const item of data || []) {
        const key = item.product_id ?? item.product_name;
        const existing = productMap.get(key);
        if (existing) {
          existing.total_quantity += item.quantity;
          existing.total_revenue += Number(item.subtotal);
        } else {
          productMap.set(key, {
            product_id: item.product_id,
            product_name: item.product_name,
            product_image_url: item.product_image_url,
            total_quantity: item.quantity,
            total_revenue: Number(item.subtotal),
          });
        }
      }

      const sorted = Array.from(productMap.values())
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, limit);

      // Fetch current stock for each product
      const productIds = sorted
        .filter((p) => p.product_id)
        .map((p) => p.product_id as string);

      let stockMap = new Map<string, number>();
      if (productIds.length > 0) {
        const { data: stockData } = await supabase
          .from('products')
          .select('id, stock_quantity')
          .in('id', productIds);

        for (const p of stockData || []) {
          stockMap.set(p.id, p.stock_quantity);
        }
      }

      return sorted.map((p, index) => ({
        rank: index + 1,
        product_id: p.product_id,
        product_name: p.product_name,
        product_image_url: p.product_image_url,
        total_quantity: p.total_quantity,
        total_revenue: parseFloat(p.total_revenue.toFixed(2)),
        current_stock: p.product_id ? (stockMap.get(p.product_id) ?? null) : null,
      }));
    } catch (error) {
      console.error('Failed to fetch top selling products:', error);
      throw error;
    }
  },

  // Low stock products (stock_quantity <= threshold)
  async getLowStockProducts(threshold = 5) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, image_url, stock_quantity, in_stock')
        .lte('stock_quantity', threshold)
        .order('stock_quantity', { ascending: true })
        .limit(8);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch low stock products:', error);
      throw error;
    }
  },

  // Order status breakdown counts
  async getOrderStatusBreakdown() {
    try {
      const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
      const results = await Promise.all(
        statuses.map((status) =>
          supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('status', status)
        )
      );

      return statuses.reduce(
        (acc, status, i) => {
          acc[status] = results[i].count || 0;
          return acc;
        },
        {} as Record<(typeof statuses)[number], number>
      );
    } catch (error) {
      console.error('Failed to fetch order status breakdown:', error);
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

  // Product Management
  async createProduct(product: any) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
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

  // Get all customers with stats
  async getAllCustomers(): Promise<CustomerStats[]> {
    try {
      // Fetch all customer profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Fetch all orders to calculate stats
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total');

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      // Calculate stats for each customer
      const customersWithStats: CustomerStats[] = (profiles || []).map((profile) => {
        const customerOrders = (orders || []).filter((o) => o.user_id === profile.id);
        const totalSpent = customerOrders.reduce((sum, order) => sum + Number(order.total), 0);

        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name || '',
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          postal_code: profile.postal_code,
          country: profile.country,
          role: profile.role,
          created_at: profile.created_at,
          total_orders: customerOrders.length,
          total_spent: totalSpent,
        };
      });

      return customersWithStats;
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      throw error;
    }
  },

  // Get customer detail with order history
  async getCustomerDetail(customerId: string): Promise<CustomerDetail> {
    try {
      // Fetch customer profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', customerId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      if (!profile) {
        throw new Error('Customer not found');
      }

      // Fetch customer orders with item count
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          total,
          order_items(count)
        `)
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      // Map orders to CustomerOrder format
      const customerOrders: CustomerOrder[] = (orders || []).map((order) => ({
        id: order.id,
        created_at: order.created_at,
        status: order.status,
        total: Number(order.total),
        items_count: order.order_items?.[0]?.count || 0,
      }));

      // Calculate stats
      const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);

      const customerDetail: CustomerDetail = {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || '',
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        postal_code: profile.postal_code,
        country: profile.country,
        role: profile.role,
        created_at: profile.created_at,
        total_orders: customerOrders.length,
        total_spent: totalSpent,
        orders: customerOrders,
      };

      return customerDetail;
    } catch (error) {
      console.error('Failed to fetch customer detail:', error);
      throw error;
    }
  },
};
