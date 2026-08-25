import type { LucideIcon } from "lucide-react";

import {
  FileText,
  Heart,
  LayoutDashboard,
  LifeBuoy,
  NotebookPen,
  Pin,
  Trash2,
} from "lucide-react";

import { NavLink } from "react-router";

import { cn } from "@/lib/cn";

import { SidebarUpgradeCard } from "./SidebarUpgradeCard";

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
    icon: FileText,
    label: "All Notes",
    to: "/notes",
  },
  {
    icon: Pin,
    label: "Pinned",
    to: "/notes/pinned",
  },
  {
    icon: Heart,
    label: "Favorites",
    to: "/notes/favorites",
  },
  {
    icon: Trash2,
    label: "Trash",
    to: "/notes/trash",
  },
];

export const AppSidebar = ({ onNavigate }: AppSidebarProps) => {
  const renderNavigationItem = (item: NavigationItem) => {
    const Icon = item.icon;

    return (
      <NavLink
        className={({ isActive }) =>
          cn(
            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
            isActive
              ? "bg-violet-500 text-white shadow-lg shadow-violet-950/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white",
          )
        }
        end={item.end}
        key={item.to}
        onClick={onNavigate}
        to={item.to}
      >
        <Icon
          aria-hidden="true"
          className="shrink-0"
          size={19}
          strokeWidth={2}
        />

        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-white/5 bg-[#151526] text-white">
      <div className="flex h-18 items-center border-b border-white/5 px-5">
        <NavLink
          className="flex items-center gap-3"
          onClick={onNavigate}
          to="/dashboard"
        >
          <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-950/30">
            <NotebookPen aria-hidden="true" size={23} />
          </span>

          <span>
            <span className="block text-base font-black tracking-tight text-white">
              Notes App
            </span>

            <span className="block text-[11px] font-medium text-slate-500">
              Personal workspace
            </span>
          </span>
        </NavLink>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
       
        <nav aria-label="Main navigation" className="space-y-1">
          {navigationItems.map(renderNavigationItem)}
        </nav>

        <div className="my-6 h-px bg-white/5" />

        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400">
          <LifeBuoy aria-hidden="true" size={19} />

          <span className="flex-1">Help & Support</span>

          <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
            Soon
          </span>
        </div>
      </div>

      <div className="border-t border-white/5 p-4">
        <SidebarUpgradeCard />
      </div>
    </aside>
  );
};
