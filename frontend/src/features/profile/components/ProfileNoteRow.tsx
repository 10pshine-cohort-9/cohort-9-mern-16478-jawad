import { FileText, MoreVertical } from "lucide-react";
import { Link } from "react-router";

import type { Note } from "@/features/notes/types/note.types";

interface ProfileNoteRowProps {
  note: Note;
}

const getContentPreview = (content: string): string => {
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= 100) {
    return plainText;
  }

  return `${plainText.slice(0, 97)}...`;
};

const formatUpdatedDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const ProfileNoteRow = ({ note }: ProfileNoteRowProps) => {
  return (
    <article className="group flex items-center gap-4 border-b border-slate-100 px-4 py-5 last:border-b-0 sm:px-6 dark:border-white/5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
        <FileText size={21} />
      </span>

      <div className="min-w-0 flex-1">
        <Link
          className="block truncate text-sm font-extrabold text-[#11175f] transition hover:text-violet-600 dark:text-white dark:hover:text-violet-300"
          to={`/notes/${note.id}/edit`}
        >
          {note.title}
        </Link>

        <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
          {getContentPreview(note.content)}
        </p>
      </div>

      <time className="hidden shrink-0 text-xs font-medium text-slate-400 sm:block">
        {formatUpdatedDate(note.updatedAt)}
      </time>

      <Link
        aria-label={`Open ${note.title}`}
        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
        to={`/notes/${note.id}/edit`}
      >
        <MoreVertical size={18} />
      </Link>
    </article>
  );
};
