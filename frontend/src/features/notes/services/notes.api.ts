import { apiClient } from "@/services/api-client";

import type {
  ApiResponse,
  DeleteNoteData,
  Note,
  NoteActivitiesData,
  NoteData,
  NoteInput,
  NoteStats,
  NoteStatsData,
  NotesListData,
} from "../types/note.types";

const getNotesCollection = async (endpoint: string): Promise<NotesListData> => {
  const response = await apiClient.get<ApiResponse<NotesListData>>(endpoint);

  return response.data.data;
};

export const getNotes = async (): Promise<NotesListData> => {
  return getNotesCollection("/notes");
};

export const getPinnedNotes = async (): Promise<NotesListData> => {
  return getNotesCollection("/notes/pinned");
};

export const getFavoriteNotes = async (): Promise<NotesListData> => {
  return getNotesCollection("/notes/favorites");
};

export const getTrashNotes = async (): Promise<NotesListData> => {
  return getNotesCollection("/notes/trash");
};

export const getNoteStats = async (): Promise<NoteStats> => {
  const response =
    await apiClient.get<ApiResponse<NoteStatsData>>("/notes/stats");

  return response.data.data.stats;
};

export const getRecentNoteActivities = async (): Promise<
  NoteActivitiesData["activities"]
> => {
  const response =
    await apiClient.get<ApiResponse<NoteActivitiesData>>("/notes/activities");

  return response.data.data.activities;
};

export const getNoteById = async (noteId: string): Promise<Note> => {
  const response = await apiClient.get<ApiResponse<NoteData>>(
    `/notes/${noteId}`,
  );

  return response.data.data.note;
};

export const createNote = async (input: NoteInput): Promise<Note> => {
  const response = await apiClient.post<ApiResponse<NoteData>>("/notes", input);

  return response.data.data.note;
};

export const updateNote = async (
  noteId: string,
  input: NoteInput,
): Promise<Note> => {
  const response = await apiClient.patch<ApiResponse<NoteData>>(
    `/notes/${noteId}`,
    input,
  );

  return response.data.data.note;
};

export const updateNotePinnedStatus = async (
  noteId: string,
  isPinned: boolean,
): Promise<Note> => {
  const response = await apiClient.patch<ApiResponse<NoteData>>(
    `/notes/${noteId}/pin`,
    {
      isPinned,
    },
  );

  return response.data.data.note;
};

export const updateNoteFavoriteStatus = async (
  noteId: string,
  isFavorite: boolean,
): Promise<Note> => {
  const response = await apiClient.patch<ApiResponse<NoteData>>(
    `/notes/${noteId}/favorite`,
    {
      isFavorite,
    },
  );

  return response.data.data.note;
};

export const deleteNote = async (noteId: string): Promise<string> => {
  const response = await apiClient.delete<ApiResponse<DeleteNoteData>>(
    `/notes/${noteId}`,
  );

  return response.data.data.noteId;
};

export const restoreNote = async (noteId: string): Promise<Note> => {
  const response = await apiClient.patch<ApiResponse<NoteData>>(
    `/notes/${noteId}/restore`,
  );

  return response.data.data.note;
};

export const permanentlyDeleteNote = async (
  noteId: string,
): Promise<string> => {
  const response = await apiClient.delete<ApiResponse<DeleteNoteData>>(
    `/notes/${noteId}/permanent`,
  );

  return response.data.data.noteId;
};
