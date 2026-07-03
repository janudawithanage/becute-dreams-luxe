-- Migration: Add gallery_images table for Instagram gallery section
-- This table stores images that appear in the landing page gallery section

CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  instagram_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for active images ordered by display_order
CREATE INDEX IF NOT EXISTS idx_gallery_images_active_order 
ON gallery_images(is_active, display_order) 
WHERE is_active = TRUE;

-- Add RLS policies
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active gallery images
CREATE POLICY "Public users can view active gallery images"
ON gallery_images FOR SELECT
TO public
USING (is_active = TRUE);

-- Allow authenticated users (admins) to manage gallery images
CREATE POLICY "Authenticated users can insert gallery images"
ON gallery_images FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery images"
ON gallery_images FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete gallery images"
ON gallery_images FOR DELETE
TO authenticated
USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gallery_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gallery_images_updated_at
BEFORE UPDATE ON gallery_images
FOR EACH ROW
EXECUTE FUNCTION update_gallery_images_updated_at();
