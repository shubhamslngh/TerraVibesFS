"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import EventGrid from "@/components/Events/EventGrid";
import { motion, useInView } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import usePackageStore from "@/stores/usePackageStore";

export default function HomePage() {
  const { packages, loading, loadPackages } = usePackageStore();

  const [activeFilters, setActiveFilters] = useState([]);

  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedService, setSelectedService] = useState(null); // ⭐ NEW

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  // ---------------------------------------------
  // LOAD PACKAGES
  // ---------------------------------------------
  useEffect(() => {
    loadPackages({ isActive: true });
  }, [loadPackages]);

  // ---------------------------------------------
  // GLOBAL FILTER TAGS
  // ---------------------------------------------
  const allTags = useMemo(() => {
    const moodTags = new Set();
    const serviceTags = new Set();

    packages.forEach((pkg) => {
      pkg.moods?.forEach((m) => moodTags.add(m.name));
      try {
        JSON.parse(pkg.services)?.forEach((s) => serviceTags.add(s.name));
      } catch {}
    });

    return [...moodTags, ...serviceTags];
  }, [packages]);

  const toggleFilter = (tag) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]
    );
  };

  // ---------------------------------------------
  // APPLY GLOBAL FILTER
  // ---------------------------------------------
  const globallyFiltered = useMemo(() => {
    if (activeFilters.length === 0) return packages;

    return packages.filter((pkg) => {
      const moodMatch = pkg.moods?.some((m) => activeFilters.includes(m.name));

      let serviceMatch = false;
      try {
        const parsed = JSON.parse(pkg.services);
        serviceMatch = parsed.some((s) => activeFilters.includes(s.name));
      } catch {}

      return moodMatch || serviceMatch;
    });
  }, [packages, activeFilters]);

  // ---------------------------------------------
  // GROUP 1: MOODS
  // ---------------------------------------------
  const moodGroups = useMemo(() => {
    const g = {};
    packages.forEach((p) =>
      p.moods?.forEach((m) => {
        if (!g[m.name]) g[m.name] = [];
        g[m.name].push(p);
      })
    );
    return g;
  }, [packages]);

  const moodList = Object.keys(moodGroups);

  const moodResults = useMemo(() => {
    if (!selectedMood) {
      return globallyFiltered.filter((pkg) => pkg.moods?.length > 0);
    }
    return (moodGroups[selectedMood] || []).filter((p) =>
      globallyFiltered.includes(p)
    );
  }, [selectedMood, globallyFiltered]);

  // ---------------------------------------------
  // GROUP 2: GUIDES
  // ---------------------------------------------
  const guideGroups = useMemo(() => {
    const g = {};
    packages.forEach((p) =>
      p.guides?.forEach((gd) => {
        if (!g[gd.name]) g[gd.name] = [];
        g[gd.name].push(p);
      })
    );
    return g;
  }, [packages]);

  const guideList = Object.keys(guideGroups);

  const guideResults = useMemo(() => {
    if (!selectedGuide) {
      return globallyFiltered.filter((p) => p.guides?.length > 0);
    }
    return (guideGroups[selectedGuide] || []).filter((p) =>
      globallyFiltered.includes(p)
    );
  }, [selectedGuide, globallyFiltered]);

  // ---------------------------------------------
  // GROUP 3: BOLLYWOOD
  // ---------------------------------------------
  const detectMovie = (title) => {
    const t = title.toLowerCase();
    if (t.includes("malang")) return "Malang";
    if (t.includes("zindagi") || t.includes("dobara")) return "ZNMD";
    if (t.includes("tamasha")) return "Tamasha";
    if (t.includes("jawaani") || t.includes("deewani")) return "YJHD";
    return null;
  };

  const movieGroups = useMemo(() => {
    const g = { Malang: [], ZNMD: [], Tamasha: [], YJHD: [] };
    packages.forEach((p) => {
      const m = detectMovie(p.title);
      if (m) g[m].push(p);
    });
    return g;
  }, [packages]);

  const movieList = Object.keys(movieGroups);

  const movieResults = useMemo(() => {
    if (!selectedMovie) {
      return globallyFiltered.filter((p) => detectMovie(p.title));
    }
    return (movieGroups[selectedMovie] || []).filter((p) =>
      globallyFiltered.includes(p)
    );
  }, [selectedMovie, globallyFiltered]);

  // ---------------------------------------------
  // ⭐ GROUP 4: SERVICES (NEW)
  // ---------------------------------------------
  const serviceGroups = useMemo(() => {
    const g = {};
    packages.forEach((p) => {
      try {
        JSON.parse(p.services)?.forEach((s) => {
          if (!g[s.name]) g[s.name] = [];
          g[s.name].push(p);
        });
      } catch {}
    });
    return g;
  }, [packages]);

  const serviceList = Object.keys(serviceGroups);

  const serviceResults = useMemo(() => {
    if (!selectedService) {
      return globallyFiltered.filter((pkg) => {
        try {
          return JSON.parse(pkg.services)?.length > 0;
        } catch {
          return false;
        }
      });
    }

    return (serviceGroups[selectedService] || []).filter((p) =>
      globallyFiltered.includes(p)
    );
  }, [selectedService, globallyFiltered]);

  // ==============================================================================
  // UI STARTS HERE
  // ==============================================================================
  return (
    <main className="w-full  bg-white dark:bg-gray-950">
      {/* ---------- HERO ---------- */}
      <section className=" bg-gradient-to-br items-center justify-center px-4 text-center from-red-100 via-blue-100 to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-black py-16 mb-10">
        <h1 className="text-4xl sm:text-5xl font-cinzel font-bold dark:text-white">
          Begin your healing with a{" "}
          <span className="text-blue-600">Journey</span>
        </h1>
        <p className="mt-4 text-lg dark:text-gray-300 font-playfair">
          Explore experiences based on moods, guides, services, and cinematic
          inspirations.
        </p>
      </section>

      {/* ===========================================================
          SECTION 1 — MOODS
      =========================================================== */}
      <SectionBlock
        title="Explore by Moods"
        tags={moodList}
        selected={selectedMood}
        onSelect={setSelectedMood}
        results={moodResults}
        loading={loading}
        color="purple"
      />

      {/* ===========================================================
          SECTION 2 — GUIDES
      =========================================================== */}
      <SectionBlock
        title="Trippers Love Their Guides... Do You?"
        tags={guideList}
        selected={selectedGuide}
        onSelect={setSelectedGuide}
        results={guideResults}
        loading={loading}
        color="green"
      />

      {/* ===========================================================
          SECTION 3 — BOLLYWOOD
      =========================================================== */}
      <SectionBlock
        title="Inspired by Bollywood"
        tags={movieList}
        selected={selectedMovie}
        onSelect={setSelectedMovie}
        results={movieResults}
        loading={loading}
        color="red"
      />

      {/* ===========================================================
          ⭐ SECTION 4 — SERVICES (NEW)
      =========================================================== */}
      <SectionBlock
        title="Explore by Services"
        tags={serviceList}
        selected={selectedService}
        onSelect={setSelectedService}
        results={serviceResults}
        loading={loading}
        color="blue"
      />
    </main>
  );
}

/* ---------------------------------------------------------
   REUSABLE SECTION COMPONENT
--------------------------------------------------------- */
function SectionBlock({
  title,
  tags,
  selected,
  onSelect,
  results,
  loading,
  color,
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 mb-20">
      <h2 className="text-3xl font-bold mb-6 font-cinzel dark:text-white">
        {title}
      </h2>

      {/* TAGS - scrollable + compact */}
      <div className="w-full no-visible-scrollbar flex flex-nowrap overflow-x-auto overflow-y-hidden gap-2 mb-4 scrollbar-hide py-1">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelect(tag)}
            className={`px-3 py-1  rounded-full border text-xs whitespace-nowrap transition
              ${
                selected === tag
                  ? `bg-${color}-600 text-white border-${color}-600`
                  : "bg-white dark:bg-gray-900 border-gray-400 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}>
            {tag}
          </button>
        ))}
      </div>

      {/* RESULTS */}
      <EventGrid packages={results} loading={loading} />
    </section>
  );
}
