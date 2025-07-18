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

  // Animate scale and vertical shift
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]); 

  if (loading) {
    return (
      <div className="text-center text-gray-500 font-cinzel">
        <Loader />
      </div>
    );
  }

  if (!loading && packages.length === 0) {
    return (
      <p className="text-center text-gray-500 font-cinzel">
        No packages found.
      </p>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="grid justify-center items-center grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 font-cinzel">
      {packages.map((pkg, i) => (
        <motion.div key={pkg.id}>
          <EventCard pkg={pkg} scrollProgress={scrollYProgress} />
        </motion.div>
      ))}
    </motion.div>
  );
}
