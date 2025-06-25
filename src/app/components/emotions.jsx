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
const broadMoods = [
  {
    id: "happy",
    label: "Happy",
    emoji: "😊",
    image: "/moods/happy.png", // replace with real path
  },
  {
    id: "sad",
    label: "Sad",
    emoji: "😢",
    image: "/moods/sad.png",
  },
  {
    id: "anxious",
    label: "Anxious",
    emoji: "😰",
    image: "/moods/anxious.jpg",
  },
  {
    id: "calm",
    label: "Calm",
    emoji: "😌",
    image: "/moods/calm1.jpg",
  },
  {
    id: "tired",
    label: "Tired",
    emoji: "😴",
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
      image:
        "/moods/explore.jpg",
    },
  ],
  sad: [
    {
      id: 3,
      name: "Heartbroken",
      designation: "Emotionally drained",
      image:
       "/moods/explore2.jpg",
    },
    {
      id: 6,
      name: "Lonely",
      designation: "Connect With People",
      image:
       "/moods/group.jpg",
    },
  ],
  anxious: [
    {
      id: 2,
      name: "Overwhelmed",
      designation: "Too much going on",
      image:
       "/moods/toomuch.jpg",
    },
  ],
  tired: [
    {
      id: 5,
      name: "Burnt Out",
      designation: "Need a break",
      image:
      "/moods/break.jpg",
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
      image:
       "/moods/lightfun.jpg",
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
  // Whenever selectedEmotion changes, re-fetch packages matching that emotion
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
      className="w-full px-4 py-16 sm:py-24 md:py-2   transition-all">
      <div className="max-w-8xl mx-auto flex flex-col items-center gap-10 text-center dark:text-white text-black px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light">
          Choose your <Headings text="Mood" />?
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
                }}>
                <Polaroid
                  src={m.image}
                  caption={`${m.label} ${m.emoji}`}
                  rotate={i % 2 === 0 ? "left" : "right"}
                />
              </div>
            ))}
          </div>
        )}

        {/* Stage 2: Detailed Emotion Selection */}
        {stage === 2 && broadMood && !selectedEmotion && (
          <>
            <p className="text-lg">
              You chose <strong>{broadMood}</strong>. Now pick a more specific
              emotion:
            </p>
            <AnimatedTooltip
              items={detailedEmotionsMap[broadMood]}
              onSelect={handleEmotionSelect}
            />
            <button
              onClick={() => {
                setStage(1);
                setBroadMood(null);
              }}
              className="mt-4 text-sm text-red-600 hover:underline">
              ← Go Back
            </button>
          </>
        )}

        {/* Stage 3: Show Packages for Selected Emotion */}
        {selectedEmotion && (
          <EventGrid
            loading={loading}
            packages={packages}
            emotionName={selectedEmotion?.name}
          />
        )}
      </div>
    </motion.div>
  );
}
