"use client";

import { useEffect } from "react";

/**
 * Fades page sections up as they scroll into view.
 * Styles live in globals.css under "Motion system" ([data-reveal]).
 * State is kept in a data attribute, not a class, so React re-renders can't wipe it.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "in";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );

    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll<HTMLElement>("main section, main [data-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Only the outermost section animates
        if (el.parentElement?.closest("[data-reveal]")) return;
        // Already on screen: show as-is so nothing flickers on load
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.dataset.reveal = "in";
        } else {
          el.dataset.reveal = "";
          io.observe(el);
        }
      });
    };

    scan();
    document.documentElement.classList.add("reveal-on");
    // Pages and client-fetched sections mount later
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
