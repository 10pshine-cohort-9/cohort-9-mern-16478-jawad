import type { LucideIcon } from "lucide-react";

import {
  FilePlus2,
  FileText,
  LayoutDashboard,
  NotebookPen,
  Star,
  Trash2,
} from "lucide-react";
import { NavLink } from "react-router";

import { cn } from "@/lib/cn";

interface AppSidebarProps {
  onNavigate?: () => void;
}

interface NavigationItem {
  end?: boolean;
  icon: LucideIcon;
  label: string;
  to: string;
}

const navigationItems: NavigationItem[] = [
  {
    end: true,
    icon: LayoutDashboard,
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    end: true,
    icon: FileText,
    label: "All Notes",
    to: "/notes",
  },
  {
    icon: Star,
    label: "Favorites",
    to: "/notes/favorites",
  },
  {
    icon: Trash2,
    label: "Deleted Notes",
    to: "/notes/trash",
  },
];

export const AppSidebar = ({ onNavigate }: AppSidebarProps) => {
  return (
    <aside className="flex h-full w-60 flex-col overflow-hidden border-r border-indigo-950/10 bg-gradient-to-b from-[#171b78] via-[#2923aa] to-[#6d28e7] text-white shadow-[12px_0_40px_rgba(49,46,129,0.12)] transition-colors duration-300 dark:border-white/5 dark:from-[#070b1b] dark:via-[#101743] dark:to-[#30167f]">
      <div className="flex h-[76px] shrink-0 items-center border-b border-white/15 px-5">
        <NavLink
          className="flex min-w-0 items-center gap-3"
          onClick={onNavigate}
          to="/dashboard"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 shadow-lg shadow-indigo-950/30">
            <NotebookPen aria-hidden="true" size={23} />
          </span>

          <span className="min-w-0">
            <span className="block truncate text-base font-extrabold tracking-tight">
              Notes App
            </span>

            <span className="block truncate text-[11px] font-medium text-indigo-200">
              Personal workspace
            </span>
          </span>
        </NavLink>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <NavLink
          className="mb-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-400 to-fuchsia-400 px-4 text-sm font-bold text-white shadow-lg shadow-indigo-950/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          onClick={onNavigate}
          to="/notes/new"
        >
          <FilePlus2 aria-hidden="true" size={19} />
          New Note
        </NavLink>

        <nav aria-label="Main navigation" className="space-y-1.5">
          {navigationItems.map(({ end, icon: Icon, label, to }) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition duration-200",
                  isActive
                    ? "bg-white/20 text-white shadow-lg shadow-indigo-950/15 backdrop-blur-sm"
                    : "text-indigo-100 hover:bg-white/10 hover:text-white",
                )
              }
              end={end}
              key={to}
              onClick={onNavigate}
              to={to}
            >
              <Icon
                aria-hidden="true"
                className="shrink-0"
                size={20}
                strokeWidth={2}
              />

              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-5 pb-5">
        <p className="text-[10px] font-medium tracking-wide text-indigo-200/70">
          Notes App Workspace
        </p>
      </div>
    </aside>
  );
};
