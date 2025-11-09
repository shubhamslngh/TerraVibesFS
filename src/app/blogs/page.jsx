"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getBlogs } from "@/services/api";
import BlogGrid from "@/components/Blogs/BlogGrid"; // ✅ Reusable scroll grid for blogs

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBlogs()
      .then((res) => setBlogs(res.data || []))
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
      })
      .finally(() => setLoading(false));
  }, []);

  // 🌀 Loading State
  if (loading)
    return (
      <main className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300">
        <div className="flex flex-col items-center justify-center">
          <DotLottieReact
            src="/TravelBus.lottie" // 👈 your loading animation
            autoplay
            loop
            style={{ width: 280, height: 280 }}
          />
          <p className="text-center font-medium text-lg mt-4">
            Loading travel stories...
          </p>
        </div>
      </main>
    );

  // 🚨 Error State
  if (error)
    return (
      <main className="flex items-center justify-center h-screen text-red-500">
        {error}
      </main>
    );

  return (
    <main className="w-full bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
      {/* 🌄 Hero Section */}
      <section className="relative w-full h-[40vh] sm:h-[50vh] bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-cinzel font-bold text-gray-900 dark:text-white leading-snug">
            Travel{" "}
            <span className="text-orange-600 dark:text-amber-400">Stories</span>{" "}
            & Guides
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 font-playfair">
            Real experiences, destinations, and travel insights shared by
            explorers like you.
          </p>
        </motion.div>
      </section>

      {/* 📰 Blog Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No blogs available right now.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            <BlogGrid blogs={blogs} loading={false} />
          </motion.div>
        )}
      </section>
    </main>
  );
}
