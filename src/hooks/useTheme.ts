import { useThemeStore } from "../store/themeStore";

export const useTheme = () => {
  const { theme, toggleTheme, setTheme, getEffectiveTheme } = useThemeStore();
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
