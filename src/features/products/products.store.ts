import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products.types";
import { products as initialProducts } from "./products.data";

interface ProductsState {
  products: Product[];
  getProducts: () => Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  addProduct: (product: Omit<Product, "id">) => string;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  initialized: boolean;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      initialized: false,

      getProducts: () => {
        return get().products;
      },

      getProductBySlug: (slug: string) => {
        return get().products.find((p) => p.slug === slug);
      },

      getProductById: (id: string) => {
        return get().products.find((p) => p.id === id);
      },

      getProductsByCategory: (category: string) => {
        return get().products.filter((p) => p.category === category);
      },

      addProduct: (productData) => {
        const newId = `p${Date.now()}`;
        const newProduct: Product = {
          ...productData,
          id: newId,
        };

        set((state) => ({
          products: [...state.products, newProduct],
        }));

        return newId;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },
    }),
    {
      name: "products-storage",
      onRehydrateStorage: () => (state) => {
        if (state && !state.initialized) {
          // Initialize with default products only if empty
          if (state.products.length === 0) {
            state.products = initialProducts;
          }
          state.initialized = true;
        }
      },
    },
  ),
);
