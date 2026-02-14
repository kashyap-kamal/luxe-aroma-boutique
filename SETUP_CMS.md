# CMS Setup Guide - Arome Luxe Admin Panel

## What Was Built

A complete Supabase-native CMS for managing products. Here's what's new:

### Files Created
```
# Database
supabase/migrations/20260214000000_create_products_table.sql  # Products table, RLS, storage
supabase/migrations/20260214000001_seed_products.sql          # Seed 20 existing products

# Services
src/lib/product-service.ts      # Supabase CRUD, image upload, admin check
src/stores/admin-store.ts       # Zustand store for admin state

# Admin UI
src/app/admin/layout.tsx                        # Admin layout (sidebar + guard)
src/app/admin/page.tsx                          # Dashboard with stats
src/app/admin/products/page.tsx                 # Product list (search, filter, delete)
src/app/admin/products/new/page.tsx             # Add new product
src/app/admin/products/[id]/page.tsx            # Edit product (server wrapper)
src/app/admin/products/[id]/edit-product-client.tsx  # Edit product (client component)
src/components/admin/admin-guard.tsx            # Auth + admin role check
src/components/admin/admin-sidebar.tsx          # Navigation sidebar
src/components/admin/product-form.tsx           # Full product form with image upload
src/components/layout-wrapper.tsx               # Hides navbar/footer on admin pages
```

### Files Modified
```
src/app/layout.tsx              # Uses LayoutWrapper (hides nav on admin routes)
src/lib/supabase.ts             # Added products + profiles.role types
src/lib/data-service.ts         # Fetches from Supabase with static fallback
src/app/products/page.tsx       # Fetches products from Supabase at runtime
```

---

## Manual Steps Required

### Step 1: Apply Database Migrations (via Supabase MCP)

Apply these two migrations using Claude Code with the Supabase MCP tools:

1. **Products table + RLS + Storage**:
   ```
   Use: mcp__supabase__apply_migration
   Name: create_products_table
   File: supabase/migrations/20260214000000_create_products_table.sql
   ```

2. **Seed existing products**:
   ```
   Use: mcp__supabase__apply_migration
   Name: seed_products
   File: supabase/migrations/20260214000001_seed_products.sql
   ```

3. **Create storage bucket** (if migration didn't auto-create it):
   ```
   Use: mcp__supabase__execute_sql
   SQL:
   INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
   VALUES ('product-images', 'product-images', true, 5242880,
           ARRAY['image/jpeg','image/png','image/webp','image/avif'])
   ON CONFLICT (id) DO NOTHING;
   ```

4. **Set up your admin account**:
   ```
   Use: mcp__supabase__execute_sql
   SQL:
   UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
   ```

   To find your user first:
   ```
   Use: mcp__supabase__execute_sql
   SQL: SELECT id, email, role FROM profiles;
   ```

### Step 2: Build & Deploy

```bash
npm run build              # Build with admin panel included
cd out && zip -r ../aromeluxe_deploy.zip .
```

Upload `aromeluxe_deploy.zip` to Hostinger via hPanel → File Manager → `public_html`.

---

## How It Works

### For the Admin
1. Go to `https://aromeluxe.in/admin/`
2. Sign in with your admin account (same auth as the store)
3. You'll see the Dashboard with product stats
4. Navigate to **Products** to see all products in a table
5. Click **Add Product** to create a new product
6. Click the edit (pencil) icon to edit an existing product
7. Click the delete (trash) icon to remove a product
8. Upload images directly — they go to Supabase Storage

### For the Storefront
- **Product listing page** (`/products/`) fetches from Supabase in real-time
  - Admin edits (price, name, status) appear immediately
- **Product detail pages** (`/products/[id]/`) are pre-built at deploy time
  - Edits to existing products: visible after rebuild + deploy
  - New products: need a rebuild for their detail pages to exist
- **Home page featured products** fetched from Supabase at build time

### Recommended Workflow for Adding New Products
1. Add product via admin panel → `/admin/products/new`
2. Product appears on listings page immediately
3. Run `npm run build` and redeploy to Hostinger for detail pages

---

## Architecture

```
Customer Browser                    Admin Browser
       │                                  │
       ▼                                  ▼
  ┌─────────┐                     ┌──────────────┐
  │ Products │ ──GET (public)──►  │ Admin Panel   │
  │ Listing  │                    │ /admin/*      │
  │ (client) │                    │ (client-side) │
  └─────────┘                     └──────┬───────┘
       │                                 │
       │        ┌────────────┐           │
       └───────►│  Supabase  │◄──────────┘
                │            │     CRUD (admin RLS)
                │ - products │     Image upload
                │ - storage  │
                │ - auth     │
                └────────────┘
```

### Security
- **RLS policies** ensure only admin users can create/update/delete products
- Anyone can READ products (public storefront)
- Storage bucket: public read, admin-only write
- Admin guard checks `profiles.role = 'admin'` on every admin page load

---

## Product Form Fields

| Field | Type | Notes |
|-------|------|-------|
| Name | Text | Required |
| Slug | Auto-generated | From name, editable |
| Description | Textarea | Full description |
| Short Description | Text | For cards/previews |
| Original Price | Number | MRP |
| Current Price | Number | Selling price |
| On Sale | Toggle | Shows strikethrough pricing |
| Category | Select | men / women / unisex |
| Size | Text | Default: 50ml |
| Status | Select | in_stock / out_of_stock / discontinued |
| Featured | Toggle | Shows on home page |
| Display Order | Number | Sort order in listings |
| Tags | Chip input | e.g. "New Launch", "Best Seller" |
| Fragrance Notes | 3 chip inputs | Top, Middle, Base notes |
| Image | Upload | PNG/JPG/WebP, max 5MB |
