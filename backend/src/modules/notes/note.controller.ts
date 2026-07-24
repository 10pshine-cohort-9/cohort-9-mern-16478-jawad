import type { RequestHandler } from "express";
import { AppError } from "../../common/errors/app-error.js";
import type { CreateNoteInput, UpdateNoteInput } from "./note.schema.js";
import {
  createNoteForUser,
  getNoteForUser,
  getNotesForUser,
  updateNoteForUser,
  deleteNoteForUser,
  toggleFavoriteForUser
} from "./note.service.js";

export const createNote: RequestHandler = async (request, response, next) => {
  try {
    const userId = request.auth?.userId;

    if (!userId) {
      throw new AppError("Authentication is required", 401, {
        code: "AUTHENTICATION_REQUIRED",
      });
    }

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
    const userId = request.auth?.userId;

    if (!userId) {
      throw new AppError("Authentication is required", 401, {
        code: "AUTHENTICATION_REQUIRED",
      });
    }

    const notes = await getNotesForUser(userId);

    response.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: {
        notes,
        total: notes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById: RequestHandler = async (request, response, next) => {
  try {
    const userId = request.auth?.userId;

    if (!userId) {
      throw new AppError("Authentication is required", 401, {
        code: "AUTHENTICATION_REQUIRED",
      });
    }

    const noteId = request.params.noteId;

    if (
      typeof noteId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        noteId,
      )
    ) {
      throw new AppError("Note ID must be a valid UUID", 400, {
        code: "INVALID_NOTE_ID",
      });
    }

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
    const userId = request.auth?.userId;

    if (!userId) {
      throw new AppError("Authentication is required", 401, {
        code: "AUTHENTICATION_REQUIRED",
      });
    }

    const noteId = request.params.noteId;

    if (
      typeof noteId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        noteId,
      )
    ) {
      throw new AppError("Note ID must be a valid UUID", 400, {
        code: "INVALID_NOTE_ID",
      });
    }

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

export const deleteNote: RequestHandler = async (request, response, next) => {
  try {
    const userId = request.auth?.userId;

    if (!userId) {
      throw new AppError("Authentication is required", 401, {
        code: "AUTHENTICATION_REQUIRED",
      });
    }

    const noteId = request.params.noteId;

    if (
      typeof noteId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        noteId,
      )
    ) {
      throw new AppError("Note ID must be a valid UUID", 400, {
        code: "INVALID_NOTE_ID",
      });
    }

    await deleteNoteForUser(userId, noteId);

    response.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: {
        noteId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const userId = request.auth?.userId;

    if (!userId) {
      throw new AppError("Authentication is required", 401, {
        code: "AUTHENTICATION_REQUIRED",
      });
    }

    const noteId = request.params.noteId;

    if (
      typeof noteId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        noteId,
      )
    ) {
      throw new AppError("Note ID must be a valid UUID", 400, {
        code: "INVALID_NOTE_ID",
      });
    }

    const note = await toggleFavoriteForUser(userId, noteId);

    response.status(200).json({
      success: true,
      message: note.isFavorite
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
