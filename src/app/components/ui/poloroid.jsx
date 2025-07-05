"use client";

import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function Polaroid({
  src,
  alt = "Polaroid photo",
  caption,
  rotate = "none", // "left", "right", "none"
  size = "w-60", // Tailwind width class
}) {
  const rotationClass = {
    left: "-rotate-6",
    right: "rotate-6",
    none: "",
  }[rotate];

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={clsx(
        // Paper background changes in dark mode
        "rounded-lg shadow-xl p-2 pb-6",
        "border",
        "bg-stone-100 border-white", // Light
        "dark:bg-gradient-to-br dark:from-[#212733] dark:to-[#292c36] dark:border-none dark:shadow-blue-900/40", // Dark
        "flex flex-col items-center",
        size,
        rotationClass
      )}
      style={{
        boxShadow: "0 8px 32px 0 rgba(34,34,60,0.07)",
        // Optional: subtle colored glow in dark mode
        filter:
          "var(--tw-shadow-colored) drop-shadow(0 6px 32px rgba(40,70,180,0.15))",
      }}>
      <div className="aspect-[4/5] relative w-full rounded overflow-hidden shadow-md">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>
      {caption && (
        <p className="text-sm mt-2 text-center text-gray-700 dark:text-gray-100 font-medium drop-shadow-sm">
          {caption}
        </p>
      )}
    </motion.div>
  );
}
