"use client";

import { useTheme } from "../hooks/useTheme";
import { Sun, Moon, Monitor } from "lucide-react";

interface ThemeToggleProps {
  variant?: "icon" | "button" | "dropdown";
  className?: string;
}

export default function ThemeToggle({
  variant = "icon",
  className = "",
}: ThemeToggleProps) {
  const { toggleTheme, isDark, isSystem } = useTheme();

  const getThemeIcon = () => {
    if (isSystem) return <Monitor className="h-4 w-4" />;
    if (isDark) return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  const getThemeLabel = () => {
    if (isSystem) return "System";
    if (isDark) return "Dark";
    return "Light";
  };

  if (variant === "icon") {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors ${className}`}
        aria-label="Toggle theme"
      >
        {getThemeIcon()}
      </button>
    );
  }

  if (variant === "button") {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
        aria-label="Toggle theme"
      >
        {getThemeIcon()}
        <span>{getThemeLabel()}</span>
      </button>
    );
  }

  // dropdown variant would need more complex implementation
  return null;
}
