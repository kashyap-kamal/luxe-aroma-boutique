# Delhivery Integration Setup Guide

This guide will help you set up Delhivery order and pincode serviceability APIs with your Razorpay payment pipeline.

## 🔧 Environment Variables Required

Create a `.env.local` file with the following variables:

```env
# Next.js Configuration
BASE_PATH=
URL=https://aromeluxe.in

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here

# Delhivery API Configuration
DELHIVERY_API_KEY=your_delhivery_api_key_here
DELHIVERY_BASE_URL=https://staging-express.delhivery.com
DELHIVERY_PICKUP_LOCATION=your_warehouse_name_here

# Seller Information (for Delhivery orders)
SELLER_NAME=Aromé Luxe
SELLER_ADDRESS=Your Business Address, City, State, Pincode
SELLER_GSTIN=your_gstin_number_here
```

## 📋 Setup Steps

### 1. Delhivery Account Setup

1. **Register with Delhivery**:
   - Visit [Delhivery Developer Portal](https://track.delhivery.com/api-docs/)
   - Create an account and get API credentials
   - Note down your API Key and Client ID

2. **Configure Seller Information**:
   - Update `SELLER_NAME` with your business name
   - Update `SELLER_ADDRESS` with your complete business address
   - Update `SELLER_GSTIN` with your GST registration number
   - Update `DELHIVERY_PICKUP_LOCATION` with your registered warehouse name (exact name as registered with Delhivery)

### 2. Razorpay Configuration

1. **Get Razorpay Credentials**:
   - Visit [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
   - Copy your Test/Live API Key and Secret
   - Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

### 3. API Endpoints Created

The following API endpoints have been created:

- **`/api/check-pincode`** - Check if a pincode is serviceable
- **`/api/create-delhivery-order`** - Create order with Delhivery after payment
- **`/api/track-order`** - Track order using waybill number

### 4. Components Added

- **`PincodeChecker`** - Component for checking delivery availability
- **`OrderTracker`** - Component for tracking orders

## 🚀 Features Implemented

### ✅ Pincode Serviceability Check
- Real-time pincode validation
- Delivery time estimation
- Shipping charges calculation
- Integration with checkout form

### ✅ Order Management
- Automatic Delhivery order creation after payment
- Waybill generation
- Order tracking integration
- Error handling and fallbacks

### ✅ Payment Pipeline Integration
- Seamless integration with Razorpay
- Automatic order creation after successful payment
- Support for both COD and prepaid orders
- Comprehensive error handling

## 🔄 Workflow

1. **Customer enters pincode** → Pincode serviceability check
2. **Customer fills checkout form** → Form validation with pincode check
3. **Payment processing** → Razorpay payment gateway
4. **Order creation** → Automatic Delhivery order creation
5. **Order tracking** → Waybill generation and tracking

## 🧪 Testing

### Test Pincode Serviceability
```bash
curl -X POST http://localhost:3000/api/check-pincode \
  -H "Content-Type: application/json" \
  -d '{"pincode": "110001", "weight": 0.5, "cod": true}'
```

### Test Order Creation
```bash
curl -X POST http://localhost:3000/api/create-delhivery-order \
  -H "Content-Type: application/json" \
  -d '{
    "customerInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "address": "123 Main St",
      "city": "Delhi",
      "state": "Delhi",
      "postalCode": "110001",
      "country": "India"
    },
    "orderItems": [{
      "name": "Test Product",
      "quantity": 1,
      "price": 1000
    }],
    "totalAmount": 1180,
    "paymentMode": "prepaid",
    "razorpayOrderId": "order_123"
  }'
```

### Test Order Tracking
```bash
curl -X POST http://localhost:3000/api/track-order \
  -H "Content-Type: application/json" \
  -d '{"waybill": "1234567890"}'
```

## 🛠️ Customization

### Shipping Charges
Modify the `calculateCharges` method in `src/lib/delhivery-api.ts`:

```typescript
private calculateCharges(weight: number, cod: boolean): { cod: number; prepaid: number } {
  // Your custom shipping calculation logic
  let baseCharge = 0;
  
  if (weight <= 0.5) {
    baseCharge = 50; // Free shipping for orders under 0.5kg
  } else if (weight <= 1) {
    baseCharge = 80;
  } else {
    baseCharge = 120 + (weight - 2) * 20;
  }

  return {
    cod: cod ? baseCharge + 20 : baseCharge,
    prepaid: baseCharge,
  };
}
```

### Delivery Time Estimation
Modify the `calculateDeliveryTime` method in `src/lib/delhivery-api.ts`:

```typescript
private calculateDeliveryTime(pincode: string): string {
  // Your custom delivery time calculation
  const firstDigit = parseInt(pincode[0]);
  
  if (firstDigit >= 1 && firstDigit <= 3) {
    return '1-2 business days'; // Metro cities
  } else if (firstDigit >= 4 && firstDigit <= 6) {
    return '2-3 business days'; // Tier 2 cities
  } else {
    return '3-5 business days'; // Other areas
  }
}
```

## 🚨 Important Notes

1. **API Rate Limits**: Delhivery has rate limits on their API calls
2. **Error Handling**: The system gracefully handles API failures
3. **Fallback Strategy**: If Delhivery order creation fails, the payment still succeeds
4. **Testing**: Always test with Delhivery's sandbox environment first

## 📞 Support

- **Delhivery API Docs**: https://track.delhivery.com/api-docs/
- **Razorpay Docs**: https://razorpay.com/docs/
- **Next.js Docs**: https://nextjs.org/docs

## 🔒 Security

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Implement proper error handling to avoid exposing sensitive information
- Regularly rotate API keys

## 📈 Monitoring

Consider implementing:
- API call logging
- Error rate monitoring
- Order success rate tracking
- Performance metrics

Your Delhivery integration is now ready! 🎉
