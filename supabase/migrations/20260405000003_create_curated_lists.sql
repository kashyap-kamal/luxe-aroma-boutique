CREATE TABLE IF NOT EXISTS curated_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  product_ids UUID[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE curated_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active curated lists" ON curated_lists FOR SELECT USING (true);
CREATE POLICY "Admin can manage curated lists" ON curated_lists FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

INSERT INTO curated_lists (slug, name, description) VALUES
('bestsellers', 'Bestsellers', 'Our most popular fragrances'),
('fresh-citrus', 'Fresh & Citrus', 'Light, energizing scents'),
('woody-spicy', 'Woody & Spicy', 'Warm, complex fragrances'),
('date-night', 'Date Night', 'Seductive evening scents'),
('office-wear', 'Office Wear', 'Professional, understated'),
('everyday-fresh', 'Everyday Fresh', 'Casual daily wear');
