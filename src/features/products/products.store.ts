import { create } from 'zustand';
import { productsService, type Product, type Category } from './products.service';
import { supabase } from '@/lib/supabase';

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
  }) => Promise<string>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
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

  addProduct: async (productData) => {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        category_id: productData.category_id,
        image_url: productData.image_url,
        gallery: [],
        tags: productData.tags || [],
        featured: productData.featured || false,
        in_stock: productData.in_stock !== false, // default to true
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }

    // Refresh products list
    await get().fetchProducts();
    
    return data.id;
  },

  updateProduct: async (id, updates) => {
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
