"use client";

import { useTheme } from "../../hooks/useTheme";
import { useThemeStore } from "../../store/themeStore";

export default function TestThemePage() {
  const { theme, toggleTheme, setTheme, isDark, isLight, isSystem } = useTheme();
  const { getEffectiveTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Theme Test Page
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Theme Info */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Current Theme
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Selected Theme:</strong> {theme}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Effective Theme:</strong> {getEffectiveTheme()}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Is Dark:</strong> {isDark ? "Yes" : "No"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Is Light:</strong> {isLight ? "Yes" : "No"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Is System:</strong> {isSystem ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* Theme Controls */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Theme Controls
            </h2>
            <div className="space-y-4">
              <button
                onClick={toggleTheme}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Toggle Theme
              </button>
              <button
                onClick={() => setTheme("light")}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                Set Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
              >
                Set Dark
              </button>
              <button
                onClick={() => setTheme("system")}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Set System
              </button>
            </div>
          </div>

          {/* Visual Test */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Visual Test
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-900 dark:text-white">
                  This is a test card with proper theme styling.
                </p>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <p className="text-blue-900 dark:text-blue-100">
                  This is a blue card with theme colors.
                </p>
              </div>
            </div>
          </div>

          {/* Debug Info */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Debug Info
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Document Class:</strong> {typeof document !== "undefined" ? document.documentElement.className : "SSR"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Has Dark Class:</strong> {typeof document !== "undefined" ? document.documentElement.classList.contains("dark") ? "Yes" : "No" : "SSR"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>System Dark Mode:</strong> {typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "Yes" : "No" : "SSR"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 