import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("should bucket paid orders into IST dates, exclude unpaid orders, and rank top-5 items", async () => {
  const modPath = path.join(root, "src/lib/admin-reporting.mjs");
  assert.equal(fs.existsSync(modPath), true, "src/lib/admin-reporting.mjs must exist");
  const {
    buildIstRevenueSeries,
    computeTopSoldItems,
    summarizeAnalyticsFunnel,
    ordersToCsv,
  } = await import(modPath);

  const now = new Date("2026-10-30T12:00:00.000Z");
  const orders = [
    {
      id: "1",
      cashfree_order_id: "order_paid_1",
      order_status: "PAID",
      payment_status: "SUCCESS",
      order_amount: 798,
      created_at: "2026-10-29T20:00:00.000Z", // 2026-10-30 01:30 IST
      items: [
        { product_id: "p1", product_name: "Aventus", price: 399, quantity: 2 },
      ],
    },
    {
      id: "2",
      cashfree_order_id: "order_unpaid_active",
      order_status: "ACTIVE",
      payment_status: "PENDING",
      order_amount: 5000,
      created_at: "2026-10-30T10:00:00.000Z",
      items: [
        { product_id: "p2", product_name: "Sauvage", price: 5000, quantity: 1 },
      ],
    },
    {
      id: "3",
      cashfree_order_id: "order_paid_2",
      order_status: "PAID",
      payment_status: "SUCCESS",
      order_amount: 699,
      created_at: "2026-10-28T10:00:00.000Z",
      items: [
        { product_id: "b1", product_name: "Signature Duo: Aventus + Sauvage", price: 699, quantity: 1 },
      ],
    },
  ];

  const series7d = buildIstRevenueSeries(orders, 7, now);
  assert.equal(series7d.length, 7);
  const oct30 = series7d.find((d) => d.dateKey === "2026-10-30");
  const oct28 = series7d.find((d) => d.dateKey === "2026-10-28");
  assert.equal(oct30?.revenue, 798);
  assert.equal(oct30?.orders, 1);
  assert.equal(oct28?.revenue, 699);

  const topSold = computeTopSoldItems(orders, 5);
  assert.equal(topSold.length, 2);
  assert.equal(topSold[0].name, "Aventus");
  assert.equal(topSold[0].units, 2);
  assert.equal(topSold[0].revenue, 798);

  const funnel = summarizeAnalyticsFunnel([
    { event_type: "page_view", session_id: "s1", item_name: null },
    { event_type: "page_view", session_id: "s1", item_name: null },
    { event_type: "product_view", session_id: "s1", item_name: "Aventus" },
    { event_type: "add_to_cart", session_id: "s1", item_name: "Aventus" },
    { event_type: "begin_checkout", session_id: "s1", item_name: null },
    { event_type: "purchase", session_id: "s1", item_name: null },
    { event_type: "page_view", session_id: "s2", item_name: null },
    { event_type: "product_view", session_id: "s2", item_name: "Aventus" },
  ]);
  assert.equal(funnel.uniqueVisitors, 2);
  assert.equal(funnel.productViews, 2);
  assert.equal(funnel.addToCarts, 1);
  assert.equal(funnel.checkoutsStarted, 1);
  assert.equal(funnel.purchases, 1);
  assert.equal(funnel.conversionRate, 50);
  assert.equal(funnel.topViewed[0].name, "Aventus");
  assert.equal(funnel.topViewed[0].views, 2);

  const csv = ordersToCsv([
    {
      id: "uuid-1",
      cashfree_order_id: "order_paid_1",
      created_at: "2026-10-30T06:30:00.000Z",
      customer_name: "=CMD()",
      customer_email: "buyer@example.com",
      customer_phone: "9876543210",
      shipping_address: { address: "Flat 4, Marine Drive", city: "Mumbai", state: "MH", pincode: "400020" },
      items: [{ product_id: "p1", product_name: "Aventus", price: 399, quantity: 2 }],
      subtotal_amount: 798,
      coupon_code: "LUXE10",
      discount_amount: 79.8,
      shipping_amount: 0,
      order_amount: 718.2,
      order_currency: "INR",
      order_status: "PAID",
      payment_status: "SUCCESS",
      payment_method: "upi",
      shiprocket_order_id: "SR123",
      shiprocket_awb: "AWB999",
      shiprocket_courier_name: "Delhivery",
      shiprocket_status: "created",
    },
  ]);
  assert.match(csv, /Order ID,Date \(IST\),Customer Name/);
  assert.ok(csv.includes("'=CMD()"), "Formula-injection prefix = must be neutralized with leading apostrophe");
  assert.ok(csv.includes('"Flat 4, Marine Drive"'), "Commas in address must be RFC-4180 quoted");
  assert.ok(csv.includes("LUXE10"));
  assert.ok(csv.includes("AWB999"));
});

test("should wire analytics migration, admin Recharts revenue chart, and orders CSV export button", () => {
  assert.equal(
    fs.existsSync(path.join(root, "supabase/migrations/20261030000001_create_analytics_events.sql")),
    true,
    "Analytics SQL migration must exist"
  );
  const adminDash = fs.readFileSync(path.join(root, "src/app/admin/page.tsx"), "utf8");
  assert.match(adminDash, /BarChart/, "Admin dashboard must render Recharts BarChart");
  const adminOrders = fs.readFileSync(path.join(root, "src/app/admin/orders/page.tsx"), "utf8");
  assert.match(adminOrders, /Export CSV/, "Admin orders page must expose Export CSV button");
});
