# Aromé Luxe Production Launch Roadmap

**Last Updated:** February 11, 2026
**Project:** Aromé Luxe E-commerce Platform
**Status:** Pre-Production (Critical Blockers Exist)

---

## Executive Summary

Aromé Luxe is a luxury perfume e-commerce platform built with Next.js, Supabase, Cashfree (payments), and Shiprocket (shipping). The platform has a **fully functional payment flow** but a **partially broken fulfillment flow** that prevents automated order processing.

### Current System Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | ✅ Ready | Next.js with static export, responsive UI |
| Authentication | ✅ Ready | Supabase Auth with email/password |
| Product Catalog | ✅ Ready | Mock data, ready for real inventory |
| Cart & Checkout | ✅ Ready | Zustand state management, form validation |
| Payment Gateway | ✅ Ready | Cashfree One Click Checkout integration |
| Payment Webhooks | ✅ Ready | Signature verification, status updates |
| Pincode Check | ✅ Ready | Shiprocket serviceability validation |
| Order Database | ✅ Ready | PostgreSQL with proper schema |
| **Shipment Automation** | ❌ **BROKEN** | **No auto-creation after payment** |
| **Shiprocket Webhooks** | ❌ **MISSING** | **No status update webhooks** |
| Order Tracking | ⚠️ Partial | Works only if AWB manually added |
| Customer Notifications | ❌ Missing | No email/SMS for order updates |
| Admin Interface | ❌ Missing | No manual order management |
| Error Monitoring | ⚠️ Limited | Basic logging, no alerting |

### Launch Readiness: 🔴 NOT READY

**Critical Issue:** Customers can pay successfully, but orders will not be shipped automatically. This will result in:
- Paid orders without shipments
- Customer complaints and refund requests
- Manual intervention required for every order
- Poor customer experience

---

## Critical Blockers (Must Fix Before Launch)

These issues **MUST** be resolved before any production launch. Current system cannot operate without manual intervention.

### 1. 🔴 Automated Shiprocket Order Creation

**Priority:** CRITICAL
**Impact:** Launch Blocker
**Estimated Effort:** 1-2 days

#### Problem
After customers complete payment via Cashfree:
- Payment webhook updates order status to "PAID" ✅
- Order sits in database with `shiprocket_awb = NULL` ❌
- No shipment is created in Shiprocket ❌
- Customer receives no tracking information ❌

#### Solution
Modify the Cashfree webhook handler to automatically trigger Shiprocket order creation:

**File to Modify:** [supabase/functions/cashfree-webhook/index.ts](../supabase/functions/cashfree-webhook/index.ts)

**Implementation Steps:**
1. After successful payment verification (when `order_status = "PAID"`)
2. Extract order details (customer info, items, shipping address)
3. Call `create-shiprocket-order` Edge Function
4. Receive AWB and Shiprocket order IDs
5. Update database with:
   - `shiprocket_order_id`
   - `shiprocket_shipment_id`
   - `shiprocket_awb`
   - `shiprocket_status = 'created'`
   - `shiprocket_courier_name`

**Error Handling:**
- Retry logic (3 attempts with exponential backoff)
- Log failures to `order_errors` table
- Send alert to admin email/Slack
- Mark order as `shiprocket_status = 'failed'` for manual processing

**Testing:**
- Complete test payment in Cashfree sandbox
- Verify automatic Shiprocket order creation
- Confirm AWB stored in database
- Check order success page shows tracking info

**Files Involved:**
- `supabase/functions/cashfree-webhook/index.ts` (lines 87-88 currently commented)
- `supabase/functions/create-shiprocket-order/index.ts` (already exists, not called)

---

### 2. 🔴 Shiprocket Webhook Handler

**Priority:** CRITICAL
**Impact:** Customer Experience
**Estimated Effort:** 1-2 days

#### Problem
After shipment is created:
- No real-time status updates from Shiprocket ❌
- Cannot track shipment progress automatically ❌
- Customer must manually check tracking ❌
- No notifications when order is delivered ❌

#### Solution
Create new Edge Function to receive Shiprocket webhooks:

