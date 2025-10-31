"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useRef } from "react";

const MotionDiv = motion.div;
const mediaUrl = `${process.env.NEXT_PUBLIC_API_URL}/media/`;

// Utility to randomly pick a layout direction
const getRandomLayout = () => {
  const layouts = [
    "flex-col-reverse",
    "flex-row",
    "flex-row-reverse",
  ];
  return layouts[Math.floor(Math.random() * layouts.length)];
};

export default function MediaFlowGallery({ items = [] }) {
  const galleryRef = useRef(null);

  const layouts = useMemo(() => items.map(() => getRandomLayout()), [items]);

  if (!items.length) return null;

  return (
    <div
      ref={galleryRef}
      className="w-full h-[100vh] overflow-x-auto py-12 rounded-xl mb-10 bg-gradient-to-b from-teal-50 to-transparent
dark:from-teal-950 dark:to-transparent ">
      <div className="flex gap-12 w-max px-6">
        {items.map((item, index) => {
          const src = `${mediaUrl}${item.mediaFile}`;
          const description = item.body || "Experience.";
          const title = item.title || "Journey";
          const layout = layouts[index];

          return (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: "easeOut",
              }}
              className={`rounded-xl flex ${layout} items-center justify-center
                          min-w-[80vw] md:min-w-[600px]   lg:min-w-[800px] max-w-[95vw]
                          transition-all duration-500 gap-4`}>
              {/* Media */}
              <div className="w-full max-w-full overflow-visible rounded-lg group relative ">
                {item.type === "video" ? (
                  <video
                    src={src}
                    controls
                    loop
                    muted
                    playsInline
                    className="object-contain w-full h-[200px] md:h-[400px] lg:h-[500px] transition-transform duration-500 group-hover:scale-105 rounded-lg"
                  />
                ) : (
                  <Image
                    src={src}
                    alt={description}
                    width={1000}
                    height={60}
                    className="object-contain w-full h-[200px] md:h-[400px] lg:h-[500px]   max-h-fit transition-transform duration-500 group-hover:scale-105 rounded-lg"
                  />
                )}
              </div>

              {/* Description - always visible and spaced properly */}
              <div className="dark:text-white text-black font-[monoton] text-left px-2 py-4 w-full max-w-xl min-h-[100px] overflow-visible z-10">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-md dark:text-indigo-300">{description}</p>
              </div>
            </MotionDiv>
          );
        })}
      </div>
    </div>
  );
}
