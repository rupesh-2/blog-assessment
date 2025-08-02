import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  getEffectiveTheme: () => "light" | "dark";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",

      toggleTheme: () => {
        set((state) => {
          const themes: Theme[] = ["light", "dark", "system"];
          const currentIndex = themes.indexOf(state.theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          return { theme: themes[nextIndex] };
        });
      },

      setTheme: (theme) => {
        set({ theme });
      },

      getEffectiveTheme: () => {
        const { theme } = get();
        if (theme === "system") {
          if (typeof window !== "undefined") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";
          }
          return "light"; // Default for SSR
        }
        return theme;
      },
    }),
    {
      name: "theme-storage",
    }
  )
);
