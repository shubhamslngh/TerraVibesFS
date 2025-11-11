"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getBlogBySlug } from "@/services/api";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getBlogBySlug(slug)
      .then((res) => setBlog(res.data[0]))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="text-center py-20">Loading…</p>;
  if (!blog) return <p className="text-center py-20">Not found 🥲</p>;

  return (
    <main className="max-w-3xl mx-auto py-16 px-6 text-gray-800 dark:text-gray-100">
      <motion.img
        src={`${blog.src}`}
        alt={blog.title}
        className="w-full rounded-2xl mb-8 h-80 object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <h1 className="text-4xl font-bold font-cinzel mb-4">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {new Date(blog.publish_date).toLocaleDateString()}
      </p>
      <article
        className="prose dark:prose-invert max-w-none leading-relaxed"
        dangerouslySetInnerHTML={{ __html: blog.body }}
      />
      <div className="mt-12">
        <Link
          href="/blogs"
          className="text-orange-600 dark:text-amber-400 font-semibold hover:underline">
          ← Back to all blogs
        </Link>
      </div>
    </main>
  );
}
