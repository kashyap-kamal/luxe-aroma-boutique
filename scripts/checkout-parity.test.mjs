import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("should compute coupon discount across Products + Bundles and evaluate shipping threshold post-coupon", async () => {
  const modPath = path.join(root, "src/lib/checkout-pricing.mjs");
  assert.equal(fs.existsSync(modPath), true, "src/lib/checkout-pricing.mjs must exist");
  const {
    calculateCouponDiscount,
    calculateShippingCharge,
    formatBundleOrderLineName,
    computeCheckoutTotals,
  } = await import(modPath);

  const luxe10 = {
    code: "LUXE10",
    discount_type: "percentage",
    discount_value: 10,
    min_order_amount: 500,
    max_discount_amount: 150,
    usage_limit: 100,
    usage_count: 5,
    is_active: true,
    starts_at: null,
    ends_at: null,
  };

  // Applies to Products (399) + Bundles (699) = 1098 -> 10% = 109.8
  const res = computeCheckoutTotals({
    productLines: [{ id: "p1", name: "Aventus", price: 399, quantity: 1, inStock: true }],
    bundleLines: [
      {
        id: "b1",
        name: "Signature Duo",
        price: 699,
        quantity: 1,
        active: true,
        constituents: [
          { name: "Aventus", quantity: 1, inStock: true },
          { name: "Sauvage", quantity: 1, inStock: true },
        ],
      },
    ],
    coupon: luxe10,
    freeShipping: { enabled: false, threshold: 1000 },
    shippingRate: { amount: 49 },
  });

  assert.equal(res.subtotal, 1098);
  assert.equal(res.discount, 109.8);
  assert.equal(res.discountedSubtotal, 988.2);
  // Pre-coupon was 1098 (>= 1000), post-coupon is 988.2 (< 1000) -> charges Rs. 49 shipping!
  assert.equal(res.shipping, 49);
  assert.equal(res.total, 1037.2);

  // Max discount cap respected
  const capped = calculateCouponDiscount(2000, luxe10);
  assert.equal(capped.valid, true);
  assert.equal(capped.discount, 150);

  // Min order rejected
  const belowMin = calculateCouponDiscount(399, luxe10);
  assert.equal(belowMin.valid, false);

  // Free shipping enabled with threshold 0 -> 0 shipping
  assert.equal(
    calculateShippingCharge(350, { enabled: true, threshold: 0 }, { amount: 49 }),
    0
  );

  // Bundle line item formatting includes constituent bottles
  assert.equal(
    formatBundleOrderLineName("Signature Duo", [
      { name: "Aventus", quantity: 1 },
      { name: "Sauvage", quantity: 1 },
    ]),
    "Signature Duo: Aventus + Sauvage"
  );

  // Out-of-stock constituent blocks bundle checkout
  const blocked = computeCheckoutTotals({
    productLines: [],
    bundleLines: [
      {
        id: "b1",
        name: "Signature Duo",
        price: 699,
        quantity: 1,
        active: true,
        constituents: [
          { name: "Aventus", quantity: 1, inStock: true },
          { name: "Oud For Greatness", quantity: 1, inStock: false },
        ],
      },
    ],
    coupon: null,
    freeShipping: { enabled: true, threshold: 0 },
    shippingRate: { amount: 49 },
  });
  assert.match(blocked.availabilityError ?? "", /Oud For Greatness/);
});

test("should enforce checkout bundle parity, post-verify cart clear, and webhook/RLS hardening", () => {
  const checkoutSrc = fs.readFileSync(path.join(root, "src/app/checkout/page.tsx"), "utf8");
  assert.match(checkoutSrc, /bundleItems/, "checkout/page.tsx must include bundleItems");
  assert.doesNotMatch(
    checkoutSrc,
    /clearCart\(\);\s*\n\s*toast\.info\(["']Redirecting to payment/,
    "checkout/page.tsx must not clearCart() before Cashfree redirect"
  );

  const paymentStoreSrc = fs.readFileSync(path.join(root, "src/stores/payment-store.tsx"), "utf8");
  const processPaymentSlice = paymentStoreSrc.slice(0, paymentStoreSrc.indexOf("markOrderPaid:"));
  assert.doesNotMatch(
    processPaymentSlice,
    /paymentStatus:\s*(?:["']completed["']|PaymentStatus\.SUCCESS)/,
    "processPayment must not mark order completed/SUCCESS before Cashfree redirect"
  );

  const webhookSrc = fs.readFileSync(
    path.join(root, "supabase/functions/cashfree-webhook/index.ts"),
    "utf8"
  );
  assert.match(
    webhookSrc,
    /\.neq\(["']order_status["'],\s*["']PAID["']\)/,
    "cashfree-webhook must guard non-paid updates against overwriting PAID"
  );
  assert.match(
    webhookSrc,
    /shiprocket_order_id/,
    "cashfree-webhook must guard duplicate Shiprocket creation on shiprocket_order_id"
  );

  const adminOrdersSrc = fs.readFileSync(
    path.join(root, "src/app/admin/orders/page.tsx"),
    "utf8"
  );
  assert.match(
    adminOrdersSrc,
    /all_statuses/,
    "admin/orders/page.tsx has all_statuses option"
  );
  assert.match(
    adminOrdersSrc,
    /statusFilter !== ["']all_statuses["']/,
    "admin/orders/page.tsx must ignore all_statuses sentinel when querying Supabase"
  );

  const migrationPath = path.join(
    root,
    "supabase/migrations/20261030000000_checkout_parity_and_rls_hardening.sql"
  );
  assert.equal(fs.existsSync(migrationPath), true, "RLS & checkout parity SQL migration must exist");
  const sql = fs.readFileSync(migrationPath, "utf8");
  assert.match(sql, /redeem_order_coupon/, "SQL migration must define atomic redeem_order_coupon RPC");
  assert.match(sql, /Admins can view all orders/, "SQL migration must add admin SELECT policy on orders");
});
