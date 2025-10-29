"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getBlogs } from "@/services/api";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBlogs()
      .then((res) => {
        setBlogs(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <main className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300">
        Loading blogs...
      </main>
    );

  if (error)
    return (
      <main className="flex items-center justify-center h-screen text-red-500">
        {error}
      </main>
    );

  return (
    <main className="w-full bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
      {/* Hero Section */}
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
            explorers.
          </p>
        </motion.div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No blogs available right now.
          </p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={`${blog.media_file}`}
                  alt={blog.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-2xl font-semibold font-cinzel text-gray-800 dark:text-white mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                    {blog.body?.slice(0, 150)}...
                  </p>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="text-orange-600 dark:text-amber-400 font-semibold hover:underline">
                    Read More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
