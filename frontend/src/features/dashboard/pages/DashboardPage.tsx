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
import {
  deleteNote,
  getNotes,
  getNoteStats,
  getRecentNoteActivities,
  updateNoteFavoriteStatus,
} from "@/features/notes/services/notes.api";
import type {
  Note,
  NoteActivity,
  NoteStats,
} from "@/features/notes/types/note.types";

const initialStats: NoteStats = {
  total: 0,
  pinned: 0,
  favorites: 0,
  deleted: 0,
  thisWeek: 0,
};

const DashboardPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [stats, setStats] = useState<NoteStats>(initialStats);

  const [activities, setActivities] = useState<NoteActivity[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [deletingNoteId, setDeletingNoteId] = useState<string>();

  const [updatingFavoriteNoteId, setUpdatingFavoriteNoteId] =
    useState<string>();

  const [errorMessage, setErrorMessage] = useState<string>();

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const [notesResult, statsResult, activitiesResult] = await Promise.all([
        getNotes(),
        getNoteStats(),
        getRecentNoteActivities(),
      ]);

      setNotes(notesResult.notes);
      setStats(statsResult);
      setActivities(activitiesResult);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const recentNotes = useMemo(() => {
    return [...notes]
      .sort(
        (firstNote, secondNote) =>
          new Date(secondNote.updatedAt).getTime() -
          new Date(firstNote.updatedAt).getTime(),
      )
      .slice(0, 4);
  }, [notes]);

  const handleDelete = async (noteId: string) => {
    setDeletingNoteId(noteId);
    setErrorMessage(undefined);

    try {
      await deleteNote(noteId);
      await loadDashboard();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setDeletingNoteId(undefined);
    }
  };

  const handleFavoriteToggle = async (noteId: string, isFavorite: boolean) => {
    setUpdatingFavoriteNoteId(noteId);
    setErrorMessage(undefined);

    try {
      await updateNoteFavoriteStatus(noteId, isFavorite);

      await loadDashboard();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setUpdatingFavoriteNoteId(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch">
        <div className="space-y-6">
          <DashboardHeader />

          <DashboardStats
            deletedNotes={stats.deleted}
            favoriteNotes={stats.favorites}
            notesThisWeek={stats.thisWeek}
            totalNotes={stats.total}
          />
        </div>

        <RecentActivity activities={activities} isLoading={isLoading} />
      </div>

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
              void loadDashboard();
            }}
            type="button"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_25px_rgba(15,23,42,0.04)] sm:p-5 dark:border-white/8 dark:bg-[#0d182b]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-[#11175f] dark:text-white">
              Recent Notes
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your latest updated notes.
            </p>
          </div>

          <Link
            className="text-sm font-bold text-violet-600 transition hover:text-violet-700 dark:text-violet-300"
            to="/notes"
          >
            View all notes
          </Link>
        </div>

        <div className="mt-5">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <NoteCardSkeleton key={index} />
              ))}
            </div>
          ) : recentNotes.length > 0 ? (
            <NotesGrid
              className="sm:grid-cols-2 xl:grid-cols-4"
              deletingNoteId={deletingNoteId}
              notes={recentNotes}
              onDelete={handleDelete}
              onFavoriteToggle={handleFavoriteToggle}
              updatingFavoriteNoteId={updatingFavoriteNoteId}
            />
          ) : (
            <NotesEmptyState />
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
