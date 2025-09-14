"use client";

import { useEffect } from "react";

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== "production") return;

    // Web Vitals monitoring
    const reportWebVitals = (metric: {
      name: string;
      id: string;
      value: number;
    }) => {
      // Send to analytics service
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", metric.name, {
          event_category: "Web Vitals",
          event_label: metric.id,
          value: Math.round(
            metric.name === "CLS" ? metric.value * 1000 : metric.value
          ),
          non_interaction: true,
        });
      }
    };

    // Import and use web-vitals library
    import("web-vitals")
      .then(({ onCLS, onFCP, onLCP, onTTFB }) => {
        onCLS(reportWebVitals);
        onFCP(reportWebVitals);
        onLCP(reportWebVitals);
        onTTFB(reportWebVitals);
      })
      .catch((error) => {
        console.warn("Failed to load web-vitals:", error);
      });

    // Performance observer for custom metrics
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Log performance entries for debugging
          console.log("Performance entry:", entry);
        }
      });

      observer.observe({ entryTypes: ["measure", "navigation", "resource"] });
    }

    // Memory usage monitoring (if available)
    if ("memory" in performance) {
      const logMemoryUsage = () => {
        const memory = (
          performance as {
            memory?: {
              usedJSHeapSize: number;
              totalJSHeapSize: number;
              jsHeapSizeLimit: number;
            };
          }
        ).memory;
        if (memory) {
          console.log("Memory usage:", {
            used: Math.round(memory.usedJSHeapSize / 1048576) + " MB",
            total: Math.round(memory.totalJSHeapSize / 1048576) + " MB",
            limit: Math.round(memory.jsHeapSizeLimit / 1048576) + " MB",
          });
        }
      };

      // Log memory usage every 30 seconds
      const memoryInterval = setInterval(logMemoryUsage, 30000);

      return () => clearInterval(memoryInterval);
    }
  }, []);

  return null;
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
