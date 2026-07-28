import { LayoutDashboard, NotebookPen } from "lucide-react";
import { NavLink, Outlet } from "react-router";

import { ProfileDropdown } from "@/components/app-shell/ProfileDropdown";
import { ThemeToggle } from "@/components/app-shell/ThemeToggle";

export const ProfileLayout = () => {
  return (
    <div className="min-h-[100dvh] bg-[#f7f8fc] text-slate-950 transition-colors duration-300 dark:bg-[#07101f] dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl dark:border-white/5 dark:bg-[#091223]/95">
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <NavLink className="flex items-center gap-3" to="/dashboard">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-600/20">
              <NotebookPen size={23} />
            </span>

            <span className="hidden text-lg font-extrabold tracking-tight text-[#11175f] sm:block dark:text-white">
              Notes App
            </span>
          </NavLink>

          <NavLink
            className="ml-3 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-4 text-sm font-bold text-violet-700 transition hover:bg-violet-100 sm:ml-12 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300"
            to="/dashboard"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />

            <div className="mx-1 h-8 w-px bg-slate-200 dark:bg-white/10" />

            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 lg:px-8"> */}
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
