import { create } from 'zustand';
import { collectionsService, Collection, CreateCollectionInput, UpdateCollectionInput } from './collections.service';

interface CollectionsState {
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  fetchCollections: (filters?: { featured?: boolean }) => Promise<void>;
  getCollectionBySlug: (slug: string) => Promise<Collection>;
  getCollectionById: (id: string) => Promise<Collection>;
  createCollection: (input: CreateCollectionInput) => Promise<Collection>;
  updateCollection: (id: string, input: UpdateCollectionInput) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<void>;
}

export const useCollectionsStore = create<CollectionsState>((set) => ({
  collections: [],
  isLoading: false,
  error: null,

  fetchCollections: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const collections = await collectionsService.getAll(filters);
      set({ collections, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  getCollectionBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const collection = await collectionsService.getBySlug(slug);
      set({ isLoading: false });
      return collection;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  getCollectionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const collection = await collectionsService.getById(id);
      set({ isLoading: false });
      return collection;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  createCollection: async (input: CreateCollectionInput) => {
    set({ isLoading: true, error: null });
    try {
      const collection = await collectionsService.create(input);
      set((state) => ({
        collections: [...state.collections, collection].sort((a, b) => a.sort_order - b.sort_order),
        isLoading: false,
      }));
      return collection;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateCollection: async (id: string, input: UpdateCollectionInput) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCollection = await collectionsService.update(id, input);
      set((state) => ({
        collections: state.collections
          .map((c) => (c.id === id ? updatedCollection : c))
          .sort((a, b) => a.sort_order - b.sort_order),
        isLoading: false,
      }));
      return updatedCollection;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteCollection: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await collectionsService.delete(id);
      set((state) => ({
        collections: state.collections.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
