// Billing and Tax Calculation Utilities
// Handles all pricing, tax, and billing logic for the e-commerce platform

export interface BillingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  hsnCode?: string;
}

export interface BillingBreakdown {
  subtotal: number;
  discount: number;
  discountPercentage: number;
  tax: number;
  taxPercentage: number;
  shipping: number;
  total: number;
  currency: string;
}

export interface BillingConfig {
  taxRate: number; // GST rate (18% for perfumes)
  shippingRate: number; // Free shipping threshold
  freeShippingThreshold: number;
  currency: string;
  hsnCode: string; // HSN code for perfumes
}

// Default billing configuration
const DEFAULT_CONFIG: BillingConfig = {
  taxRate: 18, // 18% GST for perfumes
  shippingRate: 50, // ₹50 shipping charge
  freeShippingThreshold: 500, // Free shipping above ₹500
  currency: '₹',
  hsnCode: '3303', // HSN code for perfumes and toilet waters
};

export class BillingCalculator {
  private config: BillingConfig;

  constructor(config: Partial<BillingConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Calculate billing breakdown for cart items
   */
  calculateBilling(items: BillingItem[]): BillingBreakdown {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Calculate discount (if any)
    const discount = this.calculateDiscount(subtotal);
    const discountPercentage = subtotal > 0 ? (discount / subtotal) * 100 : 0;

    // Calculate taxable amount (after discount)
    const taxableAmount = subtotal - discount;

    // Calculate tax
    const tax = this.calculateTax(taxableAmount);
    const taxPercentage = this.config.taxRate;

    // Calculate shipping
    const shipping = this.calculateShipping(taxableAmount);

    // Calculate total
    const total = taxableAmount + tax + shipping;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      discountPercentage: Math.round(discountPercentage * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      taxPercentage,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100,
      currency: this.config.currency,
    };
  }

  /**
   * Calculate discount based on business rules
   */
  private calculateDiscount(subtotal: number): number {
    // Example discount rules:
    // - 5% discount for orders above ₹1000
    // - 10% discount for orders above ₹2000
    // - 15% discount for orders above ₹3000

    if (subtotal >= 3000) {
      return subtotal * 0.15; // 15% discount
    } else if (subtotal >= 2000) {
      return subtotal * 0.10; // 10% discount
    } else if (subtotal >= 1000) {
      return subtotal * 0.05; // 5% discount
    }

    return 0;
  }

  /**
   * Calculate tax (GST) on taxable amount
   */
  private calculateTax(taxableAmount: number): number {
    return (taxableAmount * this.config.taxRate) / 100;
  }

  /**
   * Calculate shipping charges
   */
  private calculateShipping(taxableAmount: number): number {
    if (taxableAmount >= this.config.freeShippingThreshold) {
      return 0; // Free shipping
    }
    return this.config.shippingRate;
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount: number): string {
    return `${this.config.currency}${amount.toFixed(2)}`;
  }

  /**
   * Get HSN code for billing
   */
  getHSNCode(): string {
    return this.config.hsnCode;
  }

  /**
   * Calculate item-level tax breakdown
   */
  calculateItemTax(item: BillingItem): {
    taxableAmount: number;
    tax: number;
    total: number;
  } {
    const taxableAmount = item.price * item.quantity;
    const tax = (taxableAmount * this.config.taxRate) / 100;
    const total = taxableAmount + tax;

    return {
      taxableAmount: Math.round(taxableAmount * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  /**
   * Generate invoice line items for Delhivery
   */
  generateInvoiceItems(items: BillingItem[]): Array<{
    name: string;
    quantity: number;
    price: number;
    hsn_code: string;
    tax_rate: number;
  }> {
    return items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      hsn_code: item.hsnCode || this.config.hsnCode,
      tax_rate: this.config.taxRate,
    }));
  }

  /**
   * Validate billing data
   */
  validateBilling(items: BillingItem[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!items || items.length === 0) {
      errors.push('No items in cart');
    }

    items.forEach((item, index) => {
      if (!item.id) {
        errors.push(`Item ${index + 1}: Missing ID`);
      }
      if (!item.name) {
        errors.push(`Item ${index + 1}: Missing name`);
      }
      if (item.price <= 0) {
        errors.push(`Item ${index + 1}: Invalid price`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Invalid quantity`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const billingCalculator = new BillingCalculator();

// Export utility functions
export const formatCurrency = (amount: number, currency: string = '₹'): string => {
  return `${currency}${amount.toFixed(2)}`;
};

export const calculateDiscount = (subtotal: number): number => {
  if (subtotal >= 3000) return subtotal * 0.15;
  if (subtotal >= 2000) return subtotal * 0.10;
  if (subtotal >= 1000) return subtotal * 0.05;
  return 0;
};

export const calculateTax = (amount: number, rate: number = 18): number => {
  return (amount * rate) / 100;
};

export const calculateShipping = (amount: number, threshold: number = 500, rate: number = 50): number => {
  return amount >= threshold ? 0 : rate;
};
