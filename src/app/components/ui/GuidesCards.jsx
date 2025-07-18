// components/Guides.jsx
"use client";

import {
  FaInstagram,

} from "react-icons/fa";

export default function Guides({ guides = [], onSelect, selectedGuideId }) {
  return (
    <div className="transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(138,43,226,0.6)] w-full flex flex-wrap justify-center gap-6">
      {guides.map((guide, idx) => (
        <div
          key={guide.id || idx}
          onClick={() => onSelect?.(guide.id)}
          className={`relative max-w-xs w-full sm:w-[300px] h-[380px] bg-black rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-500 transform group hover:scale-105 ${
            selectedGuideId === guide.id
              ? "scale-115 z-10 ring-4 ring-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              : ""
          }`}>
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-100 group-hover:scale-110 group-hover:brightness-110"
            style={{ backgroundImage: `url(${guide.photo || guide.image})` }}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

          {/* Info */}
          <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-3 z-20">
            <h2 className="text-lg font-bold">{guide.name}</h2>
            <p className="text-sm text-violet-200 italic">{guide.expertise}</p>
          </div>

          {/* Instagram Icon */}
          <div className="absolute top-4 right-4 z-30 text-white bg-black/40 hover:bg-black/70 p-2 rounded-full">
            <FaInstagram className="text-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
