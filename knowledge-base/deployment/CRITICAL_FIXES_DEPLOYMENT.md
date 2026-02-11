# Critical Fixes Deployment Guide

**Date:** February 11, 2026
**Priority:** CRITICAL - Deploy Immediately
**Estimated Time:** 30-45 minutes

---

## Overview

This guide covers the deployment of critical fixes that enable automated order fulfillment. These fixes address the main blocker preventing production launch.

### What's Been Fixed

1. ✅ **Automated Shiprocket Order Creation** - Already implemented in Cashfree webhook
2. ✅ **Shiprocket Webhook Handler** - NEW - Receives real-time shipment status updates
3. ✅ **Error Tracking System** - NEW - Logs all failures to `order_errors` table
4. ✅ **Customer Notifications** - NEW - Automated email notifications for order updates

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Supabase project access (project ID: bzqwezglotpkzxghjxvc)
- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Shiprocket account with API credentials
- [ ] Cashfree account with webhook secret configured
- [ ] Hostinger SMTP configured in Supabase (for email notifications)
- [ ] Database backup created (recommended)

---

## Step 1: Deploy Database Migration

### Apply the `order_errors` Table Migration

```bash
# Navigate to project directory
cd /path/to/luxe-aroma-boutique

# Apply migration using Supabase CLI
supabase db push

# Or apply manually via Supabase Dashboard:
# 1. Go to https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc/sql/new
# 2. Copy contents of: supabase/migrations/20260211_create_order_errors_table.sql
# 3. Run the SQL
```

### Verify Migration Success

```sql
-- Check that order_errors table exists
SELECT * FROM order_errors LIMIT 1;

-- Check that delivered_at and rto_delivered_at columns were added
SELECT delivered_at, rto_delivered_at FROM orders LIMIT 1;
```

**Expected Result:** Both queries should execute without errors (even if they return 0 rows).

---

## Step 2: Configure Supabase Secrets

### Required Environment Variables

Set these secrets in Supabase Dashboard:
https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc/settings/vault

```bash
# Shiprocket credentials (if not already set)
SHIPROCKET_EMAIL=your-shiprocket-email@example.com
SHIPROCKET_PASSWORD=your-shiprocket-password
SHIPROCKET_BASE_URL=https://apiv2.shiprocket.in/v1/external

# Seller/Pickup address (if not already set)
SELLER_NAME=Aromé Luxe
SELLER_ADDRESS=Your Pickup Address
SELLER_CITY=Your City
SELLER_STATE=Your State
SELLER_PINCODE=123456
SELLER_PHONE=+919876543210

# Cashfree secrets (if not already set)
CASHFREE_SECRET_KEY=your-cashfree-secret-key
CASHFREE_WEBHOOK_SECRET=your-cashfree-webhook-secret

# Application URL
APP_URL=https://aromeluxe.in

# Optional: Email service (if using Resend or similar)
# RESEND_API_KEY=your-resend-api-key
```

### Verify Secrets

```bash
# Using Supabase CLI
supabase secrets list

# Or check in Dashboard:
# https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc/settings/vault
```

---

## Step 3: Deploy Edge Functions

### Deploy All Edge Functions

```bash
# Deploy all functions at once
supabase functions deploy

# Or deploy individually:
supabase functions deploy cashfree-webhook
supabase functions deploy shiprocket-webhook
supabase functions deploy send-notification
supabase functions deploy create-shiprocket-order
supabase functions deploy check-shiprocket-pincode
supabase functions deploy track-shiprocket-order
```

### Verify Deployment

```bash
# List deployed functions
supabase functions list

# Check function logs
supabase functions logs cashfree-webhook --tail
```

**Expected Output:**
```
Functions deployed:
  - cashfree-webhook
  - shiprocket-webhook
  - send-notification
  - create-shiprocket-order
  - check-shiprocket-pincode
  - track-shiprocket-order
```

---

## Step 4: Configure Webhooks

### A. Configure Cashfree Webhook

