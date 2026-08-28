import type { Request, RequestHandler, Response } from "express";
import { AppError } from "../../common/errors/app-error.js";
import type {
  CreateNoteInput,
  UpdateNoteFavoriteStatusInput,
  UpdateNoteInput,
  UpdateNotePinnedStatusInput,
} from "./note.schema.js";
import {
  createNoteForUser,
  deleteNoteForUser,
  getFavoriteNotesForUser,
  getNoteForUser,
  getNoteStatsForUser,
  getNotesForUser,
  getPinnedNotesForUser,
  getRecentNoteActivitiesForUser,
  getTrashNotesForUser,
  permanentlyDeleteNoteForUser,
  restoreNoteForUser,
  updateNoteFavoriteStatusForUser,
  updateNoteForUser,
  updateNotePinnedStatusForUser,
} from "./note.service.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getAuthenticatedUserId = (request: Request): string => {
  const userId = request.auth?.userId;

  if (!userId) {
    throw new AppError("Authentication is required", 401, {
      code: "AUTHENTICATION_REQUIRED",
    });
  }

  return userId;
};

const getValidNoteId = (request: Request): string => {
  const noteId = request.params.noteId;

  if (typeof noteId !== "string" || !UUID_PATTERN.test(noteId)) {
    throw new AppError("Note ID must be a valid UUID", 400, {
      code: "INVALID_NOTE_ID",
    });
  }

  return noteId;
};

const sendNotesResponse = (
  response: Response,
  message: string,
  notes: unknown[],
): void => {
  response.status(200).json({
    success: true,
    message,
    data: {
      notes,
      total: notes.length,
    },
  });
};

export const createNote: RequestHandler = async (request, response, next) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const note = await createNoteForUser(
      userId,
      request.body as CreateNoteInput,
    );

    response.status(201).json({
      success: true,
      message: "Note created successfully",
      data: {
        note,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNotes: RequestHandler = async (request, response, next) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const notes = await getNotesForUser(userId);

    sendNotesResponse(response, "Notes retrieved successfully", notes);
  } catch (error) {
    next(error);
  }
};

export const getPinnedNotes: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const notes = await getPinnedNotesForUser(userId);

    sendNotesResponse(response, "Pinned notes retrieved successfully", notes);
  } catch (error) {
    next(error);
  }
};

export const getFavoriteNotes: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const notes = await getFavoriteNotesForUser(userId);

    sendNotesResponse(response, "Favorite notes retrieved successfully", notes);
  } catch (error) {
    next(error);
  }
};

export const getTrashNotes: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const notes = await getTrashNotesForUser(userId);

    sendNotesResponse(response, "Trash notes retrieved successfully", notes);
  } catch (error) {
    next(error);
  }
};

export const getNoteStats: RequestHandler = async (request, response, next) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const stats = await getNoteStatsForUser(userId);

    response.status(200).json({
      success: true,
      message: "Note statistics retrieved successfully",
      data: {
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentNoteActivities: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const activities = await getRecentNoteActivitiesForUser(userId);

    response.status(200).json({
      success: true,
      message: "Recent note activity retrieved successfully",
      data: {
        activities,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById: RequestHandler = async (request, response, next) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const noteId = getValidNoteId(request);

    const note = await getNoteForUser(userId, noteId);

    response.status(200).json({
      success: true,
      message: "Note retrieved successfully",
      data: {
        note,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateNote: RequestHandler = async (request, response, next) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const noteId = getValidNoteId(request);

    const note = await updateNoteForUser(
      userId,
      noteId,
      request.body as UpdateNoteInput,
    );

    response.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: {
        note,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotePinnedStatus: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const noteId = getValidNoteId(request);

    const input = request.body as UpdateNotePinnedStatusInput;

    const note = await updateNotePinnedStatusForUser(userId, noteId, input);

    response.status(200).json({
      success: true,
      message: input.isPinned
        ? "Note pinned successfully"
        : "Note unpinned successfully",
      data: {
        note,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateNoteFavoriteStatus: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const noteId = getValidNoteId(request);

    const input = request.body as UpdateNoteFavoriteStatusInput;

    const note = await updateNoteFavoriteStatusForUser(userId, noteId, input);

    response.status(200).json({
      success: true,
      message: input.isFavorite
        ? "Note added to favorites"
        : "Note removed from favorites",
      data: {
        note,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (request, response, next) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const noteId = getValidNoteId(request);

    await deleteNoteForUser(userId, noteId);

    response.status(200).json({
      success: true,
      message: "Note moved to trash successfully",
      data: {
        noteId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const restoreNote: RequestHandler = async (request, response, next) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const noteId = getValidNoteId(request);

    const note = await restoreNoteForUser(userId, noteId);

    response.status(200).json({
      success: true,
      message: "Note restored successfully",
      data: {
        note,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const permanentlyDeleteNote: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const noteId = getValidNoteId(request);

    await permanentlyDeleteNoteForUser(userId, noteId);

    response.status(200).json({
      success: true,
      message: "Note permanently deleted successfully",
      data: {
        noteId,
      },
    });
  } catch (error) {
    next(error);
  }
};
