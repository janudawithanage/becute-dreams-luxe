export interface GalleryImage {
  id: string;
  image_url: string;
  instagram_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateGalleryImageInput {
  image_url: string;
  instagram_url: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateGalleryImageInput {
  image_url?: string;
  instagram_url?: string;
  display_order?: number;
  is_active?: boolean;
}
