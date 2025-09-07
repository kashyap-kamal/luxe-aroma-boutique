// Delhivery API Integration
// Documentation: https://track.delhivery.com/api-docs/

import ky from 'ky';

interface DelhiveryConfig {
  apiKey: string;
  baseUrl: string;
  pickupLocation: string;
}

interface PincodeServiceabilityRequest {
  pincode: string;
  weight?: number;
  cod?: boolean;
}

interface PincodeServiceabilityResponse {
  pincode: string;
  serviceable: boolean;
  deliveryTime?: string;
  charges?: {
    cod: number;
    prepaid: number;
  };
  error?: string;
}

// Real Delhivery API response interfaces based on actual API response
interface DelhiveryCenter {
  code: string;
  e: string; // end date
  cn: string; // center name
  s: string; // start date
  u?: string; // user
  sort_code: string | null;
  ud: string; // update date
}

interface DelhiveryPostalCode {
  max_weight: number;
  city: string;
  cod: string; // "Y" or "N"
  inc: string; // inclusion details
  district: string;
  pin: number;
  max_amount: number;
  pre_paid: string; // "Y" or "N"
  cash: string; // "Y" or "N"
  state_code: string;
  remarks: string;
  pickup: string; // "Y" or "N"
  repl: string; // "Y" or "N" (replacement)
  covid_zone: string;
  country_code: string;
  is_oda: string; // "Y" or "N" (Out of Delivery Area)
  protect_blacklist: boolean;
  sort_code: string;
  sun_tat: boolean; // Sunday TAT (Turn Around Time)
  center: DelhiveryCenter[];
}

interface DelhiveryApiResponse {
  delivery_codes: Array<{
    postal_code: DelhiveryPostalCode;
  }>;
}

interface DelhiveryCreateOrderResponse {
  success: boolean;
  shipments?: Array<{
    order: string;
    waybill?: string;
    awb?: string;
  }>;
  error?: string;
  message?: string;
}

interface DelhiveryTrackOrderResponse {
  success: boolean;
  data?: Array<{
    waybill: string;
    status: string;
    location?: string;
    timestamp?: string;
    remarks?: string;
  }>;
  error?: string;
}

interface CreateOrderRequest {
  name: string;
  add: string;
  phone: string;
  pin: string;
  city: string;
  state: string;
  country: string;
  order: string;
  payment_mode: 'COD' | 'Prepaid' | 'Pickup' | 'REPL';
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

interface CreateOrderResponse {
  success: boolean;
  order_id?: string;
  waybill?: string;
  error?: string;
}

interface TrackOrderRequest {
  waybill: string;
}

interface TrackOrderResponse {
  success: boolean;
  data?: {
    waybill: string;
    status: string;
    location: string;
    timestamp: string;
    remarks?: string;
  };
  error?: string;
}

class DelhiveryAPI {
  private config: DelhiveryConfig;
  private client: typeof ky;

