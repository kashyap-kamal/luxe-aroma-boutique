CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_location TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  product_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_review_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_review_updated_at();

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active reviews" ON reviews FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage reviews" ON reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

INSERT INTO reviews (customer_name, customer_location, rating, comment, product_name, is_active, display_order) VALUES
('Priya Sharma', 'Mumbai', 5, 'Absolutely love the Aventus fragrance! The quality is exceptional and the scent lasts all day. Aromé Luxe has become my go-to for premium perfumes.', 'Aventus', true, 0),
('Rajesh Kumar', 'Delhi NCR', 5, 'The Cool Water perfume exceeded my expectations. Great value for money and the packaging was beautiful. Will definitely order again!', 'Cool Water', true, 1),
('Anita Patel', 'Bangalore', 5, 'Fast delivery and amazing customer service. The Hawas fragrance is perfect for special occasions. Highly recommend Aromé Luxe!', 'Hawas', true, 2);
