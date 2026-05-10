# Aromé Luxe — Tasks & Roadmap

## Admin / CMS Migration

### Current state
Custom-built admin panel in Next.js backed by Supabase PostgreSQL. Manages two distinct
types of data that should be treated differently:

| Content (CMS territory) | Transactional (stays in Supabase) |
|---|---|
| Products, images, fragrance notes | Orders, payment records |
| Banners, curated lists | Coupons + usage tracking |
| Reviews, bundles | Shipping settings |
| Homepage sections | Customer profiles / auth |

### Recommendation — Directus (over Sanity)
Sanity is a document CMS. Our data model is relational (orders reference products,
coupons reference orders) — a document store doesn't map cleanly and transactional
data can never leave Supabase.

**Directus** connects directly to the existing Supabase PostgreSQL database. Zero data
migration. Auto-generates a polished admin UI from the existing schema. Orders, coupons,
and shipping settings stay exactly where they are.

**Payload CMS** is the TypeScript-native alternative — more setup, but offers typed
admin UI generation, versioning, and hooks. Worth evaluating if we need richer editorial
workflows.

**Sanity** — only justified if we add a blog, editorial content, or need non-developer
team members editing rich-text content with versioning/drafts.

---

## Stats & Analytics

### What exists
- Admin dashboard: total revenue, order count, orders this week, average order value,
  product counts, review/coupon summaries
- `order_statistics` and `product_statistics` database views in Supabase
- No visitor tracking, no time-series charts, no funnel data

### Three layers to build

**Layer 1 — Visitor analytics (currently zero)**
Add Plausible Analytics (privacy-first, no cookie banner) or PostHog. One script tag
in `src/app/layout.tsx`. PostHog also gives session recordings and heatmaps.

**Layer 2 — Revenue trends (data exists, no UI)**
The `orders` table already has `created_at` and `order_amount`. Missing: a chart.
Build a daily/weekly revenue bar chart in the admin dashboard grouped by
`created_at::date`. Immediately shows whether a sale or product launch is working.

**Layer 3 — Product & funnel performance (needs new tracking)**
- `product_views` table — increment on `/products/[id]` load, display top products
  by views vs purchases in admin
- PostHog funnel — cart → address entry → payment → success (shows drop-off rate
  at each step)
- Revenue breakdown by category/tag (men vs women vs unisex, by mood tag)

---

## TODO

### This week
- [ ] Add Plausible or PostHog analytics script to `src/app/layout.tsx`
- [ ] Add 7-day and 30-day revenue bar chart to admin dashboard
  (`/src/app/admin/page.tsx` + query `orders` grouped by date)
- [ ] Add top-5 products by order frequency to admin dashboard
  (JOIN orders items → group by product ID)

### Next sprint
- [ ] Prototype Directus connected to Supabase DB in staging — if it covers 80% of
  the custom admin, migrate
- [ ] CSV export for orders (`/admin/orders` — most-needed missing feature)
- [ ] Low-stock inventory alerts (manual flag on product + dashboard warning card)
- [ ] Audit log for admin actions (who changed what, when)

### Medium term
- [ ] Checkout funnel analysis in PostHog (cart → address → payment → success)
- [ ] `product_views` tracking + top-viewed vs top-purchased comparison in admin
- [ ] Revenue breakdown by category and mood tag (chart in admin dashboard)
- [ ] Bulk product operations (edit status/price for multiple products at once)
- [ ] Evaluate Payload CMS if Directus proves too limiting for content workflows
