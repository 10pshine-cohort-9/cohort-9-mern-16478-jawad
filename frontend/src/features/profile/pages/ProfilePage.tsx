import {
  AtSign,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/features/auth/utils/get-api-error-message";
import { NoteCardSkeleton } from "@/features/notes/components/NoteCardSkeleton";
import { NotesEmptyState } from "@/features/notes/components/NotesEmptyState";
import { NotesGrid } from "@/features/notes/components/NotesGrid";
import {
  deleteNote,
  getFavoriteNotes,
  getNotes,
  updateNoteFavoriteStatus,
} from "@/features/notes/services/notes.api";
import type { Note } from "@/features/notes/types/note.types";
import { cn } from "@/lib/cn";

import { ProfileEditModal } from "../components/ProfileEditModal";
import { ProfileImagePicker } from "../components/ProfileImagePicker";
import type { ProfileTab } from "../types/profile.types";

const ProfilePage = () => {
  const { user } = useAuth();

  const [allNotes, setAllNotes] = useState<Note[]>([]);

  const [favoriteNotes, setFavoriteNotes] = useState<Note[]>([]);

  const [activeTab, setActiveTab] = useState<ProfileTab>("all");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [deletingNoteId, setDeletingNoteId] = useState<string>();

  const [updatingFavoriteNoteId, setUpdatingFavoriteNoteId] =
    useState<string>();

  const [errorMessage, setErrorMessage] = useState<string>();

  const loadProfileData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const [allNotesResult, favoritesResult] = await Promise.all([
        getNotes(),
        getFavoriteNotes(),
      ]);

      setAllNotes(allNotesResult.notes);

      setFavoriteNotes(favoritesResult.notes);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfileData();
  }, [loadProfileData]);

  if (!user) {
    return null;
  }

  const visibleNotes = activeTab === "all" ? allNotes : favoriteNotes;

  const handleDelete = async (noteId: string) => {
    setDeletingNoteId(noteId);
    setErrorMessage(undefined);

    try {
      await deleteNote(noteId);

      await loadProfileData();
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

      await loadProfileData();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setUpdatingFavoriteNoteId(undefined);
    }
  };

  return (
    <div className="overflow-hidden rounded-b-3xl border-x border-b border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-[#0d182b]">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-white via-violet-50/45 to-indigo-50/70 dark:border-white/10 dark:from-[#0d182b] dark:via-violet-500/5 dark:to-indigo-500/10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500" />

        <div className="grid gap-8 px-5 pb-7 pt-9 sm:px-7 lg:px-9 xl:grid-cols-[minmax(0,1fr)_240px] xl:items-center">
          <div className="grid gap-7 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center">
            <ProfileImagePicker
              fullName={user.fullName}
              imageUrl={user.profileImageUrl}
            />

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-extrabold tracking-tight text-[#11175f] sm:text-3xl dark:text-white">
                {user.fullName}
              </h1>

              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-300">
                <AtSign size={15} />

                {user.username}
              </p>

              <div className="mt-6 space-y-4">
                <p className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Mail
                    className="shrink-0 text-violet-500 dark:text-violet-300"
                    size={18}
                  />

                  <span className="truncate">{user.email}</span>
                </p>

                <p className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Phone
                    className="shrink-0 text-violet-500 dark:text-violet-300"
                    size={18}
                  />

                  <span>{user.phoneNumber}</span>
                </p>

                <p className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <MapPin
                    className="shrink-0 text-violet-500 dark:text-violet-300"
                    size={18}
                  />

                  <span>{user.city}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              onClick={() => {
                setIsEditModalOpen(true);
              }}
              type="button"
            >
              <Pencil size={18} />
              Edit Profile
            </button>

            <button
              className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-red-200 bg-white/45 text-sm font-bold text-red-500 opacity-60 dark:border-red-500/20 dark:bg-white/[0.03]"
              disabled
              title="Account deletion is not available in this phase"
              type="button"
            >
              <Trash2 size={18} />
              Delete Profile
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-center border-b border-slate-200 bg-slate-50/70 px-4 dark:border-white/10 dark:bg-white/[0.025]">
          <div className="flex items-center gap-2" role="tablist">
            <button
              aria-selected={activeTab === "all"}
              className={cn(
                "relative inline-flex h-16 items-center gap-2 px-7 text-sm font-bold transition",
                activeTab === "all"
                  ? "text-violet-600 dark:text-violet-300"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white",
              )}
              onClick={() => {
                setActiveTab("all");
              }}
              role="tab"
              type="button"
            >
              <FileText size={19} />
              All Notes
              {activeTab === "all" && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-violet-600" />
              )}
            </button>

            <button
              aria-selected={activeTab === "favorites"}
              className={cn(
                "relative inline-flex h-16 items-center gap-2 px-7 text-sm font-bold transition",
                activeTab === "favorites"
                  ? "text-violet-600 dark:text-violet-300"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white",
              )}
              onClick={() => {
                setActiveTab("favorites");
              }}
              role="tab"
              type="button"
            >
              <Star size={19} />
              Favorites
              {activeTab === "favorites" && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-violet-600" />
              )}
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-7">
          {errorMessage && (
            <div
              className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/20 dark:bg-red-500/10"
              role="alert"
            >
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                {errorMessage}
              </p>

              <button
                className="inline-flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-300"
                onClick={() => {
                  void loadProfileData();
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
          ) : visibleNotes.length > 0 ? (
            <NotesGrid
              className="sm:grid-cols-2 xl:grid-cols-3"
              deletingNoteId={deletingNoteId}
              notes={visibleNotes}
              onDelete={handleDelete}
              onFavoriteToggle={handleFavoriteToggle}
              updatingFavoriteNoteId={updatingFavoriteNoteId}
            />
          ) : (
            <NotesEmptyState
              description={
                activeTab === "all"
                  ? "Create your first note to see it here."
                  : "Notes marked as favorite will appear here."
              }
              title={activeTab === "all" ? "No notes yet" : "No favorite notes"}
            />
          )}
        </div>
      </section>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        user={user}
      />
    </div>
  );
};

export default ProfilePage;
