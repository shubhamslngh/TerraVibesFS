"use client";

import { useState, useEffect } from "react";
import { getGuides, getPackages } from "@/services/api";
import Guides from "@/components/ui/GuidesCards";
import EventGrid from "@/components/Events/EventGrid";
import { motion, AnimatePresence } from "framer-motion";

export default function GuideSelector() {
  const [guides, setGuides] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Fetch guides + packages on mount
  useEffect(() => {
    Promise.all([getGuides(), getPackages()]).then(([gRes, pRes]) => {
      setGuides(gRes.data || []);
      setPackages(pRes.data || []);
      setFiltered(pRes.data || []);
      setLoading(false);
    });
  }, []);

  // 🎯 Update filtered list when a guide is selected
  useEffect(() => {
    if (!selectedGuideId) {
      setFiltered(packages);
    } else {
      const filteredPackages = packages.filter((pkg) =>
        pkg.guides?.some((g) => g.id === selectedGuideId)
      );
      setFiltered(filteredPackages);
    }
  }, [selectedGuideId, packages]);

  return (
    <div className="px-4 py-12">
      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-lost font-extrabold text-center text-gray-800 dark:text-white mb-4">
        Find Your{" "}
        <span className="text-indigo-600 dark:text-indigo-400">Tripper</span>
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-300 max-w-xl mx-auto mb-10">
        Select a guide below to discover handpicked experiences crafted just for
        you.
      </p>

      {/* 🎫 Guide Cards */}
      <Guides
        guides={guides}
        onSelect={setSelectedGuideId}
        selectedGuideId={selectedGuideId}
      />

      {/* Show All Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setSelectedGuideId(null)}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm shadow transition">
          <span>Show All Guides</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>

      {/* 🎠 Filtered EventGrid with animation */}
      <div className="mt-12 justify-center">
        <AnimatePresence mode="wait">
          {selectedGuideId != null && (
            <motion.p
              key={selectedGuideId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-4 text-center text-lg">
              Experiences with{" "}
              <span className="font-semibold">
                {guides.find((g) => g.id === selectedGuideId)?.name}
              </span>
            </motion.p>
          )}
        </AnimatePresence>

        <EventGrid packages={filtered} loading={loading} />
      </div>
    </div>
  );
}
