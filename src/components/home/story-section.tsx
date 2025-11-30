"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { TextReveal } from "@/components/ui/text-reveal";
import { MagnetButton } from "@/components/ui/magnet-button";
import { ArrowRight } from "lucide-react";

export default function StorySection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="py-32 bg-black text-white relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
      
      {/* Ambient Background Gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-luxe-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      
      <div className="luxury-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-luxe-gold text-sm font-bold uppercase tracking-[0.2em] mb-6 block">
              Our Heritage
            </span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-10 leading-tight">
              <div className="overflow-hidden">
                <TextReveal text="Crafting Memories" className="block" />
              </div>
              <div className="overflow-hidden text-gray-400 italic">
                <TextReveal text="Through Scent" delay={0.2} className="block" />
              </div>
            </h2>
            
            <div className="space-y-8 text-lg text-gray-400 font-light leading-relaxed border-l border-white/10 pl-8">
              <p>
                Aromé Luxe was born from a passion for exceptional fragrances and a
                desire to bring the world&apos;s finest scents to discerning
                customers. Our journey began with a simple belief: that a perfume is
                more than just a scent—it&apos;s an expression of personality.
              </p>
              <p>
                Each of our fragrances is carefully crafted using the highest
                quality ingredients sourced from around the globe. We work with
                master perfumers who blend traditional techniques with innovative
                approaches.
              </p>
            </div>

            <div className="mt-12">
              <Link href="/about">
                <MagnetButton className="bg-white text-black hover:bg-luxe-gold transition-colors group">
                  <span className="mr-3">Discover Our Story</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </MagnetButton>
              </Link>
            </div>
          </motion.div>

          <div className="relative h-[600px] hidden lg:block perspective-[1000px]">
            <motion.div 
              style={{ y, rotateX: 5, rotateY: -5 }}
              whileHover={{ rotateX: 0, rotateY: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-2xl rounded-3xl border border-white/10 p-12 shadow-2xl"
            >
              <div className="h-full w-full border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                {/* Interactive gradient background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-luxe-gold/10 via-transparent to-luxe-blue/10 group-hover:scale-110 transition-transform duration-[2s]" />
                
                <div className="text-center relative z-10 max-w-md">
                  <div className="text-6xl text-luxe-gold opacity-50 font-serif mb-6">"</div>
                  <h3 className="text-4xl font-serif italic mb-8 text-white font-light leading-tight">
                    Perfume is the art that makes memory speak.
                  </h3>
                  <div className="w-12 h-[1px] bg-luxe-gold mx-auto mb-6" />
                  <p className="text-luxe-gold uppercase tracking-[0.3em] text-xs font-bold">
                    Francis Kurkdjian
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ 
                y: [0, -40, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -right-20 w-48 h-48 bg-luxe-gold/20 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                y: [0, 60, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-20 -left-20 w-64 h-64 bg-luxe-blue/20 rounded-full blur-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
