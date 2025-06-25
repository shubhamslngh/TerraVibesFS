"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TextGenerateEffect from "@/components/ui/TextGenerateEffect";

export default function HeroSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3], [2.5, 1]);
  const words = `Begin your healing with a journey...`;

  return (
    <section
      className="relative w-full h-[80vh] min-h-[500px] sm:min-h-[600px] bg-cover bg-center bg-no-repeat rounded-2xl flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundImage: "url('/puneotw.jpeg')" }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Sticky Content */}
      <motion.div
        ref={sectionRef}
        style={{ scale }}
        initial={{ scale: 2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative z-10 text-center max-w-4xl px-4 sm:px-6">
        <motion.h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-cinzel font-bold tracking-wide leading-tight">
          TERRAVIBES
        </motion.h1>

        <TextGenerateEffect
          className="mt-6 text-base sm:text-lg md:text-xl lg:text-2xl italic font-playfair text-gray-200"
          duration={2}
          filter={false}
          words={words}
        />
      </motion.div>
    </section>
  );
}
