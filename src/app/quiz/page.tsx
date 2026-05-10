"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, RotateCcw, ShoppingBag } from "lucide-react";
import { Product, useCartStore } from "@/stores/cart-store";
import { fetchProducts } from "@/lib/product-service";
import { toast } from "sonner";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";
const DARK = "#1A0908";

interface QuizOption {
  label: string;
  description: string;
  tags: string[];
  category?: string;
}

interface QuizQuestion {
  step: string;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    step: "01",
    title: "Who is this for?",
    subtitle: "Let's start with the basics.",
    options: [
      { label: "Men", description: "Masculine, confident scents", tags: [], category: "men" },
      { label: "Women", description: "Feminine, elegant scents", tags: [], category: "women" },
      { label: "Anyone", description: "Unisex, boundary-breaking", tags: [], category: "" },
    ],
  },
  {
    step: "02",
    title: "What's the occasion?",
    subtitle: "Where will you wear this most?",
    options: [
      { label: "Office", description: "Clean, professional, not overpowering", tags: ["office-wear"] },
      { label: "Date Night", description: "Seductive, memorable, lingering", tags: ["date-night"] },
      { label: "Everyday", description: "Fresh, easy, effortless", tags: ["everyday-fresh"] },
      { label: "Evening Out", description: "Bold, statement-making", tags: ["evening"] },
    ],
  },
  {
    step: "03",
    title: "Which scent family?",
    subtitle: "Trust your instinct here.",
    options: [
      { label: "Fresh & Light", description: "Citrus, aquatic, clean", tags: ["fresh", "aquatic", "citrus"] },
      { label: "Woody & Warm", description: "Cedar, sandalwood, vetiver", tags: ["woody"] },
      { label: "Sweet & Floral", description: "Vanilla, rose, jasmine", tags: ["sweet", "floral"] },
      { label: "Rich & Oriental", description: "Oud, amber, spices", tags: ["oriental", "oud", "spicy"] },
    ],
  },
  {
    step: "04",
    title: "How long should it last?",
    subtitle: "Longevity matters.",
    options: [
      { label: "A few hours", description: "Light and breezy", tags: ["fresh"] },
      { label: "All day", description: "Morning to evening", tags: ["all-season"] },
      { label: "Into the night", description: "24hr+ projection", tags: ["long-lasting"] },
    ],
  },
  {
    step: "05",
    title: "What season?",
    subtitle: "Climate affects how a scent unfolds.",
    options: [
      { label: "Summer", description: "Hot days, open air", tags: ["summer"] },
      { label: "Winter", description: "Cold nights, layered warmth", tags: ["winter"] },
      { label: "All Year", description: "Versatile, any weather", tags: ["all-season"] },
    ],
  },
];

