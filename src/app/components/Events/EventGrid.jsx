"use client";

import {  useTransform, motion } from "framer-motion";
import EventCard from "./EventCard";
import Loader from "../ui/loader";

export default function EventGrid({ packages = [], loading = false }) {



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
    <motion.div className="flex flex-wrap justify-center gap-8 px-4">
      {packages.map((pkg) => (
        <motion.div
          key={pkg.id}
          className="w-full max-w-sm">
          <EventCard pkg={pkg} />
        </motion.div>
      ))}
    </motion.div>
  );
}
