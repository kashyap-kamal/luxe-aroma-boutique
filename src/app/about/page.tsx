"use client";

import Link from "next/link";
import { Heart, Leaf, Globe, Shield, User } from "lucide-react";
import { motion } from "framer-motion";

const INK = "#0E0E0C";
const CREAM = "#F2EDE4";
const SAFFRON = "#E8763A";
const DARK = "#1A0908";

const team = [
  { name: "Kamal Kashyap", role: "Founder & Master Perfumer", desc: "The visionary behind Aromé Luxe, Kamal is the master craftsman who creates our exquisite fragrances." },
  { name: "Ayush Paharia", role: "Web Developer", desc: "Kamal's nephew who brings our digital vision to life, crafting the online experience." },
  { name: "Amol Paharia", role: "Operations Support", desc: "Ayush's brother and another nephew of Kamal, Amol handles all day-to-day operations." },
  { name: "Moksh Kashyap", role: "Fragrance Specialist", desc: "Kamal's son, Moksh brings intimate knowledge of scents to our team." },
];

const values = [
  { icon: Heart, label: "Passion", desc: "We pour our heart into every fragrance, creating scents that inspire and delight." },
  { icon: Leaf, label: "Quality", desc: "Only the finest ingredients make their way into our carefully crafted fragrances." },
  { icon: Globe, label: "Heritage", desc: "We honor traditional perfumery techniques while embracing modern innovation." },
  { icon: Shield, label: "Integrity", desc: "We maintain the highest standards of transparency and ethical practices." },
];

const steps = [
  { n: "01", title: "Sourcing", desc: "We source the finest ingredients — from rare oud in the Middle East to precious jasmine in Grasse." },
  { n: "02", title: "Blending", desc: "Our master perfumers blend ingredients with precision, creating compositions that evolve beautifully on the skin." },
  { n: "03", title: "Aging", desc: "Like fine wine, our fragrances are aged to perfection, allowing ingredients to meld and develop depth." },
];

