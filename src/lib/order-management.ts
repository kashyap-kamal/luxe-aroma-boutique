// Order Management System
// Handles order creation, tracking, and status updates

import { billingCalculator, BillingItem } from './billing';

export interface Order {
  id: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: BillingItem[];
  billing: {
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
    currency: string;
  };
  payment: {
    method: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    cashfreeOrderId?: string;
    cashfreePaymentId?: string;
    amount: number;
    currency: string;
  };
  shipping: {
    status: 'pending' | 'confirmed' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
    delhiveryOrderId?: string;
    waybill?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OrderCreateRequest {
  customerInfo: Order['customerInfo'];
  items: BillingItem[];
  paymentMethod: string;
  cashfreeOrderId?: string;
  notes?: string;
}

export interface OrderUpdateRequest {
  status?: Order['status'];
  paymentStatus?: Order['payment']['status'];
  shippingStatus?: Order['shipping']['status'];
  cashfreePaymentId?: string;
  delhiveryOrderId?: string;
  waybill?: string;
  trackingUrl?: string;
  notes?: string;
}

class OrderManager {
  private orders: Map<string, Order> = new Map();

  /**
   * Create a new order
   */
  createOrder(request: OrderCreateRequest): Order {
    const orderId = this.generateOrderId();
    const now = new Date().toISOString();
    
    // Calculate billing
    const billing = billingCalculator.calculateBilling(request.items);
    
    const order: Order = {
      id: orderId,
      customerInfo: request.customerInfo,
      items: request.items,
      billing,
      payment: {
        method: request.paymentMethod,
        status: 'pending',
        cashfreeOrderId: request.cashfreeOrderId,
        amount: billing.total,
        currency: billing.currency,
      },
      shipping: {
        status: 'pending',
      },
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      notes: request.notes,
    };

    this.orders.set(orderId, order);
    return order;
  }

  /**
   * Update order
   */
  updateOrder(orderId: string, updates: OrderUpdateRequest): Order | null {
    const order = this.orders.get(orderId);
    if (!order) {
      return null;
    }

    const updatedOrder: Order = {
      ...order,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Update nested objects
    if (updates.paymentStatus) {
      updatedOrder.payment.status = updates.paymentStatus;
    }
    
    if (updates.shippingStatus) {
      updatedOrder.shipping.status = updates.shippingStatus;
    }
    
    if (updates.cashfreePaymentId) {
      updatedOrder.payment.cashfreePaymentId = updates.cashfreePaymentId;
    }
    
    if (updates.delhiveryOrderId) {
      updatedOrder.shipping.delhiveryOrderId = updates.delhiveryOrderId;
    }
    
    if (updates.waybill) {
      updatedOrder.shipping.waybill = updates.waybill;
    }
    
    if (updates.trackingUrl) {
      updatedOrder.shipping.trackingUrl = updates.trackingUrl;
    }

    this.orders.set(orderId, updatedOrder);
    return updatedOrder;
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Order | null {
    return this.orders.get(orderId) || null;
  }

  /**
   * Get orders by customer email
   */
  getOrdersByCustomer(email: string): Order[] {
    return Array.from(this.orders.values())
      .filter(order => order.customerInfo.email === email)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get all orders (for admin)
   */
  getAllOrders(): Order[] {
    return Array.from(this.orders.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: string, reason?: string): Order | null {
    const order = this.orders.get(orderId);
    if (!order) {
      return null;
    }

    // Only allow cancellation if order is not shipped
    if (order.shipping.status === 'in_transit' || order.shipping.status === 'delivered') {
      throw new Error('Cannot cancel order that is already shipped or delivered');
    }

    return this.updateOrder(orderId, {
      status: 'cancelled',
      notes: reason ? `Cancelled: ${reason}` : 'Order cancelled',
    });
  }

  /**
   * Process refund
   */
  processRefund(orderId: string, amount?: number): Order | null {
    const order = this.orders.get(orderId);
    if (!order) {
      return null;
    }

    const refundAmount = amount || order.billing.total;
    
    return this.updateOrder(orderId, {
      status: 'refunded',
      paymentStatus: 'refunded',
      notes: `Refund processed for ₹${refundAmount}`,
    });
  }

  /**
   * Update shipping status
   */
  updateShippingStatus(
    orderId: string, 
    status: Order['shipping']['status'],
    waybill?: string,
    trackingUrl?: string
  ): Order | null {
    return this.updateOrder(orderId, {
      shippingStatus: status,
      waybill,
      trackingUrl,
    });
  }

  /**
   * Generate unique order ID
   */
  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Get order statistics
   */
  getOrderStats(): {
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  } {
    const orders = Array.from(this.orders.values());
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.billing.total, 0),
    };
  }
}

// Export singleton instance
export const orderManager = new OrderManager();

// Types are already exported as interfaces above
