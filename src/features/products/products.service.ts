import { supabase } from '@/lib/supabase';
import type { Category } from '@/features/categories';
import type { Collection } from '@/features/collections';

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
  stock_quantity: number;
  featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
  collections?: Collection[];
}

export const productsService = {
  // Fetch all products with optional filters
  async getAll(filters?: {
    categorySlug?: string;
    collectionId?: string;
    featured?: boolean;
    search?: string;
    inStock?: boolean;
  }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_collections!inner(
          collection:collections(*)
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by category slug (join with categories table)
    if (filters?.categorySlug) {
      query = query.eq('category.slug', filters.categorySlug);
    }

    // Filter by collection ID (join with product_collections table)
    if (filters?.collectionId) {
      query = query.eq('product_collections.collection_id', filters.collectionId);
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

    // Transform the nested collections data
    const products = (data as any[]).map((p) => ({
      ...p,
      collections: p.product_collections?.map((pc: any) => pc.collection).filter(Boolean) || [],
      product_collections: undefined, // Remove intermediate join data
    }));

    return products as Product[];
  },

  // Fetch single product by slug
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_collections(
          collection:collections(*)
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }

    // Transform collections data
    const product = {
      ...data,
      collections: (data as any).product_collections?.map((pc: any) => pc.collection).filter(Boolean) || [],
      product_collections: undefined,
    };

    return product as Product;
  },

  // Fetch single product by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_collections(
          collection:collections(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }

    // Transform collections data
    const product = {
      ...data,
      collections: (data as any).product_collections?.map((pc: any) => pc.collection).filter(Boolean) || [],
      product_collections: undefined,
    };

    return product as Product;
  },

  // Get collections for a specific product
  async getProductCollections(productId: string) {
    const { data, error } = await supabase
      .from('product_collections')
      .select('collection:collections(*)')
      .eq('product_id', productId);

    if (error) {
      console.error('Error fetching product collections:', error);
      throw error;
    }

    return (data as any[]).map((pc) => pc.collection) as Collection[];
  },

  // Update product-collection relationships
  async updateProductCollections(productId: string, collectionIds: string[]) {
    // First, delete existing relationships
    const { error: deleteError } = await supabase
      .from('product_collections')
      .delete()
      .eq('product_id', productId);

    if (deleteError) {
      console.error('Error deleting product collections:', deleteError);
      throw deleteError;
    }

    // Then, insert new relationships
    if (collectionIds.length > 0) {
      const { error: insertError } = await supabase
        .from('product_collections')
        .insert(
          collectionIds.map((collectionId) => ({
            product_id: productId,
            collection_id: collectionId,
          }))
        );

      if (insertError) {
        console.error('Error inserting product collections:', insertError);
        throw insertError;
      }
    }
  },

  // Decrement product stock quantity
  async decrementStock(productId: string, quantity: number) {
    // Get current stock
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', productId)
      .single();

    if (fetchError) {
      console.error('Error fetching product stock:', fetchError);
      throw fetchError;
    }

    const newStock = product.stock_quantity - quantity;

    // Update stock quantity and in_stock status
    const { data, error } = await supabase
      .from('products')
      .update({
        stock_quantity: Math.max(0, newStock), // Prevent negative stock
        in_stock: newStock > 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }

    return data as Product;
  },
};
