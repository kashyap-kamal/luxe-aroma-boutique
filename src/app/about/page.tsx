"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Leaf, Globe, Shield, User } from "lucide-react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="flex-grow overflow-hidden bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px]">
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          <Image
            src="/assets/about-us/about-us.jpeg"
            alt="Aromé Luxe About"
            className="w-full h-full object-cover object-bottom"
            width={1280}
            height={640}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </motion.div>
        
        <div className="relative h-full luxury-container flex flex-col justify-center items-start text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 max-w-3xl"
          >
            Our Story
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl max-w-2xl font-light text-gray-200 leading-relaxed"
          >
            Crafting luxury fragrances with passion, precision, and the finest
            ingredients from around the world.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-luxe-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-luxe-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        
        <div className="luxury-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-luxe-gold text-sm font-bold uppercase tracking-widest mb-3 block">
                Our Purpose
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8">
                Our Mission
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                At Aromé Luxe, we believe that fragrance is an art form—a
                delicate balance of science and creativity that has the power to
                transport, inspire, and transform. Our mission is to create
                exceptional fragrances that become an integral part of your
                personal story.
              </p>
                <p>
                We source only the finest ingredients from renowned suppliers
                worldwide, working with master perfumers who bring decades of
                expertise to every blend. Each fragrance is crafted with
                meticulous attention to detail, ensuring a scent that is both
                distinctive and enduring.
              </p>
            </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-black/20 rounded-2xl transform translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />
              <Image
                src="/assets/about-us/our-mission.jpeg"
                alt="Luxury perfume making"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl relative z-10"
                width={600}
                height={800}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="luxury-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-luxe-gold text-sm font-bold uppercase tracking-widest mb-3 block">
              What Drives Us
            </span>
            <h2 className="text-4xl font-serif font-bold text-gray-900">
            Our Values
          </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Passion", desc: "We pour our heart into every fragrance, creating scents that inspire and delight.", color: "bg-luxe-blue" },
              { icon: Leaf, title: "Quality", desc: "Only the finest ingredients make their way into our carefully crafted fragrances.", color: "bg-luxe-sandy" },
              { icon: Globe, title: "Heritage", desc: "We honor traditional perfumery techniques while embracing modern innovation.", color: "bg-luxe-blue" },
              { icon: Shield, title: "Integrity", desc: "We maintain the highest standards of transparency and ethical practices.", color: "bg-luxe-sandy" }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300 group border border-transparent hover:border-gray-100 hover:shadow-lg"
              >
                <div className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="h-8 w-8 text-white" />
              </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-luxe-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        
        <div className="luxury-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="absolute -inset-4 border border-white/20 rounded-2xl transform rotate-3 opacity-50" />
              <Image
                src="/assets/about-us/ingredients.jpeg"
                alt="Perfume ingredients"
                className="w-full h-[600px] object-cover rounded-2xl shadow-2xl relative z-10"
                width={600}
                height={800}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <span className="text-luxe-gold text-sm font-bold uppercase tracking-widest mb-3 block">
                The Beginning
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-white">
                The Aromé Luxe Journey
              </h2>
              <div className="space-y-6 text-lg font-light text-gray-200 leading-relaxed">
                <p>
                Growing up in an Indian household, I was surrounded by a
                symphony of scents that shaped my earliest memories. From the
                intoxicating aroma of jasmine garlands that my grandmother wore
                to the earthy fragrance of sandalwood incense burning in our
                prayer room, every corner of our home told a story through
                scent.
              </p>
                <p>
                As a child, I was both fascinated and critical of the world of
                fragrances. I would spend hours in our spice cabinet, inhaling
                the complex layers of cardamom, cinnamon, and cloves, while
                simultaneously being repelled by the harsh chemical odors that
                seemed to permeate so many commercial products. This early
                obsession with authentic, natural scents became the foundation
                of my journey into perfumery.
              </p>
                <p>
                Today, Aromé Luxe represents my deep-rooted love for fragrances
                that tell authentic stories. We blend the traditional wisdom of
                Indian perfumery with modern techniques, creating scents that
                honor both heritage and innovation—fragrances that would have
                made my grandmother proud and that speak to the discerning nose
                of today&apos;s luxury connoisseur.
              </p>
            </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 bg-white">
        <div className="luxury-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            The Art of Craftsmanship
          </h2>
            <div className="w-24 h-1 bg-luxe-gold mx-auto rounded-full" />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gray-200 -z-10" />
            
            {[
              { step: "1", title: "Sourcing", desc: "We travel the world to source the finest ingredients—from rare oud in the Middle East to precious jasmine in Grasse, France." },
              { step: "2", title: "Blending", desc: "Our master perfumers blend ingredients with precision, creating harmonious compositions that evolve beautifully on the skin." },
              { step: "3", title: "Aging", desc: "Like fine wine, our fragrances are aged to perfection. This crucial step allows the ingredients to meld together, creating depth and complexity." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center bg-white p-4"
              >
                <div className="w-24 h-24 bg-white border-4 border-luxe-cream rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                  <span className="text-3xl font-serif font-bold text-luxe-gold">{item.step}</span>
              </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                  {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-luxe-cream">
        <div className="luxury-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-luxe-gold text-sm font-bold uppercase tracking-widest mb-3 block">
              The People Behind The Brand
            </span>
            <h2 className="text-4xl font-serif font-bold text-gray-900">
            Meet Our Team
          </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Kamal Kashyap", role: "Founder & Master Perfumer", desc: "The visionary behind Aromé Luxe, Kamal is the master craftsman who creates our exquisite fragrances." },
              { name: "Ayush Paharia", role: "Web Developer", desc: "Kamal's nephew who brings our digital vision to life, crafting the online experience." },
              { name: "Amol Paharia", role: "Operations Support", desc: "Ayush's brother and another nephew of Kamal, Amol handles all the day-to-day operations." },
              { name: "Moksh Kashyap", role: "Fragrance Specialist", desc: "Kamal's son, Moksh brings intimate knowledge of scents to our team." }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-32 h-32 bg-luxe-cream rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner overflow-hidden">
                  <User className="h-16 w-16 text-gray-400" />
              </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  {member.name}
              </h3>
                <p className="text-luxe-gold font-medium mb-4 text-sm uppercase tracking-wide">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-luxe-blue text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-luxe-gold/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        
        <div className="luxury-container text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Experience Aromé Luxe
          </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-300 font-light">
            Discover our collection of luxury fragrances and find your signature
            scent. Each bottle tells a story of passion, craftsmanship, and
            timeless elegance.
          </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/products">
              <Button
                  size="lg"
                  className="bg-white text-black hover:bg-luxe-cream text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Shop Collection
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 hover:text-white text-lg px-8 py-6 rounded-full bg-transparent backdrop-blur-sm"
              >
                Contact Us
              </Button>
            </Link>
          </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default About;
