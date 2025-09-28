"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
} from "framer-motion";

const TextFade = ({ text, className = "" }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className={className}>
    {text}
  </motion.h2>
);

export default function HeroSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 100%", "end 0%"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.4,
  });

  const h1 = useTransform(p, [0, 0.5, 1], [250, 320, 200]);
  const h2 = useTransform(p, [0, 0.5, 1], [190, 40, 220]);
  const h3 = useTransform(p, [0, 0.5, 1], [140, 200, 280]);

  const sky = useMotionTemplate`
    radial-gradient(120% 80% at 50% 115%,
      hsl(${h3} 90% 70% / 0.25) 0%,
      transparent 60%
    ),
    linear-gradient(to top,
      hsl(${h1} 70% 8%) 0%,
      hsl(${h2} 85% 34%) 46%,
      hsl(${h3} 90% 72%) 100%
    )
  `;

  const auroraStyle = {
    backgroundImage: `conic-gradient(
      from 0deg at 50% 60%,
      rgba(255,255,255,0.0) 0deg,
      rgba(255,255,255,0.08) 60deg,
      rgba(255,255,255,0.0) 120deg,
      rgba(255,255,255,0.10) 180deg,
      rgba(255,255,255,0.0) 240deg,
      rgba(255,255,255,0.08) 300deg,
      rgba(255,255,255,0.0) 360deg
    )`,
    backgroundSize: "140% 140%",
    mixBlendMode: "screen",
  };

  const fgY = useTransform(p, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(p, [0, 0.6, 1], [1, 0.75, 0.6]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative w-full h-[60vh] md:h-[100vh] lg:h-[100vh] flex items-center justify-center overflow-hidden text-white">
      {/* --- SKY WRAPPER with mask (only sky fades at top) --- */}
      <div className="absolute inset-0 -z-30 sky-mask-t-90 pointer-events-none">
        {/* Animated sky */}
        <motion.div
          style={{ backgroundImage: sky }}
          className="absolute inset-0"
        />

        {/* Aurora swirl (slow drift) */}
        <motion.div
          style={auroraStyle}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-35"
        />

        {/* Soft atmospheric haze */}
        <motion.div
          aria-hidden
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.0) 35%, rgba(255,255,255,0.10) 65%, rgba(255,255,255,0.0) 100%)",
            backgroundSize: "300% 100%",
            backdropFilter: "blur(0.5px)",
          }}
        />
      </div>

      {/* --- FOREGROUND stays OUTSIDE the masked sky --- */}
      <motion.img
        src="/liftmountain.png"
        alt="Foreground mountain"
        style={{ y: fgY }}
        className="absolute bottom-0 w-full object-cover z-0"
      />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[clamp(2.4rem,8vw,5.2rem)] font-bold tracking-tight drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
          Explore Beyond
        </motion.h1>
        <TextFade
          text="Switch sceneries. Shift perspectives."
          className="mt-4 text-lg md:text-xl text-gray-100"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 transition">
          Get Started
        </motion.button>
      </motion.div>

      {/* Grounding fade so the mountain/shadow blends nicely */}
      <div className="absolute bottom-0 inset-x-0 h-[42%] bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 pointer-events-none" />
    </motion.section>
  );
}
