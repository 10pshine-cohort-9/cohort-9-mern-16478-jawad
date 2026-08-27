import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import { getApiErrorMessage } from "@/features/auth/utils/get-api-error-message";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import { NoteCardSkeleton } from "@/features/notes/components/NoteCardSkeleton";
import { NotesEmptyState } from "@/features/notes/components/NotesEmptyState";
import { NotesGrid } from "@/features/notes/components/NotesGrid";
import { deleteNote, getNotes } from "@/features/notes/services/notes.api";
import type { Note } from "@/features/notes/types/note.types";

const getStartOfCurrentWeek = (): Date => {
  const startDate = new Date();

  const currentDay = startDate.getDay();

  const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;

  startDate.setDate(startDate.getDate() - daysSinceMonday);

  startDate.setHours(0, 0, 0, 0);

  return startDate;
};

const DashboardPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);

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

  const recentNotes = useMemo(() => {
    return [...notes]
      .sort(
        (firstNote, secondNote) =>
          new Date(secondNote.updatedAt).getTime() -
          new Date(firstNote.updatedAt).getTime(),
      )
      .slice(0, 4);
  }, [notes]);

  const notesThisWeek = useMemo(() => {
    const startOfWeek = getStartOfCurrentWeek();

    return notes.filter((note) => {
      const creationDate = new Date(note.createdAt);

      return (
        !Number.isNaN(creationDate.getTime()) && creationDate >= startOfWeek
      );
    }).length;
  }, [notes]);

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
      <DashboardHeader />

      <DashboardStats
        deletedNotes={0}
        notesThisWeek={notesThisWeek}
        pinnedNotes={0}
        totalNotes={notes.length}
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

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-white/5 dark:bg-[#1a1a2c]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-950 dark:text-white">
                Recent Notes
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Your latest updated notes.
              </p>
            </div>

            <Link
              className="text-sm font-bold text-violet-600 transition hover:text-violet-700 dark:text-violet-400"
              to="/notes"
            >
              View all
            </Link>
          </div>

          <div className="mt-5">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({
                  length: 4,
                }).map((_, index) => (
                  <NoteCardSkeleton key={index} />
                ))}
              </div>
            ) : recentNotes.length > 0 ? (
              <NotesGrid
                className="md:grid-cols-2 xl:grid-cols-2"
                deletingNoteId={deletingNoteId}
                notes={recentNotes}
                onDelete={handleDelete}
              />
            ) : (
              <NotesEmptyState />
            )}
          </div>
        </section>

        <RecentActivity />
      </div>
    </div>
  );
};

export default DashboardPage;
