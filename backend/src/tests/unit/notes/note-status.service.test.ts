import { expect } from "chai";
import { afterEach, describe, it } from "mocha";
import sinon from "sinon";

import { AppError } from "../../../common/errors/app-error.js";
import { noteRepository } from "../../../modules/notes/note.repository.js";
import {
  deleteNoteForUser,
  getNoteStatsForUser,
  restoreNoteForUser,
  updateNoteFavoriteStatusForUser,
  updateNotePinnedStatusForUser,
} from "../../../modules/notes/note.service.js";

const userId = "11111111-1111-4111-8111-111111111111";

const noteId = "22222222-2222-4222-8222-222222222222";

const sampleNote = {
  id: noteId,
  title: "Testing Note",
  content: "<p>Test content</p>",
  isPinned: false,
  isFavorite: false,
  deletedAt: null,
  userId,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Note status service", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("pins an active user note", async () => {
    const pinnedNote = {
      ...sampleNote,
      isPinned: true,
    };

    const repositoryStub = sinon
      .stub(noteRepository, "updatePinnedStatus")
      .resolves(pinnedNote);

    const result = await updateNotePinnedStatusForUser(userId, noteId, {
      isPinned: true,
    });

    expect(result.isPinned).to.equal(true);

    expect(repositoryStub.calledOnceWithExactly(noteId, userId, true)).to.equal(
      true,
    );
  });

  it("throws when pinning a missing note", async () => {
    sinon.stub(noteRepository, "updatePinnedStatus").resolves(null);

    try {
      await updateNotePinnedStatusForUser(userId, noteId, {
        isPinned: true,
      });

      expect.fail("Expected the service to throw");
    } catch (error) {
      expect(error).to.be.instanceOf(AppError);

      expect((error as AppError).code).to.equal("NOTE_NOT_FOUND");
    }
  });

  it("marks a note as favorite", async () => {
    const favoriteNote = {
      ...sampleNote,
      isFavorite: true,
    };

    sinon.stub(noteRepository, "updateFavoriteStatus").resolves(favoriteNote);

    const result = await updateNoteFavoriteStatusForUser(userId, noteId, {
      isFavorite: true,
    });

    expect(result.isFavorite).to.equal(true);
  });

  it("moves an active note to trash", async () => {
    sinon.stub(noteRepository, "softDeleteByIdAndUserId").resolves(sampleNote);

    await deleteNoteForUser(userId, noteId);
  });

  it("restores a deleted note", async () => {
    sinon.stub(noteRepository, "restoreByIdAndUserId").resolves(sampleNote);

    const result = await restoreNoteForUser(userId, noteId);

    expect(result.id).to.equal(noteId);
  });

  it("returns real dashboard statistics", async () => {
    const expectedStats = {
      total: 8,
      pinned: 2,
      favorites: 3,
      deleted: 1,
      thisWeek: 4,
    };

    sinon.stub(noteRepository, "getStatsByUserId").resolves(expectedStats);

    const result = await getNoteStatsForUser(userId);

    expect(result).to.deep.equal(expectedStats);
  });
});
