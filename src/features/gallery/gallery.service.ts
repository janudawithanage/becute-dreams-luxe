import { supabase } from "@/lib/supabase";
import type {
  GalleryImage,
  CreateGalleryImageInput,
  UpdateGalleryImageInput,
} from "./gallery.types";

class GalleryService {
  private readonly tableName = "gallery_images";

  /**
   * Get all active gallery images ordered by display_order
   */
  async getActiveGalleryImages(): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching active gallery images:", error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get all gallery images (admin only)
   */
  async getAllGalleryImages(): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching all gallery images:", error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get a single gallery image by ID
   */
  async getGalleryImageById(id: string): Promise<GalleryImage | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching gallery image:", error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new gallery image
   */
  async createGalleryImage(input: CreateGalleryImageInput): Promise<GalleryImage> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([
        {
          image_url: input.image_url,
          instagram_url: input.instagram_url,
          display_order: input.display_order ?? 0,
          is_active: input.is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating gallery image:", error);
      throw error;
    }

    return data;
  }

  /**
   * Update an existing gallery image
   */
  async updateGalleryImage(
    id: string,
    input: UpdateGalleryImageInput
  ): Promise<GalleryImage> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating gallery image:", error);
      throw error;
    }

    return data;
  }

  /**
   * Delete a gallery image
   */
  async deleteGalleryImage(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);

    if (error) {
      console.error("Error deleting gallery image:", error);
      throw error;
    }
  }

  /**
   * Toggle active status of a gallery image
   */
  async toggleActiveStatus(id: string, isActive: boolean): Promise<GalleryImage> {
    return this.updateGalleryImage(id, { is_active: isActive });
  }

  /**
   * Reorder gallery images
   */
  async reorderGalleryImages(imageOrders: { id: string; display_order: number }[]): Promise<void> {
    const updates = imageOrders.map((item) =>
      this.updateGalleryImage(item.id, { display_order: item.display_order })
    );

    await Promise.all(updates);
  }
}

export const galleryService = new GalleryService();
