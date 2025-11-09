"use client";

import HorizontalScrollGrid from "@/components/common/HorizontalScrollGrid";
import BlogCard from "@/components/Blogs/BlogCard";

export default function BlogGrid({ blogs = [], loading = false }) {
  return (
    <HorizontalScrollGrid
      items={blogs}
      loading={loading}
      CardComponent={BlogCard}
      emptyMessage="No stories yet. Check back soon!"
      loadingLottie="/read.lottie" // 👈 optional, replace with your animation
      itemWidth="w-[80vw] sm:w-[350px]" // 👈 adjust width for nice spacing
    />
  );
}
