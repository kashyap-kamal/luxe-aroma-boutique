# Delhivery API Keys Migration to Supabase

This document explains how Delhivery API keys have been moved to Supabase Edge Functions for secure storage.

## 🔒 Security Improvement

**Before**: Delhivery API keys were stored in environment variables (`DELHIVERY_API_KEY`, `DELHIVERY_BASE_URL`, `DELHIVERY_PICKUP_LOCATION`) and exposed to the frontend/API routes.

**After**: All Delhivery API keys are now stored securely in Supabase secrets and accessed only through Edge Functions.

## 📋 Setup Instructions

### 1. Add Delhivery Secrets to Supabase

Go to your Supabase Dashboard → Project Settings → Edge Functions → Secrets and add:

```
DELHIVERY_API_KEY=your_delhivery_api_key_here
DELHIVERY_BASE_URL=https://staging-express.delhivery.com
DELHIVERY_PICKUP_LOCATION=your_warehouse_name_here
SELLER_NAME=Aromé Luxe
SELLER_ADDRESS=Your Business Address, City, State, Pincode
```

**For Production**:
```
DELHIVERY_BASE_URL=https://track.delhivery.com
```

### 2. Deploy Edge Functions

Deploy the three new Edge Functions:

```bash
# Deploy check-delhivery-pincode function
supabase functions deploy check-delhivery-pincode

# Deploy create-delhivery-order function
supabase functions deploy create-delhivery-order

# Deploy track-delhivery-order function
supabase functions deploy track-delhivery-order
```

Or use Supabase MCP tools in Cursor to deploy them.

### 3. Remove Environment Variables

You can now **remove** these from your `.env.local` file (they're no longer needed):

```env
# ❌ Remove these - now stored in Supabase secrets
# DELHIVERY_API_KEY=...
# DELHIVERY_BASE_URL=...
# DELHIVERY_PICKUP_LOCATION=...
# SELLER_NAME=...
# SELLER_ADDRESS=...
```

### 4. Update Frontend Code

The API routes have been updated to call Supabase Edge Functions instead of using keys directly:

- `/api/check-pincode` → Calls `check-delhivery-pincode` Edge Function
- `/api/create-delhivery-order` → Calls `create-delhivery-order` Edge Function
- `/api/track-order` → Calls `track-delhivery-order` Edge Function

No frontend changes needed - the API routes handle the migration transparently.

## 🎯 Edge Functions Created

### 1. `check-delhivery-pincode`
- **Purpose**: Check if a pincode is serviceable by Delhivery
- **Endpoint**: `POST /functions/v1/check-delhivery-pincode`
- **Request**: `{ pincode: string, weight?: number, cod?: boolean }`
- **Response**: `{ pincode: string, serviceable: boolean, deliveryTime?: string, charges?: {...}, error?: string }`

### 2. `create-delhivery-order`
- **Purpose**: Create a shipping order with Delhivery
- **Endpoint**: `POST /functions/v1/create-delhivery-order`
- **Request**: `{ name, add, phone, pin, city, state, country, order, payment_mode, ... }`
- **Response**: `{ success: boolean, order_id?: string, waybill?: string, error?: string }`

### 3. `track-delhivery-order`
- **Purpose**: Track an order using waybill number
- **Endpoint**: `POST /functions/v1/track-delhivery-order`
- **Request**: `{ waybill: string }`
- **Response**: `{ success: boolean, data?: {...}, error?: string }`

## 🔐 Security Benefits

1. **API Keys Never Exposed**: Keys are stored in Supabase secrets and never sent to the frontend
2. **Centralized Management**: All API keys managed in one place (Supabase Dashboard)
3. **Access Control**: Edge Functions can enforce authentication/authorization
4. **Audit Trail**: All API calls logged in Supabase Edge Function logs
5. **Environment Separation**: Different keys for staging/production managed in Supabase

## 📝 Environment Variables Still Needed

You still need these Supabase environment variables in your `.env.local`:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## ✅ Verification

After deployment, test the functions:

1. **Check Pincode**: Test `/api/check-pincode` endpoint
2. **Create Order**: Test `/api/create-delhivery-order` endpoint (after payment)
3. **Track Order**: Test `/api/track-order` endpoint with a waybill number

## 🚨 Troubleshooting

### "Delhivery API key not configured"
- **Solution**: Add `DELHIVERY_API_KEY` to Supabase secrets

### "Delhivery pickup location not configured"
- **Solution**: Add `DELHIVERY_PICKUP_LOCATION` to Supabase secrets

### Edge Function deployment fails
- **Solution**: Check Supabase CLI is installed and authenticated
- **Alternative**: Use Supabase Dashboard → Edge Functions → Deploy

### API calls failing
- **Solution**: Check Edge Function logs in Supabase Dashboard
- **Check**: Verify Supabase URL and anon key are correct in `.env.local`

## 📚 Related Documentation

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Delhivery API Documentation](https://track.delhivery.com/api-docs/)
- [Cashfree Supabase Setup](./SUPABASE_BAAS_SETUP.md) (similar pattern)

---

**Migration Complete!** 🎉

Your Delhivery API keys are now securely stored in Supabase and never exposed to the frontend.