function scoreProducts(
  products: Product[],
  answers: { tags: string[]; category: string }
): Array<{ product: Product; score: number; matchPercent: number }> {
  const maxPossibleScore = answers.tags.length + (answers.category ? 1 : 0);
  return products
    .map((p) => {
      let score = 0;
      if (answers.category && p.category === answers.category) score += 1;
      if (!answers.category) score += 0.5;
      for (const tag of answers.tags) {
        if (p.tags?.includes(tag)) score += 1;
      }
      const matchPercent =
        maxPossibleScore > 0
          ? Math.round((score / maxPossibleScore) * 100)
          : 0;
      return { product: p, score, matchPercent: Math.min(matchPercent, 99) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<
    Array<{ product: Product; score: number; matchPercent: number }>
  >([]);
  const [showResults, setShowResults] = useState(false);
  const { addToCart } = useCartStore();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const collectedTags: string[] = [];
      let category = "";
      newAnswers.forEach((ansIdx, qIdx) => {
        const option = QUESTIONS[qIdx].options[ansIdx];
        collectedTags.push(...option.tags);
        if (option.category !== undefined) category = option.category;
      });
      const scored = scoreProducts(products, {
        tags: collectedTags,
        category,
      });
      setResults(scored.slice(0, 4));
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
    setResults([]);
    setShowResults(false);
  };

  const handleAddToCart = (product: Product) => {
    if (addedIds.has(product.id)) return;
    addToCart(product, 1);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
    toast.success(`${product.name} added to cart`);
  };

  const q = QUESTIONS[step];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: DARK, color: CREAM }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          borderBottom: `1px solid rgba(242,237,228,0.12)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "1.1rem",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: CREAM,
            textDecoration: "none",
          }}
        >
          Aromé <em>Luxe</em>
        </Link>

        {!showResults && (
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: SAFFRON,
            }}
          >
            SCENT DIAGNOSTIC — {q?.step}/{QUESTIONS.length}
          </div>
        )}

        <Link
          href="/"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(242,237,228,0.4)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <ArrowLeft style={{ width: 12, height: 12 }} />
          Exit
        </Link>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {!showResults ? (
            /* ── Question ── */
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ maxWidth: 640, width: "100%" }}
            >
              {/* Progress bar */}
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  marginBottom: 48,
                }}
              >
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 2,
                      background:
                        i <= step
                          ? SAFFRON
                          : "rgba(242,237,228,0.12)",
                      transition: "background 0.4s",
                    }}
                  />
                ))}
              </div>

              {/* Label */}
              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: SAFFRON,
                  marginBottom: 16,
                }}
              >
                QUESTION {q.step}
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: "clamp(2rem, 5vw, 3.2rem)",
                  fontWeight: 300,
                  lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                  color: CREAM,
                  margin: "0 0 8px",
                }}
              >
                {q.title}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 14,
                  color: "rgba(242,237,228,0.45)",
                  marginBottom: 40,
                }}
              >
                {q.subtitle}
              </p>

              {/* Options */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    q.options.length === 3 ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
                  gap: 12,
                }}
                className="!grid-cols-1 sm:!grid-cols-none"
              >
                {q.options.map((opt, i) => (
                  <motion.button
                    key={opt.label}
                    onClick={() => handleSelect(i)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      textAlign: "left",
                      padding: "20px 24px",
                      background: "rgba(242,237,228,0.04)",
                      border: "1px solid rgba(242,237,228,0.12)",
                      cursor: "pointer",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `rgba(232,118,58,0.5)`;
                      e.currentTarget.style.background = "rgba(232,118,58,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(242,237,228,0.12)";
                      e.currentTarget.style.background = "rgba(242,237,228,0.04)";
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-fraunces), serif",
                        fontSize: "1.1rem",
                        fontWeight: 300,
                        color: CREAM,
                        marginBottom: 6,
                      }}
                    >
                      {opt.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        color: "rgba(242,237,228,0.38)",
                        textTransform: "uppercase",
                      }}
                    >
                      {opt.description}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Back */}
              {step > 0 && (
                <button
                  onClick={handleBack}
                  style={{
                    marginTop: 32,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(242,237,228,0.35)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <ArrowLeft style={{ width: 12, height: 12 }} /> Previous
                </button>
              )}
            </motion.div>
          ) : (
            /* ── Results ── */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ maxWidth: 960, width: "100%", paddingBottom: 40 }}
            >
              {/* Results header */}
              <div style={{ marginBottom: 48 }}>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: SAFFRON,
                    marginBottom: 16,
                  }}
                >
                  DIAGNOSTIC COMPLETE
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                    fontSize: "clamp(2.4rem, 5vw, 4rem)",
                    fontWeight: 300,
                    lineHeight: 0.92,
                    letterSpacing: "-0.04em",
                    color: CREAM,
                    margin: "0 0 16px",
                  }}
                >
                  Your matches,
                  <br />
                  <em style={{ color: SAFFRON }}>curated.</em>
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 14,
                    color: "rgba(242,237,228,0.45)",
                    maxWidth: 440,
                  }}
                >
                  Based on your answers, these fragrances are calibrated to you.
                </p>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: "rgba(242,237,228,0.1)",
                  marginBottom: 40,
                }}
              />

              {results.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 14,
                      color: "rgba(242,237,228,0.45)",
                      marginBottom: 24,
                    }}
                  >
                    No exact matches found. Browse our full collection instead.
                  </p>
                  <Link
                    href="/products"
                    style={{
                      background: SAFFRON,
                      color: INK,
                      padding: "16px 32px",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Browse All →
                  </Link>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 1,
                    border: "1px solid rgba(242,237,228,0.1)",
                  }}
                >
                  {results.map(({ product, matchPercent }, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{
                        background: "#120604",
                        padding: "0",
                        position: "relative",
                      }}
                    >
                      {/* Match badge */}
                      {i === 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            zIndex: 2,
                            background: SAFFRON,
                            color: INK,
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                            fontSize: 9,
                            letterSpacing: "0.15em",
                            padding: "4px 8px",
                            textTransform: "uppercase",
                          }}
                        >
                          BEST MATCH
                        </div>
                      )}

                      {/* Match % */}
                      <div
                        style={{
                          position: "absolute",
                          top: i === 0 ? 38 : 12,
                          left: 12,
                          zIndex: 2,
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: 9,
                          letterSpacing: "0.1em",
                          color: "rgba(242,237,228,0.4)",
                        }}
                      >
                        {matchPercent}% MATCH
                      </div>

                      {/* Image */}
                      <div
                        style={{
                          position: "relative",
                          height: 280,
                          background: `radial-gradient(circle at 50% 60%, #3D1A0A 0%, #120604 70%)`,
                        }}
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-contain"
                          style={{ padding: "24px 32px" }}
                        />
                      </div>

                      {/* Info */}
                      <div
                        style={{
                          padding: "16px 20px 20px",
                          borderTop: "1px solid rgba(242,237,228,0.08)",
                        }}
                      >
                        {product.fragrance_notes?.top && (
                          <div
                            style={{
                              fontFamily: "var(--font-jetbrains-mono), monospace",
                              fontSize: 9,
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              color: "rgba(242,237,228,0.3)",
                              marginBottom: 6,
                            }}
                          >
                            {product.fragrance_notes.top.slice(0, 3).join(" · ")}
                          </div>
                        )}
                        <div
                          style={{
                            fontFamily: "var(--font-fraunces), serif",
                            fontSize: "1rem",
                            fontWeight: 300,
                            color: CREAM,
                            marginBottom: 10,
                          }}
                        >
                          {product.name}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 8,
                            marginBottom: 14,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-fraunces), serif",
                              fontSize: "1.1rem",
                              fontWeight: 300,
                              color: CREAM,
                            }}
                          >
                            {product.price.currency}
                            {product.price.current.toLocaleString("en-IN")}
                          </span>
                          {product.price.on_sale && (
                            <span
                              style={{
                                fontFamily: "var(--font-jetbrains-mono), monospace",
                                fontSize: 10,
                                color: "rgba(242,237,228,0.3)",
                                textDecoration: "line-through",
                              }}
                            >
                              {product.price.currency}
                              {product.price.original.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addedIds.has(product.id)}
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                              padding: "11px 0",
                              background: addedIds.has(product.id)
                                ? "rgba(232,118,58,0.3)"
                                : SAFFRON,
                              color: INK,
                              border: "none",
                              fontFamily: "var(--font-jetbrains-mono), monospace",
                              fontSize: 9,
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              cursor: addedIds.has(product.id)
                                ? "not-allowed"
                                : "pointer",
                              transition: "background 0.2s",
                            }}
                          >
                            <ShoppingBag style={{ width: 11, height: 11 }} />
                            {addedIds.has(product.id) ? "Added" : "Add to Cart"}
                          </button>
                          <Link
                            href={`/products/${product.id}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "11px 14px",
                              border: "1px solid rgba(242,237,228,0.15)",
                              color: CREAM,
                              textDecoration: "none",
                              transition: "border-color 0.2s",
                            }}
                          >
                            <ArrowRight style={{ width: 13, height: 13 }} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Footer actions */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 32,
                }}
              >
                <button
                  onClick={handleRestart}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 24px",
                    background: "none",
                    border: "1px solid rgba(242,237,228,0.15)",
                    color: CREAM,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  <RotateCcw style={{ width: 11, height: 11 }} />
                  Retake
                </button>
                <Link
                  href="/products"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 28px",
                    background: SAFFRON,
                    color: INK,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Browse All <ArrowRight style={{ width: 11, height: 11 }} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading overlay while products fetch */}
      {loading && !showResults && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: DARK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: SAFFRON,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            LOADING COLLECTION...
          </div>
        </div>
      )}
    </div>
  );
}
