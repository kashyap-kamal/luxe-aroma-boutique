"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import BundleCard from "@/components/bundle-card";
import { fetchBundles, Bundle } from "@/lib/bundle-service";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";

export default function BundlesPage(): React.ReactElement {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchBundles()
      .then(setBundles)
      .catch(() => setBundles([]))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <main style={{ background: CREAM, color: INK, minHeight: "100vh" }}>
      {/* Desktop header */}
      <div
        className="hidden md:flex justify-between items-end"
        style={{ padding: "56px 48px 32px", borderBottom: `1px solid ${INK}` }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            CURATED SETS {loaded ? `· ${bundles.length}` : ""}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 300,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
            }}
          >
            Discovery sets &amp; <em style={{ fontWeight: 300 }}>combos.</em>
          </h1>
        </div>
        <Link
          href="/products"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "underline",
            color: INK,
          }}
        >
          ALL FRAGRANCES →
        </Link>
      </div>

      {/* Mobile header */}
      <div
        className="block md:hidden"
        style={{ padding: "28px 20px 20px", borderBottom: `1px solid ${INK}` }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          CURATED SETS {loaded ? `· ${bundles.length}` : ""}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "2rem",
            fontWeight: 300,
            lineHeight: 0.94,
            letterSpacing: "-0.03em",
          }}
        >
          Discovery sets &amp; <em>combos.</em>
        </h1>
      </div>

      {!loaded ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ borderLeft: `1px solid ${INK}` }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-5 md:p-6"
              style={{
                borderRight: `1px solid ${INK}`,
                borderBottom: `1px solid ${INK}`,
              }}
            >
              <div style={{ aspectRatio: "3/4", background: "#EDE9E0" }} />
              <div style={{ height: 10, background: "#EDE9E0", marginTop: 14, width: "60%" }} />
              <div style={{ height: 14, background: "#EDE9E0", marginTop: 8, width: "80%" }} />
            </div>
          ))}
        </div>
      ) : bundles.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ borderLeft: `1px solid ${INK}` }}
        >
          {bundles.map((bundle, i) => (
            <div
              key={bundle.id}
              style={{
                borderRight: `1px solid ${INK}`,
                borderBottom: `1px solid ${INK}`,
              }}
            >
              <BundleCard bundle={bundle} index={i} />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 md:px-12 py-20 text-center">
          <p
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 300,
              fontStyle: "italic",
              opacity: 0.45,
              marginBottom: 16,
            }}
          >
            New discovery sets arriving soon.
          </p>
          <Link
            href="/products"
            style={{
              display: "inline-block",
              background: INK,
              color: CREAM,
              padding: "14px 28px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            EXPLORE ALL FRAGRANCES →
          </Link>
        </div>
      )}
    </main>
  );
}
