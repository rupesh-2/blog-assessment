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
          const newTheme = themes[nextIndex];
          
          // Apply theme immediately
          if (typeof window !== "undefined") {
            const effectiveTheme = newTheme === "system" 
              ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
              : newTheme;
            
            document.documentElement.classList.remove("dark", "theme-light", "theme-dark");
            document.body.classList.remove("theme-light", "theme-dark");
            
            if (effectiveTheme === "dark") {
              document.documentElement.classList.add("dark");
              document.body.classList.add("theme-dark");
            } else {
              document.body.classList.add("theme-light");
            }
            
            // Dispatch custom event for theme change
            window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: effectiveTheme } }));
          }
          
          return { theme: newTheme };
        });
      },

      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme immediately
        if (typeof window !== "undefined") {
          const effectiveTheme = theme === "system" 
            ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
            : theme;
          
          document.documentElement.classList.remove("dark", "theme-light", "theme-dark");
          document.body.classList.remove("theme-light", "theme-dark");
          
          if (effectiveTheme === "dark") {
            document.documentElement.classList.add("dark");
            document.body.classList.add("theme-dark");
          } else {
            document.body.classList.add("theme-light");
          }
          
          // Dispatch custom event for theme change
          window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: effectiveTheme } }));
        }
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
