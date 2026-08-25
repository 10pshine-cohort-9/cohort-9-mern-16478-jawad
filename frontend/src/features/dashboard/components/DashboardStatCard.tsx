import type { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  description: string;
  icon: LucideIcon;
  title: string;
  value: number;
}

export const DashboardStatCard = ({
  description,
  icon: Icon,
  title,
  value,
}: DashboardStatCardProps) => {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/5 dark:bg-[#1a1a2c]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {new Intl.NumberFormat("en-US").format(value)}
          </p>
        </div>

        <span className="flex size-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
          <Icon size={18} />
        </span>
      </div>

      <p className="mt-3 text-[11px] font-medium leading-4 text-slate-400 dark:text-slate-500">
        {description}
      </p>
    </article>
  );
};
