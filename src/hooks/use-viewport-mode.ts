"use client";

import { useEffect, useState } from "react";

export type ViewportMode = "ssr" | "desktop" | "mobile";

export function useViewportMode(mediaQuery: string = "(min-width: 768px)"): {
  viewport: ViewportMode;
  showDesktop: boolean;
  showMobile: boolean;
} {
  const [viewport, setViewport] = useState<ViewportMode>("ssr");

  useEffect(() => {
    const mq = window.matchMedia(mediaQuery);
    const sync = () => setViewport(mq.matches ? "desktop" : "mobile");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [mediaQuery]);

  return {
    viewport,
    showDesktop: viewport !== "mobile",
    showMobile: viewport !== "desktop",
  };
}