1. Go to Cashfree Dashboard: https://merchant.cashfree.com/merchants/login
2. Navigate to **Developers** → **Webhooks**
3. Add webhook URL:
   ```
   https://bzqwezglotpkzxghjxvc.supabase.co/functions/v1/cashfree-webhook
   ```
4. Select events:
   - ☑️ Payment Success
   - ☑️ Payment Failed
   - ☑️ Payment Pending
5. Copy the **Webhook Secret** and add it to Supabase secrets as `CASHFREE_WEBHOOK_SECRET`

### B. Configure Shiprocket Webhook

1. Go to Shiprocket Dashboard: https://app.shiprocket.in/login
2. Navigate to **Settings** → **API & Webhooks** → **Webhooks**
3. Add webhook URL:
   ```
   https://bzqwezglotpkzxghjxvc.supabase.co/functions/v1/shiprocket-webhook
   ```
4. Select events:
   - ☑️ Order Placed
   - ☑️ Order Pickup Scheduled
   - ☑️ Order Dispatched
   - ☑️ In Transit
   - ☑️ Out for Delivery
   - ☑️ Delivered
   - ☑️ RTO
5. Save webhook configuration

### Verify Webhook Configuration

**Test Cashfree Webhook:**
```bash
curl -X POST https://bzqwezglotpkzxghjxvc.supabase.co/functions/v1/cashfree-webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: test" \
  -H "x-webhook-timestamp: $(date +%s)" \
  -d '{"order_id":"test","order_status":"ACTIVE"}'
```

**Expected Response:**
```json
{
  "error": "Invalid webhook signature"
}
```
This is correct! It means the endpoint is working and signature verification is active.

---

## Step 5: Test End-to-End Flow

### Test Scenario 1: Complete Order Flow

