-- Migration: Create orders and webhooks tables for Cashfree integration
-- This creates the necessary database schema for storing orders and webhook events

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cashfree_order_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_amount DECIMAL(10,2) NOT NULL,
  order_currency TEXT DEFAULT 'INR',
  order_status TEXT NOT NULL DEFAULT 'ACTIVE',
  payment_status TEXT,
  payment_method TEXT,
  payment_details JSONB,
  shipping_address JSONB,
  billing_address JSONB,
  items JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_cashfree_order_id ON orders(cashfree_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Create webhooks table for logging webhook events
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for webhooks
CREATE INDEX IF NOT EXISTS idx_webhooks_order_id ON webhooks(order_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_processed ON webhooks(processed);
CREATE INDEX IF NOT EXISTS idx_webhooks_created_at ON webhooks(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
-- Allow users to view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.jwt() ->> 'email' = customer_email);

-- Allow service role to do anything (for Edge Functions)
CREATE POLICY "Service role has full access to orders"
  ON orders FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create policies for webhooks table
-- Only service role can access webhooks
CREATE POLICY "Service role has full access to webhooks"
  ON webhooks FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for order statistics (optional)
CREATE OR REPLACE VIEW order_statistics AS
SELECT
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE order_status = 'PAID') as paid_orders,
  COUNT(*) FILTER (WHERE order_status = 'ACTIVE') as active_orders,
  COUNT(*) FILTER (WHERE order_status = 'EXPIRED') as expired_orders,
  SUM(order_amount) FILTER (WHERE order_status = 'PAID') as total_revenue,
  AVG(order_amount) FILTER (WHERE order_status = 'PAID') as average_order_value
FROM orders;

-- Grant access to authenticated users for the view
GRANT SELECT ON order_statistics TO authenticated;

-- Comments for documentation
COMMENT ON TABLE orders IS 'Stores all orders created through Cashfree payment gateway';
COMMENT ON TABLE webhooks IS 'Logs all webhook events received from Cashfree';
COMMENT ON COLUMN orders.cashfree_order_id IS 'Unique order ID from Cashfree';
COMMENT ON COLUMN orders.payment_details IS 'JSON object containing payment method, transaction ID, etc.';
COMMENT ON COLUMN orders.items IS 'JSON array of order items with product details';
COMMENT ON COLUMN webhooks.payload IS 'Complete webhook payload from Cashfree';





