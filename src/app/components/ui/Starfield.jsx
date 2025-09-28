"use client";

import { useEffect, useRef } from "react";

export default function StarfieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Set canvas size to match the window, and handle resize
    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const numStars = 200;
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      opacity: 0, // Start invisible for fade-in
      speed: Math.random() * 0.05 + 0.01, // How fast it fades in
    }));

    let animationFrameId;

    // The animation loop
    const animate = () => {
      // Clear the canvas on each frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Fade in the star
        if (star.opacity < 1) {
          star.opacity += star.speed;
        }

        // Draw the star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    setup();
    window.addEventListener("resize", setup);
    animate();

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", setup);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
