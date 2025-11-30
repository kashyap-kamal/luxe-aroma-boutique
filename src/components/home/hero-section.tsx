"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { TextReveal } from "@/components/ui/text-reveal";
import { MagnetButton } from "@/components/ui/magnet-button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const heroImage =
    "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2070&auto=format&fit=crop";

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] overflow-hidden bg-black flex items-center"
    >
      {/* Background Image with Parallax */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Luxury perfume bottle with dramatic lighting"
          className="w-full h-full object-cover opacity-60"
          width={2070}
          height={1380}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </motion.div>

      {/* Ambient Spotlight Effect */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-luxe-gold/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-luxe-blue/20 rounded-full blur-[150px] animate-pulse delay-700" />

      {/* Content */}
      <div className="relative z-20 luxury-container w-full">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-sm font-medium tracking-[0.2em] uppercase backdrop-blur-md bg-white/5 text-luxe-gold">
              Est. 2024
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white mb-8 leading-[0.9]">
            <div className="overflow-hidden">
              <TextReveal 
                text="Essence of" 
                duration={0.8} 
                className="block" 
                type="words"
              />
            </div>
            <div className="overflow-visible text-luxe-gold italic">
              <TextReveal 
                text="Elegance" 
                delay={0.4} 
                duration={1} 
                className="block" 
                type="chars"
              />
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-lg md:text-2xl text-gray-200 mb-12 max-w-xl font-light leading-relaxed border-l-2 border-luxe-gold pl-6"
          >
            Discover a symphony of scents crafted for the modern connoisseur. 
            Elevate your presence with our signature collection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap gap-6"
          >
            <Link href="/products">
              <MagnetButton className="bg-white text-black hover:bg-luxe-cream group">
                <span className="mr-2">Shop Collection</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </MagnetButton>
            </Link>
            
            <Link href="/about">
              <MagnetButton className="bg-transparent border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                Our Story
              </MagnetButton>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 right-12 md:right-20 z-20 hidden md:flex items-center gap-4 text-white/50"
      >
        <span className="text-xs uppercase tracking-[0.2em] rotate-90 origin-right translate-x-2">Scroll</span>
        <div className="w-[1px] h-24 bg-white/20 overflow-hidden">
          <motion.div 
            className="w-full h-1/2 bg-white"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
