"use client";

import Link from "next/link";

export default function EventCard({ pkg, scrollProgress = 0 }) {
  const base = `${process.env.NEXT_PUBLIC_API_URL}/media`;
  const scale = 1 - 0.7 * scrollProgress;
  const padding = `${20 - 15 * scrollProgress}px`;
  const titleSize = scrollProgress < 0.5 ? "text-md md:text-xl" : "text-sm";
  const hideText = scrollProgress > 0.8;
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
    pkg.description?.length > 200
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
        style={{ transform: `scale(${scale})`, padding }}
        className="hover:scale-115 p-2 text-center relative group w-auto max-w-[50vw] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[300px] 
    mx-auto rounded-xl bg-gradient-to-br from-white via-neutral-100 to-neutral-300 
    dark:from-[#1f1c2c] dark:via-[#2d2d2d] dark:to-black 
    shadow-lg transition-transform duration-300">
        {/* Simulated Lift Shadow */}
        <div className="absolute -bottom-2 right-2 w-1/4 h-full dark:bg-amber-100 dark:opacity-35 bg-red-100 z-0 transform rotate-[20deg] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-0 group-hover:-bottom-4 group-hover:bg-transparent shadow-[0_15px_10px_rgba(0,11,0,0.2)] pointer-events-none" />

        {/* Image container */}
        <div className="relative w-full aspect-[4/2] rounded-md overflow-hidden mb-4 shadow-md">
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

        {/* Text Content */}
        <div className="relative z-20 text-gray-800 dark:text-amber-200">
          <h2
            className={`${titleSize} font-semibold line-clamp-2 mb-2 drop-shadow-sm dark:text-amber-300`}>
            {pkg.title}
          </h2>

          {!hideText && (
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3">
              {shortDescription}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
