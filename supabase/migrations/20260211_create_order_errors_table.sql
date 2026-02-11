-- Migration: Create order_errors table for tracking failed operations
-- This table logs all errors that occur during order processing
-- Useful for debugging, monitoring, and manual intervention

-- Create order_errors table
CREATE TABLE IF NOT EXISTS order_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Order identifiers
  order_id TEXT NOT NULL, -- Internal order ID
  cashfree_order_id TEXT, -- Cashfree order ID for reference

  -- Error details
  error_type TEXT NOT NULL, -- Type of error (payment_failed, shipment_failed, webhook_failed, etc.)
  error_message TEXT NOT NULL, -- Human-readable error message
  error_details JSONB, -- Full error details (stack trace, API response, etc.)
  error_source TEXT, -- Where the error occurred (edge function name, API endpoint)

  -- Resolution tracking
  retry_count INTEGER DEFAULT 0, -- Number of retry attempts
  resolved BOOLEAN DEFAULT false, -- Whether the error has been resolved
  resolved_at TIMESTAMP, -- When the error was resolved
  resolved_by TEXT, -- Who/what resolved the error (admin_user_id, auto_retry, etc.)
  resolution_notes TEXT, -- Notes about how the error was resolved

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_order_errors_order_id ON order_errors(order_id);
CREATE INDEX IF NOT EXISTS idx_order_errors_cashfree_order_id ON order_errors(cashfree_order_id);
CREATE INDEX IF NOT EXISTS idx_order_errors_resolved ON order_errors(resolved) WHERE resolved = false;
CREATE INDEX IF NOT EXISTS idx_order_errors_error_type ON order_errors(error_type);
CREATE INDEX IF NOT EXISTS idx_order_errors_created_at ON order_errors(created_at DESC);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_errors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_errors_updated_at
  BEFORE UPDATE ON order_errors
  FOR EACH ROW
  EXECUTE FUNCTION update_order_errors_updated_at();

-- Add comments for documentation
COMMENT ON TABLE order_errors IS 'Tracks all errors that occur during order processing (payment, shipment, webhooks, etc.)';
COMMENT ON COLUMN order_errors.error_type IS 'Category of error: payment_failed, shipment_failed, webhook_failed, address_invalid, etc.';
COMMENT ON COLUMN order_errors.error_details IS 'JSON object containing full error context (stack trace, API responses, request data)';
COMMENT ON COLUMN order_errors.retry_count IS 'Number of automatic retry attempts made (0 = first failure, no retry yet)';
COMMENT ON COLUMN order_errors.resolved IS 'TRUE if error has been fixed (order processed successfully or manually handled)';

-- Insert sample error types for reference (optional, can be removed in production)
-- These are just examples of error_type values that might be used
/*
COMMENT ON COLUMN order_errors.error_type IS 'Common values:
  - payment_failed: Cashfree payment processing failed
  - shipment_failed: Shiprocket order creation failed
  - shipment_address_invalid: Invalid shipping address format
  - shipment_pincode_invalid: Invalid pincode format or not serviceable
  - webhook_signature_failed: Webhook signature verification failed
  - webhook_processing_failed: Error processing webhook payload
  - api_timeout: External API call timed out
  - api_error: External API returned error response
  - database_error: Database operation failed
  - unknown_error: Unexpected error occurred
';
*/

-- Grant appropriate permissions
-- Allow service role full access
ALTER TABLE order_errors ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do anything
CREATE POLICY "Service role has full access to order_errors"
  ON order_errors
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can view their own order errors (optional - for customer support)
CREATE POLICY "Users can view errors for their orders"
  ON order_errors
  FOR SELECT
  TO authenticated
  USING (
    cashfree_order_id IN (
      SELECT cashfree_order_id FROM orders WHERE customer_email = auth.jwt() ->> 'email'
    )
  );

-- Add delivered_at and rto_delivered_at columns to orders table if they don't exist
-- These are referenced in the Shiprocket webhook handler
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS rto_delivered_at TIMESTAMP;

COMMENT ON COLUMN orders.delivered_at IS 'Timestamp when order was delivered to customer (from Shiprocket)';
COMMENT ON COLUMN orders.rto_delivered_at IS 'Timestamp when RTO (Return To Origin) was completed (from Shiprocket)';
