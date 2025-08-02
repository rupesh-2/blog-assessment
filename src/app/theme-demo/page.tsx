"use client";

import Layout from "../../components/Layout";
import ThemeToggle from "../../components/ThemeToggle";
import { useTheme } from "../../hooks/useTheme";


export default function ThemeDemoPage() {
  const { theme, isDark, isLight } = useTheme();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Theme Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore the light and dark theme functionality of the blog platform.
          </p>
        </div>

        {/* Current Theme Info */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Theme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selected Theme
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                {theme}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Effective Theme
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {isDark ? "Dark" : isLight ? "Light" : "System"}
              </p>
            </div>
          </div>
        </div>

        {/* Theme Controls */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Theme Controls
          </h2>
          <div className="flex flex-wrap gap-4">
            <ThemeToggle variant="icon" />
            <ThemeToggle variant="button" />
          </div>
        </div>

        {/* Theme Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cards */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cards
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Primary Card
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  This is a primary card with proper theme styling.
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Info Card
                </h4>
                <p className="text-blue-700 dark:text-blue-300 mt-2">
                  This is an info card with blue accent colors.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Buttons
            </h3>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Primary Button
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors">
                Secondary Button
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Outline Button
              </button>
            </div>
          </div>

          {/* Form Elements */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Form Elements
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Input Field
                </label>
                <input
                  type="text"
                  placeholder="Enter text here..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Dropdown
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
            </div>
          </div>

          {/* Text Examples */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Typography
            </h3>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Heading 1
              </h1>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Heading 2
              </h2>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Heading 3
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This is regular paragraph text with proper contrast.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                This is smaller text with muted color.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Features */}
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Theme Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Light Mode
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Clean, bright interface for daytime use
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Dark Mode
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Easy on the eyes for nighttime reading
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                System
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Automatically follows your system preference
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
