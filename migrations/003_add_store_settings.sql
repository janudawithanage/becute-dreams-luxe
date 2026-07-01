-- Create store_settings table for managing shipping and other store configurations
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Shipping settings
  free_shipping_threshold DECIMAL(10, 2) DEFAULT 100.00,
  standard_shipping_rate DECIMAL(10, 2) DEFAULT 5.99,
  express_shipping_rate DECIMAL(10, 2) DEFAULT 15.99,
  international_shipping_enabled BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO store_settings (
  free_shipping_threshold,
  standard_shipping_rate,
  express_shipping_rate,
  international_shipping_enabled
) VALUES (
  100.00,
  5.99,
  15.99,
  false
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_store_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_store_settings_timestamp
  BEFORE UPDATE ON store_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_store_settings_updated_at();

-- Add comment
COMMENT ON TABLE store_settings IS 'Store-wide configuration settings including shipping rates and thresholds';
