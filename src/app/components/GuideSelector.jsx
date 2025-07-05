"use client";

import { useState, useEffect } from "react";
import { getGuides, getPackages } from "@/services/api";
import Guides from "@/components/ui/GuidesCards"; // Dynamic guide cards
import EventGrid from "@/components/Events/EventGrid"; // Grid to show packages

export default function GuideSelector() {
  const [guides, setGuides] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [filtered, setFiltered] = useState([]);

  // Fetch all guides and packages on mount
  useEffect(() => {
    Promise.all([getGuides(), getPackages()]).then(([gRes, pRes]) => {
      setGuides(gRes.data);
      setPackages(pRes.data);
      setFiltered(pRes.data); // default to all packages
    });
  }, []);
useEffect(() => {
  if (!selectedGuideId) {
    setFiltered(packages);
  } else {
    // Filter packages where any of the guides in the package has the selected guide ID
    const filteredPackages = packages.filter((pkg) =>
      pkg.guides.some((g) => g.id === selectedGuideId)
    );

    setFiltered(filteredPackages);
  }
}, [selectedGuideId, packages]);

  return (
    <div className="px-4 py-12">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Find Your Tripper
      </h1>

      {/* Dynamic Guide Cards */}
      <Guides
        guides={guides}
        onSelect={setSelectedGuideId}
        selectedGuideId={selectedGuideId}
      />

      {/* Show All Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setSelectedGuideId(null)}
          className="px-4 py-2 rounded-md dark:bg-white dark:text-black hover:bg-gray-200 text-sm">
          Show All Guides
        </button>
      </div>

      {/* Filtered Packages */}
      <div className="mt-12">
        {selectedGuideId != null && (
          <p className="mb-4 text-center text-lg">
            Experiences with{" "}
            <span className="font-semibold">
              {guides.find((g) => g.id === selectedGuideId)?.name}
            </span>
          </p>
        )}

        {/* EventGrid rendering related packages */}
        <EventGrid packages={filtered} />
      </div>
    </div>
  );
}
