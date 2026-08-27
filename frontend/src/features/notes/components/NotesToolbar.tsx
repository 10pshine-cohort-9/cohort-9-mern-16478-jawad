import { Plus, Search } from "lucide-react";
import { Link } from "react-router";

interface NotesToolbarProps {
  noteCount: number;
  onSearchChange: (value: string) => void;
  searchValue: string;
}

export const NotesToolbar = ({
  noteCount,
  onSearchChange,
  searchValue,
}: NotesToolbarProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-[#1a1a2c]">
      <div className="relative w-full sm:max-w-md">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <input
          aria-label="Search notes"
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-950 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-violet-500 dark:focus:bg-white/10 dark:focus:ring-violet-500/10"
          onChange={(event) => {
            onSearchChange(event.target.value);
          }}
          placeholder="Search by title or content..."
          type="search"
          value={searchValue}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {noteCount} {noteCount === 1 ? "note" : "notes"}
        </p>

        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-700"
          to="/notes/new"
        >
          <Plus size={17} />
          New Note
        </Link>
      </div>
    </div>
  );
};
