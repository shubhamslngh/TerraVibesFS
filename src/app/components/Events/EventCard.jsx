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
      img.mediaFile.startsWith("http")
        ? img.mediaFile
        : `${base}/${img.mediaFile.replace(/^\/+/, "")}`
    ) || [];

  const bgImage1 = imagePaths[0];
  const bgImage2 = imagePaths[1];

  return (
    <Link href={`/packages/${pkg.id}`}>
        <div className="relative group rounded-xl p-8 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:rotate-[0.5deg] hover:shadow-2xl">
          {/* Simulated Lift Shadow */}
          <div className="absolute -bottom-2 right-2 w-1/2 h-full bg-red-50 z-0 transform rotate-20 group-hover:rotate-0 group-hover:bg-red-200  group-hover:-bottom-4 transition-all duration-300 ease-in-out shadow-[0_15px_10px_rgba(0,11,0,0.2)] pointer-events-none" />

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
                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundImage: `url(${bgImage2})` }}
              />
            )}
            <div className="absolute inset-0 bg-black/20 z-10" />
          </div>

          {/* Content */}
          <div className="relative z-20 text-gray-800">
            <h2 className="text-lg font-semibold line-clamp-2 mb-2">
              {pkg.title}
            </h2>
            <p className="text-sm text-gray-600 line-clamp-3">
              {shortDescription}
            </p>
             {/* {services.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {services.map((service, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-neutral-200 px-3 py-1 rounded-full font-medium text-black shadow-sm">
                    {service.name}
                  </span>
                ))}
              </div>
            )}  */}
          </div>
        </div>
    </Link>
  );
}
