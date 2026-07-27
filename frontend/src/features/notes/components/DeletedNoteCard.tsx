import { RotateCcw, Trash2 } from "lucide-react";
import { motion } from "motion/react";

import type { Note } from "../types/note.types";

interface DeletedNoteCardProps {
  isDeleting?: boolean;
  isRestoring?: boolean;
  note: Note;
  onPermanentDelete: (noteId: string) => Promise<void>;
  onRestore: (noteId: string) => Promise<void>;
}

const formatDeletedDate = (value: string | null): string => {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const DeletedNoteCard = ({
  isDeleting = false,
  isRestoring = false,
  note,
  onPermanentDelete,
  onRestore,
}: DeletedNoteCardProps) => {
  const handlePermanentDelete = () => {
    const confirmed = window.confirm(
      `Permanently delete "${note.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    void onPermanentDelete(note.id);
  };

  return (
    <motion.article
      className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-[0_8px_25px_rgba(15,23,42,0.04)] dark:border-rose-500/15 dark:bg-[#0d182b]"
      whileHover={{
        y: -3,
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-500 dark:bg-rose-500/15 dark:text-rose-300">
            <Trash2 size={18} />
          </span>

          <div className="min-w-0">
            <h2 className="truncate text-base font-extrabold text-[#11175f] dark:text-white">
              {note.title}
            </h2>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {note.content
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim()}
            </p>

            <p className="mt-4 text-xs font-medium text-slate-400">
              Deleted on {formatDeletedDate(note.deletedAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-rose-100 dark:border-rose-500/15">
        <button
          className="flex h-12 items-center justify-center gap-2 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          disabled={isRestoring || isDeleting}
          onClick={() => {
            void onRestore(note.id);
          }}
          type="button"
        >
          <RotateCcw size={16} />

          {isRestoring ? "Restoring..." : "Restore"}
        </button>

        <button
          className="flex h-12 items-center justify-center gap-2 border-l border-rose-100 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/15 dark:text-rose-300 dark:hover:bg-rose-500/10"
          disabled={isDeleting || isRestoring}
          onClick={handlePermanentDelete}
          type="button"
        >
          <Trash2 size={16} />

          {isDeleting ? "Deleting..." : "Delete Permanently"}
        </button>
      </div>
    </motion.article>
  );
};
