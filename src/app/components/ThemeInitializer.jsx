"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    const currTheme =
      localStorage.getItem("theme") || localStorage.getItem("nuxt-color-mode");

    if (currTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
    }
  }, []);

  return null; // nothing to render
}
