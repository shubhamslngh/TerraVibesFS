"use client";

import { useMemo, useRef } from "react";
import { color, motion, useScroll, useTransform } from "framer-motion";
import TextGenerateEffect from "@/components/ui/TextGenerateEffect";

const IMG_SRC = "/travel2.jpg";
const ROWS = 30;
const COLS = 30;

export default function HeroSection() {
  const sectionRef = (useRef(null));

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3], [2.5, 1]);
  const words = `Begin your healing with a journey...`;

  // Precompute tile coordinates [row, col]
  const tiles = useMemo(() => {
    const list = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        list.push({ r, c, key: `${r}-${c}` });
      }
    }
    return list;
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative p-10 max-h-screen w-full h-[80vh] sm:h-[90vh] xl:h-screen rounded-2xl overflow-hidden flex items-center justify-center"
      style={{ background: "transparent" }}>
      {/* Image grid layer */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden>
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 10fr)`,
          }}>
          {tiles.map(({ r, c, key }) => {
            const posX = COLS === 1 ? 0 : (c / (COLS - 1)) * 100;
            const posY = ROWS === 1 ? 0 : (r / (ROWS - 1)) * 100;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 1.02 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.1, delay: (r * COLS + c) * 0.0008 }}
                className="will-change-transform"
                style={{
                  backgroundImage: `url(${IMG_SRC})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                  backgroundPosition: `${posX}% ${posY}%`,
                }}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Content */}
      <motion.div
        initial={{ scale: 1.5 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="relative z-10 text-center px-4 sm:px-6">
        <motion.h1 className="text-white text-[clamp(2.5rem,6vw,6rem)] subtext-lost font-bold leading-tight tracking-wide">
          TERRAVIBES
        </motion.h1>

        <TextGenerateEffect
          className="mt-6 text-[clamp(1rem,2.5vw,1.75rem)] italic font-playfair text-white"
          duration={2}
          filter={false}
          words={words}
        />
      </motion.div>
    </section>
  );
}