**File to Create:** `supabase/functions/shiprocket-webhook/index.ts`

**Webhook Events to Handle:**
1. **Order Pickup Scheduled** - Update status, notify customer
2. **Shipment Dispatched** - Update status, send tracking link
3. **In Transit** - Update location and ETA
4. **Out for Delivery** - Alert customer
5. **Delivered** - Mark complete, request review
6. **Failed Delivery** - Alert customer and admin
7. **RTO (Return to Origin)** - Handle returns

**Implementation:**
```typescript
// Verify Shiprocket webhook signature
// Parse webhook payload
// Update orders table: shiprocket_status, updated_at
// Trigger customer notification (email/SMS)
// Log event in webhooks table
```

**Database Updates:**
- `orders.shiprocket_status` - Update based on event
- `orders.shiprocket_courier_name` - Update if changed
- `webhooks` table - Store event for audit trail

**Configuration Required:**
- Add webhook URL in Shiprocket dashboard
- Set up webhook authentication/signature verification
- Deploy Edge Function to production

**Testing:**
- Use Shiprocket webhook testing tool
- Simulate all status transitions
- Verify database updates
- Confirm customer notifications sent

---

### 3. 🟠 Error Handling & Monitoring

**Priority:** HIGH
**Impact:** Operations & Reliability
**Estimated Effort:** 2 days

#### Problem
- No visibility into failed operations ❌
- Can't detect stuck orders ❌
- No alerts for system failures ❌
- Difficult to debug production issues ❌

#### Solution

**A. Create Error Tracking Table**

```sql
CREATE TABLE order_errors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  cashfree_order_id TEXT,
  error_type TEXT NOT NULL, -- 'payment_failed', 'shipment_failed', 'webhook_failed'
  error_message TEXT NOT NULL,
  error_details JSONB,
  retry_count INTEGER DEFAULT 0,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_errors_order_id ON order_errors(order_id);
CREATE INDEX idx_order_errors_resolved ON order_errors(resolved);
CREATE INDEX idx_order_errors_created_at ON order_errors(created_at);
```

**B. Implement Comprehensive Logging**

Add to all Edge Functions:
- Request/response logging
- Error stack traces
- Performance metrics
- User context

**C. Add Retry Logic**

For Shiprocket API calls:
```typescript
async function createShipmentWithRetry(orderData, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await createShiprocketOrder(orderData);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}
```

**D. Set Up Error Alerting**

Options:
- Sentry integration for error tracking
- Email alerts for critical failures
- Slack/Discord webhook notifications
- Dashboard for real-time monitoring

**E. Admin Error Dashboard**

Create admin page to view:
- Failed orders requiring attention
- Recent errors with details
- Retry failed operations
- Export error logs

**Files to Create/Modify:**
- `supabase/migrations/20260211_create_order_errors_table.sql`
- All Edge Functions (add try-catch and logging)
- `src/app/admin/errors/page.tsx` (new admin page)

---

### 4. 🟠 Customer Notifications

**Priority:** HIGH
**Impact:** Customer Experience
**Estimated Effort:** 2-3 days

#### Problem
- Customers receive no confirmation emails ❌
- No shipment notifications ❌
- No delivery alerts ❌
- Poor communication leads to support queries ❌

#### Solution

**A. Email Service Integration**

Currently using: Hostinger SMTP (configured in Supabase)

**B. Email Templates Needed**

1. **Order Confirmation** (after payment)
   - Order details and items
   - Billing summary
   - Expected delivery timeline
   - Customer support contact

2. **Shipment Created** (after Shiprocket order)
   - AWB number
   - Tracking link
   - Estimated delivery date
   - Courier partner name

3. **Order Dispatched**
   - Shipment picked up
   - In transit to customer
   - Track your order button

4. **Out for Delivery**
   - Expected delivery today
   - Be available to receive
   - Contact delivery partner

5. **Delivered**
   - Order completed
   - Request review/feedback
   - Support contact if issues

6. **Delivery Failed**
   - Attempted delivery details
   - Rescheduling instructions
   - Customer action required

