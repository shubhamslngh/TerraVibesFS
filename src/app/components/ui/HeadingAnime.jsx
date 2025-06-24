"use client";

import { useEffect, useRef } from "react";
// Import the named `animate` from the ESM build
import { animate } from "animejs";

export default function AnimatedHeading({
  text = "Sunny mornings",
  className = "",
}) {
  const headingRef = useRef(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    // Wrap each letter in a <span class="letter">
    el.innerHTML = text.replace(/\S/g, "<span class='letter'>$&</span>");

    // Animate with Anime.js
    animate(".letter", {
      // move up then back down
      y: [
        { to: "-2.75rem", ease: "outExpo", duration: 600 },
        { to: "0rem", ease: "outBounce", duration: 800, delay: 100 },
      ],
      // rotate from –1 turn to 0
     
      // stagger each letter by 50ms
      delay: (_, i) => i * 50,
      // overall easing
      easing: "inOutCirc",
      // loop forever, pausing 1s between loops
      loop: false,
      loopDelay: 1000,
    });
  }, [text]);

  return (
    <h1
      ref={headingRef}
      className={`ml2 font-black text-4xl md:text-6xl ${className}`}>
      {text}
    </h1>
  );
}
