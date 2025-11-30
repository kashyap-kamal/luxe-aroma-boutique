"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface OrderTrackerProps {
  onTrackResult?: (result: TrackingResult) => void;
  initialWaybill?: string;
}

interface TrackingResult {
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

const OrderTracker: React.FC<OrderTrackerProps> = ({ onTrackResult, initialWaybill }) => {
  const [waybill, setWaybill] = useState(initialWaybill || "");
  const [loading, setLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(
    null
  );

  const trackOrder = async () => {
    if (!waybill.trim()) {
      toast.error("Please enter a waybill number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ waybill }),
      });

      const result = await response.json();
      setTrackingResult(result);

      if (result.success) {
        toast.success("Order tracking information retrieved");
        onTrackResult?.(result);
      } else {
        toast.error(result.error || "Unable to track order");
      }
    } catch (error) {
      console.error("Order tracking error:", error);
      toast.error("Unable to track order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes("delivered")) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (
      statusLower.includes("out for delivery") ||
      statusLower.includes("in transit")
    ) {
      return <Truck className="h-5 w-5 text-blue-500" />;
    } else if (
      statusLower.includes("dispatched") ||
      statusLower.includes("shipped")
    ) {
      return <Package className="h-5 w-5 text-orange-500" />;
    } else {
      return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes("delivered")) {
      return "text-green-600 bg-green-50 border-green-200";
    } else if (
      statusLower.includes("out for delivery") ||
      statusLower.includes("in transit")
    ) {
      return "text-blue-600 bg-blue-50 border-blue-200";
    } else if (
      statusLower.includes("dispatched") ||
      statusLower.includes("shipped")
    ) {
      return "text-orange-600 bg-orange-50 border-orange-200";
    } else {
      return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter waybill number"
          value={waybill}
          onChange={(e) => setWaybill(e.target.value)}
          disabled={loading}
          className="flex-1"
        />
        <Button
          onClick={trackOrder}
          disabled={loading || !waybill.trim()}
          className="px-6"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
        </Button>
      </div>

      {trackingResult && (
        <div className="p-4 rounded-lg border">
          {trackingResult.success && trackingResult.data ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Order Tracking</h3>
                <span className="text-sm text-gray-500">
                  Waybill: {trackingResult.data.waybill}
                </span>
              </div>

              <div
                className={`p-3 rounded-lg border ${getStatusColor(
                  trackingResult.data.status
                )}`}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(trackingResult.data.status)}
                  <span className="font-medium">
                    {trackingResult.data.status}
                  </span>
                </div>
                {trackingResult.data.location && (
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    <span>{trackingResult.data.location}</span>
                  </div>
                )}
                {trackingResult.data.timestamp && (
                  <div className="text-xs mt-1 opacity-75">
                    {new Date(trackingResult.data.timestamp).toLocaleString()}
                  </div>
                )}
              </div>

              {trackingResult.data.remarks && (
                <div className="text-sm text-gray-600">
                  <strong>Remarks:</strong> {trackingResult.data.remarks}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-red-600">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>{trackingResult.error || "Order not found"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
