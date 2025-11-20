"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * Reusable horizontally scrollable grid.
 *
 * @param {Array} items - Data items to display
 * @param {boolean} loading - Whether the data is loading
 * @param {React.ComponentType} CardComponent - Component used to render each item
 * @param {string} emptyMessage - Message shown when items is empty
 * @param {string} loadingLottie - Path to loading animation
 * @param {string} itemWidth - Tailwind width for each item
 */
export default function HorizontalScrollGrid({
  items = [],
  loading = false,
  CardComponent,
  emptyMessage = "No items found.",
  loadingLottie = "/travel.lottie",
  itemWidth = "w-[45vw] sm:w-[300px] md:w-[340px]",
}) {
  const scrollRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // 📏 Scroll logic
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => setScrollPos(el.scrollLeft);
    const updateBounds = () => setMaxScroll(el.scrollWidth - el.clientWidth);
    updateBounds();
    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateBounds);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateBounds);
    };
  }, [items]);

  const showLeft = scrollPos > 5;
  const showRight = scrollPos < maxScroll - 5;
  const hasOverflow = maxScroll > 0;

  // 🖱️ Drag scrolling
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let startX = 0;
    let startScroll = 0;
    let animation;

    const onDown = (e) => {
      if (window.innerWidth < 768) return;
      setIsDragging(true);
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.style.cursor = "grabbing";
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const dx = startX - e.clientX;
      el.scrollLeft = startScroll + dx;
    };

    const onUp = (e) => {
      if (!isDragging) return;
      setIsDragging(false);
      el.style.cursor = "grab";
      const velocity = (startX - e.clientX) * 5;
      const target = Math.min(Math.max(el.scrollLeft + velocity, 0), maxScroll);
      animation = animate(el.scrollLeft, target, {
        type: "inertia",
        power: 0.1,
        timeConstant: 250,
        onUpdate: (v) => (el.scrollLeft = v),
      });
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      animation?.stop?.();
    };
  }, [isDragging, maxScroll]);

  // 💫 Loading and Empty States
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center mt-12">
        <DotLottieReact
          src={loadingLottie}
          autoplay
          loop
          style={{ width: 280, height: 280 }}
        />
      </div>
    );

  if (!loading && items.length === 0)
    return (
      <p className="text-center text-gray-500 font-cinzel py-12">
        {emptyMessage}
      </p>
    );

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Fades */}
      {hasOverflow && (
        <>
          <div
            className={`absolute top-0 left-0 h-full w-10 sm:w-14 z-10 pointer-events-none bg-gradient-to-r from-white dark:from-black to-transparent transition-opacity duration-300 ${
              showLeft ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute top-0 right-0 h-full w-10 sm:w-14 z-10 pointer-events-none bg-gradient-to-l from-white dark:from-black to-transparent transition-opacity duration-300 ${
              showRight ? "opacity-100" : "opacity-0"
            }`}
          />
        </>
      )}

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="
          flex gap-4 overflow-x-auto scrollbar-none no-visible-scrollbar
          px-4 py-6 snap-x snap-mandatory cursor-grab touch-pan-x
        ">
        {items.map((item, idx) => (
          <div key={idx} className={`flex-shrink-0 snap-center ${itemWidth}`}>
            <CardComponent item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
