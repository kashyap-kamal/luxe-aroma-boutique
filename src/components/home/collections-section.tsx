"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/data-service";
import { categoryNameMap } from "@/lib/utils";

interface CollectionsSectionProps {
  categories: Category[];
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

function CollectionCard({ category }: { category: Category }) {
  return (
    <Link href={`/products?category=${category.name}`} className="group block h-full">
      <div className="relative h-[320px] md:h-[400px] overflow-hidden rounded-2xl shadow-lg transition-all duration-500 group-hover:shadow-2xl">
        {/* Background Gradient */}
        <div
          className={`w-full h-full bg-gradient-to-br ${
            category.name === "men"
              ? "from-gray-200 to-slate-300"
              : category.name === "women"
              ? "from-rose-100 to-pink-200"
              : "from-indigo-100 to-purple-200"
          } flex items-center justify-center transition-transform duration-700 group-hover:scale-105`}
        >
          <div className="text-center text-gray-500/20 group-hover:text-gray-500/30 transition-colors duration-500">
            {category.name === "men" ? (
              <div className="mb-2 transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                <Image
                  src="/assets/home/mens-collection.png"
                  alt="Men's Collection"
                  width={200}
                  height={200}
                  className="mx-auto opacity-80 mix-blend-multiply w-auto h-auto"
                />
              </div>
            ) : category.name === "women" ? (
              <div className="mb-2 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Image
                  src="/assets/home/womens-collection.png"
                  alt="Women's Collection"
                  width={200}
                  height={200}
                  className="mx-auto opacity-80 mix-blend-multiply w-auto h-auto"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 transform transition-transform duration-500 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  className="w-20 h-20 text-gray-400/40"
                >
                  <path d="M12 2C10 2 8 4 8 7c0 2.5 1.5 4 4 5 2.5-1 4-2.5 4-5 0-3-2-5-4-5z" />
                  <path d="M10 12v8M14 12v8M8 22h8" />
                </svg>
                <span className="text-2xl font-serif italic text-gray-400/30 tracking-wider">
                  For All
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-70" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 transform translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 md:mb-3 group-hover:text-luxe-gold transition-colors duration-300">
            {categoryNameMap(category.name)}
          </h3>
          <p className="text-white/80 mb-4 md:mb-6 line-clamp-2 transform opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            {category.description || `Explore our exclusive collection for ${category.name}.`}
          </p>

          <div className="flex items-center text-white font-bold text-sm uppercase tracking-widest">
            <span className="relative overflow-hidden pb-1">
              Explore Now
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></span>
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CollectionsSection({ categories }: CollectionsSectionProps) {
  return (
    <section className="py-24 bg-luxe-cream overflow-hidden">
      <div className="luxury-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-luxe-gold text-sm font-bold uppercase tracking-widest mb-3 block">
            Curated For You
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
            Our Collections
          </h2>
        </motion.div>

        {/* Desktop: 3-column grid with center card emphasis */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8 md:items-center">
          {categories.slice(0, 3).map((category, i) => (
            <motion.div
              key={category.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              className={i === 1 ? "md:scale-105 md:z-10" : ""}
            >
              <CollectionCard category={category} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: horizontal scroll carousel */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {categories.slice(0, 3).map((category, i) => (
              <motion.div
                key={category.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className="flex-shrink-0 w-[80vw] snap-center"
              >
                <CollectionCard category={category} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
