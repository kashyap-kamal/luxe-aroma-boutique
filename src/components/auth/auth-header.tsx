"use client";

import Link from "next/link";

const INK = "#0E0E0C";
const SAFFRON = "#E8763A";

export function AuthHeader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 14,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: INK,
          textDecoration: "none",
        }}
      >
        AROMÉ LUXE · HOUSE ACCOUNT
      </Link>
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: SAFFRON,
        }}
      >
        PRIVATE ATELIER
      </span>
    </div>
  );
}
