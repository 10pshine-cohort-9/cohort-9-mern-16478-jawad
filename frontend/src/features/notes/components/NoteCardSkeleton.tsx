export const NoteCardSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-[#1a1a2c]"
    >
      <div className="h-5 w-3/5 rounded bg-slate-200 dark:bg-white/10" />

      <div className="mt-4 space-y-2">
        <div className="h-3 rounded bg-slate-100 dark:bg-white/5" />
        <div className="h-3 rounded bg-slate-100 dark:bg-white/5" />
        <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-white/5" />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-slate-100 dark:bg-white/5" />
        <div className="h-8 w-20 rounded-lg bg-slate-100 dark:bg-white/5" />
      </div>
    </div>
  );
};
