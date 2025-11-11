"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatedTooltip } from "@/components/ui/AnimatedTooltip";
import { motion, useScroll, useTransform } from "framer-motion";
import Headings from "@/components/ui/Headings";
import { fetchPackages } from "@/lib/search";
import EventGrid from "@/components/Events/EventGrid";
import Polaroid from "@/components/ui/poloroid";
import axios from "axios";

export default function EmotionWizard() {
  const [stage, setStage] = useState(1);
  const [broadMood, setBroadMood] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const [moods, setMoods] = useState([]); // ← backend moods
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // 🔹 1. Fetch moods from backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/moods/") // update endpoint if different
      .then((res) => setMoods(res.data || []))
      .catch((err) => console.error("Error fetching moods:", err));
  }, []);

  // 🔹 2. Fetch packages when emotion selected
  useEffect(() => {
    if (!selectedEmotion) return;

    setLoading(true);
    fetchPackages({
      mood: selectedEmotion.name,
      isActive: true,
    })
      .then((pkgs) => setPackages(pkgs))
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [selectedEmotion]);

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  // 🧠 3. Create a derived "broad mood" mapping based on categories
  // You can group backend moods by first letter, vibe, or tags later.
  const broadMoods = [
    {
      id: "calm",
      label: "Healing Era 🌿",
      emoji: "🌸",
      image: "/moods/calm1.jpg",
      filter: (m) => /peace|break|calm/i.test(m.name),
    },
    {
      id: "sad",
      label: "Lowkey Heartbroken 💔",
      emoji: "😢",
      image: "/moods/sad.png",
      filter: (m) => /emotionally|overwhelmed|disconnected/i.test(m.name),
    },
    {
      id: "happy",
      label: "Main Character Energy ✨",
      emoji: "🎬",
      image: "/moods/happy.png",
      filter: (m) => /happy|elated|fun/i.test(m.name),
    },
    {
      id: "tired",
      label: "In My Burnout Era 😮‍💨",
      emoji: "💤",
      image: "/moods/tired.jpg",
      filter: (m) => /exhausted|need a break/i.test(m.name),
    },
    {
      id: "curious",
      label: "Soft-Launch Explorer 🧭",
      emoji: "🧭",
      image: "/moods/explore.jpg",
      filter: (m) => /curious/i.test(m.name),
    },
   
  ];


  // 🪄 4. Filter backend moods per broadMood
  const detailedEmotions = broadMood
    ? moods.filter((m) => broadMoods.find((b) => b.id === broadMood)?.filter(m))
    : [];

  return (
    <motion.div
      ref={ref}
      className="px-4 sm:px-6 lg:px-8 py-16 sm:py-2 transition-all">
      <div className="h-auto max-w-[80vw] flex flex-col gap-10 dark:text-white text-black">
        {/* Heading */}
        <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-light leading-tight">
          Pick the <Headings text="Mood" /> that guides your next adventure
        </h1>

        {/* Stage 1: Broad Mood Selection */}
        {stage === 1 && (
          <div className="flex flex-nowrap overflow-x-scroll lg:flex-wrap lg:justify-center lg:overflow-x-auto py-4">
            {broadMoods.map((m, i) => (
              <div
                key={m.id}
                className="cursor-pointer m-4 lg:m-10 flex-shrink-0 w-42"
                onClick={() => {
                  setBroadMood(m.id);
                  setStage(2);
                }}>
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
          <div className="flex flex-col items-center py-4">
            <p className="text-base sm:text-lg mb-6">
              You chose <strong>{broadMood}</strong>. Now pick a more specific
              emotion:
            </p>

            <div className="w-full place-content-around overflow-x-auto pb-4 h-[500px]">
              <AnimatedTooltip
                items={detailedEmotions.map((m) => ({
                  id: m.id,
                  name: m.name,
                  designation: m.description,
                  image: m.image || "/moods/default.jpg", // fallback
                }))}
                onSelect={handleEmotionSelect}
              />
            </div>
          </div>
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
              className="mt-6 text-sm text-red-600 hover:underline flex items-center gap-1">
              <span aria-hidden>←</span> Go Back
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
