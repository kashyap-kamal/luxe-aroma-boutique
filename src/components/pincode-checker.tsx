"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, XCircle, Truck } from "lucide-react";
import { toast } from "sonner";

interface PincodeCheckerProps {
  onServiceabilityChange: (
    isServiceable: boolean,
    deliveryInfo?: {
      pincode: string;
      serviceable: boolean;
      deliveryTime?: string;
      charges?: {
        cod: number;
        prepaid: number;
      };
      error?: string;
    }
  ) => void;
  disabled?: boolean;
}

interface DeliveryInfo {
  pincode: string;
  serviceable: boolean;
  deliveryTime?: string;
  charges?: {
    cod: number;
    prepaid: number;
  };
  error?: string;
}

const PincodeChecker: React.FC<PincodeCheckerProps> = ({
  onServiceabilityChange,
  disabled = false,
}) => {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);

  const checkPincode = async () => {
    if (!pincode || pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/check-pincode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pincode,
          weight: 0.5, // Default weight for perfume
          cod: true, // Check both COD and prepaid
        }),
      });

      const result = await response.json();
      setDeliveryInfo(result);

      if (result.serviceable) {
        toast.success(`Great! We deliver to ${pincode}`);
        onServiceabilityChange(true, result);
      } else {
        toast.error(result.error || "Sorry, we do not deliver to this pincode");
        onServiceabilityChange(false);
      }
    } catch (error) {
      console.error("Pincode check error:", error);
      toast.error("Unable to check pincode. Please try again.");
      onServiceabilityChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePincodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setPincode(numericValue);

    // Clear previous results when pincode changes
    if (deliveryInfo) {
      setDeliveryInfo(null);
      onServiceabilityChange(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter 6-digit pincode"
          value={pincode}
          onChange={(e) => handlePincodeChange(e.target.value)}
          maxLength={6}
          disabled={disabled || loading}
          className="flex-1"
        />
        <Button
          onClick={checkPincode}
          disabled={disabled || loading || pincode.length !== 6}
          className="px-6"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </Button>
      </div>

      {deliveryInfo && (
        <div className="p-4 rounded-lg border">
          {deliveryInfo.serviceable ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  We deliver to {deliveryInfo.pincode}
                </span>
              </div>

              {deliveryInfo.deliveryTime && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Estimated delivery: {deliveryInfo.deliveryTime}</span>
                </div>
              )}

              {deliveryInfo.charges && (
                <div className="text-sm text-gray-600">
                  <p>Shipping charges:</p>
                  <ul className="ml-4 space-y-1">
                    <li>Prepaid: ₹{deliveryInfo.charges.prepaid}</li>
                    <li>COD: ₹{deliveryInfo.charges.cod}</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span>
                {deliveryInfo.error ||
                  "Sorry, we do not deliver to this pincode"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PincodeChecker;
