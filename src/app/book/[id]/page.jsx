"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import MediaFlowGallery from "@/components/ui/MediaFlow";
import EventCard from "@/components/Events/EventCard";
import { motion } from "framer-motion";
import Loader from "@/components/ui/loader";
import { format } from "date-fns";
import { useScroll, useTransform } from "framer-motion";
import { useMemo } from "react";

export default function BookingPage({ params }) {
  const { id } = params;
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const [startDate, setStartDate] = useState(start ? new Date(start) : null);
  const [endDate, setEndDate] = useState(end ? new Date(end) : null);
const handleDateChange = ({ startDate: s, endDate: e }) => {
  setStartDate(s);
  setEndDate(e);
  console.log("Updated in parent:", s, e);
};
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 300], [1, 0.75]);
  const height = useTransform(scrollY, [0, 300], [500, 300]);
 const days = useMemo(() => {
   const startObj =
     typeof startDate === "string" ? new Date(startDate) : startDate;
   const endObj = typeof endDate === "string" ? new Date(endDate) : endDate;

   if (!startObj || !endObj || isNaN(startObj) || isNaN(endObj)) return 1;

   return Math.max(1, Math.ceil((endObj - startObj) / (1000 * 60 * 60 * 24)));
 }, [startDate, endDate]);

  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    async function fetchPackage() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetPackage($id: Int!) {
                package(id: $id) {
                  id
                  title
                  price
                  description
                  services
                  moods { name }
                  images { mediaFile, body, title }
                }
              }
            `,
            variables: { id: parseInt(id, 10) },
          }),
        });

        const json = await res.json();
        setPkg(json?.data?.package);
      } catch (err) {
        console.error("Failed to fetch package:", err);
      }
    }

    fetchPackage();
  }, [id]);

  if (!pkg) return <Loader />;

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-100 dark:bg-black transition-colors duration-300">
      <motion.div
        style={{ scale, height }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br mb-10 from-[#e0f2fe] to-[#fef9c3] 
    dark:from-[#0000] dark:to-[#010d2b] w-full rounded-sm z-10 overflow-hidden flex items-stretch justify-center">
        <div className="w-full h-fit">
          <MediaFlowGallery items={pkg.images} />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 space-y-8">
          <BookingForm
            packageId={id}
            defaultStart={start}
            defaultEnd={end}
            pkg={pkg}
            onDateChange={handleDateChange}
          />
        </div>
        {/* Branding & Summary */}
        <div className="w-full lg:w-1/3 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-stone-700 dark:text-white text-2xl font-extrabold  tracking-wide text-center lg:text-left">
            {pkg.title || "Package Details"}
          </motion.h1>

          <div className="sticky top-20 bg-white dark:bg-zinc-900 text-gray-800 dark:text-white shadow-md rounded-lg p-6 space-y-4 border border-gray-200 dark:border-zinc-700">
            <EventCard pkg={pkg} />

            <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
              Booking Summary
            </h2>

            <div className="text-sm space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4">
                <div className="text-center text-sm font-semibold text-stone-600 dark:text-stone-300">
                  Duration: {days} {days > 1 ? "days" : "day"}
                </div>

                <div className="relative h-12 flex items-center justify-between">
                  {/* Start Date */}
                  <div className="text-xs text-left w-1/3">
                    <p className="text-stone-700 dark:text-stone-300 font-medium">
                      Start
                    </p>
                    <p className="text-stone-500 dark:text-stone-400">
                      {startDate ? format(startDate, "dd MMM yyyy") : "-"}
                    </p>
                  </div>

                  {/* Animated Line */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1 }}
                    className="relative h-1 bg-gradient-to-r from-indigo-400 to-red-500 rounded"
                  />

                  {/* End Date */}
                  <div className="text-xs text-right w-1/3">
                    <p className="text-stone-700 dark:text-stone-300 font-medium">
                      End
                    </p>
                    <p className="text-stone-500 dark:text-stone-400">
                      {endDate ? format(endDate, "dd MMM yyyy") : "-"}
                    </p>
                  </div>
                </div>
              </motion.div>
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
