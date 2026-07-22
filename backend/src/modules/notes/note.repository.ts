import { prisma } from "../../lib/prisma.js";

interface CreateNoteRecordInput {
  userId: string;
  title: string;
  content: string;
}

interface UpdateNoteRecordInput {
  title?: string;
  content?: string;
}

export const noteRepository = {
  create(input: CreateNoteRecordInput) {
    return prisma.note.create({
      data: {
        userId: input.userId,
        title: input.title,
        content: input.content,
      },

      select: publicNoteSelect,
    });
  },

  findAllByUserId(userId: string) {
    return prisma.note.findMany({
      where: {
        userId,
      },

      select: publicNoteSelect,

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

      select: publicNoteSelect,
    });
  },

  async updateByIdAndUserId(
    noteId: string,
    userId: string,
    input: UpdateNoteRecordInput,
  ) {
    return prisma.$transaction(async (transaction) => {
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

        select: publicNoteSelect,
      });
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
};

const publicNoteSelect = {
  id: true,
  title: true,
  content: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;