export default function About() {
  return (
    <main style={{ background: CREAM, color: INK, paddingTop: 0 }}>

      {/* MASTHEAD HERO */}
      <section style={{ borderBottom: `1px solid ${INK}`, background: DARK, color: CREAM, minHeight: 480, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "56px 48px 56px" }}>
        <div className="max-w-5xl mx-auto w-full">
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 20 }}>
            FEATURE — ABOUT / OUR STORY
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(3.5rem, 8vw, 8rem)", fontWeight: 300, lineHeight: 0.88, letterSpacing: "-0.04em", margin: "0 0 28px" }}>
            Masterfully <em style={{ color: SAFFRON }}>crafted.</em>
            <br />Unapologetically honest.
          </h1>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 16, lineHeight: 1.65, maxWidth: 560, opacity: 0.75 }}>
            Aromé Luxe was born from a belief that exceptional fragrance shouldn&apos;t cost a fortune — and that every bottle should tell the truth about what&apos;s inside.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section style={{ borderBottom: `1px solid ${INK}` }}>
        <div className="hidden md:grid max-w-5xl mx-auto" style={{ gridTemplateColumns: "2fr 3fr" }}>
          <div style={{ padding: "56px 48px", borderRight: `1px solid ${INK}`, background: SAFFRON, color: INK }}>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>
              THE BEGINNING
            </div>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em", margin: 0 }}>
              The Aromé <em>Luxe</em> journey.
            </h2>
          </div>
          <div style={{ padding: "56px 48px" }}>
            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 15, lineHeight: 1.8, color: "#3A3833", display: "flex", flexDirection: "column", gap: 20 }}>
              <p>Growing up in an Indian household, I was surrounded by a symphony of scents that shaped my earliest memories — jasmine garlands, sandalwood incense, the spice cabinet. Every corner of our home told a story through fragrance.</p>
              <p>As a child I was fascinated and critical in equal measure. I spent hours in that spice cabinet, inhaling cardamom and cinnamon, while being repelled by the harsh chemical odors that permeated so many commercial products. That early obsession with authentic, natural scents became the foundation of this journey.</p>
              <p>Today, Aromé Luxe blends the traditional wisdom of Indian perfumery with modern technique — creating scents that honor both heritage and innovation. Fragrances that would have made my grandmother proud, and that speak to the discerning nose of today&apos;s connoisseur.</p>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.15em", color: SAFFRON, textTransform: "uppercase", marginTop: 8 }}>— Kamal Kashyap, Founder</div>
            </div>
          </div>
        </div>
        {/* Mobile story */}
        <div className="flex flex-col md:hidden">
          <div style={{ padding: "40px 20px", background: SAFFRON, borderBottom: `1px solid ${INK}` }}>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>THE BEGINNING</div>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "2.5rem", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.03em", margin: 0 }}>The Aromé <em>Luxe</em> journey.</h2>
          </div>
          <div style={{ padding: "32px 20px", fontFamily: "var(--font-inter), sans-serif", fontSize: 14, lineHeight: 1.75, color: "#3A3833", display: "flex", flexDirection: "column", gap: 16 }}>
            <p>Growing up in an Indian household, I was surrounded by scents that shaped my earliest memories — jasmine garlands, sandalwood incense, the spice cabinet. Every corner told a story through fragrance.</p>
            <p>Today, Aromé Luxe blends the traditional wisdom of Indian perfumery with modern technique — creating scents that honor both heritage and innovation at a price that doesn&apos;t require a boutique tax.</p>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.15em", color: SAFFRON, textTransform: "uppercase" }}>— Kamal Kashyap, Founder</div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ borderBottom: `1px solid ${INK}` }}>
        <div style={{ padding: "40px 48px 0", borderBottom: `1px solid ${INK}` }} className="hidden md:block">
          <div className="max-w-5xl mx-auto" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 8 }}>WHAT DRIVES US</div>
              <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "3rem", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", margin: 0 }}>Our <em>values.</em></h2>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto hidden md:grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {values.map((v, i) => (
            <div key={v.label} style={{ padding: "40px 36px", borderRight: i < 3 ? `1px solid ${INK}` : "none" }}>
              <div style={{ width: 40, height: 40, background: INK, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <v.icon className="h-4 w-4" style={{ color: CREAM }} strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.4rem", fontWeight: 300, marginBottom: 10 }}>{v.label}</div>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, lineHeight: 1.65, color: "#3A3833" }}>{v.desc}</p>
            </div>
          ))}
        </div>
        {/* Mobile values */}
        <div className="flex flex-col md:hidden">
          <div style={{ padding: "28px 20px 16px", borderBottom: `1px solid ${INK}` }}>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 8 }}>WHAT DRIVES US</div>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "2.2rem", fontWeight: 300, letterSpacing: "-0.03em", margin: 0 }}>Our <em>values.</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {values.map((v, i) => (
              <div key={v.label} style={{ padding: "28px 20px", borderRight: i % 2 === 0 ? `1px solid ${INK}` : "none", borderBottom: i < 2 ? `1px solid ${INK}` : "none" }}>
                <div style={{ width: 32, height: 32, background: INK, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <v.icon className="h-3.5 w-3.5" style={{ color: CREAM }} strokeWidth={1.5} />
                </div>
                <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.1rem", fontWeight: 300, marginBottom: 6 }}>{v.label}</div>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, lineHeight: 1.6, color: "#3A3833", margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CRAFTSMANSHIP */}
      <section style={{ background: DARK, color: CREAM, borderBottom: `1px solid ${INK}` }}>
        <div style={{ padding: "40px 48px 0", borderBottom: "1px solid rgba(242,237,228,0.15)" }} className="hidden md:block">
          <div className="max-w-5xl mx-auto" style={{ paddingBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 8 }}>THE PROCESS</div>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "3rem", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", margin: 0 }}>Art of <em style={{ color: SAFFRON }}>craftsmanship.</em></h2>
          </div>
        </div>
        <div className="max-w-5xl mx-auto hidden md:grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ padding: "40px 36px", borderRight: i < 2 ? "1px solid rgba(242,237,228,0.15)" : "none" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", color: SAFFRON, marginBottom: 16 }}>{s.n}</div>
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.8rem", fontWeight: 300, marginBottom: 12 }}><em>{s.title}</em></div>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, lineHeight: 1.7, opacity: 0.75, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        {/* Mobile craftsmanship */}
        <div className="flex flex-col md:hidden">
          <div style={{ padding: "28px 20px 16px", borderBottom: "1px solid rgba(242,237,228,0.15)" }}>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "2rem", fontWeight: 300, letterSpacing: "-0.03em", margin: 0 }}>Art of <em style={{ color: SAFFRON }}>craftsmanship.</em></h2>
          </div>
          {steps.map((s, i) => (
            <div key={s.n} style={{ padding: "24px 20px", borderBottom: i < 2 ? "1px solid rgba(242,237,228,0.15)" : "none" }}>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, color: SAFFRON, marginBottom: 8 }}>{s.n}</div>
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.4rem", fontWeight: 300, marginBottom: 8 }}><em>{s.title}</em></div>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, lineHeight: 1.65, opacity: 0.75, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section style={{ borderBottom: `1px solid ${INK}` }}>
        <div style={{ padding: "40px 48px 0", borderBottom: `1px solid ${INK}` }} className="hidden md:block">
          <div className="max-w-5xl mx-auto" style={{ paddingBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: 8 }}>THE PEOPLE</div>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "3rem", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", margin: 0 }}>Meet the <em>team.</em></h2>
          </div>
        </div>
        <div className="max-w-5xl mx-auto hidden md:grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {team.map((m, i) => (
            <div key={m.name} style={{ padding: "36px 28px", borderRight: i < 3 ? `1px solid ${INK}` : "none" }}>
              <div style={{ width: 48, height: 48, background: "rgba(14,14,12,0.06)", border: `1px solid rgba(14,14,12,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <User className="h-5 w-5" style={{ color: INK, opacity: 0.4 }} strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.1rem", fontWeight: 300, marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: SAFFRON, marginBottom: 10 }}>{m.role}</div>
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, lineHeight: 1.65, color: "#3A3833", margin: 0 }}>{m.desc}</p>
            </div>
          ))}
        </div>
        {/* Mobile team */}
        <div className="flex flex-col md:hidden">
          <div style={{ padding: "28px 20px 16px", borderBottom: `1px solid ${INK}` }}>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "2.2rem", fontWeight: 300, letterSpacing: "-0.03em", margin: 0 }}>Meet the <em>team.</em></h2>
          </div>
          {team.map((m, i) => (
            <div key={m.name} style={{ padding: "24px 20px", borderBottom: i < team.length - 1 ? `1px solid ${INK}` : "none", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, background: "rgba(14,14,12,0.06)", border: `1px solid rgba(14,14,12,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <User className="h-4 w-4" style={{ color: INK, opacity: 0.4 }} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1rem", fontWeight: 300 }}>{m.name}</div>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: SAFFRON, marginBottom: 6 }}>{m.role}</div>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 12, lineHeight: 1.6, color: "#3A3833", margin: 0 }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: SAFFRON, color: INK, padding: "64px 48px" }}>
        <div className="max-w-5xl mx-auto" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 24 }}>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>EXPERIENCE AROMÉ LUXE</div>
          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2.5rem, 5vw, 5rem)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.04em", margin: 0 }}>
            Find your <em>signature</em> scent.
          </h2>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
            <Link href="/products" style={{ background: INK, color: CREAM, padding: "18px 32px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>SHOP COLLECTION →</Link>
            <Link href="/quiz" style={{ background: "transparent", color: INK, border: `1px solid ${INK}`, borderLeft: "none", padding: "18px 32px", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>TAKE THE QUIZ</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
