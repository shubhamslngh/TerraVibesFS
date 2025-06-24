"use client";
import React from "react";

const Map = () => {
  return (
    <figure className="relative w-full max-w-5xl mx-auto shadow-lg overflow-hidden bg-white">
      <img
        className="w-full h-full object-cover"
        src="https://pbs.twimg.com/media/FE87Oc9X0AU4ejW?format=jpg&name=4096x4096"
        alt="Folded Map"
      />

      {/* Main fold effect (vertical folds) */}
      <span className="absolute inset-0 grid grid-cols-5 pointer-events-none">
        <span className="bg-gradient-to-r from-black/10 to-transparent" />
        <span className="bg-gradient-to-r from-black/5 to-transparent" />
        <span className="bg-gradient-to-r from-black/10 to-transparent" />
        <span className="bg-gradient-to-r from-black/5 to-transparent" />
        <span className="bg-gradient-to-r from-black/10 to-transparent" />
      </span>

      {/* Vertical gradient strips (simulate page creases) */}
      <span className="absolute inset-0 grid grid-cols-5 pointer-events-none">
        <span className="bg-gradient-to-r from-black/10 via-transparent to-black/5" />
        <span className="bg-gradient-to-r from-black/5 via-transparent to-transparent" />
        <span className="bg-gradient-to-r from-black/20 via-transparent to-black/10" />
        <span className="bg-gradient-to-r from-black/5 via-transparent to-transparent" />
        <span className="bg-gradient-to-r from-black/20 via-transparent to-black/10" />
      </span>

      {/* Horizontal gradient strips */}
      <span className="absolute inset-0 grid grid-rows-10 pointer-events-none">
        <span className="bg-gradient-to-b from-black/5 to-transparent" />
        <span className="bg-gradient-to-b from-black/5 to-transparent" />
        <span className="bg-gradient-to-b from-black/5 to-transparent" />
        <span className="bg-gradient-to-t from-black/10 to-transparent" />
        <span className="bg-gradient-to-t from-black/5 to-transparent" />
        <span className="bg-gradient-to-t from-black/10 to-transparent" />
        <span className="bg-gradient-to-t from-black/5 to-transparent" />
        <span className="bg-gradient-to-t from-black/10 to-transparent" />
        <span className="bg-gradient-to-t from-black/5 to-transparent" />
        <span className="bg-gradient-to-t from-black/10 to-transparent" />
      </span>
    </figure>
  );
};

export default Map;
