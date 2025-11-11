"use client";
import Link from "next/link";

export default function BlogCard({ blog, item }) {
  const data = blog || item; // ✅ support both prop styles
  if (!data) return null;

  return (
    <div className="flex flex-col bg-white dark:bg-neutral-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {data.src && (
        <img
          src={data.src}
          alt={data.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-lg sm:text-xl font-semibold font-cinzel text-gray-800 dark:text-white mb-2 line-clamp-2">
          {data.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
          {data.body?.slice(0, 150)}...
        </p>

        <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{new Date(data.publish_date).toLocaleDateString()}</span>
          <span className="capitalize">{data.content_type}</span>
        </div>

        <Link
          href={`/blogs/${data.slug}`}
          className="text-orange-600 dark:text-amber-400 font-semibold hover:underline mt-3">
          Read More →
        </Link>
      </div>
    </div>
  );
}
