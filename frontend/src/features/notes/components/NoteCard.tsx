import { Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router";

import type { Note } from "../types/note.types";

interface NoteCardProps {
  isDeleting?: boolean;
  note: Note;
  onDelete: (noteId: string) => Promise<void>;
}

const formatNoteDate = (value: string): string => {
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

const createContentPreview = (content: string): string => {
  const normalizedContent = content.replace(/\s+/g, " ").trim();

  if (normalizedContent.length <= 150) {
    return normalizedContent;
  }

  return `${normalizedContent.slice(0, 147)}...`;
};

export const NoteCard = ({
  isDeleting = false,
  note,
  onDelete,
}: NoteCardProps) => {
  const handleDelete = () => {
    const shouldDelete = window.confirm(
      `Delete "${note.title}"? This action cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    void onDelete(note.id);
  };

  return (
    <article className="group flex min-h-52 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg dark:border-white/5 dark:bg-[#1a1a2c] dark:hover:border-violet-500/30">
      <div className="flex items-start justify-between gap-4">
        <h3 className="line-clamp-2 text-base font-black text-slate-950 dark:text-white">
          {note.title}
        </h3>

        <div className="flex shrink-0 items-center gap-1">
          <Link
            aria-label={`Edit ${note.title}`}
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
            title="Edit note"
            to={`/notes/${note.id}/edit`}
          >
            <Edit3 size={16} />
          </Link>

          <button
            aria-label={`Delete ${note.title}`}
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-500/10"
            disabled={isDeleting}
            onClick={handleDelete}
            title="Delete note"
            type="button"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {createContentPreview(note.content)}
      </p>

      <div className="mt-auto border-t border-slate-100 pt-4 dark:border-white/5">
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Updated {formatNoteDate(note.updatedAt)}
        </p>
      </div>
    </article>
  );
};
