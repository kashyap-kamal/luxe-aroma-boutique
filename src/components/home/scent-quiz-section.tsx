"use client";

import { useRouter } from "next/navigation";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

export default function ScentQuizSection() {
  const router = useRouter();

  return (
    <section
      style={{
        borderBottom: `1px solid ${INK}`,
        background: CREAM,
        color: INK,
      }}
    >
      {/* Desktop: 2-column */}
      <div
        className="hidden md:grid"
        style={{ gridTemplateColumns: "2fr 3fr" }}
      >
        {/* Left: big heading on saffron */}
        <div
          style={{
            padding: "72px 48px",
            borderRight: `1px solid ${INK}`,
            background: SAFFRON,
            color: INK,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            FEATURE — 05 / DIAGNOSTIC
          </div>
          <h2
            style={{
              fontSize: "clamp(3.5rem, 6vw, 6rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
              fontWeight: 300,
              margin: "20px 0 0",
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            Not{" "}
            <em style={{ fontWeight: 300 }}>sure</em>
            <br />
            where to
            <br />
            begin?
          </h2>
        </div>

        {/* Right: description + CTA */}
        <div
          style={{
            padding: "72px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 20,
              lineHeight: 1.5,
              fontWeight: 300,
              maxWidth: 600,
              color: "#3A3833",
            }}
          >
            A two-minute olfactory diagnostic. Eight questions about your
            evenings, your seasons, your skin. We return three scents
            calibrated to who you actually are — not who the algorithm thinks
            you should be.
          </p>
          <div
            style={{
              marginTop: 48,
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <button
              onClick={() => router.push("/quiz")}
              style={{
                background: INK,
                color: CREAM,
                border: "none",
                padding: "22px 44px",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              BEGIN DIAGNOSTIC →
            </button>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.15em",
                opacity: 0.5,
              }}
            >
              ~ 02:14 AVG TIME
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col md:hidden">
        <div
          style={{
            background: SAFFRON,
            padding: "40px 20px",
            borderBottom: `1px solid ${INK}`,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            DIAGNOSTIC
          </div>
          <h2
            style={{
              fontSize: "3rem",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            Not <em>sure</em>
            <br />
            where to begin?
          </h2>
        </div>
        <div style={{ padding: "32px 20px" }}>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 15,
              lineHeight: 1.6,
              color: "#3A3833",
              marginBottom: 24,
            }}
          >
            Two minutes. Eight questions. Three scents calibrated to who you
            actually are.
          </p>
          <button
            onClick={() => router.push("/quiz")}
            style={{
              background: INK,
              color: CREAM,
              border: "none",
              padding: "18px 32px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              width: "100%",
            }}
          >
            BEGIN DIAGNOSTIC →
          </button>
        </div>
      </div>
    </section>
  );
}
