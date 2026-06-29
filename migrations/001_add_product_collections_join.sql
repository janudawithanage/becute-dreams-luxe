-- Migration: Add product_collections join table and update categories
-- This migration:
-- 1. Adds featured and sort_order columns to categories
-- 2. Creates product_collections join table for many-to-many relationship
-- 3. Migrates existing products.collection_id data to the join table
-- 4. Drops the collection_id column from products
-- 5. Sets up RLS policies

-- Step 1: Add featured and sort_order to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Step 2: Create product_collections join table
CREATE TABLE IF NOT EXISTS product_collections (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (product_id, collection_id)
);

-- Step 3: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_collections_product_id ON product_collections(product_id);
CREATE INDEX IF NOT EXISTS idx_product_collections_collection_id ON product_collections(collection_id);

-- Step 4: Migrate existing collection_id data to join table
-- Only migrate if the column exists and has data
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'collection_id'
  ) THEN
    -- Insert existing relationships into join table
    INSERT INTO product_collections (product_id, collection_id)
    SELECT id, collection_id
    FROM products
    WHERE collection_id IS NOT NULL
    ON CONFLICT (product_id, collection_id) DO NOTHING;
    
    -- Drop the old column
    ALTER TABLE products DROP COLUMN collection_id;
  END IF;
END $$;

-- Step 5: Enable RLS on product_collections
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;

-- Step 6: RLS Policies for product_collections

-- Allow public read access
CREATE POLICY "Public read access for product_collections"
  ON product_collections
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated admin users to insert
CREATE POLICY "Admin insert access for product_collections"
  ON product_collections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow authenticated admin users to update
CREATE POLICY "Admin update access for product_collections"
  ON product_collections
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow authenticated admin users to delete
CREATE POLICY "Admin delete access for product_collections"
  ON product_collections
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Step 7: Add comment for documentation
COMMENT ON TABLE product_collections IS 'Many-to-many join table connecting products to collections';
COMMENT ON COLUMN categories.featured IS 'Whether this category should be displayed on homepage';
COMMENT ON COLUMN categories.sort_order IS 'Display order for featured categories (lower = earlier)';
