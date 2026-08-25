import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "notes-app-theme";

const getInitialTheme = (): Theme => {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme: Theme): void => {
  document.documentElement.classList.toggle("dark", theme === "dark");

  document.documentElement.style.colorScheme = theme;
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const isDarkMode = theme === "dark";

  useEffect(() => {
    applyTheme(theme);

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const accessibleLabel = isDarkMode
    ? "Switch to light mode"
    : "Switch to dark mode";

  return (
    <button
      aria-label={accessibleLabel}
      className="flex size-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white dark:focus-visible:ring-violet-500/20"
      onClick={toggleTheme}
      title={accessibleLabel}
      type="button"
    >
      {isDarkMode ? (
        <Sun aria-hidden="true" size={20} />
      ) : (
        <Moon aria-hidden="true" size={20} />
      )}
    </button>
  );
};
