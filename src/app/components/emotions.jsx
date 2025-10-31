"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatedTooltip } from "@/components/ui/AnimatedTooltip";
import EventCard from "@/components/Events/EventCard";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Headings from "@/components/ui/Headings";
import { fetchPackages } from "@/lib/search";
import EventGrid from "@/components/Events/EventGrid";
import Polaroid from "@/components/ui/poloroid";
import Image from "next/image";
import Map from "@/components/ui/map";
// Step 1: Broad mood choices (hard-coded)
// Broad moods
// Broad moods (images unchanged)
const broadMoods = [
  {
    id: "happy",
    label: "Main Character",
    emoji: "🎬",
    image: "/moods/happy.png",
  },
  {
    id: "sad",
    label: "In My Feels",
    emoji: "😢",
    image: "/moods/sad.png",
  },
  {
    id: "anxious",
    label: "Overthinking",
    emoji: "😵‍💫",
    image: "/moods/anxious.jpg",
  },
  {
    id: "calm",
    label: "Healing Era",
    emoji: "🌸",
    image: "/moods/calm1.jpg",
  },
  {
    id: "tired",
    label: "Sleep Is Life",
    emoji: "💤",
    image: "/moods/tired.jpg",
  },
];

// Detailed emotions by broad mood
const detailedEmotionsMap = {
  calm: [
    {
      id: 1,
      name: "Calm",
      designation: "Need peace",
      image: "/moods/m2.jpg",
    },
    {
      id: 4,
      name: "Curious",
      designation: "Open to explore",
      image: "/moods/explore.jpg",
    },
  ],
  sad: [
    {
      id: 3,
      name: "Heartbroken",
      designation: "Emotionally drained",
      image: "/moods/explore2.jpg",
    },
    {
      id: 6,
      name: "Lonely",
      designation: "Connect With People",
      image: "/moods/group.jpeg",
    },
  ],
  anxious: [
    {
      id: 2,
      name: "Overwhelmed",
      designation: "Too much going on",
      image: "/moods/toomuch.jpg",
    },
  ],
  tired: [
    {
      id: 5,
      name: "Burnt Out",
      designation: "Need a break",
      image: "/moods/break.jpg",
    },
  ],
  happy: [
    {
      id: 7,
      name: "Joyful",
      designation: "Feeling elated",
      image: "/moods/elated.jpg",
    },
    {
      id: 8,
      name: "Playful",
      designation: "Lighthearted fun",
      image: "/moods/lightfun.jpg",
    },
  ],
};


export default function EmotionWizard() {
  const [stage, setStage] = useState(1);
  const [broadMood, setBroadMood] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
 useEffect(() => {
   if (!selectedEmotion) return;

   setLoading(true);
   fetchPackages({
     mood: selectedEmotion.designation,
     isActive: true,
   })
     .then((pkgs) => setPackages(pkgs))
     .catch((err) => console.error("Fetch error:", err))
     .finally(() => setLoading(false));
 }, [selectedEmotion]);

 const handleEmotionSelect = (emotion) => {
   setSelectedEmotion(emotion);
 };

 return (
  <motion.div
    ref={ref}
    className="px-4 sm:px-6 lg:px-8 py-16 sm:py-2 transition-all"
  >
    <div className="max-w-screen-3xl mx-auto flex flex-col items-center gap-10 text-center dark:text-white text-black">
      {/* Heading */}
      <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-light leading-tight">
        Pick the <Headings text="Mood" /> that guides your next adventure
      </h1>

      {/* Stage 1: Broad Mood Selection */}
      {stage === 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {broadMoods.map((m, i) => (
            <div
              key={m.id}
              className="cursor-pointer"
              onClick={() => {
                setBroadMood(m.id);
                setStage(2);
              }}
            >
              <Polaroid
                src={m.image}
                caption={`${m.label}`}
                rotate={i % 2 === 0 ? "left" : "right"}
              />
            </div>
          ))}
        </div>
      )}

      {/* Stage 2: Detailed Emotion Selection */}
      {stage === 2 && broadMood && !selectedEmotion && (
        <>
          <p className="text-base sm:text-lg">
            You chose <strong>{broadMood}</strong>. Now pick a more specific emotion:
          </p>

          <div className="w-full max-w-3xl">
            <AnimatedTooltip
              items={detailedEmotionsMap[broadMood]}
              onSelect={handleEmotionSelect}
            />
          </div>
        </>
      )}

      {/* Stage 3: Show Packages */}
      {selectedEmotion && (
        <div className="w-full">
          <EventGrid
            loading={loading}
            packages={packages}
            emotionName={selectedEmotion?.name}
          />
        </div>
      )}

      {/* Go Back Button */}
      {stage > 1 && (
        <div className="w-full flex justify-start">
          <button
            onClick={() => {
              if (selectedEmotion) {
                setSelectedEmotion(null); // back to stage 2
              } else {
                setBroadMood(null);
                setStage(1); // back to stage 1
              }
            }}
            className="mt-6 text-sm text-red-600 hover:underline flex items-center gap-1"
          >
            <span aria-hidden>←</span> Go Back
          </button>
        </div>
      )}
    </div>
  </motion.div>
);
}