"use client";

import { motion, useInView, AnimationControls, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  type?: "words" | "chars";
}

export const TextReveal = ({
  text,
  className,
  delay = 0,
  duration = 0.8,
  type = "words",
}: TextRevealProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const items = type === "words" ? text.split(" ") : text.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: type === "words" ? 0.1 : 0.03,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      transition: { type: "spring", damping: 12, stiffness: 100 } 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        damping: 12, 
        stiffness: 100,
        duration: duration 
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={cn("inline-block", className)}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          variants={childVariants}
          className="inline-block mr-[0.2em] whitespace-pre"
        >
          {item}
        </motion.span>
      ))}
    </motion.span>
  );
};


