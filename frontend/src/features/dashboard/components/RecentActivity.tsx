import {
  FilePlus2,
  Heart,
  Pencil,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react";

import type {
  NoteActivity,
  NoteActivityType,
} from "@/features/notes/types/note.types";

interface RecentActivityProps {
  activities: NoteActivity[];
  isLoading?: boolean;
}

const activityMeta: Record<
  NoteActivityType,
  {
    icon: typeof FilePlus2;
    label: string;
    style: string;
  }
> = {
  CREATED: {
    icon: FilePlus2,
    label: "Created",
    style:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  UPDATED: {
    icon: Pencil,
    label: "Updated",
    style:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  },
  PINNED: {
    icon: Pencil,
    label: "Updated",
    style:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  },
  UNPINNED: {
    icon: Pencil,
    label: "Updated",
    style:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  },
  FAVORITED: {
    icon: Heart,
    label: "Favorited",
    style:
      "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  },
  UNFAVORITED: {
    icon: Heart,
    label: "Removed from favorites",
    style: "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300",
  },
  TRASHED: {
    icon: Trash2,
    label: "Deleted",
    style: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  },
  RESTORED: {
    icon: RotateCcw,
    label: "Restored",
    style:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  PERMANENTLY_DELETED: {
    icon: XCircle,
    label: "Permanently deleted",
    style: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300",
  },
};

const formatActivityTime = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const differenceInMinutes = Math.round(
    (date.getTime() - Date.now()) / 60_000,
  );

  if (Math.abs(differenceInMinutes) < 60) {
    return new Intl.RelativeTimeFormat("en", {
      numeric: "auto",
    }).format(differenceInMinutes, "minute");
  }

  const differenceInHours = Math.round(differenceInMinutes / 60);

  if (Math.abs(differenceInHours) < 24) {
    return new Intl.RelativeTimeFormat("en", {
      numeric: "auto",
    }).format(differenceInHours, "hour");
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
};

export const RecentActivity = ({
  activities,
  isLoading = false,
}: RecentActivityProps) => {
  const visibleActivities = activities.filter(
    (activity) => activity.type !== "PINNED" && activity.type !== "UNPINNED",
  );

  return (
    <aside className="flex h-[225px] min-h-0 w-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_25px_rgba(15,23,42,0.04)] dark:border-white/8 dark:bg-[#0d182b]">
      <div className="shrink-0">
        <h2 className="text-sm font-extrabold text-[#11175f] dark:text-white">
          Recent Activity
        </h2>

        <p className="mt-0 text-[11px] text-slate-500 dark:text-slate-400">
          Your latest note actions
        </p>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              className="animate-pulse rounded-xl bg-slate-50 p-3 dark:bg-white/5"
              key={index}
            >
              <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-white/10" />

              <div className="mt-2 h-2.5 w-1/3 rounded bg-slate-100 dark:bg-white/5" />
            </div>
          ))}
        </div>
      ) : visibleActivities.length > 0 ? (
        <div className="app-scrollbar mt-2 flex-1 space-y-0 overflow-y-auto pr-1">
          {visibleActivities.map((activity) => {
            const meta = activityMeta[activity.type];

            const Icon = meta.icon;

            return (
              <article
                className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-violet-50 dark:hover:bg-violet-500/5"
                key={activity.id}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full ${meta.style}`}
                >
                  <Icon size={16} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {meta.label} “{activity.noteTitle}”
                  </p>
                </div>

                <time className="shrink-0 text-[10px] font-medium text-slate-400">
                  {formatActivityTime(activity.createdAt)}
                </time>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-center">
          <p className="text-xs font-semibold text-slate-400">
            No recent activity
          </p>
        </div>
      )}
    </aside>
  );
};
