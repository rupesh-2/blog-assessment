"use client";

import { ReactNode, useEffect, useState } from "react";
import { useThemeStore } from "../store/themeStore";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { getEffectiveTheme, theme } = useThemeStore();
  const [currentTheme, setCurrentTheme] = useState<string>("light");

  useEffect(() => {
    // Apply theme to document and body
    const effectiveTheme = getEffectiveTheme();
    setCurrentTheme(effectiveTheme);

    // Remove all theme classes first
    document.documentElement.classList.remove(
      "dark",
      "theme-light",
      "theme-dark"
    );
    document.body.classList.remove("theme-light", "theme-dark");

    if (effectiveTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.add("theme-light");
    }
  }, [getEffectiveTheme, theme]); // Add theme to dependencies

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const effectiveTheme = getEffectiveTheme();
      setCurrentTheme(effectiveTheme);

      // Remove all theme classes first
      document.documentElement.classList.remove(
        "dark",
        "theme-light",
        "theme-dark"
      );
      document.body.classList.remove("theme-light", "theme-dark");

      if (effectiveTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.body.classList.add("theme-dark");
      } else {
        document.body.classList.add("theme-light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [getEffectiveTheme, theme]); // Add theme to dependencies

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
}
