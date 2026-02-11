# Cashfree One Click Checkout Integration Guide

This guide explains how to set up and use Cashfree One Click Checkout (OCC) in your Aromé Luxe boutique application.

## 🚀 Quick Start

### 1. Cashfree Account Setup

1. **Create Cashfree Account**
   - Sign up at [cashfree.com](https://www.cashfree.com/)
   - Complete KYC verification
   - Activate One Click Checkout feature in dashboard

2. **Get API Credentials**
   - Go to Developers → API Keys
   - Copy your `Client ID` and `Secret Key`
   - Note: Use Sandbox credentials for testing, Production for live

### 2. Environment Variables

Add these to your `.env.local` file:

```env
# Cashfree Configuration
CASHFREE_CLIENT_ID=your_client_id_here
CASHFREE_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_CASHFREE_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_CASHFREE_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox  # or "production" for live

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Aromé Luxe
```

**Important Security Notes:**
- `CASHFREE_CLIENT_ID` and `CASHFREE_SECRET_KEY` are server-side only (used in API routes)
- `NEXT_PUBLIC_CASHFREE_CLIENT_ID` and `NEXT_PUBLIC_CASHFREE_SECRET_KEY` are client-side (used in frontend)
- Never commit these values to version control

### 3. Supabase Configuration (Optional)

If you want to store orders in Supabase:

1. **Create Orders Table**
   ```sql
   CREATE TABLE orders (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     cashfree_order_id TEXT UNIQUE NOT NULL,
     customer_email TEXT NOT NULL,
     customer_name TEXT NOT NULL,
     customer_phone TEXT NOT NULL,
     order_amount DECIMAL(10,2) NOT NULL,
     order_currency TEXT DEFAULT 'INR',
     order_status TEXT NOT NULL,
     payment_status TEXT,
     payment_method TEXT,
     shipping_address JSONB,
     billing_address JSONB,
     items JSONB NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE INDEX idx_orders_cashfree_order_id ON orders(cashfree_order_id);
   CREATE INDEX idx_orders_customer_email ON orders(customer_email);
   ```

2. **Create Webhooks Table** (for logging webhook events)
   ```sql
   CREATE TABLE webhooks (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     order_id TEXT NOT NULL,
     event_type TEXT NOT NULL,
     payload JSONB NOT NULL,
     processed BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### 4. Domain Whitelisting

Before going live:

1. Log in to Cashfree Dashboard
2. Go to Developers → Whitelisting
3. Add your production domain (e.g., `https://yourdomain.com`)
4. Add return URLs:
   - `https://yourdomain.com/order-success/{order_id}`
   - `https://yourdomain.com/api/webhook/cashfree`

## 📋 Features Implemented

### ✅ Payment Flow

1. **Order Creation**: Creates Cashfree order with One Click Checkout enabled
2. **Checkout**: Opens Cashfree checkout page with pre-filled customer details
3. **Payment Processing**: Handles payment through Cashfree gateway
4. **Verification**: Verifies payment status after completion
5. **Webhook Handling**: Receives and processes payment status updates

### ✅ One Click Checkout Features

- **Instant OTP Verification**: Fast customer authentication
- **Smart Address Pre-filling**: From 100M+ saved addresses
- **25% Faster Checkout**: Optimized payment flow
- **AI-Powered Risk Assessment**: For COD orders
- **Customizable Interface**: Brand-perfect experience

## 🛠️ Technical Implementation

### API Routes

- **`POST /api/checkout`**: Creates Cashfree order
- **`POST /api/verify-payment`**: Verifies payment status
- **`POST /api/webhook/cashfree`**: Handles Cashfree webhooks

### Components

- **`src/types/cashfree.ts`**: TypeScript interfaces for Cashfree
- **`src/types/services/cashfree-services.ts`**: Payment service logic
- **`src/stores/payment-store.tsx`**: Payment state management
- **`src/app/checkout/page.tsx`**: Checkout page with Cashfree integration

### Payment Flow

```
User clicks "Pay Now"
  ↓
Create Cashfree Order (API)
  ↓
Get Payment Session ID
  ↓
Open Cashfree Checkout
  ↓
User completes payment
  ↓
Cashfree redirects to return URL
  ↓
Verify payment status
  ↓
Update order in database
  ↓
Show success page
```

## 🧪 Testing

### Sandbox Testing

1. Use sandbox credentials from Cashfree dashboard
2. Set `NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox`
3. Test with Cashfree test cards:
   - **Success**: `4111 1111 1111 1111`
   - **Failure**: `4000 0000 0000 0002`
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date

### Test Scenarios

- ✅ Successful payment
- ✅ Failed payment
- ✅ Payment cancellation
- ✅ Webhook processing
- ✅ Order verification

## 🔒 Security Best Practices

1. **API Keys**: Store securely in environment variables
2. **Webhook Verification**: Verify webhook signatures (implement signature verification)
3. **HTTPS**: Always use HTTPS in production
4. **Input Validation**: Validate all user inputs
5. **Error Handling**: Don't expose sensitive information in error messages

## 📚 Documentation References

- [Cashfree One Click Checkout Docs](https://www.cashfree.com/docs/payments/checkout/one-click-checkout)
- [Cashfree API Reference](https://www.cashfree.com/docs/api)
- [Cashfree Webhooks](https://www.cashfree.com/docs/payments/webhooks)

## 🚨 Troubleshooting

### Common Issues

1. **"Payment service not configured"**
   - Check environment variables are set correctly
   - Verify API keys are valid

2. **"Cashfree SDK not loaded"**
   - Check internet connection
   - Verify script tag is present in checkout page
   - Check browser console for errors

3. **"Invalid order ID"**
   - Verify order was created successfully
   - Check order ID format matches Cashfree requirements

4. **Webhook not receiving**
   - Verify webhook URL is whitelisted in Cashfree dashboard
   - Check server logs for incoming requests
   - Ensure endpoint is publicly accessible

## 📝 Migration from Razorpay

All Razorpay references have been removed and replaced with Cashfree:

- ✅ Payment service updated
- ✅ API routes migrated
- ✅ Types and interfaces updated
- ✅ Checkout page updated
- ✅ Order management updated
- ✅ Dependencies removed

## 🎯 Next Steps

1. **Complete Cashfree Account Setup**
   - Finish KYC verification
   - Activate One Click Checkout

2. **Configure Environment Variables**
   - Add all required environment variables
   - Test with sandbox credentials

3. **Set Up Supabase** (Optional)
   - Create orders table
   - Configure webhook logging

4. **Test Payment Flow**
   - Test in sandbox environment
   - Verify all payment scenarios

5. **Go Live**
   - Switch to production credentials
   - Whitelist production domain
   - Monitor webhook logs

## 💡 Additional Features to Consider

- **Order Management Dashboard**: View and manage orders
- **Refund Processing**: Handle refunds through Cashfree
- **Analytics**: Track payment success rates
- **Email Notifications**: Send order confirmations
- **Order Tracking**: Integrate with shipping providers





