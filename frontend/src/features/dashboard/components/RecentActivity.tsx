import { Activity, Clock3 } from "lucide-react";

export const RecentActivity = () => {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#1a1a2c]">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
          <Activity size={17} />
        </span>

        <div>
          <h2 className="text-sm font-black text-slate-950 dark:text-white">
            Recent Activity
          </h2>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Latest note actions
          </p>
        </div>
      </div>

      <div className="mt-5 flex min-h-32 flex-col items-center justify-center text-center">
        <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500">
          <Clock3 size={18} />
        </span>

        <p className="mt-3 text-xs font-bold text-slate-700 dark:text-slate-300">
          No recent activity
        </p>

        <p className="mt-1 max-w-44 text-[11px] leading-4 text-slate-400">
          Your latest note actions will appear here.
        </p>
      </div>
    </aside>
  );
};
