const IST_TIMEZONE = "Asia/Kolkata";

const istDateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: IST_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const istLabelFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: IST_TIMEZONE,
  day: "2-digit",
  month: "short",
});

const istDateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: IST_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function toIstDateKey(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "";
  return istDateKeyFormatter.format(d);
}

export function isPaidOrder(order) {
  if (!order) return false;
  return order.order_status === "PAID" || order.payment_status === "SUCCESS";
}

export function buildIstRevenueSeries(orders = [], days = 7, now = new Date()) {
  const safeDays = Math.max(1, Math.min(90, Math.floor(Number(days) || 7)));
  const buckets = new Map();

  for (let offset = safeDays - 1; offset >= 0; offset -= 1) {
    const dayMoment = new Date(now.getTime() - offset * 24 * 60 * 60 * 1000);
    const dateKey = toIstDateKey(dayMoment);
    buckets.set(dateKey, {
      dateKey,
      label: istLabelFormatter.format(dayMoment),
      revenue: 0,
      orders: 0,
    });
  }

  for (const order of orders) {
    if (!isPaidOrder(order)) continue;
    const key = toIstDateKey(order.created_at);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.revenue = Math.round((bucket.revenue + Number(order.order_amount || 0)) * 100) / 100;
      bucket.orders += 1;
    }
  }

  return Array.from(buckets.values());
}

export function computeTopSoldItems(orders = [], limit = 5) {
  const byName = new Map();
  for (const order of orders) {
    if (!isPaidOrder(order)) continue;
    for (const item of order.items || []) {
      const name = String(item.product_name || item.name || "Fragrance").trim();
      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const lineRev = Math.round(Number(item.price || 0) * qty * 100) / 100;
      const existing = byName.get(name) || { name, units: 0, revenue: 0 };
      existing.units += qty;
      existing.revenue = Math.round((existing.revenue + lineRev) * 100) / 100;
      byName.set(name, existing);
    }
  }

  return Array.from(byName.values())
    .sort((a, b) => b.units - a.units || b.revenue - a.revenue)
    .slice(0, limit);
}

export function summarizeAnalyticsFunnel(events = [], topLimit = 5) {
  const visitorSessions = new Set();
  const productViewSessions = new Set();
  const cartSessions = new Set();
  const checkoutSessions = new Set();
  const purchaseSessions = new Set();
  const itemViews = new Map();

  for (const ev of events) {
    if (!ev || !ev.session_id) continue;
    visitorSessions.add(ev.session_id);
    switch (ev.event_type) {
      case "product_view": {
        productViewSessions.add(ev.session_id);
        if (ev.item_name) {
          itemViews.set(ev.item_name, (itemViews.get(ev.item_name) || 0) + 1);
        }
        break;
      }
      case "add_to_cart":
        cartSessions.add(ev.session_id);
        break;
      case "begin_checkout":
        checkoutSessions.add(ev.session_id);
        break;
      case "purchase":
        purchaseSessions.add(ev.session_id);
        break;
      default:
        break;
    }
  }

  const uniqueVisitors = visitorSessions.size;
  const purchases = purchaseSessions.size;
  const conversionRate =
    uniqueVisitors > 0 ? Math.round((purchases / uniqueVisitors) * 1000) / 10 : 0;

  const topViewed = Array.from(itemViews.entries())
    .map(([name, views]) => ({ name, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, topLimit);

  return {
    uniqueVisitors,
    productViews: productViewSessions.size,
    addToCarts: cartSessions.size,
    checkoutsStarted: checkoutSessions.size,
    purchases,
    conversionRate,
    topViewed,
  };
}

export function escapeCsvCell(raw) {
  if (raw === null || raw === undefined) return "";
  let str = String(raw);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function ordersToCsv(orders = []) {
  const headers = [
    "Order ID",
    "Date (IST)",
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "Shipping Address",
    "City",
    "State",
    "Pincode",
    "Items",
    "Subtotal (INR)",
    "Coupon Code",
    "Discount (INR)",
    "Shipping (INR)",
    "Total Amount (INR)",
    "Order Status",
    "Payment Status",
    "Payment Method",
    "Shiprocket Order ID",
    "AWB",
    "Courier",
    "Shipping Status",
  ];

  const rows = [headers.map(escapeCsvCell).join(",")];

  for (const order of orders) {
    const addr = order.shipping_address || {};
    const itemsSummary = (order.items || [])
      .map((i) => `${i.product_name || "Item"} x${i.quantity || 1} (@${i.price || 0})`)
      .join("; ");
    const createdDate = new Date(order.created_at);
    const istFormatted = Number.isNaN(createdDate.getTime())
      ? String(order.created_at || "")
      : istDateTimeFormatter.format(createdDate);

    const row = [
      order.cashfree_order_id || order.id,
      istFormatted,
      order.customer_name || "",
      order.customer_email || "",
      order.customer_phone || "",
      addr.address || addr.address_line1 || "",
      addr.city || "",
      addr.state || "",
      addr.pincode || addr.postal_code || "",
      itemsSummary,
      order.subtotal_amount ?? order.order_amount ?? 0,
      order.coupon_code || "",
      order.discount_amount ?? 0,
      order.shipping_amount ?? 0,
      order.order_amount ?? 0,
      order.order_status || "",
      order.payment_status || "",
      order.payment_method || "",
      order.shiprocket_order_id || "",
      order.shiprocket_awb || "",
      order.shiprocket_courier_name || "",
      order.shiprocket_status || "",
    ];
    rows.push(row.map(escapeCsvCell).join(","));
  }

  return rows.join("\r\n");
}
