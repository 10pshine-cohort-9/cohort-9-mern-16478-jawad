import { AppError } from "../../common/errors/app-error.js";
import { logger } from "../../lib/logger.js";
import { noteRepository } from "./note.repository.js";
import type { CreateNoteInput, UpdateNoteInput } from "./note.schema.js";
import {
  hasMeaningfulNoteContent,
  sanitizeNoteContent,
  sanitizeNoteTitle,
} from "./note.sanitizer.js";

const createInvalidTitleError = (): AppError => {
  return new AppError("Note title must contain valid text", 400, {
    code: "NOTE_TITLE_REQUIRED",
  });
};

const createInvalidContentError = (): AppError => {
  return new AppError("Note content must contain valid text", 400, {
    code: "NOTE_CONTENT_REQUIRED",
  });
};

export const createNoteForUser = async (
  userId: string,
  input: CreateNoteInput,
) => {
  const sanitizedTitle = sanitizeNoteTitle(input.title);

  if (sanitizedTitle.length === 0) {
    throw createInvalidTitleError();
  }

  const sanitizedContent = sanitizeNoteContent(input.content);

  if (!hasMeaningfulNoteContent(sanitizedContent)) {
    throw createInvalidContentError();
  }

  try {
    const note = await noteRepository.create({
      userId,
      title: sanitizedTitle,
      content: sanitizedContent,
    });

    logger.info(
      {
        userId,
        noteId: note.id,
      },
      "Note created successfully",
    );

    return note;
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
      },
      "Failed to create note",
    );

    throw new AppError("Note could not be created", 500, {
      code: "NOTE_CREATE_FAILED",
      cause: error,
    });
  }
};

export const getNotesForUser = async (userId: string) => {
  try {
    const notes = await noteRepository.findAllByUserId(userId);

    logger.info(
      {
        userId,
        noteCount: notes.length,
      },
      "User notes retrieved successfully",
    );

    return notes;
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
      },
      "Failed to retrieve user notes",
    );

    throw new AppError("Notes could not be retrieved", 500, {
      code: "NOTES_FETCH_FAILED",
      cause: error,
    });
  }
};

export const getNoteForUser = async (userId: string, noteId: string) => {
  try {
    const note = await noteRepository.findByIdAndUserId(noteId, userId);

    if (!note) {
      throw new AppError("Note not found", 404, {
        code: "NOTE_NOT_FOUND",
      });
    }

    logger.info(
      {
        userId,
        noteId,
      },
      "Note retrieved successfully",
    );

    return note;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    logger.error(
      {
        err: error,
        userId,
        noteId,
      },
      "Failed to retrieve note",
    );

    throw new AppError("Note could not be retrieved", 500, {
      code: "NOTE_FETCH_FAILED",
      cause: error,
    });
  }
};

export const updateNoteForUser = async (
  userId: string,
  noteId: string,
  input: UpdateNoteInput,
) => {
  const updateData: {
    title?: string;
    content?: string;
  } = {};

  if (input.title !== undefined) {
    const sanitizedTitle = sanitizeNoteTitle(input.title);

    if (sanitizedTitle.length === 0) {
      throw createInvalidTitleError();
    }

    updateData.title = sanitizedTitle;
  }

  if (input.content !== undefined) {
    const sanitizedContent = sanitizeNoteContent(input.content);

    if (!hasMeaningfulNoteContent(sanitizedContent)) {
      throw createInvalidContentError();
    }

    updateData.content = sanitizedContent;
  }

  try {
    const note = await noteRepository.updateByIdAndUserId(
      noteId,
      userId,
      updateData,
    );

    if (!note) {
      throw new AppError("Note not found", 404, {
        code: "NOTE_NOT_FOUND",
      });
    }

    logger.info(
      {
        userId,
        noteId,
        updatedFields: Object.keys(updateData),
      },
      "Note updated successfully",
    );

    return note;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    logger.error(
      {
        err: error,
        userId,
        noteId,
      },
      "Failed to update note",
    );

    throw new AppError("Note could not be updated", 500, {
      code: "NOTE_UPDATE_FAILED",
      cause: error,
    });
  }
};

export const deleteNoteForUser = async (
  userId: string,
  noteId: string,
): Promise<void> => {
  try {
    const result = await noteRepository.deleteByIdAndUserId(noteId, userId);

    if (result.count === 0) {
      throw new AppError("Note not found", 404, {
        code: "NOTE_NOT_FOUND",
      });
    }

    logger.info(
      {
        userId,
        noteId,
      },
      "Note deleted successfully",
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    logger.error(
      {
        err: error,
        userId,
        noteId,
      },
      "Failed to delete note",
    );

    throw new AppError("Note could not be deleted", 500, {
      code: "NOTE_DELETE_FAILED",
      cause: error,
    });
  }
};

export const toggleFavoriteForUser = async (userId: string, noteId: string) => {
  try {
    const existingNote = await noteRepository.findByIdAndUserId(noteId, userId);

    if (!existingNote) {
      throw new AppError("Note not found", 404, {
        code: "NOTE_NOT_FOUND",
      });
    }

    const note = await noteRepository.toggleFavorite(userId, noteId);

    if (!note) {
      throw new AppError("Note not found", 404, {
        code: "NOTE_NOT_FOUND",
      });
    }

    logger.info(
      {
        userId,
        noteId,
        isFavorite: note.isFavorite,
      },
      `Note ${note.isFavorite ? "added to" : "removed from"} favorites`,
    );

    return note;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    logger.error(
      {
        err: error,
        userId,
        noteId,
      },
      "Failed to toggle note favorite",
    );

    throw new AppError("Note favorite could not be toggled", 500, {
      code: "NOTE_FAVORITE_TOGGLE_FAILED",
      cause: error,
    });
  }
};
