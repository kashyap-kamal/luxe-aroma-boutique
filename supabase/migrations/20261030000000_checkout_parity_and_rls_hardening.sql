-- Migration: Checkout Parity (Bundles, Coupons, Shipping) and RLS Hardening
-- Adds order pricing breakdown columns, atomic coupon redemption RPC, and admin/customer RLS guards.

-- 1. Order pricing breakdown columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal_amount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_orders_coupon_code ON orders(coupon_code) WHERE coupon_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- 2. Idempotent coupon redemption per paid order
CREATE UNIQUE INDEX IF NOT EXISTS idx_coupon_usage_unique_order
  ON coupon_usage(order_id)
  WHERE order_id IS NOT NULL;

CREATE OR REPLACE FUNCTION redeem_order_coupon(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_inserted INT := 0;
BEGIN
  SELECT id, coupon_id, customer_email, discount_amount, order_status
    INTO v_order
    FROM orders
   WHERE id = p_order_id;

  IF NOT FOUND OR v_order.coupon_id IS NULL OR v_order.order_status <> 'PAID' THEN
    RETURN FALSE;
  END IF;

  INSERT INTO coupon_usage (coupon_id, order_id, customer_email, discount_applied)
  VALUES (v_order.coupon_id, v_order.id, v_order.customer_email, COALESCE(v_order.discount_amount, 0))
  ON CONFLICT (order_id) WHERE order_id IS NOT NULL DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;

  IF v_inserted > 0 THEN
    UPDATE coupons
       SET usage_count = usage_count + 1,
           updated_at = now()
     WHERE id = v_order.coupon_id;
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

REVOKE ALL ON FUNCTION redeem_order_coupon(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION redeem_order_coupon(UUID) TO service_role;

-- 3. Admin SELECT policy on orders + invoker-scoped statistics views
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
     WHERE schemaname = 'public'
       AND tablename = 'orders'
       AND policyname IN ('Admins can view all orders', 'Admin can view all orders')
  ) THEN
    CREATE POLICY "Admins can view all orders"
      ON orders FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM profiles
           WHERE profiles.id = auth.uid()
             AND profiles.role = 'admin'
        )
      );
  END IF;
END;
$$;

ALTER VIEW order_statistics SET (security_invoker = true);
ALTER VIEW product_statistics SET (security_invoker = true);
REVOKE ALL ON order_statistics FROM anon;
REVOKE ALL ON product_statistics FROM anon;

-- 4. Tighten coupons & coupon_usage RLS
DROP POLICY IF EXISTS "Public can read active coupons" ON coupons;
CREATE POLICY "Public can read active coupons"
  ON coupons FOR SELECT
  USING (
    is_active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at >= now())
  );

DROP POLICY IF EXISTS "Anyone can insert coupon usage" ON coupon_usage;

-- 5. Prevent self-escalation of profiles.role by non-admin authenticated callers
CREATE OR REPLACE FUNCTION prevent_profile_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF COALESCE(auth.jwt() ->> 'role', '') <> 'service_role'
       AND NOT EXISTS (
         SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
       ) THEN
      RAISE EXCEPTION 'Not authorized to modify profile role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_role_escalation ON profiles;
CREATE TRIGGER trg_prevent_profile_role_escalation
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_profile_role_escalation();
