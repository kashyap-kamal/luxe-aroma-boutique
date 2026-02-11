# Shiprocket Integration Setup

This document explains how Shiprocket is integrated with the Aromé Luxe project for shipping and order tracking.

## Overview

Shiprocket is used for:
- **Pincode serviceability check** - Verify if delivery is available to a pincode
- **Automatic order creation** - Create shipments after successful payment
- **Courier assignment** - Auto-assign the best courier partner
- **Order tracking** - Track shipments using AWB numbers

## Architecture

All Shiprocket API calls are made through Supabase Edge Functions.
Credentials are stored securely in Supabase secrets.

### Edge Functions

1. **`check-shiprocket-pincode`** - Check pincode serviceability
   - Endpoint: `POST /functions/v1/check-shiprocket-pincode`
   - Input: `{ pincode, weight?, cod? }`
   - Returns: Serviceability, delivery time, charges, courier info

2. **`create-shiprocket-order`** - Create shipping order
   - Endpoint: `POST /functions/v1/create-shiprocket-order`
   - Input: Order details (name, address, items, etc.)
   - Returns: `order_id`, `shipment_id`, `awb`, `courier_name`

3. **`track-shiprocket-order`** - Track shipment
   - Endpoint: `POST /functions/v1/track-shiprocket-order`
   - Input: `{ awb }`
   - Returns: Tracking status, location, timestamps

## Supabase Secrets Required

Set these secrets in Supabase Dashboard > Settings > Edge Functions > Secrets:

| Secret | Description | Example |
|--------|-------------|---------|
| `SHIPROCKET_EMAIL` | Shiprocket account email | `you@example.com` |
| `SHIPROCKET_PASSWORD` | Shiprocket account password | `your_password` |
| `SHIPROCKET_BASE_URL` | Shiprocket API base URL | `https://apiv2.shiprocket.in/v1/external` |
| `SELLER_NAME` | Your business name | `Aromé Luxe` |
| `SELLER_ADDRESS` | Pickup address | `123 Street, Area` |
| `SELLER_CITY` | Pickup city | `Mumbai` |
| `SELLER_STATE` | Pickup state | `Maharashtra` |
| `SELLER_PINCODE` | Pickup pincode | `400001` |
| `SELLER_PHONE` | Pickup contact | `9876543210` |

## Authentication

Shiprocket uses email/password authentication. Each Edge Function:
1. Logs in with `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD`
2. Receives a Bearer token
3. Uses the token for API calls

## Automatic Order Flow

After a successful Cashfree payment:
1. Cashfree webhook fires -> `cashfree-webhook` Edge Function
2. Webhook verifies payment and fetches order from database
3. Calls `create-shiprocket-order` Edge Function
4. Shiprocket creates order and auto-assigns courier
5. AWB number and courier info are stored in the `orders` table
6. Customer sees tracking info on the order success page

## Database Columns

The `orders` table has these Shiprocket columns:
- `shiprocket_order_id` - Shiprocket order ID
- `shiprocket_shipment_id` - Shiprocket shipment ID
- `shiprocket_awb` - AWB tracking number
- `shiprocket_status` - Shipment status (pending, created, failed, pending_address)
- `shiprocket_courier_id` - Courier partner ID
- `shiprocket_courier_name` - Courier partner name

## Testing

1. **Pincode Check**: Go to a product page and enter a pincode
2. **Order Creation**: Complete a test payment through Cashfree
3. **Tracking**: Use the AWB number on the order success page

## Troubleshooting

### "Shiprocket credentials not configured"
- Ensure `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD` are set in Supabase secrets

### "Shiprocket auth failed"
- Verify your email/password are correct
- Check if your Shiprocket account is active

### AWB not assigned
- The order is created but no courier is available
- Check Shiprocket dashboard for the order
- May need to manually assign a courier

### Pincode not serviceable
- The pincode may not be covered by any courier partner
- Try a different pincode or check Shiprocket serviceability dashboard

## API Reference

- Shiprocket API Docs: https://apidocs.shiprocket.in/
- Base URL: `https://apiv2.shiprocket.in/v1/external`
