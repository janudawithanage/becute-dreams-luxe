import { supabase } from '@/lib/supabase';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCollectionInput {
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  featured?: boolean;
  sort_order?: number;
}

export interface UpdateCollectionInput extends Partial<CreateCollectionInput> {}

export const collectionsService = {
  // Fetch all collections
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
      console.error('Error fetching collection:', error);
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
      console.error('Error fetching collection:', error);
      throw error;
    }

    return data as Collection;
  },

  // Create new collection (Admin only)
  async create(input: CreateCollectionInput) {
    const { data, error } = await supabase
      .from('collections')
      .insert({
        name: input.name,
        slug: input.slug,
        description: input.description || null,
        image_url: input.image_url,
        featured: input.featured || false,
        sort_order: input.sort_order || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating collection:', error);
      throw error;
    }

    return data as Collection;
  },

  // Update collection (Admin only)
  async update(id: string, input: UpdateCollectionInput) {
    const { data, error } = await supabase
      .from('collections')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating collection:', error);
      throw error;
    }

    return data as Collection;
  },

  // Delete collection (Admin only)
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
