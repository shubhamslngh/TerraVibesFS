"use client";

import Link from "next/link";

export default function EventCard({ pkg }) {
const base = `${process.env.NEXT_PUBLIC_API_URL}/media`;

  let services = [];
  try {
    services =
      typeof pkg.services === "string"
        ? JSON.parse(pkg.services)
        : pkg.services;
  } catch (e) {
    console.error("Failed to parse services:", e);
  }

  const priceNumber = parseFloat(pkg.price);

  const shortDescription =
    pkg.description.length > 200
      ? pkg.description.slice(0, 200) + "…"
      : pkg.description;

  const imagePaths =
    pkg.images?.map((img) =>
      img.media_file
        ? img.media_file
        : `${base}/${img.mediaFile.replace(/^\/+/, "")}`
    ) || [];

  const bgImage1 = imagePaths[0];
  const bgImage2 = imagePaths[1];

  return (
    <Link href={`/packages/${pkg.id}`}>
      <div
        className="relative group rounded-xl p-8 
  bg-gradient-to-br from-white via-neutral-100 to-neutral-200 
  dark:from-[#1f1c2c] dark:via-[#2d2d2d] dark:to-black 
  shadow-lg transition-all max-w-100 duration-300 
  hover:-translate-y-1 hover:rotate-[0.5deg] 
  hover:shadow-2xl dark:hover:shadow-[0_15px_50px_rgba(255,215,0,0.1)]">
        {/* Simulated Lift Shadow */}
        <div className="absolute -bottom-2 right-2 w-1/4 h-full dark:bg-amber-100 dark:opacity-35 bg-red-100 z-0 transform rotate-[20deg] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-0 group-hover:-bottom-4 group-hover:bg-transparent shadow-[0_15px_10px_rgba(0,11,0,0.2)] pointer-events-none" />

        {/* Image container */}
        <div className="relative w-full h-40 rounded-md overflow-hidden mb-4 shadow-md">
          {/* Image 1 */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
            style={{ backgroundImage: `url(${bgImage1})` }}
          />
          {/* Image 2 (on hover) */}
          {bgImage2 && (
            <div
              className="absolute inset-0 bg-cover bg-center scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-in-out"
              style={{ backgroundImage: `url(${bgImage2})` }}
            />
          )}
          <div className="absolute inset-0 bg-black/20 z-10" />
        </div>

        <div className="relative z-20 text-gray-800 dark:text-amber-200">
          <h2 className="text-lg font-semibold line-clamp-2 mb-2 drop-shadow-sm dark:text-amber-300">
            {pkg.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {shortDescription}
          </p>
        </div>
      </div>
    </Link>
  );
}