1. **Place Test Order**
   - Visit: https://aromeluxe.in
   - Add products to cart
   - Proceed to checkout
   - Enter **valid test address** (use a real pincode that's serviceable)
   - Complete payment with Cashfree test card:
     - Card: 4111 1111 1111 1111
     - CVV: 123
     - Expiry: Any future date

2. **Verify Payment Webhook**
   ```bash
   # Check Cashfree webhook logs
   supabase functions logs cashfree-webhook --tail
   ```

   **Expected Log Output:**
   ```
   Webhook signature verified successfully - processing webhook
   Order {order_id} payment successful
   Creating Shiprocket order for {order_id}
   Shiprocket order created successfully. AWB: {awb_number}
   Order confirmation notification sent successfully
   ```

3. **Verify Database Updates**
   ```sql
   -- Check order status
   SELECT
     cashfree_order_id,
     order_status,
     payment_status,
     shiprocket_awb,
     shiprocket_status,
     shiprocket_courier_name
   FROM orders
   WHERE cashfree_order_id = 'your-test-order-id';
   ```

   **Expected Result:**
   - `order_status` = 'PAID'
   - `payment_status` = 'SUCCESS'
   - `shiprocket_awb` = (not null, e.g., 'AWB123456789')
   - `shiprocket_status` = 'created'
   - `shiprocket_courier_name` = (courier name, e.g., 'Delhivery')

4. **Verify Email Notification**
   - Check customer email inbox
   - Should receive: "Order Confirmed" email
   - If AWB assigned: "Your Order Has Been Shipped" email

5. **Verify Shiprocket Order**
   - Login to Shiprocket Dashboard
   - Check **Orders** section
   - Confirm order was created with correct details
   - AWB should be assigned

### Test Scenario 2: Shipment Status Update

1. **Trigger Status Update in Shiprocket**
   - Go to Shiprocket Dashboard
   - Find the test order
   - Manually update status to "Dispatched" (or use their test webhook tool)

2. **Verify Shiprocket Webhook**
   ```bash
   # Check Shiprocket webhook logs
   supabase functions logs shiprocket-webhook --tail
   ```

   **Expected Log Output:**
   ```
   Shiprocket webhook received
   Shiprocket status update: ORDER_DISPATCHED -> dispatched
   Updating order {cashfree_order_id} with Shiprocket status: dispatched
   Order updated successfully with status: dispatched
   Sending customer notification for status: dispatched
   Notification sent successfully for dispatched
   ```

3. **Verify Database Update**
   ```sql
   SELECT
     cashfree_order_id,
     order_status,
     shiprocket_status,
     updated_at
   FROM orders
   WHERE cashfree_order_id = 'your-test-order-id';
   ```

   **Expected Result:**
   - `order_status` = 'SHIPPED'
   - `shiprocket_status` = 'dispatched'
   - `updated_at` = (recently updated timestamp)

4. **Verify Email Notification**
   - Customer should receive: "Your Order Is On The Way" email

### Test Scenario 3: Error Handling

1. **Trigger Shiprocket Error** (invalid address)
   - Place order with invalid pincode (e.g., '000000')
   - Complete payment

2. **Verify Error Logging**
   ```sql
   SELECT
     cashfree_order_id,
     error_type,
     error_message,
     created_at
   FROM order_errors
   WHERE cashfree_order_id = 'your-test-order-id';
   ```

   **Expected Result:**
   - Error logged with `error_type` = 'shipment_failed'
   - `error_message` contains details about the failure

3. **Verify Order Status**
   ```sql
   SELECT
     cashfree_order_id,
     shiprocket_status,
     notes
   FROM orders
   WHERE cashfree_order_id = 'your-test-order-id';
   ```

   **Expected Result:**
   - `shiprocket_status` = 'failed' or 'pending_address'
   - `notes` contains error description

---

## Step 6: Monitor Production

### Real-Time Monitoring

```bash
# Monitor all Edge Function logs
supabase functions logs --tail

# Monitor specific function
supabase functions logs cashfree-webhook --tail
supabase functions logs shiprocket-webhook --tail
supabase functions logs send-notification --tail
```

### Check for Errors

```sql
-- View unresolved errors
SELECT
  cashfree_order_id,
  error_type,
  error_message,
  retry_count,
  created_at
FROM order_errors
WHERE resolved = false
ORDER BY created_at DESC
LIMIT 10;

-- Count errors by type
SELECT
  error_type,
  COUNT(*) as count
FROM order_errors
WHERE resolved = false
GROUP BY error_type;
```

### Check Orders Needing Attention

```sql
-- Orders with payment but no shipment
SELECT
  cashfree_order_id,
  customer_email,
  order_status,
  payment_status,
  shiprocket_status,
  created_at
FROM orders
WHERE payment_status = 'SUCCESS'
  AND (shiprocket_awb IS NULL OR shiprocket_awb = '')
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Orders with failed shipment creation
SELECT
  cashfree_order_id,
  customer_email,
  shiprocket_status,
  notes,
  created_at
FROM orders
WHERE shiprocket_status = 'failed'
ORDER BY created_at DESC;
```

---

## Troubleshooting

### Issue: Shiprocket Order Not Created

**Symptoms:**
- Order payment successful
- `shiprocket_awb` is NULL
- `shiprocket_status` = 'failed' or 'pending_address'

**Solutions:**

1. **Check Error Logs**
   ```sql
   SELECT error_message, error_details
   FROM order_errors
   WHERE cashfree_order_id = 'your-order-id';
   ```

2. **Common Causes:**
   - **Invalid/Missing Address Fields**: Ensure address, city, state, pincode, phone are all provided
   - **Invalid Pincode Format**: Must be exactly 6 digits
   - **Pincode Not Serviceable**: Check if pincode is serviceable via Shiprocket
   - **Shiprocket Credentials Invalid**: Verify SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD secrets
   - **Shiprocket API Down**: Check Shiprocket status page

3. **Manual Fix:**
   - Update order with correct address
   - Manually create Shiprocket order via dashboard
   - Update order record:
     ```sql
     UPDATE orders
     SET shiprocket_awb = 'AWB123',
         shiprocket_status = 'created',
         shiprocket_courier_name = 'Delhivery'
     WHERE cashfree_order_id = 'your-order-id';
     ```

### Issue: Emails Not Sending

**Symptoms:**
- Logs show "Failed to send notification"
- Customer not receiving emails

**Solutions:**

1. **Check SMTP Configuration**
   - Verify Hostinger SMTP settings in Supabase
   - Test SMTP connection

2. **Implement Email Service**
   - Current implementation logs emails but doesn't send
   - Need to integrate with actual email service (Resend, SendGrid, Hostinger SMTP)

3. **Temporary Workaround:**
   - Use Supabase Dashboard to manually send emails
   - Or send emails via your email client until fixed

### Issue: Webhook Signature Verification Failed

**Symptoms:**
- Cashfree webhook logs show "Invalid webhook signature"
- Orders not updating after payment

**Solutions:**

1. **Verify Webhook Secret:**
   ```bash
   supabase secrets list | grep CASHFREE
   ```
   Should show `CASHFREE_WEBHOOK_SECRET` or `CASHFREE_SECRET_KEY`

2. **Update Secret:**
   - Get correct secret from Cashfree Dashboard
   - Update in Supabase:
     ```bash
     supabase secrets set CASHFREE_WEBHOOK_SECRET=your-correct-secret
     ```

3. **Redeploy Webhook Function:**
   ```bash
   supabase functions deploy cashfree-webhook
   ```

---

## Rollback Plan

If critical issues occur after deployment:

### 1. Stop Processing New Orders
- Put maintenance mode message on website
- Or disable checkout temporarily

### 2. Revert Database Migration
```sql
-- Remove order_errors table
DROP TABLE IF EXISTS order_errors;

-- Remove new columns from orders
ALTER TABLE orders
  DROP COLUMN IF EXISTS delivered_at,
  DROP COLUMN IF EXISTS rto_delivered_at;
```

### 3. Revert Edge Functions
```bash
# Deploy previous version (if you have git history)
git checkout previous-commit
supabase functions deploy

# Or manually revert specific functions
```

### 4. Process Orders Manually
- Export pending orders
- Create Shiprocket shipments manually
- Update database manually

---

## Post-Deployment Tasks

After successful deployment:

1. **Update Documentation**
   - [ ] Mark deployment as complete in ROADMAP.md
   - [ ] Update knowledge-base with new webhook URLs
   - [ ] Document any issues encountered

2. **Monitor for 24 Hours**
   - [ ] Check logs every few hours
   - [ ] Verify all test orders process correctly
   - [ ] Monitor error_errors table

3. **Implement Email Service**
   - [ ] Integrate with Resend, SendGrid, or Hostinger SMTP
   - [ ] Update `send-notification` Edge Function
   - [ ] Test email delivery

4. **Set Up Alerting**
   - [ ] Configure alerts for failed shipments
   - [ ] Set up daily error summary email
   - [ ] Create dashboard for monitoring

---

## Next Steps

After critical fixes are deployed and stable:

1. **Implement Admin Dashboard** (Week 2-3)
   - View all orders
   - Manually create shipments for failed orders
   - View error logs

2. **Enhance Notifications** (Week 2)
   - Implement actual email sending (Resend/SendGrid)
   - Add SMS notifications (Twilio/MSG91)
   - Customize email templates

3. **Add Retry Logic** (Week 3)
   - Auto-retry failed Shiprocket orders
   - Exponential backoff
   - Alert after max retries

4. **Inventory Management** (Week 3-4)
   - Track stock levels
   - Prevent overselling
   - Auto-restock alerts

---

## Support

If you encounter issues:

- **Supabase Support**: https://supabase.com/dashboard/support
- **Shiprocket Support**: https://app.shiprocket.in/support
- **Cashfree Support**: https://merchant.cashfree.com/support
- **Project Documentation**: See `knowledge-base/` directory

---

**Deployment completed? Update the status:**
```
Status: ✅ DEPLOYED
Date: [DATE]
Deployed By: [NAME]
```
