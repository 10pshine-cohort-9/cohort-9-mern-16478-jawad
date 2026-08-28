import { cn } from "@/lib/cn";

import type { Note } from "../types/note.types";
import { NoteCard } from "./NoteCard";

interface NotesGridProps {
  className?: string;
  deletingNoteId?: string;
  notes: Note[];
  onDelete: (noteId: string) => Promise<void>;
  onFavoriteToggle?: (noteId: string, isFavorite: boolean) => Promise<void>;
  updatingFavoriteNoteId?: string;
}

export const NotesGrid = ({
  className,
  deletingNoteId,
  notes,
  onDelete,
  onFavoriteToggle,
  updatingFavoriteNoteId,
}: NotesGridProps) => {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {notes.map((note) => (
        <NoteCard
          isDeleting={deletingNoteId === note.id}
          isUpdatingFavorite={updatingFavoriteNoteId === note.id}
          key={note.id}
          note={note}
          onDelete={onDelete}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
};
