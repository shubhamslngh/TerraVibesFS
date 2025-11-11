"use client";

import Link from "next/link";

export default function EventCard({ item, scrollProgress = 0 }) {
  // 🛡️ Ensure valid data
  if (!item) return null;
  const pkg = item;

  const base = `${process.env.NEXT_PUBLIC_API_URL || ""}/media`;

  const titleSize =
    scrollProgress < 0.5
      ? "text-sm sm:text-base md:text-lg"
      : "text-xs sm:text-sm";

  // 🧠 Safely parse services
  let services = [];
  try {
    if (pkg.services) {
      services =
        typeof pkg.services === "string"
          ? JSON.parse(pkg.services)
          : pkg.services;
    }
  } catch (e) {
    console.error("Failed to parse services:", e);
  }

  // 🖼️ Safely build image paths
const imagePaths =
  pkg?.images
    ?.map((img) => {
      const src = img?.src || img?.mediaFile || img?.media_file;
      if (!src) return null;
      if (src.startsWith("http")) return src;
      return `${base}/${src.replace(/^\/+/, "")}`;
    })
    ?.filter(Boolean) || [];

  const bgImage1 = imagePaths[0];
  const bgImage2 = imagePaths[1];

  return (
    <Link href={`/experiences/${pkg.id}`} className="block w-full">
      <div
        className="
          group relative p-2 text-center rounded-xl 
          bg-gradient-to-br from-white via-neutral-100 to-neutral-300 
          dark:from-[#1f1c2c] dark:via-[#2d2d2d] dark:to-black 
          shadow-lg transition-transform duration-300 hover:scale-105
        ">
        {/* Decorative strip */}
        <div className="absolute -bottom-2 right-2 w-1/4 h-full dark:bg-amber-100 dark:opacity-35 bg-red-100 z-0 transform rotate-[20deg] transition-all duration-500 group-hover:rotate-0 group-hover:-bottom-4 group-hover:bg-transparent shadow-[0_15px_10px_rgba(0,11,0,0.2)] pointer-events-none" />

        {/* Image section */}
        {bgImage1 && (
          <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden mb-2 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
              style={{ backgroundImage: `url(${bgImage1})` }}
            />
            {bgImage2 && (
              <div
                className="absolute inset-0 bg-cover bg-center scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-in-out"
                style={{ backgroundImage: `url(${bgImage2})` }}
              />
            )}
            <div className="absolute inset-0 bg-black/20 z-10" />
          </div>
        )}

        {/* Title */}
        <div className="relative z-20 text-gray-800 dark:text-amber-200 px-1 pb-1">
          <h2
            className={`${titleSize} font-semibold line-clamp-2 drop-shadow-sm dark:text-amber-300`}>
            {pkg.title || "Untitled Package"}
          </h2>
        </div>
      </div>
    </Link>
  );
}
