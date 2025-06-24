"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { motion } from "framer-motion";
export default function BookingPage(props) {
  const { id } = use(props.params);
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Booking Form */}
        <div className="w-full lg:w-2/3">
          <BookingForm packageId={id} defaultStart={start} defaultEnd={end} />
        </div>

        {/* Branding */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-stone-700 text-5xl font-extrabold font-cinzel tracking-wide text-center lg:hidden">
          TERRAVIBES
        </motion.h1>

        {/* Summary Card */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-20 bg-white text-gray-800 shadow-md rounded-lg p-6 space-y-4 border border-gray-200">
            <h2 className="text-xl font-bold text-indigo-700">
              Booking Summary
            </h2>
            <div className="text-sm space-y-2">
              <p>
                <strong>Package ID:</strong> {id}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {start ? new Date(start).toLocaleDateString() : "-"}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {end ? new Date(end).toLocaleDateString() : "-"}
              </p>
            </div>
            <button
              disabled
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded shadow disabled:opacity-50 transition">
              Pay Now
            </button>
            <p className="text-xs text-gray-500 italic text-center">
              * Payment coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
