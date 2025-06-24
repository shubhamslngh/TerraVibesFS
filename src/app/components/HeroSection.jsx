"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import TextGenerateEffect from "@/components/ui/TextGenerateEffect";

export default function HeroSection() {
  const sectionRef = useRef(null);

  // Real-time scroll detection
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"], 
  });

    const scale = useTransform(scrollYProgress, [0, 0.3], [2.5, 1]);
  const words = `Begin your healing with a journey...`;

  return (
    <section  className="relative w-full h-[80vh]  mask-t-from-60% bg-[url('/puneotw.jpeg')] bg-cover bg-center rounded-2xl flex flex-col place-self-center items-center justify-center">

      <motion.div
        initial={{ scale: 2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="fixed inset-0  bg-no-repeat bg-contain bg-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Sticky Content */}
      <motion.div
        ref={sectionRef}
        initial={{ scale: 10 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="sticky top-1/2 -translate-y-1/2 z-10 text-center max-w-4xl mx-auto px-6">
        <motion.h1 className="text-slate-900 text-6xl md:text-7xl font-cinzel font-bold tracking-wide">
          TERRAVIBES
        </motion.h1>
      <TextGenerateEffect
        className="mt-6 text-xl md:text-2xl italic font-playfair text-gray-200"
        duration={2}
        filter={false}
        words={words}
      />
      </motion.div>
    </section>
  );
}
