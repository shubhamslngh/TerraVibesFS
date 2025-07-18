"use client";

import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import DateRangeSelector from "@/components/Calendar";
import { Timeline } from "@/components/ui/Timeline";
import MediaFlowGallery from "@/components/ui/MediaFlow";
import { use } from "react";
import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

import Loader from "@/components/ui/loader";
// Inside your component

export default function PackageDetailsPage({ params }) {
  const [pkg, setPkg] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { id } = use(params);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/graphql/`;
  const mediaUrl = `${process.env.NEXT_PUBLIC_API_URL}/media/`;
  const galleryRef = useRef(null);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const calcHeight = () => {
    const start = 0;
    const end = 500;
    const minHeight = 300;
    const maxHeight = window.innerHeight;
    const scrollProgress = Math.min(scrollY / end, 1);
    const interpolatedHeight =
      maxHeight - (maxHeight - minHeight) * scrollProgress;
    return `${interpolatedHeight}px`;
  };

  useEffect(() => {
    async function fetchPackage() {
      try {
        const res = await fetch(url, {
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
                  images { mediaFile, body, title,}
                }
              }
            `,
            variables: { id: parseInt(id, 10) },
          }),
        });

        const json = await res.json();
        const data = json?.data?.package;
        if (!data) return notFound();
        setPkg(data);
      } catch (err) {
        console.error("Failed to load package:", err);
        notFound();
      }
    }

    fetchPackage();
  }, [id]);

  const handleDateChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  if (!pkg) {
    return (
      <Loader/>
    );
  }

  const priceNumber = parseFloat(pkg.price);
  const imagePaths =
    pkg.images?.map((img) => `${mediaUrl}${img.mediaFile}`) || [];

  const timelineData = [
    {
      title: "📍 Package Overview",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}>
          <h1 className=" text-3xl font-bold text-stone-700 dark:text-stone-100 mb-2">
            {pkg.title}
          </h1>
          <p className="text-lg text-red-600 font-semibold">
            ₹ {isNaN(priceNumber) ? pkg.price : priceNumber.toLocaleString()}
          </p>
        </motion.div>
      ),
    },
  
    {
      title: "📖 Description",
      content: (
        <p className="text-stone-700 dark:text-stone-200 whitespace-pre-line leading-relaxed">
          {pkg.description}
        </p>
      ),
    },
    pkg.moods?.length > 0 && {
      title: "💡 Matching Moods",
      content: (
        <div className="flex flex-wrap gap-2">
          {pkg.moods.map((mood, i) => (
            <span
              key={i}
              className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm px-3 py-1 rounded-full font-medium">
              {mood.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "🗓️ Plan Your Break",
      content: (
        <div>
          <h2 className="text-md font-semibold mb-2 text-stone-700 dark:text-stone-100">
            How long do you want to disconnect?
          </h2>
          <DateRangeSelector onChange={handleDateChange} />
          <div className="mt-4 text-sm text-stone-700 dark:text-stone-300">
            <strong>Selected:</strong> {startDate.toLocaleDateString()} –{" "}
            {endDate.toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      title: "✅ Ready to Book?",
      content: (
        <div className="mt-6 flex flex-col items-start gap-4">
          <p className="text-sm text-stone-700 dark:text-stone-300">
            You're all set! Click below to book this experience.
          </p>
          <button
            onClick={() => {
              const query = new URLSearchParams({
                packageId: pkg.id,
                start: startDate.toISOString(),
                end: endDate.toISOString(),
              }).toString();
              window.location.href = `/book/${pkg.id}?${query}`;
            }}
            className="bg-black dark:bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded shadow">
            Book Now
          </button>
        </div>
      ),
    },
  ].filter(Boolean);
  return (
    <motion.div className=" p-2 place-content-center relative  bg-white dark:bg-black text-stone-800 dark:text-stone-100">
      <motion.div
        style={{ height: calcHeight() }}
        transition={{ duration: 0.4 }}
        className="w-full bg-gradient-to-br from-[#e0f2fe] to-[#fef9c3] 
    dark:from-transparent dark:to-[#010d2b] rounded-sm z-10 overflow-hidden">
        <MediaFlowGallery items={pkg.images} />
      </motion.div>
      <div className="px-4 sm:px-8 pt-8 pb-16">
        <h1 className="text-4xl font-bold mb-6">Package Details</h1>
        <Timeline data={timelineData} />
      </div>
    </motion.div>
  );
}
