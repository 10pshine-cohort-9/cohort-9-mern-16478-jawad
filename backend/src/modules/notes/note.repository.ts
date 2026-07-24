import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../common/errors/app-error.js";

interface CreateNoteRecordInput {
  userId: string;
  title: string;
  content: string;
}

interface UpdateNoteRecordInput {
  title?: string;
  content?: string;
}

const listNoteSelect = {
  id: true,
  title: true,
  isFavorite: true,
  createdAt: true,
  updatedAt: true,
} as const;

const detailNoteSelect = {
  id: true,
  title: true,
  content: true,
  isFavorite: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const noteRepository = {
  create(input: CreateNoteRecordInput) {
    return prisma.note.create({
      data: {
        userId: input.userId,
        title: input.title,
        content: input.content,
      },
      select: detailNoteSelect,
    });
  },

  findAllByUserId(
    userId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;
    
    return prisma.note.findMany({
      where: { userId },
      skip,
      take: limit,
      select: listNoteSelect,
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  findByIdAndUserId(noteId: string, userId: string) {
    return prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
      },
      select: detailNoteSelect,
    });
  },

  async updateByIdAndUserId(
    noteId: string,
    userId: string,
    input: UpdateNoteRecordInput,
  ) {
    return prisma.$transaction(async (transaction) => {
      try {
        const updateResult = await transaction.note.updateMany({
          where: {
            id: noteId,
            userId,
          },
          data: input,
        });

        if (updateResult.count === 0) {
          return null;
        }

        return transaction.note.findFirst({
          where: {
            id: noteId,
            userId,
          },
          select: detailNoteSelect,
        });
      } catch (error) {
        throw new AppError("Failed to update note in transaction", 500, {
          code: "NOTE_UPDATE_TRANSACTION_FAILED",
          cause: error,
        });
      }
    });
  },

  deleteByIdAndUserId(noteId: string, userId: string) {
    return prisma.note.deleteMany({
      where: {
        id: noteId,
        userId,
      },
    });
  },

  async toggleFavorite(userId: string, noteId: string) {
    return prisma.$transaction(async (transaction) => {
      try {
        const currentNote = await transaction.note.findFirst({
          where: {
            id: noteId,
            userId,
          },
          select: {
            isFavorite: true,
          },
        });

        if (!currentNote) {
          return null;
        }

        const updatedNote = await transaction.note.update({
          where: {
            id: noteId,
          },
          data: {
            isFavorite: !currentNote.isFavorite,
          },
          select: detailNoteSelect,
        });

        return updatedNote;
      } catch (error) {
        throw new AppError("Failed to toggle favorite in transaction", 500, {
          code: "NOTE_FAVORITE_TOGGLE_TRANSACTION_FAILED",
          cause: error,
        });
      }
    });
  },
};