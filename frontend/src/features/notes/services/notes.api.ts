import { apiClient } from "@/services/api-client";

import type {
  ApiResponse,
  DeleteNoteData,
  Note,
  NoteData,
  NoteInput,
  NotesListData,
} from "../types/note.types";

export const getNotes = async (): Promise<NotesListData> => {
  const response = await apiClient.get<ApiResponse<NotesListData>>("/notes");

  return response.data.data;
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

export const deleteNote = async (noteId: string): Promise<string> => {
  const response = await apiClient.delete<ApiResponse<DeleteNoteData>>(
    `/notes/${noteId}`,
  );

  return response.data.data.noteId;
};
