interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

interface UploadOptions {
  folder?: string;
  transformation?: string;
}

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'becute-products',
};

export async function uploadToCloudinary(
  file: File,
  options?: UploadOptions
): Promise<CloudinaryUploadResponse> {
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Check your .env.local file.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  
  if (options?.folder) {
    formData.append('folder', options.folder);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    return await response.json();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// Helper to generate optimized image URLs
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'webp' | 'avif';
  }
): string {
  // If it's already a full URL, return as is
  if (publicIdOrUrl.startsWith('http')) {
    return publicIdOrUrl;
  }

  const { width, height, quality = 'auto', format = 'auto' } = options || {};
  
  let transformation = `f_${format},q_${quality}`;
  if (width) transformation += `,w_${width}`;
  if (height) transformation += `,h_${height},c_fill`;

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformation}/${publicIdOrUrl}`;
}

// Helper to delete images via a Supabase Edge Function that holds the API secret.
// Direct deletion from the browser is not possible — Cloudinary's destroy endpoint
// requires the API secret which must never be exposed client-side.
//
// Deploy the edge function at: supabase/functions/delete-cloudinary-image/index.ts
// It should call: cloudinary.uploader.destroy(publicId) with server-side credentials.
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing. Check your .env.local file.');
  }

  const response = await fetch(
    `${supabaseUrl}/functions/v1/delete-cloudinary-image`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ publicId }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete image: ${error}`);
  }
}

// Backward compatibility - keep the old function name
export async function uploadImage(file: File, folder: string = 'products') {
  try {
    const result = await uploadToCloudinary(file, { folder });
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error };
  }
}
