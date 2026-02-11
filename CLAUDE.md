# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aromé Luxe is a premium e-commerce perfume boutique. The frontend is a Next.js 15 static site deployed to Hostinger. The backend uses Supabase (PostgreSQL + Deno Edge Functions) for auth, orders, payments, and shipping.

## Commands

```bash
npm run dev          # Dev server with Turbopack
npm run build        # Static production build (output: "export")
npm run lint         # ESLint
npm run deploy       # Deploy to Hostinger via scripts/deploy.sh
```

No test framework is configured.

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
