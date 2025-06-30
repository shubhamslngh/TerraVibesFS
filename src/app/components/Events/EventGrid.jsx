"use client";

import EventCard from "./EventCard";
import Loader from "../ui/loader";

export default function EventGrid({ packages = [], loading = false }) {
  if (loading) {
    return (
      <div className="text-center text-gray-500 font-cinzel">
        <Loader/>
      </div>
    );
  }

  if (!loading && packages.length === 0) {
    return (
      <p className="text-center text-gray-500 font-cinzel">
        No packages found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 font-cinzel">
      {packages.map((pkg) => (
        <EventCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}
