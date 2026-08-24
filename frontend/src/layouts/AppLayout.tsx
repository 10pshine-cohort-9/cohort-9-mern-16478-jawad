import { FileText, LayoutDashboard, Plus, UserRound } from "lucide-react";
import { NavLink, Outlet } from "react-router";

import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/cn";

const navigation = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "All Notes",
    to: "/notes",
    icon: FileText,
  },
  {
    label: "Profile",
    to: "/profile",
    icon: UserRound,
  },
];

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8f8ff] lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="hidden min-h-screen bg-gradient-to-b from-indigo-950 to-indigo-900 p-6 text-white lg:flex lg:flex-col">
        <Logo />

        <button
          type="button"
          className="mt-9 flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 font-semibold shadow-lg shadow-indigo-950/30 transition hover:brightness-110"
        >
          <Plus size={19} />
          New Note
        </button>

        <nav className="mt-8 space-y-2">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-indigo-100 transition hover:bg-white/10",
                  isActive && "bg-white/12 text-white",
                )
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <p className="mt-auto text-xs text-indigo-300">
          Notes App frontend foundation
        </p>
      </aside>

      <div className="min-w-0">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          <Logo compact className="text-indigo-950 lg:hidden" />

          <p className="hidden text-sm text-slate-500 sm:block">
            Professional Notes Workspace
          </p>

          <div className="flex size-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
            JA
          </div>
        </header>

        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
