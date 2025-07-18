"use client";

import { use, useEffect, useState } from "react";
import EventGrid from "@/components/Events/EventGrid";
import { fetchPackages } from "@/lib/search";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages({ isActive: true })
      .then((pkgs) => setPackages(pkgs))
      .catch((error) => console.error("Failed to fetch packages:", error))
      .finally(() => setLoading(false));
  }, []);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const words = `Begin your healing with a journey...`;

  return (
    <>
    

        {/* === PACKAGES SECTION === */}
        <section className=" h-[300vh] w-[80vw] place-self-center rounded-2xl py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-cinzel text-center dark:text-white text-gray-800 mb-10">
              Journeys you can experience
            </h2>

            <EventGrid packages={packages} loading={loading} />
          </div>
        </section>
    </>
  );
}
