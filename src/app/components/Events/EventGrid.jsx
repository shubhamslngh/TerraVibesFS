"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import EventCard from "./EventCard";
import Loader from "../ui/loader";

export default function EventGrid({ packages = [], loading = false }) {
  const containerRef = useRef(null);
  const x = useMotionValue(0);

  // Estimate total scroll width based on card size + spacing
  const totalWidth = (packages.length - 1) * 340; // Adjust if your cards are wider

  // Fade masks: left fades in when scrolled, right fades when nearing end
  const leftOpacity = useTransform(x, [0, -50], [0, 1]);
  const rightOpacity = useTransform(
    x,
    [-totalWidth + 100, -totalWidth + 50, 0],
    [0, 1, 1]
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (!loading && packages.length === 0) {
    return (
      <p className="text-center text-gray-500 font-cinzel py-12">
        No packages found.
      </p>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full select-none">
      {/* 🌫 Left & right fade masks */}
      <motion.div
        style={{ opacity: leftOpacity }}
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white dark:from-black to-transparent z-10"
      />
      <motion.div
        style={{ opacity: rightOpacity }}
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white dark:from-black to-transparent z-10"
      />

      {/* 🎠 Scrollable + Draggable Flex Container */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -totalWidth, right: 0 }}
        dragElastic={0.12}
        style={{ x }}
        className="
        transparent-scrollbar
          flex gap-6
          overflow-x-auto
          scrollbar-none
          px-6 py-4
          snap-x snap-mandatory
          cursor-grab active:cursor-grabbing
        ">
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
            whileTap={{ scale: 0.97 }}
            className="
              flex-shrink-0
              snap-center
              w-[80vw] sm:w-[320px] md:w-[340px]
            ">
            <EventCard pkg={pkg} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
