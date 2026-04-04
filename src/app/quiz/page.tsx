"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ShoppingBag, RotateCcw } from "lucide-react";
import { Product, useCartStore } from "@/stores/cart-store";
import { fetchProducts } from "@/lib/product-service";
import { toast } from "sonner";

// ── Quiz questions and answer-to-tag mappings ──

interface QuizOption {
  label: string;
  description: string;
  tags: string[];
  category?: string;
}

interface QuizQuestion {
  title: string;
  subtitle: string;
  options: QuizOption[];
}

const quizQuestions: QuizQuestion[] = [
  {
    title: "Who is this fragrance for?",
    subtitle: "Let's start with the basics.",
    options: [
      { label: "Men", description: "Masculine, confident scents", tags: [], category: "men" },
      { label: "Women", description: "Feminine, elegant scents", tags: [], category: "women" },
      { label: "Anyone", description: "Unisex, boundary-breaking", tags: [], category: "" },
    ],
  },
  {
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
    title: "Which scent family speaks to you?",
    subtitle: "Trust your instinct here.",
    options: [
      { label: "Fresh & Light", description: "Citrus, aquatic, clean", tags: ["fresh", "aquatic", "citrus"] },
      { label: "Woody & Warm", description: "Cedar, sandalwood, vetiver", tags: ["woody"] },
      { label: "Sweet & Floral", description: "Vanilla, rose, jasmine", tags: ["sweet", "floral"] },
      { label: "Rich & Oriental", description: "Oud, amber, spices", tags: ["oriental", "oud", "spicy"] },
    ],
  },
  {
    title: "How long should it last?",
    subtitle: "Longevity matters.",
    options: [
      { label: "A few hours", description: "Light and breezy", tags: ["fresh"] },
      { label: "All day", description: "Morning to evening", tags: ["all-season"] },
      { label: "Into the night", description: "24hr+ projection", tags: ["long-lasting"] },
    ],
  },
  {
    title: "What season are you dressing for?",
    subtitle: "Climate affects how a scent unfolds.",
    options: [
      { label: "Summer", description: "Hot days, open air", tags: ["summer"] },
      { label: "Winter", description: "Cold nights, layered warmth", tags: ["winter"] },
      { label: "All Year", description: "Versatile, any weather", tags: ["all-season"] },
    ],
  },
];

// ── Scoring logic ──

