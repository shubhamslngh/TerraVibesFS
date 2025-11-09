"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fetchPackages } from "@/lib/search";
import { getBlogs } from "@/services/api";
import EmotionPage from "./components/emotions";
import GuideSelector from "./components/GuideSelector";
import Guides from "@/components/ui/GuidesCards";
import HeroSection from "@/components/HeroSection";
import BlogGrid from "@/components/Blogs/BlogGrid";


function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="relative w-full">
      <div className="px-4 ">
        <div className="max-w-[1280px] mx-auto">
          <div
            className="
              rounded-3xl border border-black/5 dark:border-white/15
              bg-white/65 backdrop-blur-md
              dark:bg-transparent dark:backdrop-blur-0
              overflow-hidden
            "
          >
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
            <div className="px-2">{children}</div>
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
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const hasPackages = useMemo(() => (packages?.length ?? 0) > 0, [packages]);

  const handleScrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch travel packages
    fetchPackages({ isActive: true })
      .then((pkgs) => setPackages(pkgs))
      .catch(() => { })
      .finally(() => setLoading(false));

    // Fetch latest blogs
    getBlogs()
      .then((res) => setBlogs(res.data.slice(0, 3))) // show latest 3
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-12 sm:gap-16 lg:gap-10 py-10 sm:py-14 lg:py-16">
        {/* HERO */}
        <section className="relative h-auto w-full">
          <div className="sticky top-0 h-auto w-full">
            <HeroSection onExploreClick={handleScrollToContent} />
          </div>
        </section>

        {/* divider */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-8xl mx-auto h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/15 to-transparent" />
        </div>

        <div ref={contentRef}>
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
        </div>

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

        {/* STORIES (Blogs) */}
        <Section
          id="stories"
          title="Stories"
          subtitle="Hear real journeys from explorers like you."
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <BlogGrid blogs={blogs} loading={false} />
          </motion.div>
        </Section>


        {/* PACKAGES
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
            {!loading && !hasPackages && (
              <div className="mt-6 rounded-xl border border-black/5 dark:border-white/15 p-6 text-center text-sm text-neutral-600 dark:text-neutral-300">
                Nothing to show yet. Try another mood or check back soon.
              </div>
            )}
          </motion.div>
        </Section> */}
      </div>
    </div>
  );
}
