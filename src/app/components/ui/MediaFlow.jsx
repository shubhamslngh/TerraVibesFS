"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
const MotionDiv = motion.div;
const mediaUrl = `${process.env.NEXT_PUBLIC_API_URL}/media/`;

export default function MediaFlowGallery({ items = [] }) {
const galleryRef = useRef(null);

  if (!items.length) return null;

  return (
    <div
      ref={galleryRef}
      className="w-full transparent-scrollbar overflow-x-auto py-12 rounded-xl mb-10
  bg-gradient-to-br from-[#e0f2fe] to-[#fef9c3] 
  dark:from-[#475976] dark:to-[#010d2b]">
      <div className="flex gap-10 w-max px-6">
        {items.map((item, index) => {
          const src = `${mediaUrl}${item.mediaFile}`;
          const description = item.body || "Experience.";
          const title = item.title || " Journey";
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
              className="rounded-lg p-4 h-auto flex flex-col md:flex-row items-center justify-center max-h-[300px] min-w-[320px] md:min-w-[600px] max-w-[90vw]">
              {/* Media + description container */}
              <div
                className={`flex flex-col md:flex-row gap-4 items-center justify-center w-full`}>
                {/* Media */}
                <div className="w-full md:w-[400px] max-h-90 overflow-hidden rounded-lg group relative">
                  {item.type === "video" ? (
                    <video
                      src={src}
                      controls
                      loop
                      muted
                      playsInline
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 rounded-lg"
                    />
                  ) : (
                    <Image
                      src={src}
                      alt={description}
                      width={800}
                      style={{
                        objectFit: "contain",
                      }}
                      height={400}
                      className=" bg-center w-full h-auto transition-transform duration-500 group-hover:scale-105 rounded-lg"
                    />
                  )}
                </div>

                {/* Description */}
                <div className="dark:text-white text-black text-md w-full md:w-1/2 max-w-md px-2 text-left leading-relaxed">
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-sm dark:text-indigo-300">{description}</p>
                </div>
              </div>
            </MotionDiv>
          );
        })}
      </div>
    </div>
  );
}
