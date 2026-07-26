import { AppError } from "../../common/errors/app-error.js";
import { logger } from "../../lib/logger.js";
import { noteRepository } from "./note.repository.js";
import type {
  CreateNoteInput,
  UpdateNoteFavoriteStatusInput,
  UpdateNoteInput,
  UpdateNotePinnedStatusInput,
} from "./note.schema.js";
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

const createNoteNotFoundError = (): AppError => {
  return new AppError("Note not found", 404, {
    code: "NOTE_NOT_FOUND",
  });
};

const getStartOfCurrentWeek = (): Date => {
  const startDate = new Date();

  const currentDay = startDate.getUTCDay();

  const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;

  startDate.setUTCDate(startDate.getUTCDate() - daysSinceMonday);

  startDate.setUTCHours(0, 0, 0, 0);

  return startDate;
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

export const getPinnedNotesForUser = async (userId: string) => {
  try {
    return await noteRepository.findPinnedByUserId(userId);
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
      },
      "Failed to retrieve pinned notes",
    );

    throw new AppError("Pinned notes could not be retrieved", 500, {
      code: "PINNED_NOTES_FETCH_FAILED",
      cause: error,
    });
  }
};

export const getFavoriteNotesForUser = async (userId: string) => {
  try {
    return await noteRepository.findFavoritesByUserId(userId);
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
      },
      "Failed to retrieve favorite notes",
    );

    throw new AppError("Favorite notes could not be retrieved", 500, {
      code: "FAVORITE_NOTES_FETCH_FAILED",
      cause: error,
    });
  }
};

export const getTrashNotesForUser = async (userId: string) => {
  try {
    return await noteRepository.findTrashByUserId(userId);
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
      },
      "Failed to retrieve trash notes",
    );

    throw new AppError("Trash notes could not be retrieved", 500, {
      code: "TRASH_NOTES_FETCH_FAILED",
      cause: error,
    });
  }
};

export const getNoteForUser = async (userId: string, noteId: string) => {
  try {
    const note = await noteRepository.findByIdAndUserId(noteId, userId);

    if (!note) {
      throw createNoteNotFoundError();
    }

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
      throw createNoteNotFoundError();
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

export const updateNotePinnedStatusForUser = async (
  userId: string,
  noteId: string,
  input: UpdateNotePinnedStatusInput,
) => {
  try {
    const note = await noteRepository.updatePinnedStatus(
      noteId,
      userId,
      input.isPinned,
    );

    if (!note) {
      throw createNoteNotFoundError();
    }

    logger.info(
      {
        userId,
        noteId,
        isPinned: input.isPinned,
      },
      input.isPinned
        ? "Note pinned successfully"
        : "Note unpinned successfully",
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
      "Failed to update note pin status",
    );

    throw new AppError("Note pin status could not be updated", 500, {
      code: "NOTE_PIN_STATUS_UPDATE_FAILED",
      cause: error,
    });
  }
};

export const updateNoteFavoriteStatusForUser = async (
  userId: string,
  noteId: string,
  input: UpdateNoteFavoriteStatusInput,
) => {
  try {
    const note = await noteRepository.updateFavoriteStatus(
      noteId,
      userId,
      input.isFavorite,
    );

    if (!note) {
      throw createNoteNotFoundError();
    }

    logger.info(
      {
        userId,
        noteId,
        isFavorite: input.isFavorite,
      },
      input.isFavorite
        ? "Note added to favorites"
        : "Note removed from favorites",
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
      "Failed to update favorite status",
    );

    throw new AppError("Favorite status could not be updated", 500, {
      code: "NOTE_FAVORITE_STATUS_UPDATE_FAILED",
      cause: error,
    });
  }
};

export const deleteNoteForUser = async (
  userId: string,
  noteId: string,
): Promise<void> => {
  try {
    const note = await noteRepository.softDeleteByIdAndUserId(noteId, userId);

    if (!note) {
      throw createNoteNotFoundError();
    }

    logger.info(
      {
        userId,
        noteId,
      },
      "Note moved to trash successfully",
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
      "Failed to move note to trash",
    );

    throw new AppError("Note could not be moved to trash", 500, {
      code: "NOTE_TRASH_FAILED",
      cause: error,
    });
  }
};

export const restoreNoteForUser = async (userId: string, noteId: string) => {
  try {
    const note = await noteRepository.restoreByIdAndUserId(noteId, userId);

    if (!note) {
      throw createNoteNotFoundError();
    }

    logger.info(
      {
        userId,
        noteId,
      },
      "Note restored successfully",
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
      "Failed to restore note",
    );

    throw new AppError("Note could not be restored", 500, {
      code: "NOTE_RESTORE_FAILED",
      cause: error,
    });
  }
};

export const permanentlyDeleteNoteForUser = async (
  userId: string,
  noteId: string,
): Promise<void> => {
  try {
    const note = await noteRepository.permanentlyDeleteByIdAndUserId(
      noteId,
      userId,
    );

    if (!note) {
      throw createNoteNotFoundError();
    }

    logger.info(
      {
        userId,
        noteId,
      },
      "Note permanently deleted",
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
      "Failed to permanently delete note",
    );

    throw new AppError("Note could not be permanently deleted", 500, {
      code: "NOTE_PERMANENT_DELETE_FAILED",
      cause: error,
    });
  }
};

export const getNoteStatsForUser = async (userId: string) => {
  try {
    return await noteRepository.getStatsByUserId(
      userId,
      getStartOfCurrentWeek(),
    );
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
      },
      "Failed to retrieve note statistics",
    );

    throw new AppError("Note statistics could not be retrieved", 500, {
      code: "NOTE_STATS_FETCH_FAILED",
      cause: error,
    });
  }
};

export const getRecentNoteActivitiesForUser = async (userId: string) => {
  try {
    return await noteRepository.findRecentActivitiesByUserId(userId);
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
      },
      "Failed to retrieve note activity",
    );

    throw new AppError("Recent note activity could not be retrieved", 500, {
      code: "NOTE_ACTIVITY_FETCH_FAILED",
      cause: error,
    });
  }
};
