CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  link_url TEXT,
  link_label TEXT,
  position TEXT NOT NULL DEFAULT 'top' CHECK (position IN ('top', 'hero', 'collections', 'custom')),
  background_color TEXT NOT NULL DEFAULT '#2d3435',
  text_color TEXT NOT NULL DEFAULT '#f9f9f9',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_banner_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_banner_updated_at();

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active banners"
  ON banners FOR SELECT USING (true);

CREATE POLICY "Admin can insert banners"
  ON banners FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admin can update banners"
  ON banners FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admin can delete banners"
  ON banners FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Seed default top banner
INSERT INTO banners (title, text, position, background_color, text_color, is_active, display_order)
VALUES ('Promo', 'USE CODE LUXE10 FOR 10% OFF • FREE DELIVERY ON ALL ORDERS', 'top', '#2d3435', '#f9f9f9', true, 0);
