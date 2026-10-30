export interface CouponRuleInput {
  readonly code: string;
  readonly discount_type: "percentage" | "fixed";
  readonly discount_value: number;
  readonly min_order_amount?: number | null;
  readonly max_discount_amount?: number | null;
  readonly usage_limit?: number | null;
  readonly usage_count?: number | null;
  readonly is_active: boolean;
  readonly starts_at?: string | null;
  readonly ends_at?: string | null;
}

export interface BundleConstituentInput {
  readonly name: string;
  readonly quantity: number;
  readonly inStock?: boolean;
}

export interface ProductCheckoutLine {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
  readonly inStock?: boolean;
}

export interface BundleCheckoutLine {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
  readonly active?: boolean;
  readonly constituents?: readonly BundleConstituentInput[];
}

export interface FreeShippingRule {
  readonly enabled: boolean;
  readonly threshold: number;
}

export interface ShippingRateRule {
  readonly amount: number;
}

export interface CouponDiscountResult {
  readonly valid: boolean;
  readonly discount: number;
  readonly error?: string;
}

export interface CheckoutTotalsResult {
  readonly subtotal: number;
  readonly discount: number;
  readonly discountedSubtotal: number;
  readonly shipping: number;
  readonly total: number;
  readonly couponValid: boolean;
  readonly couponError: string | null;
  readonly availabilityError: string | null;
}

export function roundCurrency(value: number): number;
export function formatBundleOrderLineName(
  bundleName: string,
  constituents?: readonly BundleConstituentInput[]
): string;
export function calculateCouponDiscount(
  subtotal: number,
  coupon: CouponRuleInput | null | undefined,
  now?: Date
): CouponDiscountResult;
export function calculateShippingCharge(
  discountedSubtotal: number,
  freeShipping?: FreeShippingRule,
  shippingRate?: ShippingRateRule,
  shiprocketPrepaid?: number
): number;
export function computeCheckoutTotals(input: {
  readonly productLines?: readonly ProductCheckoutLine[];
  readonly bundleLines?: readonly BundleCheckoutLine[];
  readonly coupon?: CouponRuleInput | null;
  readonly freeShipping?: FreeShippingRule;
  readonly shippingRate?: ShippingRateRule;
  readonly shiprocketPrepaid?: number;
  readonly now?: Date;
}): CheckoutTotalsResult;
