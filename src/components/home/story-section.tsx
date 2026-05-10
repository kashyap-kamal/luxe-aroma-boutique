"use client";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

const pillars = [
  {
    num: "01",
    title: "Rooted in India",
    body: "We partner directly with India's finest fragrance houses — cutting out middlemen to bring you premium ingredients at honest prices.",
  },
  {
    num: "02",
    title: "Expert blending",
    body: "Each formula is refined over dozens of iterations. We don't ship until the dry-down is flawless on skin, not just paper.",
  },
  {
    num: "03",
    title: "Direct to you",
    body: "No middlemen, no inflated margins. You pay for the fragrance, not the boutique. That's the Aromé Luxe model.",
  },
];

export default function StorySection() {
  return (
    <section
      style={{
        borderBottom: `1px solid ${INK}`,
        background: CREAM,
        color: INK,
      }}
    >
      {/* Desktop */}
      <div className="hidden md:block" style={{ padding: "80px 48px" }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          FEATURE — 06 / THE LUXURY PARADOX
        </div>
        <h2
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            fontWeight: 300,
            margin: "20px 0 56px",
            maxWidth: "90%",
            fontFamily: "var(--font-fraunces), serif",
          }}
        >
          Why should luxury cost a{" "}
          <em style={{ fontWeight: 300 }}>fortune?</em>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            borderTop: `1px solid ${INK}`,
          }}
        >
          {pillars.map((pillar, i) => (
            <div
              key={pillar.num}
              style={{
                padding: "28px 28px 28px 0",
                paddingLeft: i > 0 ? 28 : 0,
                borderRight: i < 2 ? `1px solid ${INK}` : "none",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(4rem, 6vw, 6rem)",
                  fontWeight: 300,
                  lineHeight: 0.9,
                  color: SAFFRON,
                  letterSpacing: "-0.04em",
                  fontFamily: "var(--font-fraunces), serif",
                }}
              >
                {pillar.num}
              </div>
              <div
                style={{
                  fontSize: "clamp(1.2rem, 2vw, 2rem)",
                  fontWeight: 300,
                  marginTop: 14,
                  fontStyle: "italic",
                  fontFamily: "var(--font-fraunces), serif",
                }}
              >
                {pillar.title}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#3A3833",
                  marginTop: 14,
                  maxWidth: 340,
                }}
              >
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <div style={{ padding: "32px 20px 20px", borderBottom: `1px solid ${INK}` }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            THE LUXURY PARADOX
          </div>
          <h2
            style={{
              fontSize: "2.6rem",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            Why should luxury cost a{" "}
            <em style={{ fontWeight: 300 }}>fortune?</em>
          </h2>
        </div>

        {pillars.map((pillar, i) => (
          <div
            key={pillar.num}
            style={{
              padding: "24px 20px",
              borderBottom: i < 2 ? `1px solid ${INK}` : "none",
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                fontSize: "3.5rem",
                fontWeight: 300,
                lineHeight: 0.9,
                color: SAFFRON,
                letterSpacing: "-0.04em",
                fontFamily: "var(--font-fraunces), serif",
                flexShrink: 0,
                width: 60,
              }}
            >
              {pillar.num}
            </div>
            <div>
              <div
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontFamily: "var(--font-fraunces), serif",
                  marginBottom: 8,
                }}
              >
                {pillar.title}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#3A3833",
                  margin: 0,
                }}
              >
                {pillar.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
