"use client";

import { FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Guides({ guides = [], onSelect, selectedGuideId }) {
  if (!guides.length) return null;

  return (
    <div className="relative w-full">
      {/* 🌫 Left & Right fade masks for mobile */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white dark:from-black to-transparent z-10 sm:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white dark:from-black to-transparent z-10 sm:hidden" />

      {/* 🌀 Scrollable row on small screens, grid on desktop */}
      <motion.div
        className="
          flex sm:flex-wrap gap-6 justify-start sm:justify-center
          overflow-x-auto sm:overflow-visible
          px-4 sm:px-0 py-4
          scrollbar-none snap-x snap-mandatory
          cursor-grab active:cursor-grabbing
        ">
        {guides.map((guide, idx) => (
          <motion.div
            key={guide.id || idx}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect?.(guide.id)}
            className={`
              flex-shrink-0 snap-center relative 
              w-[70vw] sm:w-[200px] md:w-[240px] lg:w-[260px] h-[280px]
              rounded-xl overflow-hidden shadow-lg cursor-pointer
              transition-transform duration-500
              ${
                selectedGuideId === guide.id
                  ? "scale-105 ring-4 ring-violet-400 shadow-[0_0_25px_rgba(139,92,246,0.6)] z-10"
                  : "hover:scale-105"
              }
            `}>
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-contain bg-center  transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              style={{ backgroundImage: `url(${guide.photo || guide.image})` }}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />

            {/* Info */}
            <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-3 z-20">
              <h2 className="text-base sm:text-lg font-bold truncate">
                {guide.name}
              </h2>
              <p className="text-xs sm:text-sm text-violet-200 italic truncate">
                {guide.expertise}
              </p>
            </div>

            {/* Instagram Icon */}
            <div className="absolute top-4 right-4 z-30 text-white bg-black/40 hover:bg-black/70 p-2 rounded-full">
              <FaInstagram className="text-lg sm:text-xl" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
