import { RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/features/auth/utils/get-api-error-message";

import { DeletedNoteCard } from "../components/DeletedNoteCard";
import { NoteCardSkeleton } from "../components/NoteCardSkeleton";
import {
  getTrashNotes,
  permanentlyDeleteNote,
  restoreNote,
} from "../services/notes.api";
import type { Note } from "../types/note.types";

const DeletedNotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [restoringNoteId, setRestoringNoteId] = useState<string>();

  const [deletingNoteId, setDeletingNoteId] = useState<string>();

  const [errorMessage, setErrorMessage] = useState<string>();

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const result = await getTrashNotes();

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

  const handleRestore = async (noteId: string) => {
    setRestoringNoteId(noteId);

    try {
      await restoreNote(noteId);

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteId),
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setRestoringNoteId(undefined);
    }
  };

  const handlePermanentDelete = async (noteId: string) => {
    setDeletingNoteId(noteId);

    try {
      await permanentlyDeleteNote(noteId);

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteId),
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setDeletingNoteId(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2">
          <Trash2 className="text-rose-500" />

          <h1 className="text-2xl font-extrabold text-[#11175f] sm:text-3xl dark:text-white">
            Deleted Notes
          </h1>
        </div>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Restore recently removed notes or delete them permanently.
        </p>
      </header>

      <div className="inline-flex rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
        {notes.length} deleted {notes.length === 1 ? "note" : "notes"}
      </div>

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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <DeletedNoteCard
              isDeleting={deletingNoteId === note.id}
              isRestoring={restoringNoteId === note.id}
              key={note.id}
              note={note}
              onPermanentDelete={handlePermanentDelete}
              onRestore={handleRestore}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-center dark:border-white/10 dark:bg-[#0d182b]">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Trash2 size={24} />
          </span>

          <h2 className="mt-4 text-lg font-extrabold text-[#11175f] dark:text-white">
            Deleted Notes is empty
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Notes you delete will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeletedNotesPage;
