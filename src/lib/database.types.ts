export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          featured: boolean
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          compare_at_price: number | null
          category_id: string | null
          image_url: string
          gallery: string[]
          in_stock: boolean
          stock_quantity: number
          featured: boolean
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      product_collections: {
        Row: {
          product_id: string
          collection_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['product_collections']['Row'], 'created_at'>
        Update: never
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['cart_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['cart_items']['Insert']>
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          order_number: string
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          customer_email: string
          customer_name: string
          customer_phone: string | null
          shipping_address_line1: string
          shipping_address_line2: string | null
          shipping_city: string
          shipping_state: string
          shipping_postal_code: string
          shipping_country: string
          subtotal: number
          shipping_cost: number
          tax: number
          total: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_image_url: string | null
          price: number
          quantity: number
          subtotal: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      collections: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string
          featured: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['collections']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['collections']['Insert']>
      }
      store_settings: {
        Row: {
          id: string
          free_shipping_threshold: number
          standard_shipping_rate: number
          express_shipping_rate: number
          international_shipping_enabled: boolean
          hero_tag_label: string
          hero_tag_title: string
          hero_price_label: string
          hero_price_value: string
          hero_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['store_settings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['store_settings']['Insert']>
      }
    }
  }
}
