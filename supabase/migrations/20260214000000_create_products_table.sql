-- Migration: Create products table, admin role, and storage bucket
-- This enables CMS functionality for product management

-- ============================================================
-- 1. PRODUCTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,

  -- Pricing
  price_original DECIMAL(10,2) NOT NULL,
  price_current DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT '₹',
  on_sale BOOLEAN DEFAULT false,

  -- Classification
  category TEXT NOT NULL CHECK (category IN ('men', 'women', 'unisex')),
  tags TEXT[] DEFAULT '{}',

  -- Perfume-specific
  size TEXT DEFAULT '50ml',
  fragrance_notes JSONB DEFAULT '{"top":[],"middle":[],"base":[]}',

  -- Media
  image_url TEXT,
  image_urls TEXT[] DEFAULT '{}',

  -- Status & ordering
  status TEXT DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'out_of_stock', 'discontinued')),
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,

  -- Ratings
  rating_stars DECIMAL(2,1) DEFAULT 0 CHECK (rating_stars >= 0 AND rating_stars <= 5),
  rating_count INT DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);

-- Auto-update updated_at trigger (reuse existing function if available)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'products_updated_at'
  ) THEN
    CREATE TRIGGER products_updated_at
      BEFORE UPDATE ON products
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;

-- ============================================================
-- 2. ADMIN ROLE ON PROFILES
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- Add check constraint if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
      CHECK (role IN ('customer', 'admin'));
  END IF;
END;
$$;

-- ============================================================
-- 3. ROW LEVEL SECURITY FOR PRODUCTS
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can read products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Only admins can insert products
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can update products
CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can delete products
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- 4. STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Public read access for product images
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Admins can upload product images
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update product images
CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can delete product images
CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- 5. HELPER VIEW FOR ADMIN DASHBOARD
-- ============================================================

CREATE OR REPLACE VIEW product_statistics AS
SELECT
  COUNT(*) as total_products,
  COUNT(*) FILTER (WHERE status = 'in_stock') as in_stock_count,
  COUNT(*) FILTER (WHERE status = 'out_of_stock') as out_of_stock_count,
  COUNT(*) FILTER (WHERE on_sale = true) as on_sale_count,
  COUNT(*) FILTER (WHERE featured = true) as featured_count,
  COUNT(*) FILTER (WHERE category = 'men') as men_count,
  COUNT(*) FILTER (WHERE category = 'women') as women_count,
  COUNT(*) FILTER (WHERE category = 'unisex') as unisex_count,
  AVG(price_current) as average_price,
  MIN(price_current) as min_price,
  MAX(price_current) as max_price
FROM products;

GRANT SELECT ON product_statistics TO authenticated;

COMMENT ON TABLE products IS 'Product catalog managed via admin CMS';
