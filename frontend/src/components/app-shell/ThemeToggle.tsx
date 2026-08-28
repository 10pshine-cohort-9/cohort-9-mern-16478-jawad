import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "notes-app-theme";

const getInitialTheme = (): Theme => {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "light";
};

const applyTheme = (theme: Theme): void => {
  const rootElement = document.documentElement;

  rootElement.classList.toggle("dark", theme === "dark");

  rootElement.style.colorScheme = theme;
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const isDarkMode = theme === "dark";

  useEffect(() => {
    applyTheme(theme);

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const label = isDarkMode ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
      onClick={() => {
        setTheme(isDarkMode ? "light" : "dark");
      }}
      title={label}
      type="button"
    >
      {isDarkMode ? (
        <Sun aria-hidden="true" size={19} />
      ) : (
        <Moon aria-hidden="true" size={19} />
      )}
    </button>
  );
};