**C. Trigger Points**

| Trigger Event | Email Template | Edge Function |
|---------------|----------------|---------------|
| Payment Success | Order Confirmation | cashfree-webhook |
| Shiprocket Order Created | Shipment Created | cashfree-webhook |
| Status: Dispatched | Order Dispatched | shiprocket-webhook |
| Status: Out for Delivery | Out for Delivery | shiprocket-webhook |
| Status: Delivered | Delivered | shiprocket-webhook |
| Status: Failed Delivery | Delivery Failed | shiprocket-webhook |

**D. SMS Notifications (Optional)**

Integration options:
- Twilio (international)
- MSG91 (India-focused)
- Exotel (India-focused)

SMS for:
- Order confirmation with order ID
- Shipment dispatch with tracking
- Out for delivery alert
- Delivered confirmation

**E. Implementation**

Create new Edge Function:
```
supabase/functions/send-notification/index.ts
```

Features:
- Template rendering with order data
- Email sending via Hostinger SMTP
- Optional SMS via provider API
- Notification logging
- Retry on failure

**Files to Create:**
- `supabase/functions/send-notification/index.ts`
- Email templates in `supabase/email-templates/`
- Update webhook handlers to call notification function

---

## High Priority (Should Have for Launch)

### 5. 🟡 Admin Order Management Interface

**Priority:** MEDIUM-HIGH
**Impact:** Operations
**Estimated Effort:** 3-4 days

#### Features Required

**A. Orders Dashboard**
- View all orders with pagination
- Filter by:
  - Date range
  - Order status (pending, paid, shipped, delivered)
  - Payment status
  - Shiprocket status
  - Customer email
  - Order ID / Cashfree Order ID / AWB
- Sort by date, amount, status
- Export to CSV

**B. Order Detail View**
- Complete order information
- Customer details
- Payment details (masked card info)
- Shipping address
- Order items with images
- Shiprocket tracking timeline
- Webhook events history

**C. Manual Actions**
- Create Shiprocket order (for failed auto-creation)
- Update order status
- Add internal notes
- Resend notification emails
- Mark order as cancelled
- Initiate refund

**D. Bulk Operations**
- Bulk create shipments
- Bulk status updates
- Bulk export orders

**E. Analytics**
- Total orders today/week/month
- Revenue metrics
- Conversion rate
- Average order value
- Orders by status (pie chart)
- Failed shipments count

#### Implementation

**Authentication:**
- Create admin role in Supabase
- Protect admin routes with middleware
- Row-Level Security for admin queries

**Files to Create:**
- `src/app/admin/layout.tsx` - Admin layout with navigation
- `src/app/admin/orders/page.tsx` - Orders list view
- `src/app/admin/orders/[id]/page.tsx` - Order detail view
- `src/app/admin/analytics/page.tsx` - Analytics dashboard
- `src/lib/admin-api.ts` - Admin API functions
- `supabase/policies/admin_policies.sql` - RLS policies

---

### 6. 🟡 Order Cancellation & Returns

**Priority:** MEDIUM
**Impact:** Customer Service
**Estimated Effort:** 3-4 days

#### Features

**A. Order Cancellation**
- Customer can cancel before shipment
- Admin can cancel at any time
- Automatic refund processing
- Cancel Shiprocket order if created
- Email notification

**B. Return Requests**
- Customer initiates return (within 7 days)
- Select return reason
- Upload images if product damaged
- Admin reviews and approves
- Shiprocket reverse pickup scheduled

**C. Refund Processing**
- Integration with Cashfree refund API
- Full or partial refund support
- Refund status tracking
- Refund confirmation email

#### Implementation

**Database Schema:**
```sql
CREATE TABLE order_cancellations (
  id UUID PRIMARY KEY,
  order_id TEXT NOT NULL,
  cashfree_order_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  initiated_by TEXT, -- 'customer' or 'admin'
  refund_amount DECIMAL(10,2),
  refund_status TEXT,
  refund_id TEXT,
  created_at TIMESTAMP
);

CREATE TABLE return_requests (
  id UUID PRIMARY KEY,
  order_id TEXT NOT NULL,
  cashfree_order_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  images JSONB,
  status TEXT, -- 'pending', 'approved', 'rejected', 'completed'
  shiprocket_return_order_id TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP
);
```

