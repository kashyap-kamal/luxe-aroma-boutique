-- Migration: Native Storefront Visitor & Checkout Funnel Analytics
-- Stores privacy-safe session events readable only by admins.

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (
    event_type IN ('page_view', 'product_view', 'add_to_cart', 'begin_checkout', 'purchase')
  ),
  session_id TEXT NOT NULL CHECK (char_length(session_id) BETWEEN 8 AND 128),
  page_path TEXT CHECK (page_path IS NULL OR char_length(page_path) <= 512),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  bundle_id UUID REFERENCES product_bundles(id) ON DELETE SET NULL,
  item_name TEXT CHECK (item_name IS NULL OR char_length(item_name) <= 256),
  order_id TEXT CHECK (order_id IS NULL OR char_length(order_id) <= 128),
  value_inr DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_created ON analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert constrained analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (
    event_type IN ('page_view', 'product_view', 'add_to_cart', 'begin_checkout', 'purchase')
    AND char_length(session_id) BETWEEN 8 AND 128
  );

CREATE POLICY "Admins can read analytics events"
  ON analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
       WHERE profiles.id = auth.uid()
         AND profiles.role = 'admin'
    )
  );
