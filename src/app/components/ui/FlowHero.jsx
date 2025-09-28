import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";


export default function App() {
  const containerRef = useRef(null);

  // useScroll listens to the scroll progress of the containerRef
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // --- Parallax Transformations ---
  // We transform the scroll progress (0 to 1) into different motion values.
  // This creates the parallax effect where some layers move faster than others.

  // Mountains move up slowly
  const mountainsY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  // Trees move up faster, creating a sense of depth
  const treesY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  // Text fades out as you scroll down
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // --- Animation Variants for Text ---
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2, // Animate children one after another
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
      {/* Container for parallaxing images */}
      <div className="absolute inset-0 z-0">
        {/* Mountain Image (Back Layer) */}
        <motion.img
          src="/mountain.png"
          alt="Misty mountains background"
          style={{ y: mountainsY }}
          className="absolute bottom-0 left-0 w-full h-auto object-cover"
        />

        {/* Trees Image (Front Layer) */}
        <motion.img
          src="/tree.png"
          alt="Foggy pine trees"
          style={{ y: treesY }}
          className="absolute bottom-0 left-0 w-full h-[90%] object-cover"
        />
      </div>

      {/* Overlay Gradient to blend the images */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* Text Content */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white p-4">
        <motion.div variants={textVariants} initial="hidden" animate="visible">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-shadow-lg mb-4 font-serif">
            Into the Mist
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl max-w-2xl text-shadow-md text-gray-200">
            Discover serene landscapes and breathtaking views that inspire
            adventure and tranquility.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
