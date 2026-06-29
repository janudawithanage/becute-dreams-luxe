import { create } from 'zustand';
import { productsService, type Product } from './products.service';
import { supabase } from '@/lib/supabase';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  
  // Actions
  fetchProducts: (filters?: {
    categorySlug?: string;
    collectionId?: string;
    featured?: boolean;
    search?: string;
    inStock?: boolean;
  }) => Promise<void>;
  getProductBySlug: (slug: string) => Promise<Product | null>;
  getProductById: (id: string) => Promise<Product | null>;
  getProductCollections: (productId: string) => Promise<void>;
  addProduct: (productData: {
    name: string;
    slug: string;
    description: string;
    price: number;
    category_id: string;
    image_url: string;
    tags?: string[];
    featured?: boolean;
    in_stock?: boolean;
    collectionIds?: string[];
  }) => Promise<string>;
  updateProduct: (id: string, updates: Partial<Product>, collectionIds?: string[]) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Computed getters (for backward compatibility)
  getProducts: () => Product[];
  getProductsByCategory: (categoryId: string) => Product[];
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
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

  getProductCollections: async (productId: string) => {
    try {
      await productsService.getProductCollections(productId);
    } catch (error) {
      console.error('Failed to fetch product collections:', error);
    }
  },

  addProduct: async (productData) => {
    const { collectionIds, ...data } = productData;
    
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        category_id: data.category_id,
        image_url: data.image_url,
        gallery: [],
        tags: data.tags || [],
        featured: data.featured || false,
        in_stock: data.in_stock !== false, // default to true
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }

    // Add collection relationships if provided
    if (collectionIds && collectionIds.length > 0) {
      await productsService.updateProductCollections(product.id, collectionIds);
    }

    // Refresh products list
    await get().fetchProducts();
    
    return product.id;
  },

  updateProduct: async (id, updates, collectionIds) => {
    const { error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    // Update collection relationships if provided
    if (collectionIds !== undefined) {
      await productsService.updateProductCollections(id, collectionIds);
    }

    // Refresh products list
    await get().fetchProducts();
  },

  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }

    // Update local state
    set((state) => ({
      products: state.products.filter(p => p.id !== id),
    }));
  },

  // Backward compatibility methods
  getProducts: () => get().products,
  
  getProductsByCategory: (categoryId: string) => {
    return get().products.filter(p => p.category_id === categoryId);
  },
}));