  constructor() {
    this.config = {
      apiKey: process.env.DELHIVERY_API_KEY || '',
      baseUrl: process.env.DELHIVERY_BASE_URL || 'https://staging-express.delhivery.com',
      pickupLocation: process.env.DELHIVERY_PICKUP_LOCATION || '',
    };

    // Initialize ky client with base configuration
    this.client = ky.create({
      prefixUrl: this.config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  /**
   * Check if a pincode is serviceable by Delhivery
   */
  async checkPincodeServiceability(
    request: PincodeServiceabilityRequest
  ): Promise<PincodeServiceabilityResponse> {
    try {
      const { pincode, weight = 0.5, cod = false } = request;

      // Validate pincode format (6 digits)
      if (!/^\d{6}$/.test(pincode)) {
        return {
          pincode,
          serviceable: false,
          error: 'Invalid pincode format. Please enter a 6-digit pincode.',
        };
      }

      // Use ky client for pincode check
      const data: DelhiveryApiResponse = await this.client.get('c/api/pin-codes/json/', {
        searchParams: {
          token: this.config.apiKey,
          filter_codes: pincode,
        },
      }).json();

      // Check if pincode is serviceable
      const isServiceable = data.delivery_codes && data.delivery_codes.length > 0;

      if (!isServiceable) {
        return {
          pincode,
          serviceable: false,
          error: 'Sorry, we do not deliver to this pincode.',
        };
      }

      // Get the first delivery code (most relevant)
      const deliveryCode = data.delivery_codes[0];
      const postalCode = deliveryCode.postal_code;

      // Check if COD is available
      const codAvailable = postalCode.cod === 'Y';
      const prepaidAvailable = postalCode.pre_paid === 'Y';

      // Check if pickup is available (for future use)
      // const pickupAvailable = postalCode.pickup === 'Y';

      // Check if it's an out-of-delivery area (for future use)
      // const isODA = postalCode.is_oda === 'Y';

      // Check for any restrictions (for future use)
      // const hasRestrictions = postalCode.remarks && postalCode.remarks !== '';

      // Determine if serviceable based on payment mode
      let serviceable = false;
      if (cod && codAvailable) {
        serviceable = true;
      } else if (!cod && prepaidAvailable) {
        serviceable = true;
      }

      // Check weight restrictions
      if (postalCode.max_weight > 0 && weight > postalCode.max_weight) {
        return {
          pincode,
          serviceable: false,
          error: `Weight limit exceeded. Maximum allowed weight: ${postalCode.max_weight}kg`,
        };
      }

      // Check amount restrictions for COD
      if (cod && postalCode.max_amount > 0) {
        const codAmount = this.calculateCharges(weight, true).cod;
        if (codAmount > postalCode.max_amount) {
          return {
            pincode,
            serviceable: false,
            error: `COD amount limit exceeded. Maximum allowed: ₹${postalCode.max_amount}`,
          };
        }
      }

      if (!serviceable) {
        let errorMessage = 'Sorry, we do not deliver to this pincode.';
        if (cod && !codAvailable) {
          errorMessage = 'COD not available for this pincode. Please try prepaid payment.';
        } else if (!cod && !prepaidAvailable) {
          errorMessage = 'Prepaid delivery not available for this pincode. Please try COD.';
        }
        
        return {
          pincode,
          serviceable: false,
          error: errorMessage,
        };
      }

      // Calculate delivery time based on actual data
      const deliveryTime = this.calculateDeliveryTimeFromData(postalCode);
      const charges = this.calculateCharges(weight, cod);

      return {
        pincode,
        serviceable: true,
        deliveryTime,
        charges,
      };
    } catch (error) {
      console.error('Delhivery pincode check error:', error);
      return {
        pincode: request.pincode,
        serviceable: false,
        error: 'Unable to verify pincode serviceability. Please try again.',
      };
    }
  }

  /**
   * Create a new order with Delhivery
   * Based on official Delhivery API documentation
   */
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      // Prepare the shipment data according to Delhivery API specification
      const shipmentData = {
        name: request.name,
        add: request.add,
        pin: request.pin,
        city: request.city,
        state: request.state,
        country: request.country,
        phone: request.phone,
        order: request.order,
        payment_mode: request.payment_mode,
        return_pin: request.return_pin || '',
        return_city: request.return_city || '',
        return_phone: request.return_phone || '',
        return_add: request.return_address || '',
        return_state: request.return_state || '',
        return_country: request.return_country || '',
        products_desc: request.products_desc || '',
        hsn_code: request.hsn_code || '',
        cod_amount: request.cod_amount || '',
        order_date: null,
        total_amount: request.total_amount || '',
        seller_add: request.seller_add || '',
        seller_name: request.seller_name || '',
        seller_inv: request.seller_inv || '',
        quantity: request.quantity || '',
        waybill: request.waybill || '',
        shipment_width: request.shipment_width || '100',
        shipment_height: request.shipment_height || '100',
        weight: request.weight || '',
        shipping_mode: request.shipping_mode || 'Surface',
        address_type: request.address_type || '',
        fragile_shipment: request.fragile_shipment || false,
        dangerous_good: request.dangerous_good || false,
        plastic_packaging: request.plastic_packaging || false,
      };

      // Prepare the request body in the format expected by Delhivery API
      const requestBody = {
        format: 'json',
        data: JSON.stringify({
          shipments: [shipmentData],
          pickup_location: {
            name: this.config.pickupLocation
          }
        })
      };

      // Use ky client for order creation
      const data: DelhiveryCreateOrderResponse = await this.client.post('api/cmu/create.json', {
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(requestBody as Record<string, string>),
      }).json();

      if (data.success) {
        // Extract waybill and order info from the response
        const shipment = data.shipments && data.shipments[0];
        return {
          success: true,
          order_id: shipment?.order || request.order,
          waybill: shipment?.waybill || shipment?.awb,
        };
      } else {
        return {
          success: false,
          error: data.error || data.message || 'Failed to create order',
        };
      }
    } catch (error) {
      console.error('Delhivery create order error:', error);
      return {
        success: false,
        error: 'Failed to create order. Please try again.',
      };
    }
  }

  /**
   * Track an order using waybill number
   */
  async trackOrder(request: TrackOrderRequest): Promise<TrackOrderResponse> {
    try {
      const { waybill } = request;

      // Use ky client for order tracking
      const data: DelhiveryTrackOrderResponse = await this.client.get('api/v1/packages/json/', {
        searchParams: {
          token: this.config.apiKey,
          waybill: waybill,
        },
      }).json();

      if (data.success && data.data && data.data.length > 0) {
        const orderData = data.data[0];
        return {
          success: true,
          data: {
            waybill: orderData.waybill,
            status: orderData.status,
            location: orderData.location || 'In Transit',
            timestamp: orderData.timestamp || new Date().toISOString(),
            remarks: orderData.remarks,
          },
        };
      } else {
        return {
          success: false,
          error: 'Order not found or tracking information unavailable',
        };
      }
    } catch (error) {
      console.error('Delhivery track order error:', error);
      return {
        success: false,
        error: 'Unable to track order. Please try again later.',
      };
    }
  }

  /**
   * Calculate estimated delivery time based on pincode
   */
  private calculateDeliveryTime(pincode: string): string {
    // Mock calculation - in production, use actual Delhivery data
    const firstDigit = parseInt(pincode[0]);
    
    if (firstDigit >= 1 && firstDigit <= 3) {
      return '1-2 business days'; // Metro cities
    } else if (firstDigit >= 4 && firstDigit <= 6) {
      return '2-3 business days'; // Tier 2 cities
    } else {
      return '3-5 business days'; // Other areas
    }
  }

  /**
   * Calculate delivery time based on actual Delhivery data
   */
  private calculateDeliveryTimeFromData(postalCode: DelhiveryPostalCode): string {
    // Check if it's an out-of-delivery area
    if (postalCode.is_oda === 'Y') {
      return '5-7 business days (Remote area)';
    }

    // Check for special remarks that might affect delivery time
    if (postalCode.remarks) {
      const remarks = postalCode.remarks.toLowerCase();
      if (remarks.includes('embargo')) {
        return 'Delivery suspended (Embargo area)';
      }
      if (remarks.includes('restricted')) {
        return '4-6 business days (Restricted area)';
      }
    }

    // Check COVID zone restrictions
    if (postalCode.covid_zone === 'R') {
      return '3-5 business days (Red zone)';
    } else if (postalCode.covid_zone === 'O') {
      return '2-4 business days (Orange zone)';
    }

    // Check if Sunday delivery is available
    const sundayDelivery = postalCode.sun_tat;
    
    // Base delivery time on state code and city
    const stateCode = postalCode.state_code;
    const city = postalCode.city.toLowerCase();
    
    // Metro cities and major states
    if (['DL', 'MH', 'KA', 'TN', 'GJ'].includes(stateCode) || 
        city.includes('delhi') || city.includes('mumbai') || 
        city.includes('bangalore') || city.includes('chennai')) {
      return sundayDelivery ? '1-2 business days' : '2-3 business days';
    }
    
    // Tier 2 cities
    if (['RJ', 'UP', 'MP', 'WB', 'AP', 'TS'].includes(stateCode)) {
      return sundayDelivery ? '2-3 business days' : '3-4 business days';
    }
    
    // Other areas
    return sundayDelivery ? '3-4 business days' : '4-5 business days';
  }

  /**
   * Calculate shipping charges based on weight and payment mode
   */
  private calculateCharges(weight: number, cod: boolean): { cod: number; prepaid: number } {
    // Mock calculation - in production, use actual Delhivery rates
    let baseCharge = 0;
    
    if (weight <= 0.5) {
      baseCharge = 50;
    } else if (weight <= 1) {
      baseCharge = 80;
    } else if (weight <= 2) {
      baseCharge = 120;
    } else {
      baseCharge = 120 + (weight - 2) * 20; // Additional charges for heavier items
    }

    return {
      cod: cod ? baseCharge + 20 : baseCharge, // Additional COD charges
      prepaid: baseCharge,
    };
  }
}

// Export singleton instance
export const delhiveryAPI = new DelhiveryAPI();

// Export types for use in other files
export type {
  PincodeServiceabilityRequest,
  PincodeServiceabilityResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  TrackOrderRequest,
  TrackOrderResponse,
  DelhiveryApiResponse,
  DelhiveryPostalCode,
  DelhiveryCenter,
  DelhiveryCreateOrderResponse,
  DelhiveryTrackOrderResponse,
};
