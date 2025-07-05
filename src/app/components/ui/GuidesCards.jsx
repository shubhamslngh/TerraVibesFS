// components/Guides.jsx
"use client";

import {
  FaInstagram,

} from "react-icons/fa";

export default function Guides({ guides = [], onSelect, selectedGuideId }) {
  return (
    <div className="w-full flex flex-wrap justify-center gap-6">
      {guides.map((guide, idx) => (
        <div
          key={guide.id || idx}
          onClick={() => onSelect?.(guide.id)}
          className={`relative h-[379px] w-[300px] bg-black rounded-[10px] overflow-hidden shadow-[0_70px_63px_-60px_rgba(0,0,0,1)] transition-all duration-500 group cursor-pointer ${
            selectedGuideId === guide.id ? "ring-4 ring-violet-400" : ""
          }`}
          style={{
            backgroundImage: `url(${guide.photo || guide.image})`,
            backgroundSize: "300px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}>
          <div className="absolute h-[369px] w-[290px] top-[5px] left-[5px] rounded-[10px] transition-all duration-700 group-hover:border group-hover:border-white">
            <h2 className="text-white font-sans text-xl mt-5 ml-5 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              {guide.name}
            </h2>
            <div className="absolute top-[226px] left-1/2 -translate-x-1/2 text-white h-[130px] w-[50px] flex flex-col justify-around items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <FaInstagram />
              {guide.expertise}
            </div>
          </div>

          {/* Expand image on hover */}
          <div
            className="absolute inset-0 transition-all duration-700 group-hover:bg-left"
            style={{
              backgroundImage: `url(${guide.photo || guide.image})`,
              backgroundSize: "600px",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left center",
              zIndex: -1,
            }}
          />
        </div>
      ))}
    </div>
  );
}
