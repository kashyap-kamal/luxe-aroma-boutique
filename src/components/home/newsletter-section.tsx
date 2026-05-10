"use client";

import { useState } from "react";
import { toast } from "sonner";
import { subscribeEmail } from "@/lib/newsletter-service";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    const { success, error } = await subscribeEmail(email);
    setLoading(false);
    if (success) {
      setSubscribed(true);
      setEmail("");
      toast.success("You're in! Your ₹50 credit is on its way.");
    } else {
      toast.error(error || "Something went wrong. Please try again.");
    }
  };

  return (
    <section
      style={{
        background: INK,
        color: CREAM,
      }}
    >
      {/* Desktop: 2-column */}
      <div
        className="hidden md:grid"
        style={{ gridTemplateColumns: "3fr 2fr" }}
      >
        {/* Left: subscription */}
        <div
          style={{
            padding: "72px 48px",
            borderRight: `1px solid ${SAFFRON}`,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: SAFFRON,
            }}
          >
            CLASSIFIEDS — JOIN THE INNER CIRCLE
          </div>
          <h2
            style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              fontWeight: 300,
              margin: "20px 0",
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            Letters from{" "}
            <em style={{ fontWeight: 300, color: SAFFRON }}>
              the perfumer.
            </em>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 15,
              lineHeight: 1.6,
              opacity: 0.7,
              maxWidth: 500,
            }}
          >
            New arrivals, dispatches from Grasse, the occasional unhinged
            opinion on synthetic musks. Weekly. Worth the inbox.
          </p>

          {subscribed ? (
            <div
              style={{
                marginTop: 40,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 13,
                letterSpacing: "0.15em",
                color: SAFFRON,
                textTransform: "uppercase",
              }}
            >
              ★ WELCOME ABOARD — CHECK YOUR INBOX
            </div>
          ) : (
            <form onSubmit={handleSubscribe}>
              <div
                style={{
                  display: "flex",
                  marginTop: 40,
                  maxWidth: 600,
                  border: `1px solid ${SAFFRON}`,
                }}
              >
                <input
                  type="email"
                  placeholder="your.address@inbox.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    color: CREAM,
                    padding: "18px 22px",
                    fontSize: 15,
                    outline: "none",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: SAFFRON,
                    color: INK,
                    border: "none",
                    padding: "0 36px",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  SUBSCRIBE →
                </button>
              </div>
            </form>
          )}

          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              opacity: 0.45,
              marginTop: 16,
              textTransform: "uppercase",
            }}
          >
            ★ ₹50 STORE CREDIT ON FIRST ORDER · UNSUBSCRIBE ANY TIME
          </div>
        </div>

        {/* Right: testimonial quote */}
        <div
          style={{
            padding: "72px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: SAFFRON,
              }}
            >
              LETTERS / PG. 16
            </div>
            <p
              style={{
                fontSize: 22,
                lineHeight: 1.4,
                fontStyle: "italic",
                fontWeight: 300,
                marginTop: 20,
                fontFamily: "var(--font-fraunces), serif",
              }}
            >
              &ldquo;Absolutely love the quality. The dry-down on Ameer Al Oud
              lasts past midnight — and so does the compliment count.&rdquo;
            </p>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.15em",
                marginTop: 20,
                opacity: 0.55,
              }}
            >
              — PRIYA S., BOMBAY · AVENTUS
            </div>
          </div>
          <div
            style={{
              marginTop: 48,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.15em",
              opacity: 0.3,
              lineHeight: 1.8,
            }}
          >
            COLOPHON · SET IN FRAUNCES &amp; JETBRAINS MONO
            <br />
            PRINTED ON RECYCLED PIXELS
            <br />
            © MMXXVI AROMÉ LUXE · ALL RIGHTS RESERVED
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col md:hidden" style={{ padding: "40px 20px" }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: SAFFRON,
            marginBottom: 12,
          }}
        >
          JOIN THE INNER CIRCLE
        </div>
        <h2
          style={{
            fontSize: "2.5rem",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            fontWeight: 300,
            marginBottom: 16,
            fontFamily: "var(--font-fraunces), serif",
          }}
        >
          Letters from{" "}
          <em style={{ color: SAFFRON }}>the perfumer.</em>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 14,
            lineHeight: 1.6,
            opacity: 0.7,
            marginBottom: 24,
          }}
        >
          New arrivals, dispatches from Grasse, opinions on synthetic musks.
          Weekly. Worth the inbox.
        </p>

        {subscribed ? (
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.15em",
              color: SAFFRON,
              textTransform: "uppercase",
            }}
          >
            ★ WELCOME — CHECK YOUR INBOX
          </div>
        ) : (
          <form onSubmit={handleSubscribe}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                border: `1px solid ${SAFFRON}`,
              }}
            >
              <input
                type="email"
                placeholder="your.address@inbox.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${SAFFRON}`,
                  color: CREAM,
                  padding: "16px 18px",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: SAFFRON,
                  color: INK,
                  border: "none",
                  padding: "16px 18px",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                SUBSCRIBE →
              </button>
            </div>
          </form>
        )}

        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            opacity: 0.4,
            marginTop: 16,
            textTransform: "uppercase",
          }}
        >
          ★ ₹50 STORE CREDIT ON FIRST ORDER · UNSUBSCRIBE ANY TIME
        </div>
      </div>
    </section>
  );
}
