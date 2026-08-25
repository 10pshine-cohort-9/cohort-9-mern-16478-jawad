import { FilePlus2, NotebookPen } from "lucide-react";
import { Link } from "react-router";

interface NotesEmptyStateProps {
  description?: string;
  title?: string;
}

export const NotesEmptyState = ({
  description = "Create your first note to organise your ideas, tasks and important information.",
  title = "No notes found",
}: NotesEmptyStateProps) => {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center dark:border-white/10 dark:bg-[#1a1a2c]">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
        <NotebookPen size={28} />
      </span>

      <h2 className="mt-5 text-lg font-black text-slate-950 dark:text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

      <Link
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700"
        to="/notes/new"
      >
        <FilePlus2 size={18} />
        Create Note
      </Link>
    </div>
  );
};
