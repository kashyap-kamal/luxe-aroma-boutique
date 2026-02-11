# 🚀 Quick Start - Deploy Critical Fixes

**Status:** Ready to Deploy
**Priority:** CRITICAL
**Time Required:** 30-45 minutes

---

## ✅ Pre-Deployment Checklist

Before you start, ensure you have:

- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Supabase project access (Project ID: `bzqwezglotpkzxghjxvc`)
- [ ] Shiprocket credentials ready
- [ ] Cashfree webhook secret ready
- [ ] Terminal access to this project

---

## 🎯 5-Step Deployment

### Step 1: Deploy Database Migration (2 minutes)

```bash
# Navigate to project
cd /Users/ayushpaharia/Desktop/box/project-by-org/arome-luxe/luxe-aroma-boutique

# Apply migration
supabase db push
```

**Verify:**
```sql
SELECT COUNT(*) FROM order_errors;  -- Should work (returns 0)
```

---

### Step 2: Configure Secrets (5 minutes)

Go to: https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc/settings/vault

Add these secrets (if not already set):

```bash
SHIPROCKET_EMAIL=your-email@domain.com
SHIPROCKET_PASSWORD=your-password
SELLER_NAME=Aromé Luxe
SELLER_ADDRESS=Your pickup address
SELLER_CITY=Your city
SELLER_STATE=Your state
SELLER_PINCODE=123456
SELLER_PHONE=+919876543210
APP_URL=https://aromeluxe.in
CASHFREE_WEBHOOK_SECRET=your-webhook-secret
```

**Verify:**
```bash
supabase secrets list
```

---

### Step 3: Deploy Edge Functions (5 minutes)

```bash
# Deploy all functions
supabase functions deploy
```

**Expected Output:**
```
✓ cashfree-webhook deployed
✓ shiprocket-webhook deployed
✓ send-notification deployed
✓ create-shiprocket-order deployed
✓ check-shiprocket-pincode deployed
✓ track-shiprocket-order deployed
```

---

### Step 4: Configure Webhooks (10 minutes)

#### A. Cashfree Webhook
1. Go to: https://merchant.cashfree.com/merchants/login
2. Navigate: Developers → Webhooks
3. Add URL:
   ```
   https://bzqwezglotpkzxghjxvc.supabase.co/functions/v1/cashfree-webhook
   ```
4. Select: Payment Success, Payment Failed, Payment Pending
5. Save

#### B. Shiprocket Webhook
1. Go to: https://app.shiprocket.in/login
2. Navigate: Settings → API & Webhooks → Webhooks
3. Add URL:
   ```
   https://bzqwezglotpkzxghjxvc.supabase.co/functions/v1/shiprocket-webhook
   ```
4. Select: All shipment events
5. Save

---

### Step 5: Test End-to-End (15 minutes)

#### Test Order Flow
1. Visit: https://aromeluxe.in
2. Add product to cart
3. Checkout with **valid test address**
4. Use Cashfree test card:
   - Card: 4111 1111 1111 1111
   - CVV: 123
   - Expiry: Any future date

#### Verify Results

**Check Logs:**
```bash
supabase functions logs cashfree-webhook --tail
```

**Expected Log:**
```
✓ Webhook signature verified
✓ Order payment successful
✓ Creating Shiprocket order
✓ Shiprocket order created. AWB: ABC123456
✓ Notification sent successfully
```

**Check Database:**
```sql
SELECT
  cashfree_order_id,
  order_status,
  payment_status,
  shiprocket_awb,
  shiprocket_status
FROM orders
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Result:**
- `order_status` = 'PAID'
- `payment_status` = 'SUCCESS'
- `shiprocket_awb` = (AWB number, not null)
- `shiprocket_status` = 'created'

---

## 🎉 Success Indicators

✅ **Database migration applied**
✅ **All Edge Functions deployed**
✅ **Webhooks configured**
✅ **Test order processed successfully**
✅ **Shiprocket order auto-created**
✅ **AWB assigned**
✅ **Customer notification triggered**

---

## ⚠️ Troubleshooting

### Issue: Migration Failed
**Solution:** Run migration manually via Supabase Dashboard SQL editor

### Issue: Secrets Not Found
**Solution:** Double-check secret names and values in Supabase Dashboard

### Issue: Function Deployment Failed
**Solution:**
```bash
supabase functions deploy [function-name]  # Deploy individually
supabase functions logs [function-name]     # Check logs
```

### Issue: Shiprocket Order Not Created
**Solution:**
1. Check if address fields are complete
2. Verify Shiprocket credentials
3. Check error_errors table:
   ```sql
   SELECT * FROM order_errors ORDER BY created_at DESC LIMIT 5;
   ```

---

## 📚 Next Steps

### Immediate (Before Production)
1. **Implement Email Sending**
   - Update `supabase/functions/send-notification/index.ts`
   - Integrate with Resend/SendGrid/SMTP
   - Test email delivery

### Post-Deployment (Week 1)
2. **Monitor System**
   - Check logs daily
   - Monitor `order_errors` table
   - Verify all orders process correctly

3. **Build Admin Dashboard**
   - View all orders
   - Manage failed shipments
   - Track error resolution

---

## 📖 Detailed Documentation

- **Full Deployment Guide:** `knowledge-base/deployment/CRITICAL_FIXES_DEPLOYMENT.md`
- **Production Roadmap:** `docs/ROADMAP.md`
- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`
- **Documentation Index:** `knowledge-base/INDEX.md`

---

## 🆘 Need Help?

**Check Logs:**
```bash
# Real-time monitoring
supabase functions logs --tail

# Specific function
supabase functions logs cashfree-webhook --tail
```

**Check Errors:**
```sql
-- Unresolved errors
SELECT * FROM order_errors
WHERE resolved = false
ORDER BY created_at DESC;
```

**Supabase Dashboard:**
https://supabase.com/dashboard/project/bzqwezglotpkzxghjxvc

---

## ✨ What's New?

### 🆕 Shiprocket Webhook Handler
- Real-time status updates
- Auto-updates order database
- Triggers customer notifications

### 🆕 Error Tracking System
- Comprehensive error logging
- Retry tracking
- Resolution management

### 🆕 Customer Notifications
- Automated email templates
- 6 notification types
- Beautiful HTML emails

### ✅ Enhanced Cashfree Webhook
- Better error logging
- Notification integration
- Improved debugging

---

**Ready to deploy? Follow Steps 1-5 above!** 🚀

**Questions?** Check the detailed documentation in `knowledge-base/deployment/`
