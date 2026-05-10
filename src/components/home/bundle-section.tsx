"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BundleCard from "@/components/bundle-card";
import { fetchFeaturedBundles, Bundle } from "@/lib/bundle-service";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";

export default function BundleSection() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchFeaturedBundles(4)
      .then(setBundles)
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && bundles.length === 0) return null;

  return (
    <section
      style={{
        borderBottom: `1px solid ${INK}`,
        background: CREAM,
        color: INK,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "56px 48px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: `1px solid ${INK}`,
        }}
        className="hidden md:flex"
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            FEATURE — 05 / DISCOVERY SETS
          </div>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              margin: "10px 0 0",
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            The discovery set,{" "}
            <em style={{ fontWeight: 300 }}>reconsidered.</em>
          </h2>
        </div>
        <Link
          href="/bundles"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "underline",
            color: INK,
          }}
        >
          VIEW ALL →
        </Link>
      </div>

      {/* Mobile header */}
      <div
        className="flex md:hidden"
        style={{
          padding: "28px 20px 16px",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: `1px solid ${INK}`,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            DISCOVERY SETS
          </div>
          <h2
            style={{
              fontSize: "1.8rem",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              fontWeight: 300,
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            The discovery set, <em>reconsidered.</em>
          </h2>
        </div>
      </div>

      {/* Bundle grid */}
      {!loaded ? (
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                borderRight: i < 3 ? `1px solid ${INK}` : "none",
                padding: 24,
              }}
            >
              <div
                style={{
                  aspectRatio: "3/4",
                  background: "#EDE9E0",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <div
                style={{
                  height: 12,
                  background: "#EDE9E0",
                  marginTop: 12,
                  width: "60%",
                }}
              />
              <div
                style={{
                  height: 16,
                  background: "#EDE9E0",
                  marginTop: 8,
                  width: "80%",
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${Math.min(bundles.length, 4)}, 1fr)`,
          }}
        >
          {bundles.map((bundle, i) => (
            <div
              key={bundle.id}
              style={{
                borderRight:
                  i < bundles.length - 1 ? `1px solid ${INK}` : "none",
              }}
            >
              <BundleCard bundle={bundle} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
