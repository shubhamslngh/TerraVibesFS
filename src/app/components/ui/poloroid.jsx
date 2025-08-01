"use client";

import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function Polaroid({
  src,
  alt = "Polaroid photo",
  caption,
  rotate = "none", // "left", "right", "none"
  size = "", // Override if needed
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
        "hover:shadow-red-200  shadow-xl p-2 pb-6",
        "bg-stone-100",
        "rounded dark:shadow-teal-700 dark:bg-black dark:inset-shadow-lg dark:inset-shadow-indigo-500   hover:dark:shadow-white",
        "flex flex-col items-center",
        "w-full max-w-[90vw] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]",
        rotationClass,
        size
      )}>
      <div className="aspect-[4/5] relative w-full rounded-md overflow-hidden border border-gray-300 dark:border-stone-900">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover rounded"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
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
