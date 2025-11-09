"use client";
import HorizontalScrollGrid from "@/components/Common/HorizontalScrollGrid";
import EventCard from "@/components/Events/EventCard";

export default function EventGrid({ packages = [], loading = false }) {
  return (
    <HorizontalScrollGrid
      items={packages}
      loading={loading}
      CardComponent={EventCard}
      emptyMessage="No packages found."
      loadingLottie="/travelBus.lottie"
    />
  );
}
