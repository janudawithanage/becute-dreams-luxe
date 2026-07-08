import { supabase } from '@/lib/supabase';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string;
  featured: boolean;
  sort_order: number;
  discount_percentage: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCollectionInput {
  name: string;
  slug: string;
  description?: string | null;
  image_url: string;
  featured?: boolean;
  sort_order?: number;
  discount_percentage?: number | null;
}

export interface UpdateCollectionInput {
  name?: string;
  slug?: string;
  description?: string | null;
  image_url?: string;
  featured?: boolean;
  sort_order?: number;
  discount_percentage?: number | null;
}

export const collectionsService = {
  // Fetch all collections with optional filters
  async getAll(filters?: { featured?: boolean }) {
    let query = supabase
      .from('collections')
      .select('*')
      .order('sort_order', { ascending: true });

    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }

    return data as Collection[];
  },

  // Fetch single collection by slug
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching collection by slug:', error);
      throw error;
    }

    return data as Collection;
  },

  // Fetch single collection by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching collection by id:', error);
      throw error;
    }

    return data as Collection;
  },

  // Create a new collection
  async create(input: CreateCollectionInput) {
    const { data, error } = await supabase
      .from('collections')
      .insert({
        ...input,
        sort_order: input.sort_order ?? 0,
        featured: input.featured ?? false,
        discount_percentage: input.discount_percentage ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating collection:', error);
      throw error;
    }

    return data as Collection;
  },

  // Update an existing collection
  async update(id: string, input: UpdateCollectionInput) {
    const { data, error } = await supabase
      .from('collections')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating collection:', error);
      throw error;
    }

    return data as Collection;
  },

  // Delete a collection
  async delete(id: string) {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  },

  // Generate unique slug from name
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  },
};
