import { z } from "zod";

const NOTE_TITLE_MAX_LENGTH = 200;
const NOTE_CONTENT_MAX_LENGTH = 100_000;

export const createNoteSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Note title is required")
      .max(
        NOTE_TITLE_MAX_LENGTH,
        `Note title cannot exceed ${NOTE_TITLE_MAX_LENGTH} characters`,
      ),

    content: z
      .string()
      .trim()
      .min(1, "Note content is required")
      .max(
        NOTE_CONTENT_MAX_LENGTH,
        `Note content cannot exceed ${NOTE_CONTENT_MAX_LENGTH} characters`,
      ),
  })
  .strict();

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Note title cannot be empty")
      .max(
        NOTE_TITLE_MAX_LENGTH,
        `Note title cannot exceed ${NOTE_TITLE_MAX_LENGTH} characters`,
      )
      .optional(),

    content: z
      .string()
      .trim()
      .min(1, "Note content cannot be empty")
      .max(
        NOTE_CONTENT_MAX_LENGTH,
        `Note content cannot exceed ${NOTE_CONTENT_MAX_LENGTH} characters`,
      )
      .optional(),
  })
  .strict()
  .refine((input) => input.title !== undefined || input.content !== undefined, {
    message: "At least one field, title or content, is required",
  });

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;

// ============================================
// Favorite Status Update Schema
// ============================================
export const updateNoteFavoriteStatusSchema = z
  .object({
    isFavorite: z.boolean(),
  })
  .strict();

export type UpdateNoteFavoriteStatusInput = z.infer<
  typeof updateNoteFavoriteStatusSchema
>;

// ============================================
// Pinned Status Update Schema
// ============================================
export const updateNotePinnedStatusSchema = z
  .object({
    isPinned: z.boolean(),
  })
  .strict();

export type UpdateNotePinnedStatusInput = z.infer<
  typeof updateNotePinnedStatusSchema
>;
