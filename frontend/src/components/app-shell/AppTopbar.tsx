import { Bell, Menu, Search } from "lucide-react";

import { ProfileDropdown } from "./ProfileDropdown";
import { ThemeToggle } from "./ThemeToggle";

interface AppTopbarProps {
  onOpenMobileSidebar: () => void;
}

export const AppTopbar = ({ onOpenMobileSidebar }: AppTopbarProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/5 dark:bg-[#171728]/90">
      <div className="flex h-18 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          aria-label="Open navigation"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          onClick={onOpenMobileSidebar}
          type="button"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden max-w-xl flex-1 md:block">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            aria-label="Search notes"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-violet-500 dark:focus:bg-white/10 dark:focus:ring-violet-500/10"
            placeholder="Search your notes..."
            type="search"
          />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeToggle />

          <button
            aria-label="Notifications"
            className="flex size-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
            title="Notifications"
            type="button"
          >
            <Bell size={20} />
          </button>

          <div className="mx-1 h-8 w-px bg-slate-200 dark:bg-white/10" />

          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
