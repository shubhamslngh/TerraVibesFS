"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import EventCard from "./EventCard";
import Loader from "../ui/loader";

export default function EventGrid({ packages = [], loading = false }) {
  const scrollRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // 🧠 Update scroll metrics
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => setScrollPos(el.scrollLeft);
    const updateScrollBounds = () =>
      setMaxScroll(el.scrollWidth - el.clientWidth);

    updateScrollBounds();
    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateScrollBounds);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollBounds);
    };
  }, [packages]);

  // 🌫️ Fade visibility logic
  const showLeft = scrollPos > 5;
  const showRight = scrollPos < maxScroll - 5;
  const hasOverflow = maxScroll > 0;

  // 🖱️ Desktop drag with inertia
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animation;
    let startX = 0;
    let startScroll = 0;

    const onPointerDown = (e) => {
      if (window.innerWidth < 768) return; // disable drag on mobile
      setIsDragging(true);
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.style.cursor = "grabbing";
      e.preventDefault();
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = startX - e.clientX;
      el.scrollLeft = startScroll + dx;
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      setIsDragging(false);
      el.style.cursor = "grab";

      // inertia physics
      const velocity = (startX - e.clientX) * 5;
      const target = Math.min(Math.max(el.scrollLeft + velocity, 0), maxScroll);
      animation = animate(el.scrollLeft, target, {
        type: "inertia",
        power: 0.1,
        timeConstant: 250,
        restDelta: 0.5,
        onUpdate: (v) => (el.scrollLeft = v),
      });
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      animation && animation.stop?.();
    };
  }, [isDragging, maxScroll]);

  // 📦 Loading and empty states
  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );

  if (!loading && packages.length === 0)
    return (
      <p className="text-center text-gray-500 font-cinzel py-12">
        No packages found.
      </p>
    );

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* 🌫 Left Fade Mask */}
      {hasOverflow && (
        <div
          className={`absolute top-0 left-[-1px] h-full w-10 sm:w-14 z-10 pointer-events-none transition-opacity duration-300 ${
            showLeft ? "opacity-100" : "opacity-0"
          } bg-gradient-to-r from-[var(--background,white)] dark:from-[var(--background,black)] to-transparent`}
        />
      )}

      {/* 🌫 Right Fade Mask */}
      {hasOverflow && (
        <div
          className={`absolute top-0 right-[-2px]  h-full w-10 sm:w-14 z-10 pointer-events-none transition-opacity duration-300 ${
            showRight ? "opacity-100" : "opacity-0"
          } bg-gradient-to-l from-[var(--background,white)] dark:from-[var(--background,black)] to-transparent`}
        />
      )}

      {/* 🎠 Scrollable Row */}
      <div
        ref={scrollRef}
        className="
          flex gap-4
          overflow-x-auto
          scrollbar-none
          px-[calc(1rem+2px)]  /* small padding but aligns fades perfectly */
          py-6
          snap-x snap-mandatory
          cursor-grab
          touch-pan-x
        ">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="
              flex-shrink-0 snap-center
              w-[45vw] sm:w-[300px] md:w-[340px]
            ">
            <EventCard pkg={pkg} />
          </div>
        ))}
      </div>
    </div>
  );
}
