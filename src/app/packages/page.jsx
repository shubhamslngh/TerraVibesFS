// app/page.jsx
import EventCard from "@/components/Events/EventCard";
import { fetchPackages } from "@/lib/search";
import DateRangeSelector from "@/components/DateRangeSelector";

export default async function HomePage() {
  // Use the search util
  const packages = await fetchPackages({ isActive: true });

  return (
    <section className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      <h1 className="text-4xl font-bold text-center text-indigo-700">
        Explore Packages
      </h1>

      {packages.length === 0 ? (
        <p className="text-center text-gray-500">No packages found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <EventCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </section>
  );
}
