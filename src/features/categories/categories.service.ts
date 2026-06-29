import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  featured?: boolean;
  sort_order?: number;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export const categoriesService = {
  // Fetch all categories
  async getAll(filters?: { featured?: boolean }) {
    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data as Category[];
  },

  // Fetch single category by slug
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      throw error;
    }

    return data as Category;
  },

  // Fetch single category by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      throw error;
    }

    return data as Category;
  },

  // Create new category (Admin only)
  async create(input: CreateCategoryInput) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: input.name,
        slug: input.slug,
        description: input.description || null,
        image_url: input.image_url || null,
        featured: input.featured || false,
        sort_order: input.sort_order || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }

    return data as Category;
  },

  // Update category (Admin only)
  async update(id: string, input: UpdateCategoryInput) {
    const updateData: Record<string, any> = {};
    
    // Only include defined values in the update
    if (input.name !== undefined) updateData.name = input.name;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.image_url !== undefined) updateData.image_url = input.image_url;
    if (input.featured !== undefined) updateData.featured = input.featured;
    if (input.sort_order !== undefined) updateData.sort_order = input.sort_order;

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }

    return data as Category;
  },

  // Delete category (Admin only)
  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
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
