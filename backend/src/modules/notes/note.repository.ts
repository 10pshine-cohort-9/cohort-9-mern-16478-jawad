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

const publicNoteSelect = {
  id: true,
  title: true,
  content: true,
  isPinned: true,
  isFavorite: true,
  deletedAt: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;

const publicActivitySelect = {
  id: true,
  noteId: true,
  type: true,
  noteTitle: true,
  createdAt: true,
} as const;

export const noteRepository = {
  async create(input: CreateNoteRecordInput) {
    return prisma.$transaction(async (transaction) => {
      const note = await transaction.note.create({
        data: {
          userId: input.userId,
          title: input.title,
          content: input.content,
        },
        select: publicNoteSelect,
      });

      await transaction.noteActivity.create({
        data: {
          userId: input.userId,
          noteId: note.id,
          type: "CREATED",
          noteTitle: note.title,
        },
      });

      return note;
    });
  },

  findAllByUserId(userId: string) {
    return prisma.note.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: publicNoteSelect,
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  findPinnedByUserId(userId: string) {
    return prisma.note.findMany({
      where: {
        userId,
        isPinned: true,
        deletedAt: null,
      },
      select: publicNoteSelect,
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  findFavoritesByUserId(userId: string) {
    return prisma.note.findMany({
      where: {
        userId,
        isFavorite: true,
        deletedAt: null,
      },
      select: publicNoteSelect,
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  findTrashByUserId(userId: string) {
    return prisma.note.findMany({
      where: {
        userId,
        deletedAt: {
          not: null,
        },
      },
      select: publicNoteSelect,
      orderBy: {
        deletedAt: "desc",
      },
    });
  },

  findByIdAndUserId(noteId: string, userId: string) {
    return prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
        deletedAt: null,
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
          deletedAt: null,
        },
        data: input,
      });

      if (updateResult.count === 0) {
        return null;
      }

      const note = await transaction.note.findFirst({
        where: {
          id: noteId,
          userId,
          deletedAt: null,
        },
        select: publicNoteSelect,
      });

      if (!note) {
        return null;
      }

      await transaction.noteActivity.create({
        data: {
          userId,
          noteId: note.id,
          type: "UPDATED",
          noteTitle: note.title,
        },
      });

      return note;
    });
  },

  async updatePinnedStatus(noteId: string, userId: string, isPinned: boolean) {
    return prisma.$transaction(async (transaction) => {
      const updateResult = await transaction.note.updateMany({
        where: {
          id: noteId,
          userId,
          deletedAt: null,
        },
        data: {
          isPinned,
        },
      });

      if (updateResult.count === 0) {
        return null;
      }

      const note = await transaction.note.findFirst({
        where: {
          id: noteId,
          userId,
          deletedAt: null,
        },
        select: publicNoteSelect,
      });

      if (!note) {
        return null;
      }

      await transaction.noteActivity.create({
        data: {
          userId,
          noteId: note.id,
          type: isPinned ? "PINNED" : "UNPINNED",
          noteTitle: note.title,
        },
      });

      return note;
    });
  },

  async updateFavoriteStatus(
    noteId: string,
    userId: string,
    isFavorite: boolean,
  ) {
    return prisma.$transaction(async (transaction) => {
      const updateResult = await transaction.note.updateMany({
        where: {
          id: noteId,
          userId,
          deletedAt: null,
        },
        data: {
          isFavorite,
        },
      });

      if (updateResult.count === 0) {
        return null;
      }

      const note = await transaction.note.findFirst({
        where: {
          id: noteId,
          userId,
          deletedAt: null,
        },
        select: publicNoteSelect,
      });

      if (!note) {
        return null;
      }

      await transaction.noteActivity.create({
        data: {
          userId,
          noteId: note.id,
          type: isFavorite ? "FAVORITED" : "UNFAVORITED",
          noteTitle: note.title,
        },
      });

      return note;
    });
  },

  async softDeleteByIdAndUserId(noteId: string, userId: string) {
    return prisma.$transaction(async (transaction) => {
      const note = await transaction.note.findFirst({
        where: {
          id: noteId,
          userId,
          deletedAt: null,
        },
        select: publicNoteSelect,
      });

      if (!note) {
        return null;
      }

      await transaction.note.update({
        where: {
          id: note.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await transaction.noteActivity.create({
        data: {
          userId,
          noteId: note.id,
          type: "TRASHED",
          noteTitle: note.title,
        },
      });

      return note;
    });
  },

  async restoreByIdAndUserId(noteId: string, userId: string) {
    return prisma.$transaction(async (transaction) => {
      const note = await transaction.note.findFirst({
        where: {
          id: noteId,
          userId,
          deletedAt: {
            not: null,
          },
        },
        select: publicNoteSelect,
      });

      if (!note) {
        return null;
      }

      const restoredNote = await transaction.note.update({
        where: {
          id: note.id,
        },
        data: {
          deletedAt: null,
        },
        select: publicNoteSelect,
      });

      await transaction.noteActivity.create({
        data: {
          userId,
          noteId: restoredNote.id,
          type: "RESTORED",
          noteTitle: restoredNote.title,
        },
      });

      return restoredNote;
    });
  },

  async permanentlyDeleteByIdAndUserId(noteId: string, userId: string) {
    return prisma.$transaction(async (transaction) => {
      const note = await transaction.note.findFirst({
        where: {
          id: noteId,
          userId,
          deletedAt: {
            not: null,
          },
        },
        select: {
          id: true,
          title: true,
        },
      });

      if (!note) {
        return null;
      }

      await transaction.noteActivity.create({
        data: {
          userId,
          noteId: null,
          type: "PERMANENTLY_DELETED",
          noteTitle: note.title,
        },
      });

      await transaction.note.delete({
        where: {
          id: note.id,
        },
      });

      return note;
    });
  },

  async getStatsByUserId(userId: string, startOfWeek: Date) {
    const [total, pinned, favorites, deleted, thisWeek] =
      await prisma.$transaction([
        prisma.note.count({
          where: {
            userId,
            deletedAt: null,
          },
        }),

        prisma.note.count({
          where: {
            userId,
            isPinned: true,
            deletedAt: null,
          },
        }),

        prisma.note.count({
          where: {
            userId,
            isFavorite: true,
            deletedAt: null,
          },
        }),

        prisma.note.count({
          where: {
            userId,
            deletedAt: {
              not: null,
            },
          },
        }),

        prisma.note.count({
          where: {
            userId,
            deletedAt: null,
            createdAt: {
              gte: startOfWeek,
            },
          },
        }),
      ]);

    return {
      total,
      pinned,
      favorites,
      deleted,
      thisWeek,
    };
  },

  findRecentActivitiesByUserId(userId: string) {
    return prisma.noteActivity.findMany({
      where: {
        userId,
      },
      select: publicActivitySelect,
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });
  },
};
