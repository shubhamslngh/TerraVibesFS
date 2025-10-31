"use client";

import { useEffect, useState, useRef } from "react";
import EventGrid from "@/components/Events/EventGrid";
import { fetchPackages } from "@/lib/search";
import { motion, useInView } from "framer-motion";

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    fetchPackages({ isActive: true })
      .then((pkgs) => setPackages(pkgs))
      .catch((error) => console.error("Failed to fetch packages:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="w-full bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-cinzel font-bold text-gray-900 dark:text-white leading-snug">
            Begin your healing with a{" "}
            <span className="text-blue-600 dark:text-purple-400">Journey</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 font-playfair">
            Explore transformative experiences that nourish the mind, body, and
            soul.
          </p>
        </motion.div>
      </section>

      {/* Experience Grid Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white font-cinzel">
            Journeys You Can Experience
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Carefully curated experiences designed to relax, rejuvenate, and
            inspire.
          </p>
        </div>

        {!loading ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            <EventGrid packages={packages} loading={loading} />
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
            Loading journeys...
          </p>
        )}
      </section>
    </main>
  );
}
