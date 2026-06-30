-- Add stock_quantity column to products table
ALTER TABLE products
ADD COLUMN stock_quantity INTEGER NOT NULL DEFAULT 0;

-- Add comment to explain the column
COMMENT ON COLUMN products.stock_quantity IS 'Current available stock quantity for the product';

-- Create an index for better query performance
CREATE INDEX idx_products_stock_quantity ON products(stock_quantity);
