"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const theme = settings.darkMode ? "dark" : "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, mounted]);

  const setTheme = (t: Theme) => {
    updateSettings({ darkMode: t === "dark" });
  };

  const toggleTheme = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--surface)]" style={{ opacity: 0 }} />
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
