import { Edit3, Heart, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

import type { Note } from "../types/note.types";

interface NoteCardProps {
  isDeleting?: boolean;
  isUpdatingFavorite?: boolean;
  note: Note;
  onDelete: (noteId: string) => Promise<void>;
  onFavoriteToggle?: (noteId: string, isFavorite: boolean) => Promise<void>;
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
  const textContent = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (textContent.length <= 150) {
    return textContent;
  }

  return `${textContent.slice(0, 147)}...`;
};

export const NoteCard = ({
  isDeleting = false,
  isUpdatingFavorite = false,
  note,
  onDelete,
  onFavoriteToggle,
}: NoteCardProps) => {
  const handleDelete = () => {
    const shouldDelete = window.confirm(
      `Move "${note.title}" to Deleted Notes?`,
    );

    if (!shouldDelete) {
      return;
    }

    void onDelete(note.id);
  };

  return (
    <motion.article
      className="group flex min-h-52 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_25px_rgba(15,23,42,0.04)] transition-colors dark:border-white/8 dark:bg-[#0d182b]"
      transition={{
        duration: 0.2,
      }}
      whileHover={{
        y: -3,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-base font-extrabold text-[#11175f] dark:text-white">
          {note.title}
        </h3>

        {onFavoriteToggle && (
          <button
            aria-label={
              note.isFavorite
                ? `Remove ${note.title} from favorites`
                : `Add ${note.title} to favorites`
            }
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-amber-50 hover:text-amber-500 disabled:opacity-50 dark:hover:bg-amber-500/10"
            disabled={isUpdatingFavorite}
            onClick={() => {
              void onFavoriteToggle(note.id, !note.isFavorite);
            }}
            title={
              note.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            type="button"
          >
            <Heart
              className={note.isFavorite ? "fill-amber-400 text-amber-400" : ""}
              size={17}
            />
          </button>
        )}
      </div>

      <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {createContentPreview(note.content)}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
        <p className="text-xs font-medium text-slate-400">
          {formatNoteDate(note.updatedAt)}
        </p>

        <div className="flex items-center gap-1">
          <Link
            aria-label={`Edit ${note.title}`}
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
            title="Edit note"
            to={`/notes/${note.id}/edit`}
          >
            <Edit3 size={16} />
          </Link>

          <button
            aria-label={`Delete ${note.title}`}
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:hover:bg-rose-500/10"
            disabled={isDeleting}
            onClick={handleDelete}
            title="Move to Deleted Notes"
            type="button"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
