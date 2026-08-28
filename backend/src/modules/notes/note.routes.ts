import { Router } from "express";
import { authenticate } from "../../common/middleware/authenticate.middleware.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import {
  createNote,
  deleteNote,
  getFavoriteNotes,
  getNoteById,
  getNoteStats,
  getNotes,
  getPinnedNotes,
  getRecentNoteActivities,
  getTrashNotes,
  permanentlyDeleteNote,
  restoreNote,
  updateNote,
  updateNoteFavoriteStatus,
  updateNotePinnedStatus,
} from "./note.controller.js";
import {
  createNoteSchema,
  updateNoteFavoriteStatusSchema,
  updateNotePinnedStatusSchema,
  updateNoteSchema,
} from "./note.schema.js";

export const noteRouter = Router();

noteRouter.get("/stats", authenticate, getNoteStats);

noteRouter.get("/activities", authenticate, getRecentNoteActivities);

noteRouter.get("/pinned", authenticate, getPinnedNotes);

noteRouter.get("/favorites", authenticate, getFavoriteNotes);

noteRouter.get("/trash", authenticate, getTrashNotes);

noteRouter.get("/", authenticate, getNotes);

noteRouter.get("/:noteId", authenticate, getNoteById);

noteRouter.post("/", authenticate, validateBody(createNoteSchema), createNote);

noteRouter.patch(
  "/:noteId",
  authenticate,
  validateBody(updateNoteSchema),
  updateNote,
);

noteRouter.patch(
  "/:noteId/pin",
  authenticate,
  validateBody(updateNotePinnedStatusSchema),
  updateNotePinnedStatus,
);

noteRouter.patch(
  "/:noteId/favorite",
  authenticate,
  validateBody(updateNoteFavoriteStatusSchema),
  updateNoteFavoriteStatus,
);

noteRouter.delete("/:noteId", authenticate, deleteNote);

noteRouter.patch("/:noteId/restore", authenticate, restoreNote);

noteRouter.delete("/:noteId/permanent", authenticate, permanentlyDeleteNote);
