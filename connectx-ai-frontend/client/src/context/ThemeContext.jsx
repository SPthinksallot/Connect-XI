import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "yaap-theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Migrate old key if present
    const legacy = window.localStorage?.getItem("connectx-theme");
    if (legacy) {
      window.localStorage.removeItem("connectx-theme");
      window.localStorage.setItem(STORAGE_KEY, legacy);
      return legacy;
    }
    const stored = window.localStorage?.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage?.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