**API Routes:**
- POST `/api/orders/[id]/cancel` - Cancel order
- POST `/api/orders/[id]/return` - Request return
- POST `/api/orders/[id]/refund` - Process refund (admin only)

**Files to Create:**
- `src/app/orders/[id]/cancel/page.tsx`
- `src/app/orders/[id]/return/page.tsx`
- `supabase/functions/process-refund/index.ts`
- `supabase/functions/create-return-order/index.ts`

---

### 7. 🟡 Inventory Management

**Priority:** MEDIUM
**Impact:** Business Operations
**Estimated Effort:** 4-5 days

#### Problem
- Using mock product data ❌
- No stock tracking ❌
- Can oversell products ❌
- No low stock alerts ❌

#### Solution

**A. Database Schema**

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_original DECIMAL(10,2),
  price_current DECIMAL(10,2),
  on_sale BOOLEAN DEFAULT false,
  category TEXT NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  sku TEXT UNIQUE,
  weight DECIMAL(10,2), -- in kg, for shipping
  dimensions JSONB, -- {length, width, height} in cm
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inventory_transactions (
  id UUID PRIMARY KEY,
  product_id TEXT NOT NULL,
  order_id TEXT,
  transaction_type TEXT, -- 'sale', 'return', 'adjustment', 'restock'
  quantity INTEGER NOT NULL,
  previous_quantity INTEGER,
  new_quantity INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_stock ON products(stock_quantity);
CREATE INDEX idx_inventory_product ON inventory_transactions(product_id);
```

**B. Stock Management Features**

1. **Automatic Stock Deduction**
   - Decrease stock when order is paid
   - Increase stock on cancellation/return
   - Log all transactions

2. **Low Stock Alerts**
   - Email admin when product reaches threshold
   - Dashboard widget showing low stock items
   - Suggested reorder quantity

3. **Out of Stock Handling**
   - Hide "Add to Cart" button
   - Show "Out of Stock" badge
   - Allow pre-orders (optional)
   - Notify when back in stock

4. **Admin Inventory Interface**
   - View all products with stock levels
   - Add/edit products
   - Bulk stock updates
   - Import/export CSV
   - Stock adjustment with reason

**C. Migration from Mock Data**

1. Export current mock products to database
2. Add stock quantities
3. Update product pages to use database
4. Remove mock data files

**Files to Modify:**
- `src/lib/mock-data.ts` → Migrate to database
- `src/app/products/page.tsx` → Fetch from database
- Create admin interface for product management

---

### 8. 🟡 Enhanced Order Tracking Page

**Priority:** MEDIUM
**Impact:** Customer Experience
**Estimated Effort:** 2-3 days

#### Current State
- [src/app/orders/page.tsx](../src/app/orders/page.tsx) - Basic tracking by AWB
- No authentication required
- No order history for logged-in users

#### Improvements

**A. Authenticated User Orders**
- Show all orders for logged-in customer
- Filter by status
- Search by order ID
- Sort by date

**B. Order Detail Modal**
- Detailed order information
- Items with images
- Payment details
- Shipping timeline with map
- Download invoice (PDF)

**C. Timeline Visualization**
- Visual progress bar
- Status checkpoints with timestamps
- Current location on map
- Estimated delivery date

**D. Order Actions**
- Track shipment (external link to courier)
- Download invoice
- Request return
- Cancel order (if not shipped)
- Contact support about order

**Files to Modify:**
- [src/app/orders/page.tsx](../src/app/orders/page.tsx)
- Create `src/components/order-timeline.tsx`
- Create `src/components/order-detail-modal.tsx`

---

## Medium Priority (Can Launch Without)

### 9. 🟢 COD (Cash on Delivery) Support

**Priority:** LOW-MEDIUM
**Estimated Effort:** 2-3 days

#### Implementation
- Add COD as payment option in checkout
- Skip Cashfree for COD orders
- Mark order with `payment_method = 'COD'`
- Pass COD flag to Shiprocket
- Handle COD reconciliation with courier
- Track COD remittances

---

### 10. 🟢 Multi-Currency Support

**Priority:** LOW
**Estimated Effort:** 3-4 days

#### Current State
- Hardcoded to INR (₹)
- Prices in database in INR only

#### Implementation
- Add currency selection
- Store prices in multiple currencies or convert dynamically
- Update Cashfree integration for currency
- Display prices in selected currency
- Handle currency conversion rates

---

### 11. 🟢 Gift Wrapping & Messages

**Priority:** LOW
**Estimated Effort:** 1-2 days

#### Features
- Add gift wrapping option in checkout
- Additional charges for gift wrapping
- Custom gift message input
- Store in order metadata
- Pass to Shiprocket as special instructions
- Include in packing slip

---

### 12. 🟢 Loyalty Program & Discounts

**Priority:** LOW
**Estimated Effort:** 4-5 days

#### Features

**A. Coupon Codes**
- Create/manage coupon codes (admin)
- Percentage or fixed amount discount
- Minimum order value
- Usage limits (per customer, total)
- Expiry date
- Apply at checkout

**B. Loyalty Points**
- Earn points on purchases
- Redeem points for discounts
- Points history
- Points expiry

**C. Referral Program**
- Refer a friend
- Both get discount on next order
- Track referrals

---

## Technical Debt & Improvements

### Security Enhancements

1. **Rate Limiting**
   - Implement on all Edge Functions
   - Prevent abuse and DDoS
   - Use Supabase rate limiting features

2. **Input Validation**
   - Validate all form inputs
   - Sanitize user data
   - Prevent SQL injection
   - Prevent XSS attacks

3. **Secrets Management**
   - All API keys in Supabase secrets ✅
   - Rotate secrets regularly
   - Never expose in client code

4. **CORS Configuration**
   - Properly configure allowed origins
   - Restrict webhook endpoints

### Performance Optimizations

1. **Image Optimization**
   - Use Next.js Image component
   - Lazy load images
   - Compress images
   - Use CDN

2. **Database Indexing**
   - Review slow queries
   - Add indexes on frequently queried fields
   - Optimize join operations

3. **Caching**
   - Cache product catalog
   - Cache static pages
   - Use Redis for session data (future)

4. **Code Splitting**
   - Lazy load heavy components
   - Reduce initial bundle size
   - Use dynamic imports

### Code Quality

1. **Testing**
   - Unit tests for utilities
   - Integration tests for Edge Functions
   - E2E tests for checkout flow
   - Test coverage > 70%

2. **Documentation**
   - API documentation
   - Component documentation
   - Setup guides (already done ✅)

3. **Type Safety**
   - Fix any TypeScript errors
   - Add types for all functions
   - Use strict mode

---

## Pre-Launch Checklist

### Critical Tests

- [ ] **Complete Order Flow Test**
  - Add products to cart
  - Proceed to checkout
  - Enter valid shipping details
  - Verify pincode serviceability
  - Complete payment (test card)
  - Verify order in database
  - **Verify Shiprocket order auto-created** ← Critical
  - Verify AWB stored in database
  - Check order success page shows tracking
  - Verify email notifications sent

- [ ] **Failed Payment Recovery**
  - Initiate payment
  - Cancel on Cashfree page
  - Verify order status updated
  - Verify customer can retry

- [ ] **Webhook Tests**
  - Test Cashfree webhook with all statuses
  - Test Shiprocket webhook with all statuses
  - Verify database updates
  - Verify notifications sent

- [ ] **Error Handling**
  - Simulate Shiprocket API failure
  - Verify retry logic
  - Verify error logged
  - Verify admin alerted

### Security Tests

- [ ] Webhook signature verification works
- [ ] API keys not exposed in client
- [ ] Rate limiting prevents abuse
- [ ] Input validation prevents injection
- [ ] CORS properly configured
- [ ] HTTPS enforced everywhere

### Performance Tests

- [ ] Page load times < 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Works on all major browsers

### Operational Readiness

- [ ] Admin can access order dashboard
- [ ] Admin can manually create shipments
- [ ] Admin receives error alerts
- [ ] Customer support contact info visible
- [ ] Privacy policy, terms, refund policy updated
- [ ] SSL certificate installed
- [ ] Domain configured correctly
- [ ] Backups configured
- [ ] Monitoring set up

### Business Readiness

- [ ] Shiprocket account verified and funded
- [ ] Cashfree account verified (KYC)
- [ ] Bank account connected for settlements
- [ ] Pickup address configured in Shiprocket
- [ ] Return address configured
- [ ] Customer support email/phone active
- [ ] Social media handles active
- [ ] Marketing materials ready

---

## Post-Launch Monitoring

### Metrics to Track

**Business Metrics:**
- Daily orders count
- Revenue (daily, weekly, monthly)
- Average order value
- Conversion rate (visitors → orders)
- Cart abandonment rate

**Operational Metrics:**
- Orders pending shipment
- Failed shipment creation count
- Average time to shipment
- Delivery success rate
- Return/cancellation rate

**Technical Metrics:**
- API response times
- Error rates
- Webhook success rates
- Database query performance
- Server uptime

**Customer Metrics:**
- Customer satisfaction score
- Support ticket volume
- Average resolution time
- Repeat customer rate

### Monitoring Tools

**Recommended:**
- **Sentry** - Error tracking and performance monitoring
- **Google Analytics** - User behavior and conversion tracking
- **Supabase Dashboard** - Database and API metrics
- **Uptime Robot** - Website uptime monitoring
- **Hotjar** - User session recordings and heatmaps

---

## Launch Timeline Estimate

Based on critical blockers and high-priority items:

### Week 1: Critical Fixes
- **Days 1-2:** Implement automated Shiprocket order creation
- **Days 3-4:** Create Shiprocket webhook handler
- **Day 5:** Testing and bug fixes

### Week 2: Essential Features
- **Days 1-2:** Error handling and monitoring
- **Days 3-4:** Customer notifications (email)
- **Day 5:** End-to-end testing

### Week 3: Operations & Polish
- **Days 1-3:** Admin order management interface
- **Days 4-5:** Final testing, security audit, performance optimization

### Week 4: Soft Launch
- **Days 1-2:** Deploy to production, limited marketing
- **Days 3-5:** Monitor, fix issues, gather feedback

### Week 5+: Full Launch
- Full marketing push
- Ongoing monitoring and improvements
- Implement medium and low priority features

**Minimum Time to Launch:** 3 weeks (with critical fixes only)
**Recommended Time to Launch:** 4-5 weeks (with essential features)

---

## Conclusion

Aromé Luxe has a solid foundation but **cannot launch** in its current state due to the broken fulfillment flow. The critical blocker is the lack of automated Shiprocket order creation after payment.

### Immediate Actions Required:

1. **Fix automated shipment creation** (1-2 days) 🔴
2. **Implement Shiprocket webhooks** (1-2 days) 🔴
3. **Add error monitoring** (2 days) 🟠
4. **Implement customer notifications** (2-3 days) 🟠

After these are complete, the platform can handle basic e-commerce operations, though the experience will be limited without admin tools and advanced features.

### Recommendation:

Complete all critical and high-priority items (Weeks 1-2) before launch. This ensures:
- Customers receive their orders automatically
- Real-time status updates
- Proper error handling
- Professional customer communication

Medium and low-priority features can be added post-launch based on user feedback and business needs.

---

**For questions or clarifications, refer to:**
- [knowledge-base/INDEX.md](../knowledge-base/INDEX.md) - Documentation index
- [knowledge-base/integrations/CASHFREE_SETUP.md](../knowledge-base/integrations/CASHFREE_SETUP.md) - Payment setup
- [knowledge-base/integrations/SHIPROCKET_SETUP.md](../knowledge-base/integrations/SHIPROCKET_SETUP.md) - Shipping setup
- Plan file: `~/.claude/plans/resilient-puzzling-milner.md` - Detailed technical audit
