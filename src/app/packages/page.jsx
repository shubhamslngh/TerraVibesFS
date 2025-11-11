"use client";

import { useEffect } from "react";
import EventCard from "@/components/Events/EventCard";
import usePackageStore from "@/stores/usePackageStore";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { packages, loading, loadPackages } = usePackageStore();

  // 🚀 Fetch packages on mount
  useEffect(() => {
    loadPackages({ isActive: true });
  }, [loadPackages]);

  return (
    <section className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      <h1 className="text-4xl font-bold text-center text-indigo-700">
        Explore Packages
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-indigo-600" size={28} />
        </div>
      ) : packages.length === 0 ? (
        <p className="text-center text-gray-500">No packages found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {packages.map((pkg) => (
            <EventCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </section>
  );
}
