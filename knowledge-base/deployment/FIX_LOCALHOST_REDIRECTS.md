# Fix for Localhost Redirects Issue

## Problem Description

When users clicked on internal links like "Discover our story" on the homepage at `aromeluxe.in`, they were being redirected to `localhost:3000` instead of staying on the production domain.

## Root Cause

The issue was caused by hardcoded `localhost` URLs as fallback values in multiple files:

1. **Frontend Code:**
   - `src/types/services/cashfree-services.ts` - Used `http://localhost:3000` as fallback for `appUrl`
   - `src/types/services/payment-services.ts` - Used `http://localhost:5173` as fallback for Razorpay
   - `src/lib/metadata.ts` - Returned `http://localhost:3000` in development mode

2. **Supabase Edge Functions:**
   - `supabase/functions/create-cashfree-order/index.ts` - Used `http://localhost:3000` in product URLs
   - `supabase/functions/auth-forgot-password/index.ts` - Used `http://localhost:3000` for password reset links

When building the static site without setting environment variables (`NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_URL`), these localhost values were baked into the production build.

## Changes Made

### 1. Frontend Code Updates

**File: `src/types/services/cashfree-services.ts`**
- Changed: `appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"`
- To: `appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://aromeluxe.in"`

**File: `src/types/services/payment-services.ts`**
- Changed: `appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5173"`
- To: `appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://aromeluxe.in"`

**File: `src/lib/metadata.ts`**
- Removed development mode check that returned `http://localhost:3000`
- Now always uses production URL (`https://aromeluxe.in`) as fallback for static export

### 2. Supabase Edge Functions Updates

**File: `supabase/functions/create-cashfree-order/index.ts`**
- Changed: `item_details_url: ${Deno.env.get("APP_URL") || "http://localhost:3000"}/products/${item.productId}`
- To: `item_details_url: ${Deno.env.get("APP_URL") || "https://aromeluxe.in"}/products/${item.productId}`

**File: `supabase/functions/auth-forgot-password/index.ts`**
- Changed: `const resetUrl = ${Deno.env.get("APP_URL") || "http://localhost:3000"}/auth/reset-password`
- To: `const resetUrl = ${Deno.env.get("APP_URL") || "https://aromeluxe.in"}/auth/reset-password`

### 3. Deploy Script Enhancement

**File: `scripts/deploy.js`**
- Added environment variable validation before build
- Displays warning if required variables (`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`) are not set
- Provides guidance on setting them correctly

## Steps to Fix the Production Site

### Step 1: Update Supabase Edge Functions

The Edge Functions need to be redeployed with the updated code:

```bash
# Deploy the updated Edge Functions using Supabase MCP tools
# This should be done through the Cursor AI using the MCP tools
```

Or set the APP_URL secret in Supabase:

```bash
# If you have Supabase CLI installed:
supabase secrets set APP_URL=https://aromeluxe.in
```

Or through Supabase Dashboard:
1. Go to https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc/settings/vault
2. Add/Update secret: `APP_URL` = `https://aromeluxe.in`

### Step 2: Set Environment Variables (Optional but Recommended)

Create/update `.env.local` file with production values:

```bash
NEXT_PUBLIC_APP_URL=https://aromeluxe.in
NEXT_PUBLIC_SITE_URL=https://aromeluxe.in
NEXT_PUBLIC_APP_NAME=Aromé Luxe

# Your existing Supabase and Cashfree variables
NEXT_PUBLIC_SUPABASE_URL=your_value
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value
NEXT_PUBLIC_CASHFREE_CLIENT_ID=your_value
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox  # or production
```

### Step 3: Rebuild and Redeploy

```bash
# Clean previous build
rm -rf out

# Build with production values
# The fallbacks are now correct, but setting env vars explicitly is best practice
npm run deploy:prod

# This will:
# 1. Check environment variables (with warnings if not set)
# 2. Build the static site
# 3. Create a deployment archive
```

### Step 4: Upload to Hostinger

1. Upload the generated `deploy-YYYYMMDD-HHMMSS.tar.gz` file to your Hostinger `public_html` directory
2. Extract the archive in the `public_html` directory
3. Verify the site works correctly at https://aromeluxe.in

## Testing

After deployment, test the following:

1. **Internal Navigation:**
   - ✅ Click "Discover Our Story" on homepage → Should go to `/about` on aromeluxe.in
   - ✅ Click "Our Story" in hero section → Should go to `/about` on aromeluxe.in
   - ✅ All navigation links should stay on aromeluxe.in domain

2. **Payment Flow:**
   - ✅ Checkout process should redirect correctly after payment
   - ✅ Password reset emails should contain aromeluxe.in links

3. **Email Links:**
   - ✅ Password reset emails should link to https://aromeluxe.in/auth/reset-password
   - ✅ Not to localhost URLs

## Prevention

To prevent this issue in the future:

1. **Always Set Environment Variables Before Building:**
   - Set `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SITE_URL` before running `npm run build`
   - The deploy script now warns if these aren't set

2. **Use Relative Paths for Internal Links:**
   - All internal navigation already uses relative paths (e.g., `/about`, `/products`)
   - Never use absolute URLs for internal links

3. **Set Supabase Secrets:**
   - Ensure `APP_URL` is set in Supabase Edge Function secrets
   - This prevents Edge Functions from using localhost URLs

4. **Updated Fallback Values:**
   - All fallback URLs now point to `https://aromeluxe.in`
   - Even if env vars aren't set, the site will work correctly

## Summary

The issue has been fixed by:
1. ✅ Replacing all `localhost` fallbacks with `https://aromeluxe.in`
2. ✅ Updating both frontend code and Supabase Edge Functions
3. ✅ Adding environment variable validation to deploy script
4. ✅ Documenting proper deployment procedure

**Next Action Required:** Rebuild and redeploy the site using the steps above.
