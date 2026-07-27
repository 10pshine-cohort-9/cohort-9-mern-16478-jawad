import { Plus, RefreshCw, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";

import { getApiErrorMessage } from "@/features/auth/utils/get-api-error-message";

import { NoteCardSkeleton } from "../components/NoteCardSkeleton";
import { NotesEmptyState } from "../components/NotesEmptyState";
import { NotesGrid } from "../components/NotesGrid";
import {
  deleteNote,
  getFavoriteNotes,
  updateNoteFavoriteStatus,
} from "../services/notes.api";
import type { Note } from "../types/note.types";

const FavoriteNotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [deletingNoteId, setDeletingNoteId] = useState<string>();

  const [updatingFavoriteNoteId, setUpdatingFavoriteNoteId] =
    useState<string>();

  const [errorMessage, setErrorMessage] = useState<string>();

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const result = await getFavoriteNotes();

      setNotes(result.notes);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  const handleFavoriteToggle = async (noteId: string, isFavorite: boolean) => {
    setUpdatingFavoriteNoteId(noteId);

    try {
      await updateNoteFavoriteStatus(noteId, isFavorite);

      await loadNotes();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setUpdatingFavoriteNoteId(undefined);
    }
  };

  const handleDelete = async (noteId: string) => {
    setDeletingNoteId(noteId);

    try {
      await deleteNote(noteId);
      await loadNotes();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setDeletingNoteId(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Star className="text-amber-500" />

            <h1 className="text-2xl font-extrabold text-[#11175f] sm:text-3xl dark:text-white">
              Favorite Notes
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Quick access to the notes you marked as favorite.
          </p>
        </div>

        <Link
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 sm:self-auto"
          to="/notes/new"
        >
          <Plus size={18} />
          New Note
        </Link>
      </header>

      {errorMessage && (
        <div
          className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10"
          role="alert"
        >
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">
            {errorMessage}
          </p>

          <button
            className="flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-300"
            onClick={() => {
              void loadNotes();
            }}
            type="button"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <NoteCardSkeleton key={index} />
          ))}
        </div>
      ) : notes.length > 0 ? (
        <NotesGrid
          deletingNoteId={deletingNoteId}
          notes={notes}
          onDelete={handleDelete}
          onFavoriteToggle={handleFavoriteToggle}
          updatingFavoriteNoteId={updatingFavoriteNoteId}
        />
      ) : (
        <NotesEmptyState
          description="Notes marked as favorite will appear here."
          title="No favorite notes"
        />
      )}
    </div>
  );
};

export default FavoriteNotesPage;
