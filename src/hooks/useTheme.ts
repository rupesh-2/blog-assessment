import { useThemeStore } from "../store/themeStore";
import { useEffect } from "react";

export const useTheme = () => {
  const { theme, toggleTheme, setTheme, getEffectiveTheme } = useThemeStore();
  
  // Force re-render when theme changes
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    // This effect will run whenever the theme changes, ensuring components re-render
  }, [theme, getEffectiveTheme]);

  return {
    theme,
    toggleTheme,
    setTheme,
    getEffectiveTheme,
    isDark: getEffectiveTheme() === "dark",
    isLight: getEffectiveTheme() === "light",
    isSystem: theme === "system",
  };
};