function scoreProducts(
  products: Product[],
  answers: { tags: string[]; category: string }
): Array<{ product: Product; score: number; matchPercent: number }> {
  const maxPossibleScore = answers.tags.length + (answers.category ? 1 : 0);

  return products
    .map((p) => {
      let score = 0;
      // Category match
      if (answers.category && p.category === answers.category) score += 1;
      if (!answers.category) score += 0.5; // slight bonus for "Anyone"
      // Tag matches
      for (const tag of answers.tags) {
        if (p.tags?.includes(tag)) score += 1;
      }
      const matchPercent = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;
      return { product: p, score, matchPercent: Math.min(matchPercent, 99) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ── Components ──

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Array<{ product: Product; score: number; matchPercent: number }>>([]);
  const [showResults, setShowResults] = useState(false);
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate results
      const collectedTags: string[] = [];
      let category = "";
      newAnswers.forEach((ansIdx, qIdx) => {
        const option = quizQuestions[qIdx].options[ansIdx];
        collectedTags.push(...option.tags);
        if (option.category !== undefined) category = option.category;
      });
      const scored = scoreProducts(products, { tags: collectedTags, category });
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
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const currentQuestion = quizQuestions[step];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#2d3435" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 lg:px-12 py-5">
        <Link href="/" className="font-serif font-bold uppercase text-lg" style={{ color: "#f9f9f9", letterSpacing: "-0.02em" }}>
          AROMÉ LUXE
        </Link>
        <Link href="/" className="font-sans text-xs uppercase tracking-widest" style={{ color: "rgba(249,249,249,0.5)" }}>
          <ArrowLeft className="inline h-3 w-3 mr-1" />
          Back to Store
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl w-full"
            >
              {/* Progress */}
              <div className="flex items-center gap-3 mb-10">
                <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(249,249,249,0.1)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${((step + 1) / quizQuestions.length) * 100}%`, background: "#735b3a" }}
                  />
                </div>
                <span className="font-sans text-xs" style={{ color: "rgba(249,249,249,0.4)" }}>
                  {step + 1}/{quizQuestions.length}
                </span>
              </div>

              {/* Question */}
              <span className="font-sans uppercase tracking-[0.5em] text-[10px] block mb-4" style={{ color: "#735b3a" }}>
                SENSORY JOURNEY
              </span>
              <h2 className="font-serif italic font-normal mb-2" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f9f9f9" }}>
                {currentQuestion.title}
              </h2>
              <p className="font-sans font-light mb-10" style={{ fontSize: "1rem", color: "rgba(249,249,249,0.5)" }}>
                {currentQuestion.subtitle}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, i) => (
                  <button
                    key={option.label}
                    onClick={() => handleSelect(i)}
                    className="text-left p-5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "rgba(249,249,249,0.05)",
                      border: "1px solid rgba(249,249,249,0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(249,249,249,0.1)";
                      e.currentTarget.style.borderColor = "rgba(115,91,58,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(249,249,249,0.05)";
                      e.currentTarget.style.borderColor = "rgba(249,249,249,0.1)";
                    }}
                  >
                    <div className="font-sans font-semibold text-sm mb-1" style={{ color: "#f9f9f9" }}>
                      {option.label}
                    </div>
                    <div className="font-sans text-xs" style={{ color: "rgba(249,249,249,0.45)" }}>
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>

              {/* Back button */}
              {step > 0 && (
                <button onClick={handleBack} className="mt-6 font-sans text-xs uppercase tracking-widest flex items-center gap-2" style={{ color: "rgba(249,249,249,0.4)" }}>
                  <ArrowLeft className="h-3 w-3" /> Previous
                </button>
              )}
            </motion.div>
          ) : (
            /* Results */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl w-full py-10"
            >
              <div className="text-center mb-10">
                <span className="font-sans uppercase tracking-[0.5em] text-[10px] block mb-4" style={{ color: "#735b3a" }}>
                  YOUR RESULTS
                </span>
                <h2 className="font-serif italic font-normal mb-3" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "#f9f9f9" }}>
                  We found your match{results.length > 1 ? "es" : ""}.
                </h2>
                <p className="font-sans font-light" style={{ fontSize: "0.95rem", color: "rgba(249,249,249,0.5)" }}>
                  Based on your preferences, here&apos;s what we recommend.
                </p>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-10">
                  <p className="font-sans" style={{ color: "rgba(249,249,249,0.5)" }}>
                    No exact matches found. Try a different combination!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {results.map(({ product, matchPercent }, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                      <div className="relative overflow-hidden mb-3" style={{ aspectRatio: "3/4", background: "rgba(249,249,249,0.05)" }}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={300}
                          height={400}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider" style={{ background: "#735b3a", color: "#f9f9f9" }}>
                          {matchPercent}% Match
                        </div>
                      </div>
                      <div className="px-1">
                        {product.fragrance_notes?.top && (
                          <p className="font-sans uppercase tracking-[0.1em] mb-1" style={{ fontSize: "0.55rem", color: "rgba(249,249,249,0.35)" }}>
                            {product.fragrance_notes.top.slice(0, 3).join(" · ")}
                          </p>
                        )}
                        <h3 className="font-serif font-medium mb-1" style={{ fontSize: "0.95rem", color: "#f9f9f9" }}>
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="font-sans font-semibold text-sm" style={{ color: "#f9f9f9" }}>
                            {product.price.currency}{product.price.current.toLocaleString("en-IN")}
                          </span>
                          {product.price.on_sale && (
                            <span className="font-sans text-xs line-through" style={{ color: "rgba(249,249,249,0.35)" }}>
                              {product.price.currency}{product.price.original.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 font-sans text-xs font-medium tracking-wide transition-all hover:opacity-90"
                            style={{ background: "#735b3a", color: "#f9f9f9" }}
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Add to Cart
                          </button>
                          <Link
                            href={`/products/${product.id}`}
                            className="flex items-center justify-center px-3 py-2.5 font-sans text-xs tracking-wide transition-all"
                            style={{ border: "1px solid rgba(249,249,249,0.2)", color: "#f9f9f9" }}
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="flex justify-center gap-4 mt-10">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-6 py-3 font-sans text-xs uppercase tracking-widest transition-all"
                  style={{ border: "1px solid rgba(249,249,249,0.2)", color: "#f9f9f9" }}
                >
                  <RotateCcw className="h-3 w-3" /> Retake Quiz
                </button>
                <Link
                  href="/products"
                  className="flex items-center gap-2 px-6 py-3 font-sans text-xs uppercase tracking-widest transition-all"
                  style={{ background: "#735b3a", color: "#f9f9f9" }}
                >
                  Browse All <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
