import { Plus } from "lucide-react";
import { Link } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth";

const getGreeting = (): string => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good morning";
  }

  if (currentHour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
};

export const DashboardHeader = () => {
  const { user } = useAuth();

  const firstName = user?.fullName.trim().split(/\s+/)[0] ?? "there";

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">
          {getGreeting()}, {firstName}!
        </h1>

        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Manage your notes and stay organised.
        </p>
      </div>

      <Link
        className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-violet-600 px-4 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 sm:self-auto"
        to="/notes/new"
      >
        <Plus size={17} />
        New Note
      </Link>
    </header>
  );
};
