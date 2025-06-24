"use client";
import Polaroid from "./poloroid";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";

export const AnimatedTooltip = ({ items , onSelect}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Tooltip tilt
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (event) => {
    const half = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - half);
  };

  // 1) Parent container variants for staggering
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1, // 100ms between each icon
      },
    },
  };

  // 2) Child variants for each icon
  const child = {
    hidden: { scale: 0, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 10 },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-wrap items-center justify-center gap-6">
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={child}
          className="group relative"
          onClick={() => onSelect?.(item)}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}>
          {/* Tooltip */}
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 260, damping: 10 },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{ translateX, rotate, whiteSpace: "nowrap" }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl">
                <div className="absolute inset-x-10 -bottom-px h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative text-base font-bold text-white">
                  {item.name}
                </div>
                <div className="text-lg text-white">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Icon */}

          <Polaroid
            onMouseMove={handleMouseMove}
            src={item.image}
            caption={`${item.designation}`}
            rotate={item.id % 2 === 0 ? "left" : "right"}
          />
          
        </motion.div>
      ))}
    </motion.div>
  );
};
