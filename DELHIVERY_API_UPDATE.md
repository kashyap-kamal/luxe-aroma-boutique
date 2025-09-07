# Delhivery API Update - Official Specification Compliance

## 🔄 **Changes Made**

Based on the official Delhivery API documentation, I've updated the implementation to match the exact specification for shipment creation.

### **Key Changes:**

#### **1. API Endpoint Update**
- **Before**: `https://track.delhivery.com/api/cmu/create.json`
- **After**: `https://staging-express.delhivery.com/api/cmu/create.json`

#### **2. Request Format Update**
- **Before**: JSON body with `client_id`
- **After**: URL-encoded form data with `pickup_location`

#### **3. Environment Variables Update**
- **Removed**: `DELHIVERY_CLIENT_ID`
- **Added**: `DELHIVERY_PICKUP_LOCATION` (warehouse name)

#### **4. Request Structure Update**

**Old Format:**
```json
{
  "name": "Customer Name",
  "client_id": "client_id_value",
  // ... other fields
}
```

**New Format (Official):**
```javascript
{
  format: 'json',
  data: JSON.stringify({
    shipments: [{
      name: "Customer Name",
      add: "Address",
      pin: "110001",
      // ... all required fields
    }],
    pickup_location: {
      name: "warehouse_name"
    }
  })
}
```

### **Updated Interface**

The `CreateOrderRequest` interface now includes all official Delhivery API parameters:

```typescript
interface CreateOrderRequest {
  // Required fields
  name: string;
  add: string;
  phone: string;
  pin: string;
  city: string;
  state: string;
  country: string;
  order: string;
  payment_mode: 'COD' | 'Prepaid' | 'Pickup' | 'REPL';
  
  // Optional fields
  products_desc?: string;
  cod_amount?: number;
  total_amount?: number;
  seller_add?: string;
  seller_name?: string;
  seller_inv?: string;
  quantity?: number;
  weight?: number;
  address_type?: string;
  shipping_mode?: string;
  fragile_shipment?: boolean;
  shipment_height?: number;
  shipment_width?: number;
  shipment_length?: number;
  dangerous_good?: boolean;
  plastic_packaging?: boolean;
  hsn_code?: string;
  return_name?: string;
  return_address?: string;
  return_city?: string;
  return_phone?: string;
  return_state?: string;
  return_country?: string;
  return_pin?: string;
  waybill?: string;
}
```

### **Environment Configuration**

Update your `.env.local` file:

```env
# Delhivery API Configuration
DELHIVERY_API_KEY=your_delhivery_api_key_here
DELHIVERY_BASE_URL=https://staging-express.delhivery.com
DELHIVERY_PICKUP_LOCATION=your_warehouse_name_here

# Seller Information
SELLER_NAME=Aromé Luxe
SELLER_ADDRESS=Your Business Address, City, State, Pincode
SELLER_GSTIN=your_gstin_number_here
```

### **API Request Example**

The implementation now sends requests in the exact format expected by Delhivery:

```javascript
const formData = new URLSearchParams();
formData.append('format', 'json');
formData.append('data', JSON.stringify({
  shipments: [{
    name: "John Doe",
    add: "123 Main Street",
    pin: "110001",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    phone: "9876543210",
    order: "ORD-123456",
    payment_mode: "Prepaid",
    products_desc: "Perfume (Qty: 1)",
    total_amount: 1180,
    seller_add: "Your Business Address",
    seller_name: "Aromé Luxe",
    seller_inv: "INV-123456",
    quantity: 1,
    weight: 0.5,
    address_type: "home",
    shipping_mode: "Surface",
    fragile_shipment: false,
    dangerous_good: false,
    plastic_packaging: false
  }],
  pickup_location: {
    name: "your_warehouse_name"
  }
}));
```

### **Response Handling**

The API now properly handles the official Delhivery response format:

```javascript
if (data.success) {
  const shipment = data.shipments && data.shipments[0];
  return {
    success: true,
    order_id: shipment?.order || request.order,
    waybill: shipment?.waybill || shipment?.awb,
  };
}
```

### **Benefits of This Update**

1. **✅ Official Compliance** - Matches exact Delhivery API specification
2. **✅ Better Error Handling** - Proper response parsing
3. **✅ Enhanced Features** - Support for all Delhivery parameters
4. **✅ Future-Proof** - Compatible with Delhivery updates
5. **✅ Production Ready** - Uses staging endpoint for testing

### **Testing**

The updated implementation is ready for testing with:

1. **Staging Environment** - Uses `staging-express.delhivery.com`
2. **Proper Authentication** - Token-based authorization
3. **URL Encoding** - Handles special characters correctly
4. **Complete Field Mapping** - All required and optional fields included

### **Next Steps**

1. **Get Delhivery Credentials** - Register with Delhivery and get API key
2. **Register Warehouse** - Set up pickup location with Delhivery
3. **Update Environment** - Add your credentials to `.env.local`
4. **Test Integration** - Verify order creation and tracking
5. **Go Live** - Switch to production endpoint when ready

Your Delhivery integration is now fully compliant with the official API specification! 🚀
