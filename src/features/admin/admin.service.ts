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
      // First, let's see ALL profiles to debug
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('ALL profiles (before filter):', allProfiles);

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

      console.log('Filtered customer profiles:', profiles);
      console.log('Number of customers found:', profiles?.length || 0);

      // Fetch all orders to calculate stats
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total');

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      console.log('Fetched orders:', orders);

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

      console.log('Customers with stats:', customersWithStats);

      return customersWithStats;
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      throw error;
    }
  },
};
