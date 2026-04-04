"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { fetchActiveBanners, BannerRow } from "@/lib/banner-service";

interface PromoBannerProps {
  onHeightChange?: (height: number) => void;
  onDismiss?: () => void;
}

export default function PromoBanner({ onHeightChange, onDismiss }: PromoBannerProps) {
  const [visible, setVisible] = useState(true);
  const [banner, setBanner] = useState<BannerRow | null>(null);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchActiveBanners("top").then((banners) => {
      if (banners.length > 0) {
        setBanner(banners[0]);
      }
      setLoaded(true);
    });
  }, []);

  const reportHeight = useCallback(() => {
    if (ref.current && visible) {
      onHeightChange?.(ref.current.offsetHeight);
    }
  }, [onHeightChange, visible]);

  useEffect(() => {
    reportHeight();
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => reportHeight());
    observer.observe(el);
    return () => observer.disconnect();
  }, [reportHeight, banner]);

  const handleDismiss = () => {
    setVisible(false);
    onHeightChange?.(0);
    onDismiss?.();
  };

  // Only show banners set by admin — no fallback
  if (loaded && !banner) {
    onHeightChange?.(0);
    return null;
  }
  if (!banner) return null; // Still loading

  const displayText = banner.text;
  const bgColor = banner.background_color;
  const textColor = banner.text_color;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          initial={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full relative z-40 overflow-hidden"
          style={{ background: bgColor }}
        >
          <div className="flex items-center justify-center px-10 py-2.5">
            {banner?.link_url ? (
              <Link href={banner.link_url} className="contents">
                <p
                  className="font-sans font-medium text-center uppercase"
                  style={{ fontSize: "10px", letterSpacing: "0.2em", color: textColor }}
                >
                  {displayText}
                  {banner.link_label && (
                    <span className="ml-2 underline underline-offset-2">{banner.link_label}</span>
                  )}
                </p>
              </Link>
            ) : (
              <p
                className="font-sans font-medium text-center uppercase"
                style={{ fontSize: "10px", letterSpacing: "0.2em", color: textColor }}
              >
                {displayText}
              </p>
            )}
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-opacity hover:opacity-70"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" style={{ color: textColor }} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
