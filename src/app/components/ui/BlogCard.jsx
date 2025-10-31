"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogCard({ blog }) {
  if (!blog) return null;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 100 }}
      className=" flex flex-row h-56 w-[40vw]
        bg-white dark:bg-black dark:mask-b-from-orange-10 shadow-lg rounded-2xl overflow-hidden
        border border-gray-200 dark:border-gray-700 hover:shadow-xl
        transition-all duration-300
      ">
      {/* Blog Image */}
      {blog.media_file && (
        <img
          src={`${blog.media_file}`}
          alt={blog.title}
          className="w-56 h-auto object-cover"
        />
      )}

      {/* Blog Content */}
      <div className="flex flex-col p-5">
        <h2 className="text-2xl font-semibold font-cinzel text-gray-800 dark:text-white mb-2">
          {blog.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
          {blog.body?.slice(0, 150)}...
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>{new Date(blog.publish_date).toLocaleDateString()}</span>
          <span className="capitalize">{blog.content_type}</span>
        </div>

        <Link
          href={`/blogs/${blog.slug}`}
          className="text-orange-600 dark:text-amber-400 font-semibold hover:underline">
          Read More →
        </Link>
      </div>
    </motion.div>
  );
}
