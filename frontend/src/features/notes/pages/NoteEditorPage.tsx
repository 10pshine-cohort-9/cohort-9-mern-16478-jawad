import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { getApiErrorMessage } from "@/features/auth/utils/get-api-error-message";

import { createNote, getNoteById, updateNote } from "../services/notes.api";

const NoteEditorPage = () => {
  const navigate = useNavigate();

  const { noteId } = useParams<{
    noteId: string;
  }>();

  const isEditing = typeof noteId === "string";

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [isLoading, setIsLoading] = useState(isEditing);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!noteId) {
      return;
    }

    let isActive = true;

    const loadNote = async () => {
      setIsLoading(true);
      setErrorMessage(undefined);

      try {
        const note = await getNoteById(noteId);

        if (!isActive) {
          return;
        }

        setTitle(note.title);
        setContent(note.content);
      } catch (error) {
        if (isActive) {
          setErrorMessage(getApiErrorMessage(error));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadNote();

    return () => {
      isActive = false;
    };
  }, [noteId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    const normalizedContent = content.trim();

    if (!normalizedTitle) {
      setErrorMessage("Note title is required.");

      return;
    }

    if (!normalizedContent) {
      setErrorMessage("Note content is required.");

      return;
    }

    setIsSubmitting(true);
    setErrorMessage(undefined);

    try {
      if (noteId) {
        await updateNote(noteId, {
          title: normalizedTitle,
          content: normalizedContent,
        });
      } else {
        await createNote({
          title: normalizedTitle,
          content: normalizedContent,
        });
      }

      navigate("/notes", {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LoaderCircle className="animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
        to="/notes"
      >
        <ArrowLeft size={17} />
        Back to Notes
      </Link>

      <header className="mt-5">
        <h1 className="text-2xl font-black text-slate-950 sm:text-3xl dark:text-white">
          {isEditing ? "Edit Note" : "Create New Note"}
        </h1>

        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          {isEditing
            ? "Update your note title and content."
            : "Capture your ideas and important information."}
        </p>
      </header>

      <form
        className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-white/5 dark:bg-[#1a1a2c]"
        onSubmit={handleSubmit}
      >
        {errorMessage && (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        <label className="block">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Note Title
          </span>

          <input
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-violet-500 dark:focus:bg-white/10 dark:focus:ring-violet-500/10"
            maxLength={200}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            placeholder="Enter note title"
            value={title}
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Note Content
          </span>

          <textarea
            className="mt-2 min-h-80 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-950 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-violet-500 dark:focus:bg-white/10 dark:focus:ring-violet-500/10"
            maxLength={100_000}
            onChange={(event) => {
              setContent(event.target.value);
            }}
            placeholder="Write your note content..."
            value={content}
          />
        </label>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end dark:border-white/5">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            to="/notes"
          >
            Cancel
          </Link>

          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <LoaderCircle className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}

            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Note"
                : "Save Note"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteEditorPage;
