# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arome Luxe is a premium e-commerce perfume boutique. The frontend is a Next.js 15 static site deployed to Hostinger. The backend uses Supabase (PostgreSQL + Deno Edge Functions) for auth, orders, payments, and shipping.

## Commands

```bash
npm run dev              # Dev server with Turbopack
npm run build            # Static production build (output: "export")
npm run lint             # ESLint
npm run deploy           # Build + create deploy archive via scripts/deploy.sh
npm run optimize-images  # Optimize images in public/assets/ (tinify-style, visually lossless)
npm run optimize-images:dry  # Preview optimization savings without modifying files
```

No test framework is configured.

### Image Optimization

`scripts/optimize-images.mjs` uses sharp to compress images. Originals are backed up to `.image-backups/`.

```bash
node scripts/optimize-images.mjs                  # default: visually-lossless
node scripts/optimize-images.mjs --lossless        # strictly lossless
node scripts/optimize-images.mjs --webp            # also generate .webp copies
node scripts/optimize-images.mjs --max-width 800   # resize images wider than 800px
node scripts/optimize-images.mjs --dry-run         # preview only
```

### Deployment to Hostinger

This is a static export site. Deployment flow:

1. `npm run optimize-images` — compress images (run once, or after adding new images)
2. `npm run build` — generates static files in `out/`
3. Create archive: `cd out && zip -r ../aromeluxe_deploy.zip .`
4. Upload `aromeluxe_deploy.zip` to Hostinger via hPanel → File Manager → `public_html`
5. Extract the archive on the server, then delete the zip
6. Verify at https://aromeluxe.in

The `.htaccess` file (in project root and copied to `out/` during build) handles compression, security headers, caching, and SPA routing on Hostinger.

**Hostinger MCP note:** The `deployStaticWebsite` and `deployJsApplication` MCP tools currently return 400 on pre-upload. Use manual hPanel upload or FTP until resolved.

## Architecture

### Frontend (Next.js 15 App Router)

- **Static export** (`output: "export"` in `next.config.ts`) — no API routes, no SSR at runtime. All backend calls go to Supabase Edge Functions.
- **UI**: shadcn/ui (Radix UI primitives) in `src/components/ui/`, styled with Tailwind CSS 4.
- **State**: Zustand stores in `src/stores/` — `cart-store.ts` (shopping cart with session persistence), `auth-store.ts` (auth state), `payment-store.tsx` (Cashfree payment flow).
- **Services**: `src/lib/` contains service modules that call Supabase Edge Functions — `auth-service.ts`, `data-service.ts`, `order-management.ts`, `billing.ts`, `contact-service.ts`, `email-service.ts`.
- **Product data**: Static JSON catalog at `src/products.json` — not fetched from database.
- **Path alias**: `@/` maps to `src/`.

### Backend (Supabase Edge Functions)

Edge Functions live in `supabase/functions/{name}/index.ts` (Deno TypeScript runtime). Key functions:

- **Auth**: `auth-signup`, `auth-signin`, `auth-forgot-password`, `auth-reset-password`
- **Payments**: `create-cashfree-order`, `verify-cashfree-payment`, `cashfree-webhook`
- **Shipping**: `create-shiprocket-order`, `check-shiprocket-pincode`, `track-shiprocket-order`, `shiprocket-webhook`
- **Notifications**: `send-notification` (email templates in `supabase/email-templates/`)
- **Contact**: `contact-handler`

Shared utilities are in `supabase/functions/_shared/`.

### Database

Migrations in `supabase/migrations/`. Key tables: `profiles`, `orders`, `order_errors`, `webhooks`, `contact_messages`.

### Payment & Shipping Flow

1. User checks out → `create-cashfree-order` creates payment session
2. Cashfree webhook (`cashfree-webhook`) confirms payment → order status updated
3. `create-shiprocket-order` creates shipment
4. Shiprocket webhook (`shiprocket-webhook`) sends status updates → `send-notification` emails customer

## Key Conventions

- Edge Functions must include CORS headers and handle OPTIONS preflight requests.
- Database schema changes must use migration files (`supabase/migrations/YYYYMMDDHHMMSS_description.sql`), applied via Supabase MCP tools — not raw CLI commands.
- Edge Functions are deployed via `mcp_supabase_deploy_edge_function`, not the Supabase CLI directly.
- The `.cursorrules` file contains detailed MCP tool workflows for Supabase and Hostinger operations — refer to it when performing infrastructure tasks.

## Environment Variables

**Frontend** (in `.env`):
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `NEXT_PUBLIC_CASHFREE_ENVIRONMENT` — `sandbox` or `production`
- `NEXT_PUBLIC_APP_URL` — Site URL (https://aromeluxe.in)

**Supabase Edge Function secrets** (set via dashboard):
- `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD` — Shiprocket API auth
- `CASHFREE_WEBHOOK_SECRET` — Webhook signature verification
- Seller details: `SELLER_NAME`, `SELLER_ADDRESS`, `SELLER_CITY`, `SELLER_STATE`, `SELLER_PINCODE`, `SELLER_PHONE`

## Hostinger Hosting

- **Domain**: `aromeluxe.in` (main), `aromeluxe.shop` (addon)
- **Username**: `u677900242`
- **Root**: `/home/u677900242/domains/aromeluxe.in/public_html`
- **Plan**: Hostinger Premium
- **SMTP**: `smtp.hostinger.com:465`, sender `noreply@aromeluxe.in`
