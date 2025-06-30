"use client";

import { useScroll, useTransform, motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 100%"],
  });
const innerDotScale = useTransform(scrollYProgress, [0, 0.1, 1], [1, 1.25, 1]);

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const dotScale = useTransform(scrollYProgress, [0, 0.15, 1], [1, 1.6, 0.95]);
  const dotShadow = useTransform(
    scrollYProgress,
    [0, 0.15, 1],
    [
      "0 0 0px 0px #7c3aed",
      "0 0 18px 8px #6366f1, 0 0 40px 16px #3b82f6",
      "0 0 0px 0px #7c3aed",
    ]
  );

  return (
    <div
      ref={containerRef}
      className="w-full font-sans bg-white dark:bg-black text-stone-800 dark:text-stone-100 md:px-10">
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 font-bold max-w-4xl text-black dark:text-white">
          Don’t let your mood decide your day.
        </h2>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => {
          const itemRef = useRef(null);
          const isInView = useInView(itemRef, {
            once: true,
            margin: "-30% 0px",
          });

          const dotScale = useTransform(
            scrollYProgress,
            [0, 1],
            [1, isInView ? 1.6 : 1]
          );
          const innerDotScale = useTransform(
            scrollYProgress,
            [0, 1],
            [1, isInView ? 1.25 : 1]
          );
          const dotShadow = isInView
            ? "0 0 18px 8px #6366f1, 0 0 40px 16px #3b82f6"
            : "0 0 0px 0px #7c3aed";

          return (
            <div
              key={index}
              ref={itemRef}
              className="flex flex-col md:flex-row justify-start pt-10 md:pt-40 md:gap-10 relative">
              {/* Dot + Title */}
              <div className="sticky z-40 top-40 self-start max-w-xs lg:max-w-sm md:w-full flex items-start">
                <div className="relative p-7 ">
                  <motion.div
                    style={{
                      scale: isInView ? 1.6 : 1,
                      boxShadow: dotShadow,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, #fff 70%, #6366f1 100%)",
                    }}
                    className="h-3 w-3 flex items-center justify-center border-2 border-neutral-300 dark:border-blue-900 bg-white dark:bg-black transition-all duration-300">
                    <motion.div
                      style={{
                        scale: isInView ? 1.25 : 1,
                      }}
                      className="h-1 w-1 rounded-full bg-neutral-200 dark:bg-blue-600"
                    />
                  </motion.div>
                </div>
                <h3 className="hidden md:block text-xl md:pl-6 md:text-5xl font-bold text-neutral-900 dark:text-white">
                  {item.title}
                </h3>
              </div>

              {/* Content */}
              <div className="relative pl-16 pr-4 md:pl-4 w-full">
                <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-900 dark:text-white">
                  {item.title}
                </h3>
                <div className="prose dark:prose-invert">{item.content}</div>
              </div>
            </div>
          );
        })}

        {/* Animated Vertical Line */}
        <div
          style={{ height: height + "px" }}
          className="absolute md:left-8 left-8 top-0 w-[2px] bg-gradient-to-b from-transparent via-neutral-300 dark:via-blue-900">
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute top-0 inset-x-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
