export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface NoteInput {
  title: string;
  content: string;
}

export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
}

export interface NotesListData {
  notes: Note[];
  total: number;
}

export interface NoteData {
  note: Note;
}

export interface DeleteNoteData {
  noteId: string;
}
