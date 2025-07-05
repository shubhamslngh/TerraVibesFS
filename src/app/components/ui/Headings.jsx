"use client";
import React from "react";
import { motion } from "motion/react";

export function ColourfulText({
    text
}) {
   const colors = [
     "rgb(28, 45, 62)", // Deep mountain shadow blue
     "rgb(51, 85, 109)", // Muted alpine blue
     "rgb(87, 112, 130)", // Soft denim from the jacket
     "rgb(143, 155, 145)", // Misty valley green
     "rgb(179, 145, 119)", // Warm neutral rock tone
     "rgb(168, 109, 74)", // Dog’s reddish fur
     "rgb(202, 173, 122)", // Sunlight reflection on skin/rock
     "rgb(110, 104, 93)", // Wood and earthy contrast
     "rgb(20, 94, 32)", // Deep natural shadow
   ];


    const [currentColors, setCurrentColors] = React.useState(colors);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            const shuffled = [...colors].sort(() => Math.random() - 0.5);
            setCurrentColors(shuffled);
            setCount((prev) => prev + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return text.split("").map((char, index) => (
        <motion.span
            key={`${char}-${count}-${index}`}
            initial={{
                y: 0,
            }}
            animate={{
                color: currentColors[index % currentColors.length],
                y: [0, -3, 0],
                scale: [1, 1.01, 1],
                filter: ["blur(0px)", `blur(5px)`, "blur(0px)"],
                opacity: [1, 0.8, 1],
            }}
            transition={{
                duration: 0.5,
                delay: index * 0.05,
            }}
            className="inline-block whitespace-pre font-sans tracking-tight">
            {char}
        </motion.span>
    ));
}
export default ColourfulText;