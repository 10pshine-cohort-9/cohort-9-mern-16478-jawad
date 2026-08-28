export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isFavorite: boolean;
  deletedAt: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteInput {
  title: string;
  content: string;
}

export interface NoteStats {
  total: number;
  pinned: number;
  favorites: number;
  deleted: number;
  thisWeek: number;
}

export type NoteActivityType =
  | "CREATED"
  | "UPDATED"
  | "PINNED"
  | "UNPINNED"
  | "FAVORITED"
  | "UNFAVORITED"
  | "TRASHED"
  | "RESTORED"
  | "PERMANENTLY_DELETED";

export interface NoteActivity {
  id: string;
  noteId: string | null;
  type: NoteActivityType;
  noteTitle: string;
  createdAt: string;
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

export interface NoteStatsData {
  stats: NoteStats;
}

export interface NoteActivitiesData {
  activities: NoteActivity[];
}
