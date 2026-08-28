import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getApiErrorMessage } from "@/features/auth/utils/get-api-error-message";

import { NoteCardSkeleton } from "../components/NoteCardSkeleton";
import { NotesEmptyState } from "../components/NotesEmptyState";
import { NotesGrid } from "../components/NotesGrid";
import { NotesToolbar } from "../components/NotesToolbar";
import { deleteNote, getNotes } from "../services/notes.api";
import type { Note } from "../types/note.types";

const AllNotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [searchValue, setSearchValue] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [deletingNoteId, setDeletingNoteId] = useState<string>();

  const [errorMessage, setErrorMessage] = useState<string>();

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const result = await getNotes();

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

  const filteredNotes = useMemo(() => {
    const searchTerm = searchValue.trim().toLowerCase();

    const sortedNotes = [...notes].sort(
      (firstNote, secondNote) =>
        new Date(secondNote.updatedAt).getTime() -
        new Date(firstNote.updatedAt).getTime(),
    );

    if (!searchTerm) {
      return sortedNotes;
    }

    return sortedNotes.filter((note) => {
      return (
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
      );
    });
  }, [notes, searchValue]);

  const handleDelete = async (noteId: string) => {
    setDeletingNoteId(noteId);
    setErrorMessage(undefined);

    try {
      await deleteNote(noteId);

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
        <h1 className="text-2xl font-black text-slate-950 sm:text-3xl dark:text-white">
          All Notes
        </h1>

        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Create, edit, search and manage all your notes.
        </p>
      </header>

      <NotesToolbar
        noteCount={filteredNotes.length}
        onSearchChange={setSearchValue}
        searchValue={searchValue}
      />

      {errorMessage && (
        <div
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/20 dark:bg-red-500/10"
          role="alert"
        >
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">
            {errorMessage}
          </p>

          <button
            className="inline-flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-300"
            onClick={() => {
              void loadNotes();
            }}
            type="button"
          >
            <RefreshCw size={16} />
            Try again
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
      ) : filteredNotes.length > 0 ? (
        <NotesGrid
          deletingNoteId={deletingNoteId}
          notes={filteredNotes}
          onDelete={handleDelete}
        />
      ) : (
        <NotesEmptyState
          description={
            searchValue ? "No notes match your current search." : undefined
          }
          title={searchValue ? "No matching notes" : undefined}
        />
      )}
    </div>
  );
};

export default AllNotesPage;
