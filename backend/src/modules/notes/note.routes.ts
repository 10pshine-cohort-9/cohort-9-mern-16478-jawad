import { Router } from "express";
import { authenticate } from "../../common/middleware/authenticate.middleware.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import {
  createNote,
  getNoteById,
  getNotes,
  updateNote,
  deleteNote,
  toggleFavorite,
} from "./note.controller.js";
import { createNoteSchema, updateNoteSchema } from "./note.schema.js";

export const noteRouter = Router();

noteRouter.get("/", authenticate, getNotes);

noteRouter.get("/:noteId", authenticate, getNoteById);

noteRouter.post("/", authenticate, validateBody(createNoteSchema), createNote);

noteRouter.put(
  "/:noteId",
  authenticate,
  validateBody(updateNoteSchema),
  updateNote,
);

noteRouter.patch("/:noteId/favorite", authenticate, toggleFavorite);

noteRouter.delete("/:noteId", authenticate, deleteNote);
