-- Migration: Replace Delhivery columns with Shiprocket columns on the orders table
-- Removes Delhivery tracking fields and adds Shiprocket equivalents

-- Step 1: Drop old Delhivery indexes
DROP INDEX IF EXISTS idx_orders_delhivery_waybill;
DROP INDEX IF EXISTS idx_orders_delhivery_status;

-- Step 2: Drop old Delhivery columns
ALTER TABLE orders DROP COLUMN IF EXISTS delhivery_order_id;
ALTER TABLE orders DROP COLUMN IF EXISTS delhivery_waybill;
ALTER TABLE orders DROP COLUMN IF EXISTS delhivery_status;

-- Step 3: Add Shiprocket columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_shipment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_awb TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_courier_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shiprocket_courier_name TEXT;

-- Step 4: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_shiprocket_awb ON orders(shiprocket_awb);
CREATE INDEX IF NOT EXISTS idx_orders_shiprocket_status ON orders(shiprocket_status);

-- Step 5: Add comments for documentation
COMMENT ON COLUMN orders.shiprocket_order_id IS 'Shiprocket order ID';
COMMENT ON COLUMN orders.shiprocket_shipment_id IS 'Shiprocket shipment ID';
COMMENT ON COLUMN orders.shiprocket_awb IS 'Shiprocket AWB (Air Waybill) tracking number';
COMMENT ON COLUMN orders.shiprocket_status IS 'Status of Shiprocket shipment: pending, created, failed, pending_address';
COMMENT ON COLUMN orders.shiprocket_courier_id IS 'Assigned courier partner ID from Shiprocket';
COMMENT ON COLUMN orders.shiprocket_courier_name IS 'Assigned courier partner name from Shiprocket';
