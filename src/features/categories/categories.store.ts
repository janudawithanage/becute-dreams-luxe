import { create } from 'zustand';
import { categoriesService, type Category } from './categories.service';

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: (filters?: { featured?: boolean }) => Promise<void>;
  getCategoryBySlug: (slug: string) => Promise<Category | null>;
  getCategoryById: (id: string) => Promise<Category | null>;
  createCategory: (input: {
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    featured?: boolean;
    sort_order?: number;
  }) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoriesService.getAll(filters);
      set({ categories, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        isLoading: false,
      });
    }
  },

  getCategoryBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const category = await categoriesService.getBySlug(slug);
      set({ isLoading: false });
      return category;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch category',
        isLoading: false,
      });
      return null;
    }
  },

  getCategoryById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const category = await categoriesService.getById(id);
      set({ isLoading: false });
      return category;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch category',
        isLoading: false,
      });
      return null;
    }
  },

  createCategory: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const category = await categoriesService.create(input);
      set({ isLoading: false });
      // Refresh categories list
      await get().fetchCategories();
      return category;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create category',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Filter out null values to match UpdateCategoryInput type
      const cleanUpdates: Record<string, any> = {};
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== null) {
          cleanUpdates[key] = value;
        }
      });
      
      await categoriesService.update(id, cleanUpdates);
      set({ isLoading: false });
      // Refresh categories list
      await get().fetchCategories();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update category',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoriesService.delete(id);
      // Update local state
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete category',
        isLoading: false,
      });
      throw error;
    }
  },
}));
