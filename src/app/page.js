"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchPackages } from "@/lib/search";
import EmotionPage from "./components/emotions";
import GuideSelector from "./components/GuideSelector";
import Guides from "@/components/ui/GuidesCards";
import HeroSection from "@/components/HeroSection";
import { motion } from "framer-motion";


function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="relative w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div
            className="
              rounded-3xl border border-black/5 dark:border-white/15
              bg-white/65 backdrop-blur-md
              dark:bg-transparent dark:backdrop-blur-0
              shadow-[0_8px_40px_rgba(0,0,0,0.06)]
              overflow-hidden
            "
          >
            {/* header */}
            {(title || subtitle) && (
              <div className="px-5 sm:px-8 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                  {title && (
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* content */}
            <div className="px-5 sm:px-8 py-8 sm:py-10">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasData = useMemo(() => (packages?.length ?? 0) > 0, [packages]);
  const heroRef = useRef(null);
  const handleScrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    fetchPackages({ isActive: true })
      .then((pkgs) => setPackages(pkgs))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full">

      {/* page rhythm */}
      <div className="flex flex-col items-center gap-12 sm:gap-16 lg:gap-20 py-10 sm:py-14 lg:py-16">
        {/* HERO */}
        <section className="relative h-auto w-full">
          <div className="sticky top-0 h-auto w-full">
            <HeroSection onExploreClick={handleScrollToContent} ref={heroRef} />
          </div>
        </section>


        {/* divider */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-8xl mx-auto h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/15 to-transparent" />
        </div>

        {/* EMOTIONS */}
        <Section
          id="emotions"
          title="Curate by Mood"
          subtitle="Pick how you feel—discover matching experiences."
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <EmotionPage />
          </motion.div>
        </Section>

        {/* GUIDES */}
        <Section
          id="guides"
          title="Travel Guides"
          subtitle="Handpicked routes, rituals and must-dos for every vibe."
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <GuideSelector />
          </motion.div>
        </Section>

        {/* PACKAGES */}
        <Section
          id="packages"
          title="Featured Packages"
          subtitle="Ready-to-book journeys aligned to your mood."
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <Guides packages={packages} loading={loading} />
            {!loading && !hasData && (
              <div className="mt-6 rounded-xl border border-black/5 dark:border-white/15 p-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
                Nothing to show yet. Try another mood or check back soon.
              </div>
            )}
          </motion.div>
        </Section>

        {/* bottom divider */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1280px] mx-auto h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/15 to-transparent" />
        </div>

        {/* footer spacer */}
        <div className="h-6 sm:h-10" />
      </div>
    </div>
  );
}
