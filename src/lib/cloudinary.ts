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

// Helper to delete images (requires backend/admin API)
export async function deleteFromCloudinary(_publicId: string): Promise<void> {
  console.warn('Delete requires backend API with API secret. Implement server-side endpoint.');
  // This should be implemented via your backend/Supabase Edge Function
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
