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
    "bg-stone-100 rounded-sm shadow-lg p-2 pb-6",
    "border border-white flex flex-col items-center",
    size,
    rotationClass
  )}
>
      <div className="aspect-[4/5] mask-x-from-95% sepia-10 mask-x-to-100% relative w-full  rounded overflow-hidden shadow-sm">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>
      {caption && (
        <p className="text-md mt-2 text-center dark:text-black text-gray-700 font-\\\">
          {caption}
        </p>
      )}
    </motion.div>
  );
}
