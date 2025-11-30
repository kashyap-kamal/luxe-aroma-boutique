# ✅ Supabase BaaS Setup Complete!

Your Supabase Backend-as-a-Service is now fully configured for Cashfree payments!

## 🎉 What's Been Set Up

### ✅ Database Tables Created
- **`orders`** - Stores all orders with payment details
- **`webhooks`** - Logs all webhook events from Cashfree
- **Row Level Security (RLS)** - Enabled with proper policies
- **Indexes** - Optimized for performance
- **Triggers** - Automatic timestamp updates

### ✅ Edge Functions Deployed (All Active)
1. **`create-cashfree-order`** - Creates Cashfree orders with One Click Checkout
2. **`verify-cashfree-payment`** - Verifies payment status
3. **`cashfree-webhook`** - Handles webhook notifications

### ✅ Security Features
- Row Level Security enabled
- Service role policies configured
- Users can only view their own orders
- Webhooks accessible only to service role

## 🔐 Next Steps: Set Your Secrets

**IMPORTANT**: You need to set your Cashfree API keys as Supabase secrets. These are stored securely and never exposed to the frontend.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Edge Functions** → **Secrets**
4. Add these secrets:

```
CASHFREE_CLIENT_ID=your_cashfree_client_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENVIRONMENT=sandbox  # or "production" for live
APP_URL=http://localhost:3000  # or your production URL
```

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref bzqwezglotpkzxghjxvc

# Set secrets
supabase secrets set CASHFREE_CLIENT_ID=your_cashfree_client_id
supabase secrets set CASHFREE_SECRET_KEY=your_cashfree_secret_key
supabase secrets set CASHFREE_ENVIRONMENT=sandbox
supabase secrets set APP_URL=http://localhost:3000
```

## 📋 Environment Variables for Frontend

Update your `.env.local` file with these values:

```env
# Supabase Configuration (Safe to expose - these are client-side keys)
NEXT_PUBLIC_SUPABASE_URL=https://bzqwezglotpkzxghjxvc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Aromé Luxe

# DO NOT add Cashfree keys here - they're stored securely in Supabase secrets!
```

**Get your anon key from**: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`

## 🔗 Edge Function URLs

Your Edge Functions are available at:

- **Create Order**: `https://bzqwezglotpkzxghjxvc.supabase.co/functions/v1/create-cashfree-order`
- **Verify Payment**: `https://bzqwezglotpkzxghjxvc.supabase.co/functions/v1/verify-cashfree-payment`
- **Webhook**: `https://bzqwezglotpkzxghjxvc.supabase.co/functions/v1/cashfree-webhook`

## 🧪 Testing

### 1. Test Order Creation

```bash
curl -X POST \
  'https://bzqwezglotpkzxghjxvc.supabase.co/functions/v1/create-cashfree-order' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "amount": 100,
    "customerInfo": {
      "name": "Test User",
      "email": "test@example.com",
      "contact": "9999999999"
    },
    "cartItems": [
      {
        "productId": "prod_1",
        "productName": "Test Product",
        "price": 100,
        "quantity": 1
      }
    ],
    "returnUrl": "http://localhost:3000/order-success/{order_id}"
  }'
```

### 2. Test Payment Verification

```bash
curl -X POST \
  'https://bzqwezglotpkzxghjxvc.supabase.co/functions/v1/verify-cashfree-payment' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "orderId": "ORDER_1234567890_abc123"
  }'
```

## 📊 View Your Data

### In Supabase Dashboard

1. **View Orders**: Table Editor → `orders` table
2. **View Webhooks**: Table Editor → `webhooks` table
3. **View Statistics**: SQL Editor → Run `SELECT * FROM order_statistics;`

### Edge Function Logs

1. Go to Edge Functions in Dashboard
2. Click on any function
3. View logs in real-time

## 🔧 Configure Cashfree Webhook

In your Cashfree Dashboard:

1. Go to **Developers** → **Webhooks**
2. Add webhook URL:
   ```
   https://bzqwezglotpkzxghjxvc.supabase.co/functions/v1/cashfree-webhook
   ```
3. Enable events:
   - Order Paid
   - Order Active
   - Order Expired

## ✅ Verification Checklist

- [x] Database tables created (`orders`, `webhooks`)
- [x] Edge Functions deployed (all 3 functions active)
- [x] Row Level Security enabled
- [ ] Cashfree secrets set in Supabase Dashboard
- [ ] Frontend environment variables configured
- [ ] Cashfree webhook URL configured
- [ ] Test payment flow end-to-end

## 🚨 Troubleshooting

### Edge Functions Not Working?

1. **Check Secrets**: Make sure Cashfree secrets are set in Supabase Dashboard
2. **Check Logs**: View function logs in Supabase Dashboard → Edge Functions
3. **Check CORS**: Functions include CORS headers, but verify your domain is allowed

### Database Errors?

1. **Check RLS Policies**: Make sure service role has access
2. **Check Table Structure**: Verify tables exist in Table Editor
3. **Check Logs**: View database logs in Supabase Dashboard

### Payment Not Working?

1. **Verify Secrets**: Check Cashfree credentials are correct
2. **Check Environment**: Make sure `CASHFREE_ENVIRONMENT` matches your Cashfree account
3. **Check Webhook**: Verify webhook URL is configured in Cashfree Dashboard

## 📚 Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Cashfree API Reference](https://www.cashfree.com/docs/api)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🎯 What's Next?

1. **Set Cashfree Secrets** (Required before testing)
2. **Update Frontend Environment Variables**
3. **Test Payment Flow** with Cashfree sandbox
4. **Configure Webhook** in Cashfree Dashboard
5. **Go Live** when ready!

---

**Your Supabase project URL**: `https://bzqwezglotpkzxghjxvc.supabase.co`

All Cashfree API keys are stored securely in Supabase secrets and never exposed to your frontend! 🔐





