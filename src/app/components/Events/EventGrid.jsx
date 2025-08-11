"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import EventCard from "./EventCard";
import Loader from "../ui/loader";

export default function EventGrid({ packages = [], loading = false }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 font-cinzel py-12">
        <Loader />
      </div>
    );
  }

  if (!loading && packages.length === 0) {
    return (
      <p className="text-center text-gray-500 font-cinzel py-12">
        No packages found.
      </p>
    );
  }

  return (
    <motion.div ref={ref} className="flex flex-wrap justify-center gap-8 px-4">
      {packages.map((pkg) => (
        <motion.div
          key={pkg.id}
          style={{ scale, y }}
          className="w-full max-w-sm">
          <EventCard pkg={pkg} />
        </motion.div>
      ))}
    </motion.div>
  );
}
