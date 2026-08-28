import type { LucideIcon } from "lucide-react";

import { motion } from "motion/react";

type StatTone = "violet" | "amber" | "rose" | "indigo";

interface DashboardStatCardProps {
  description: string;
  icon: LucideIcon;
  title: string;
  tone: StatTone;
  value: number;
}

const toneStyles: Record<
  StatTone,
  {
    icon: string;
    iconBackground: string;
  }
> = {
  violet: {
    icon: "text-violet-600 dark:text-violet-300",
    iconBackground: "bg-violet-100 dark:bg-violet-500/15",
  },
  amber: {
    icon: "text-amber-500 dark:text-amber-300",
    iconBackground: "bg-amber-100 dark:bg-amber-500/15",
  },
  rose: {
    icon: "text-rose-500 dark:text-rose-300",
    iconBackground: "bg-rose-100 dark:bg-rose-500/15",
  },
  indigo: {
    icon: "text-indigo-600 dark:text-indigo-300",
    iconBackground: "bg-indigo-100 dark:bg-indigo-500/15",
  },
};

export const DashboardStatCard = ({
  description,
  icon: Icon,
  title,
  tone,
  value,
}: DashboardStatCardProps) => {
  const styles = toneStyles[tone];

  return (
    <motion.article
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_25px_rgba(15,23,42,0.04)] transition-colors dark:border-white/8 dark:bg-[#0d182b]"
      initial={{
        opacity: 0,
        y: 10,
      }}
      transition={{
        duration: 0.3,
      }}
      whileHover={{
        y: -3,
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${styles.iconBackground} ${styles.icon}`}
        >
          <Icon size={21} />
        </span>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-1 text-2xl font-extrabold text-[#11175f] dark:text-white">
            {new Intl.NumberFormat("en-US").format(value)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[11px] font-medium leading-4 text-slate-400 dark:text-slate-500">
        {description}
      </p>
    </motion.article>
  );
};
