export function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function formatBundleOrderLineName(bundleName, constituents = []) {
  const cleanName = String(bundleName || "Bundle").trim();
  const parts = constituents
    .filter((c) => c && c.name)
    .map((c) => {
      const qty = Math.max(1, Math.floor(Number(c.quantity) || 1));
      return qty > 1 ? `${c.name.trim()} x${qty}` : c.name.trim();
    });
  return parts.length > 0 ? `${cleanName}: ${parts.join(" + ")}` : cleanName;
}

export function calculateCouponDiscount(subtotal, coupon, now = new Date()) {
  const safeSubtotal = roundCurrency(Math.max(0, Number(subtotal) || 0));
  if (!coupon) {
    return { valid: true, discount: 0 };
  }
  if (!coupon.is_active) {
    return { valid: false, discount: 0, error: "This coupon is no longer active" };
  }
  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    return { valid: false, discount: 0, error: "This coupon is not yet active" };
  }
  if (coupon.ends_at && new Date(coupon.ends_at) < now) {
    return { valid: false, discount: 0, error: "This coupon has expired" };
  }
  if (
    coupon.usage_limit !== null &&
    coupon.usage_limit !== undefined &&
    Number(coupon.usage_count || 0) >= Number(coupon.usage_limit)
  ) {
    return { valid: false, discount: 0, error: "This coupon has been fully redeemed" };
  }
  const minOrder = Number(coupon.min_order_amount || 0);
  if (minOrder > 0 && safeSubtotal < minOrder) {
    return {
      valid: false,
      discount: 0,
      error: `Minimum order of ₹${minOrder.toLocaleString("en-IN")} required`,
    };
  }

  let discount = 0;
  if (coupon.discount_type === "percentage") {
    discount = safeSubtotal * (Number(coupon.discount_value || 0) / 100);
    if (coupon.max_discount_amount !== null && coupon.max_discount_amount !== undefined && Number(coupon.max_discount_amount) > 0) {
      discount = Math.min(discount, Number(coupon.max_discount_amount));
    }
  } else {
    discount = Number(coupon.discount_value || 0);
  }

  discount = Math.min(safeSubtotal, Math.max(0, roundCurrency(discount)));
  return { valid: true, discount };
}

export function calculateShippingCharge(
  discountedSubtotal,
  freeShipping = { enabled: true, threshold: 0 },
  shippingRate = { amount: 49 },
  shiprocketPrepaid = 0
) {
  const safePostCoupon = roundCurrency(Math.max(0, Number(discountedSubtotal) || 0));
  const threshold = Number(freeShipping?.threshold || 0);

  if (freeShipping?.enabled && threshold <= 0) {
    return 0;
  }
  if (threshold > 0 && safePostCoupon >= threshold) {
    return 0;
  }
  const configuredRate = Number(shippingRate?.amount || 0);
  return roundCurrency(configuredRate > 0 ? configuredRate : Math.max(0, Number(shiprocketPrepaid) || 0));
}

export function computeCheckoutTotals({
  productLines = [],
  bundleLines = [],
  coupon = null,
  freeShipping = { enabled: true, threshold: 0 },
  shippingRate = { amount: 49 },
  shiprocketPrepaid = 0,
  now = new Date(),
}) {
  let availabilityError = null;
  let subtotal = 0;

  for (const line of productLines) {
    if (line.inStock === false) {
      availabilityError = `${line.name} is currently unavailable`;
      break;
    }
    const qty = Math.max(1, Math.floor(Number(line.quantity) || 1));
    subtotal += Number(line.price || 0) * qty;
  }

  if (!availabilityError) {
    for (const bundle of bundleLines) {
      if (bundle.active === false) {
        availabilityError = `${bundle.name} is currently unavailable`;
        break;
      }
      const outConstituent = (bundle.constituents || []).find((c) => c.inStock === false);
      if (outConstituent) {
        availabilityError = `${bundle.name} cannot be ordered because ${outConstituent.name} is out of stock`;
        break;
      }
      const qty = Math.max(1, Math.floor(Number(bundle.quantity) || 1));
      subtotal += Number(bundle.price || 0) * qty;
    }
  }

  subtotal = roundCurrency(subtotal);
  const couponResult = calculateCouponDiscount(subtotal, coupon, now);
  const discount = couponResult.valid ? couponResult.discount : 0;
  const discountedSubtotal = roundCurrency(Math.max(0, subtotal - discount));
  const shipping = calculateShippingCharge(
    discountedSubtotal,
    freeShipping,
    shippingRate,
    shiprocketPrepaid
  );
  const total = roundCurrency(discountedSubtotal + shipping);

  return {
    subtotal,
    discount,
    discountedSubtotal,
    shipping,
    total,
    couponValid: couponResult.valid,
    couponError: couponResult.error ?? null,
    availabilityError,
  };
}
