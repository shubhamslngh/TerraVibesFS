"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function StarField({ count = 120 }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Listen for class change if theme toggles
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true });

    // Initial detection
    setIsDarkMode(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  const colors = useMemo(() => {
    return isDarkMode
      ? ["#ffffff", "#2196F3", "#80d8ff"]
      : ["#FFD700", "#f0e68c", "#fceabb"];
  }, [isDarkMode]);

  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 2 + 1;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 3 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      return { id: i, size, top, left, delay, duration, color };
    });
  }, [count, colors]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            duration: star.duration,
            delay: star.delay,
          }}
          className="absolute rounded-full"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
          }}
        />
      ))}
    </div>
  );
}
