# Supabase BaaS Setup for Cashfree Integration

This guide shows you how to set up Supabase as your Backend-as-a-Service (BaaS) to securely handle Cashfree payments without exposing API keys.

## 🔐 Why Use Supabase as BaaS?

- **Secure**: API keys stored in Supabase secrets, never exposed to frontend
- **Scalable**: Edge Functions run globally for low latency
- **Database Included**: Store orders, webhooks, and customer data
- **Free Tier**: Generous free tier for development and small projects

## 📋 Prerequisites

1. Supabase account ([Sign up](https://supabase.com))
2. Cashfree account ([Sign up](https://www.cashfree.com))
3. Supabase CLI installed

## 🚀 Step-by-Step Setup

### Step 1: Install Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (with Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or use npm
npm install -g supabase
```

### Step 2: Initialize Supabase in Your Project

```bash
# Navigate to your project directory
cd /Users/ayushpaharia/Desktop/box/project-by-org/arome-luxe/luxe-aroma-boutique

# Login to Supabase
supabase login

# Link to your Supabase project (or create new one)
supabase link --project-ref your-project-ref

# Or init a new project
supabase init
```

### Step 3: Set Up Supabase Secrets

Store your Cashfree API keys securely in Supabase:

```bash
# Set Cashfree credentials as secrets
supabase secrets set CASHFREE_CLIENT_ID=your_cashfree_client_id
supabase secrets set CASHFREE_SECRET_KEY=your_cashfree_secret_key
supabase secrets set CASHFREE_ENVIRONMENT=sandbox  # or production
supabase secrets set APP_URL=http://localhost:3000  # or your production URL

# Verify secrets are set
supabase secrets list
```

**Important**: These secrets are only accessible to your Supabase Edge Functions, never exposed to the frontend.

### Step 4: Create Database Tables

Run the migration to create orders and webhooks tables:

```bash
# Apply the migration
supabase db push

# Or manually run the SQL in Supabase Dashboard → SQL Editor
# Copy contents from: supabase/migrations/20240101000000_create_orders_tables.sql
```

This creates:
- `orders` table: Stores all orders with payment details
- `webhooks` table: Logs all webhook events from Cashfree
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates

### Step 5: Deploy Edge Functions

Deploy the Supabase Edge Functions:

```bash
# Deploy all functions
supabase functions deploy create-cashfree-order
supabase functions deploy verify-cashfree-payment
supabase functions deploy cashfree-webhook

# Or deploy all at once
supabase functions deploy
```

**Edge Functions Created:**
1. `create-cashfree-order`: Creates orders with Cashfree
2. `verify-cashfree-payment`: Verifies payment status
3. `cashfree-webhook`: Handles Cashfree webhook notifications

### Step 6: Update Environment Variables

Update your `.env.local` file (remove Cashfree keys from here):

```env
# Supabase Configuration (these are safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Remove these - they're now in Supabase secrets
# CASHFREE_CLIENT_ID=...
# CASHFREE_SECRET_KEY=...
```

**Important**: 
- Supabase URL and Anon Key are safe to expose (they're client-side)
- Cashfree keys are stored securely in Supabase secrets

### Step 7: Configure Cashfree Webhook URL

In your Cashfree Dashboard:

1. Go to Developers → Webhooks
2. Add webhook URL:
   ```
   https://your-project.supabase.co/functions/v1/cashfree-webhook
   ```
3. Enable webhook events:
   - Order Paid
   - Order Active
   - Order Expired

## 📊 Database Schema

### Orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  cashfree_order_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_amount DECIMAL(10,2) NOT NULL,
  order_currency TEXT DEFAULT 'INR',
  order_status TEXT NOT NULL,
  payment_status TEXT,
  payment_method TEXT,
  payment_details JSONB,
  shipping_address JSONB,
  billing_address JSONB,
  items JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Webhooks Table

```sql
CREATE TABLE webhooks (
  id UUID PRIMARY KEY,
  order_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔒 Security Features

### Row Level Security (RLS)

1. **Users can only view their own orders**
   ```sql
   CREATE POLICY "Users can view own orders"
     ON orders FOR SELECT
     USING (auth.jwt() ->> 'email' = customer_email);
   ```

2. **Edge Functions have full access**
   ```sql
   CREATE POLICY "Service role has full access"
     ON orders FOR ALL
     USING (auth.jwt() ->> 'role' = 'service_role');
   ```

3. **Only service role can access webhooks**
   ```sql
   CREATE POLICY "Service role has full access to webhooks"
     ON webhooks FOR ALL
     USING (auth.jwt() ->> 'role' = 'service_role');
   ```

## 🧪 Testing

### Test Edge Functions Locally

```bash
# Start Supabase locally
supabase start

# Test create-cashfree-order function
curl -i --location --request POST \
  'http://localhost:54321/functions/v1/create-cashfree-order' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"amount":100,"customerInfo":{"name":"Test User","email":"test@example.com","contact":"9999999999"},"cartItems":[],"returnUrl":"http://localhost:3000/order-success/{order_id}"}'

# View function logs
supabase functions logs create-cashfree-order
```

### Test Payment Flow

1. Go to your checkout page
2. Complete a test payment using Cashfree test credentials
3. Check Supabase Dashboard → Table Editor → orders
4. Verify order was created and updated after payment

### View Webhook Logs

```bash
# View webhook function logs
supabase functions logs cashfree-webhook

# Or check in Supabase Dashboard → Edge Functions → cashfree-webhook → Logs
```

## 📈 Monitoring

### View Orders in Supabase Dashboard

1. Go to Supabase Dashboard
2. Click on Table Editor
3. Select `orders` table
4. View all orders with filter and search

### View Webhook Events

1. Go to Table Editor
2. Select `webhooks` table
3. View all webhook events received from Cashfree

### Order Statistics

Query the `order_statistics` view:

```sql
SELECT * FROM order_statistics;
```

Returns:
- Total orders
- Paid orders
- Active orders
- Expired orders
- Total revenue
- Average order value

## 🔧 Customization

### Add Custom Logic to Edge Functions

Edit the Edge Functions to add custom logic:

**After Payment Success:**
```typescript
// In cashfree-webhook/index.ts, add:
case "PAID":
  // Send confirmation email
  await sendConfirmationEmail(customer_details.customer_email, order_id);
  
  // Update inventory
  await updateInventory(orderItems);
  
  // Trigger fulfillment
  await createShippingLabel(order_id);
  
  break;
```

**Store Additional Data:**
```typescript
// In create-cashfree-order/index.ts, add:
const { error } = await supabase
  .from("orders")
  .insert({
    cashfree_order_id: orderId,
    customer_email: customerInfo.email,
    customer_name: customerInfo.name,
    customer_phone: customerInfo.contact,
    order_amount: amount,
    items: cartItems,
    order_status: "ACTIVE",
  });
```

## 🚨 Troubleshooting

### Function Deployment Fails

```bash
# Check function syntax
supabase functions serve create-cashfree-order

# View detailed error logs
supabase functions logs create-cashfree-order --level error
```

### Secrets Not Working

```bash
# Verify secrets are set
supabase secrets list

# Re-deploy functions after setting secrets
supabase functions deploy
```

### Database Migration Fails

```bash
# Check migration status
supabase db diff

# Reset database (WARNING: deletes all data)
supabase db reset
```

### CORS Errors

The Edge Functions include CORS headers. If you still get errors:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://yourdomain.com", // Specify your domain
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

## 📚 Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [Cashfree API Reference](https://www.cashfree.com/docs/api)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🎯 Next Steps

1. ✅ Complete Supabase setup
2. ✅ Deploy Edge Functions
3. ✅ Test payment flow end-to-end
4. Add email notifications
5. Add admin dashboard for order management
6. Set up monitoring and alerts
7. Switch to production credentials

## 💡 Pro Tips

1. **Use Supabase CLI for development**: Test functions locally before deploying
2. **Monitor function logs**: Check logs regularly for errors
3. **Use environment-specific secrets**: Separate sandbox and production secrets
4. **Set up database backups**: Enable automatic backups in Supabase Dashboard
5. **Use TypeScript**: Edge Functions support TypeScript for better type safety
6. **Test webhooks**: Use Cashfree Dashboard to manually trigger test webhooks

---

**Security Note**: With this setup, your Cashfree API keys are never exposed to the frontend. All sensitive operations happen in Supabase Edge Functions with secrets stored securely in Supabase.





